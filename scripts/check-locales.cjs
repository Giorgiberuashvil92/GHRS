const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..', 'public', 'locales');
const locales = ['he', 'ar', 'de', 'fr', 'it', 'uk'];
const files = fs.readdirSync(path.join(root, 'en')).filter(file => file.endsWith('.json'));
const tokens = text => (text.match(/\{\{.*?\}\}|\$\{.*?\}|<\/?[^>]+>|https?:\/\/[^\s<>]+|[\w.+-]+@[\w.-]+\.[A-Za-z]+/g) || []).sort();
let checked = 0;
function compare(source, target, label) {
  assert.equal(typeof target, typeof source, label);
  if (typeof source === 'string') {
    assert.ok(target.trim() || !source.trim(), `${label}: empty translation`);
    assert.deepEqual(tokens(target), tokens(source), `${label}: changed placeholders, markup or links`);
    assert.ok(!/ZXQ\s*\d+\s*QXZ/i.test(target), `${label}: unrestored token`);
    checked++;
  } else if (source && typeof source === 'object') {
    assert.deepEqual(Object.keys(target).sort(), Object.keys(source).sort(), `${label}: missing/extra keys`);
    for (const key of Object.keys(source)) compare(source[key], target[key], `${label}.${key}`);
  } else assert.equal(target, source, label);
}
for (const locale of locales) {
  for (const file of files) {
    compare(JSON.parse(fs.readFileSync(path.join(root, 'en', file))), JSON.parse(fs.readFileSync(path.join(root, locale, file))), `${locale}/${file}`);
  }
}
console.log(`Verified ${checked} translated strings across ${locales.length} languages: keys, nonempty values, placeholders, HTML and links.`);
