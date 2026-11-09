"""Generate static locale JSON from English via Google's public translation endpoint.
Only repository UI messages are submitted; no user or database content is read.
Existing translated values are preserved. Run explicitly when adding languages.
"""
import concurrent.futures, json, pathlib, re, time, urllib.parse, urllib.request
ROOT = pathlib.Path(__file__).resolve().parents[1]
LANGUAGES = ['he', 'ar', 'de', 'fr', 'it', 'uk']
OVERRIDES = json.loads((ROOT/'scripts/locale-overrides.json').read_text())
CACHE = ROOT / 'scripts' / '.translation-cache.json'
cache = json.loads(CACHE.read_text()) if CACHE.exists() else {}
files = {p.name: json.loads(p.read_text()) for p in sorted((ROOT/'public/locales/en').glob('*.json'))}
def strings(value):
    if isinstance(value, str): yield value
    elif isinstance(value, dict):
        for item in value.values(): yield from strings(item)
    elif isinstance(value, list):
        for item in value: yield from strings(item)
texts = sorted(set(s for obj in files.values() for s in strings(obj)))
protected = re.compile(r'\{\{.*?\}\}|\$\{.*?\}|</?[^>]+>|https?://[^\s<>]+|[\w.+-]+@[\w.-]+\.[A-Za-z]+')
def translate(task):
    lang, source = task
    key = lang + ':' + source
    if key in cache: return key, cache[key]
    if not re.search('[a-zA-Z]', source): return key, source
    tokens = []
    def mask(match):
        tokens.append(match.group()); return f'ZXQ{len(tokens)-1}QXZ'
    masked = protected.sub(mask, source)
    chunks, chunk = [], ''
    for word in re.findall(r'\S+\s*', masked):
        if len(chunk) + len(word) > 1500 and chunk:
            chunks.append(chunk); chunk = ''
        chunk += word
    if chunk: chunks.append(chunk)
    translated = []
    for chunk in chunks:
        query = urllib.parse.urlencode({'client':'gtx','sl':'en','tl':lang,'dt':'t','q':chunk})
        for attempt in range(5):
            try:
                request = urllib.request.Request('https://translate.googleapis.com/translate_a/single?' + query, headers={'User-Agent':'Mozilla/5.0'})
                with urllib.request.urlopen(request, timeout=45) as response: data = json.load(response)
                translated.append(''.join(part[0] or '' for part in data[0]))
                break
            except Exception:
                if attempt == 4: raise
                time.sleep(2 * (attempt + 1))
    result = ' '.join(translated)
    for i, token in enumerate(tokens):
        pattern = re.compile(r'ZXQ\s*'+str(i)+r'\s*QXZ', re.I)
        if not pattern.search(result): raise ValueError(f'Translation lost protected token: {lang}, token {i}')
        result = pattern.sub(lambda _: token, result)
    if not result.strip():
        if source.strip(): raise ValueError('Empty translation')
        return key, source
    return key, result

def replace(obj, lang):
    if isinstance(obj, str):
        return OVERRIDES[obj][LANGUAGES.index(lang)] if obj in OVERRIDES else cache[lang+':'+obj]
    if isinstance(obj, dict): return {k:replace(v,lang) for k,v in obj.items()}
    if isinstance(obj, list): return [replace(v,lang) for v in obj]
    return obj
def batches():
    for lang in LANGUAGES:
        batch = []
        size = 0
        for source in texts:
            if source in OVERRIDES or lang+':'+source in cache: continue
            if batch and (size+len(source)>1400 or len(batch)>=20):
                yield lang,batch
                batch,size=[],0
            batch.append(source)
            size += len(source)+12
        if batch: yield lang,batch

def translate_batch(task):
    lang,batch=task
    if len(batch)==1: return [translate((lang,batch[0]))]
    separator='ZXSEPZX'
    _,result=translate((lang,('\n'+separator+'\n').join(batch)))
    parts=re.split(r'\s*ZXSEPZX\s*',result,flags=re.I)
    if len(parts)!=len(batch):
        return [translate((lang,source)) for source in batch]
    return [(lang+':'+source,part) for source,part in zip(batch,parts)]

def preserve_edits(source, translated, existing):
    if isinstance(source, dict) and isinstance(existing, dict):
        return {k: preserve_edits(value, translated[k], existing.get(k)) for k, value in source.items()}
    if isinstance(source, list) and isinstance(existing, list) and len(source) == len(existing):
        return [preserve_edits(s, t, e) for s, t, e in zip(source, translated, existing)]
    return existing if isinstance(existing, str) and existing != source else translated

if __name__ == '__main__':
    pending=list(batches())
    print(f'{len(pending)} batches remaining',flush=True)
    pool=concurrent.futures.ThreadPoolExecutor(max_workers=3)
    try:
        for i, results in enumerate(pool.map(translate_batch,pending)):
            cache.update(results)
            if i%10==0:
                CACHE.write_text(json.dumps(cache,ensure_ascii=False)+'\n')
                print(f'{i+1}/{len(pending)} batches',flush=True)
    finally:
        pool.shutdown(wait=False,cancel_futures=True)
        CACHE.write_text(json.dumps(cache,ensure_ascii=False)+'\n')
    for lang in LANGUAGES:
        directory=ROOT/'public/locales'/lang
        directory.mkdir(exist_ok=True)
        for filename,obj in files.items():
            path=directory/filename
            translated = replace(obj, lang)
            if path.exists():
                translated = preserve_edits(obj, translated, json.loads(path.read_text()))
            path.write_text(json.dumps(translated, ensure_ascii=False, indent=2)+'\n')
