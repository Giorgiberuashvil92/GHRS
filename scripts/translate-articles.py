"""Generate static article translations from a snapshot of public articles."""
import argparse
import concurrent.futures
import hashlib
import html
import json
import pathlib
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

LANGUAGES = ("ar", "de", "fr", "he", "it", "ka", "uk")
FIELDS = ("title", "excerpt", "content")
TOKENS = re.compile(
    r"""(<!--[\s\S]*?-->|<(?:script|style)\b[^>]*>[\s\S]*?</(?:script|style)\s*>|"""
    r"""</?[A-Za-z](?:[^<>"']|"[^"]*"|'[^']*')*>|"""
    r"""\[/?(?:su_|caption\b|gallery\b)[^\]]*\]|https?://[^\s<>]+)""",
    re.IGNORECASE,
)
SEPARATOR = " ZXQSEPZX "
SEPARATOR_RE = re.compile(r"\s*ZXQSEPZX\s*", re.IGNORECASE)


def request_translation(text, locale):
    query = urllib.parse.urlencode(
        {"client": "gtx", "sl": "en", "tl": locale, "dt": "t", "q": text}
    )
    request = urllib.request.Request(
        "https://translate.googleapis.com/translate_a/single?" + query,
        headers={"User-Agent": "Mozilla/5.0"},
    )
    for attempt in range(4):
        try:
            with urllib.request.urlopen(request, timeout=25) as response:
                result = json.load(response)
            return "".join(part[0] or "" for part in result[0])
        except urllib.error.HTTPError as error:
            if error.code < 500 or attempt == 3:
                raise
            time.sleep(2 ** attempt)
        except (OSError, ValueError):
            if attempt == 3:
                raise
            time.sleep(2 ** attempt)


def translate_batch(parts, locale):
    result = request_translation(SEPARATOR.join(parts), locale)
    translations = SEPARATOR_RE.split(result)
    if len(translations) != len(parts):
        translations = [request_translation(part, locale) for part in parts]
    else:
        translations = [
            translation if translation.strip() else request_translation(part, locale)
            for part, translation in zip(parts, translations)
        ]
    if any(not translation.strip() for translation in translations):
        raise ValueError("Empty translation")
    return translations


def translate_field(source, locale, markup):
    parts = TOKENS.split(source) if markup else [source]
    slots = []
    for index in range(0, len(parts), 2):
        original = parts[index]
        if not re.search(r"[A-Za-z]", html.unescape(original)):
            continue
        text = html.unescape(original.strip())
        chunks = re.findall(r".{1,1650}(?:\s+|$)|.{1,1650}", text, re.DOTALL)
        slots.extend((index, chunk.strip()) for chunk in chunks if chunk.strip())

    replacements = {}
    batch = []
    length = 0

    def flush():
        if batch:
            translations = translate_batch([text for _, text in batch], locale)
            for (index, _), translation in zip(batch, translations):
                replacements.setdefault(index, []).append(translation.strip())
            batch.clear()

    for index, text in slots:
        if batch and length + len(text) > 1800:
            flush()
            length = 0
        batch.append((index, text))
        length += len(text) + len(SEPARATOR)
    flush()

    for index, translated in replacements.items():
        original = parts[index]
        leading = original[: len(original) - len(original.lstrip())]
        trailing = original[len(original.rstrip()):]
        text = " ".join(translated)
        parts[index] = leading + (html.escape(text, quote=False) if markup else text) + trailing
    return "".join(parts)


def translate_article(article, locale, checkpoint, cache_only):
    source_hash = hashlib.sha256(
        json.dumps([article[field].get("en") for field in FIELDS]).encode()
    ).hexdigest()
    cache = checkpoint / f"{article['_id']}-{locale}-{source_hash}.json"
    if cache.exists():
        return json.loads(cache.read_text())
    if cache_only:
        return None
    result = {}
    for field in FIELDS:
        localized = article[field]
        if not localized.get(locale, "").strip() and localized.get("en", "").strip():
            result[field] = translate_field(localized["en"], locale, field != "title")
    temporary = cache.with_suffix(".tmp")
    temporary.write_text(json.dumps(result, ensure_ascii=False))
    temporary.replace(cache)
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("snapshot", type=pathlib.Path)
    parser.add_argument("output", type=pathlib.Path)
    parser.add_argument("checkpoint", type=pathlib.Path)
    parser.add_argument("--cache-only", action="store_true")
    args = parser.parse_args()

    articles = json.loads(args.snapshot.read_text())
    args.output.mkdir(parents=True, exist_ok=True)
    args.checkpoint.mkdir(parents=True, exist_ok=True)
    tasks = [(article, locale) for article in articles for locale in LANGUAGES]

    if not args.cache_only:
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
            pending = [
                pool.submit(translate_article, article, locale, args.checkpoint, False)
                for article, locale in tasks
            ]
            try:
                for future in concurrent.futures.as_completed(pending):
                    future.result()
            except (OSError, ValueError) as error:
                for future in pending:
                    future.cancel()
                print(f"Translation stopped: {error}", file=sys.stderr)

    results = {locale: {} for locale in LANGUAGES}
    missing = 0
    for article, locale in tasks:
        translation = translate_article(article, locale, args.checkpoint, True)
        if translation is None:
            missing += 1
        elif translation:
            results[locale][article["_id"]] = translation

    for locale, translations in results.items():
        (args.output / f"{locale}.json").write_text(
            json.dumps(translations, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
        )
        print(f"{locale}: {len(translations)} articles saved")
    if missing and not args.cache_only:
        raise SystemExit(f"{missing} article-language pairs remain unfinished")


if __name__ == "__main__":
    main()
