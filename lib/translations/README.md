# Interface languages

Supported languages are defined in `lib/locales.ts`. English UI JSON is the key
reference. Existing Georgian, Russian, and English JSON has been preserved.
The six added languages have static dictionaries generated from the English UI.
The dictionaries include machine translation and edits to common labels.

- No translation service is called when visitors switch language.
- Messages load lazily, with English fallback for missing keys/load failures.
- Selection persists locally. Arabic and Hebrew set the document to RTL.
- CMS articles, courses, exercise descriptions, video/audio, and admin UI have
  not been translated. Existing content uses English fallback in new languages.
- The standalone `/test` questionnaire still supports its existing English and
  Russian content. Interface language support does not expand its API contract.
- Localized pricing/payment behavior follows English for new interface languages;
  adding a language does not add a currency or convert prices differently.
- Consultation submissions accept and retain all nine interface language codes.
- Machine-translated medical/legal wording needs editorial review before release.

Check keys, placeholders, links, and HTML integrity:

```sh
node scripts/check-locales.cjs
npx tsc --noEmit --incremental false
```

The optional `scripts/translate-locales.py` generator sends only English UI
messages to Google's public translation endpoint. It needs network access, caches
results locally, preserves placeholders/HTML/links, and preserves existing translated values. It is an authoring utility, not an app dependency.
