// Deterministic checks; no network requests or database writes.
const path = require('node:path'), fs = require('node:fs'), assert = require('node:assert/strict'), vm = require('node:vm');
const root = path.join(__dirname, '..');
require(path.join(root, 'backend/node_modules/ts-node')).register({ project: path.join(root, 'backend/tsconfig.json'), transpileOnly: true });
const ts = require('typescript');

async function checkPublicRequests() {
  let calls = 0, now = 0, fail = false;
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync(path.join(root, 'lib/public-request.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021 } }).outputText;
  vm.runInNewContext(source, { module, exports: module.exports, Date: { now: () => now }, AbortSignal,
    fetch: async () => { calls++; await Promise.resolve(); return { ok: !fail, status: fail ? 503 : 200, json: async () => ({ value: calls }) }; },
  });
  const { getPublicJson } = module.exports;
  const [first, second] = await Promise.all([getPublicJson('/catalog'), getPublicJson('/catalog')]);
  assert.equal(calls, 1); assert.equal(first, second);
  await getPublicJson('/catalog'); assert.equal(calls, 1);
  await getPublicJson('/catalog', { force: true }); assert.equal(calls, 2);
  now = 16000; await getPublicJson('/catalog'); assert.equal(calls, 3);
  fail = true; await assert.rejects(() => getPublicJson('/failed'));
  fail = false; await getPublicJson('/failed'); assert.equal(calls, 5);
}
async function checkTranslations() {
  const { loadTranslations } = require('../lib/translations');
  const names = ['common','home','advantages','subscribe','sets','header','components','personalAccount','footer','contact','rehabilitation','course','professional','legal'];
  const flatten = (value, prefix = '', result = new Map()) => {
    for (const [key, child] of Object.entries(value)) {
      const full = prefix ? `${prefix}.${key}` : key;
      if (child && typeof child === 'object') flatten(child, full, result); else result.set(full, child);
    }
    return result;
  };
  for (const locale of ['ka', 'en', 'ru']) {
    const expected = new Map();
    for (const name of names) for (const [key, value] of flatten(JSON.parse(fs.readFileSync(path.join(root, `public/locales/${locale}/${name}.json`), 'utf8')))) {
      // Later namespaces replace scalar parents; later scalars replace descendants.
      for (const previous of expected.keys()) if (previous.startsWith(key + '.') || key.startsWith(previous + '.')) expected.delete(previous);
      expected.set(key, value);
    }
    const result = await loadTranslations(locale), actual = flatten(result);
    for (const [key, value] of expected) assert.equal(actual.get(key), value, `${locale}: ${key}`);
    assert.equal(await loadTranslations(locale), result);
    assert.ok(result.chapter.more_exercises); assert.ok(result.auth.email_already_exists);
  }
}
async function checkParallelStatistics() {
  const { StatisticsService } = require('../backend/src/statistics/statistics.service');
  let started = 0; const resolvers = [];
  const pending = value => { started++; return new Promise(resolve => resolvers.push(() => resolve(value))); };
  const sets = { countDocuments: filter => pending(filter.isPublished ? 1 : 2), find: () => ({ lean: () => pending([{ totalDuration: '01:00:00' }, { totalDuration: '30:00' }]) }) };
  const exercises = { countDocuments: filter => pending(filter.isPublished ? 3 : 4) };
  const result = new StatisticsService(sets, exercises).getGlobalStatistics();
  assert.equal(started, 5, 'All independent database queries must start together');
  resolvers.forEach(resolve => resolve());
  assert.deepEqual(await result, { total: { sets: 2, exercises: 4, hours: 1.5 }, published: { sets: 1, exercises: 3 } });
}
async function checkSetSummary() {
  const { SetService } = require('../backend/src/set/set.service');
  let selected = '', populated = [];
  const row = { _id: '507f1f77bcf86cd799439011', thumbnailImage: 'data:image/png;base64,aGVsbG8=', updatedAt: new Date(0) };
  const query = { select(value) { selected = value; return this; }, populate(...values) { populated.push(values); return this; }, sort() { return this; }, lean() { return this; }, exec: async () => [row] };
  const model = { find: () => query, findById: () => ({ ...query, exec: async () => row }) };
  const service = new SetService(model);
  const summary = await service.findAll({ view: 'summary' });
  assert.equal(summary[0].thumbnailImage, `/api/sets/${row._id}/thumbnail?v=0`);
  assert.ok(!selected.includes('additional')); assert.ok(populated.every(([, fields]) => fields === '_id name'));
  const thumbnail = await service.getThumbnail(row._id); assert.equal(thumbnail.type, 'image/png'); assert.equal(thumbnail.body.toString(), 'hello');
  await assert.rejects(() => service.getThumbnail('invalid'));
  populated = []; await service.findAll({}); assert.ok(populated.every(values => values.length === 1), 'Existing full admin responses must remain available');
}
(async () => {
  await checkPublicRequests(); await checkTranslations(); await checkParallelStatistics(); await checkSetSummary();
  console.log('PASS: request deduplication, public cache freshness and retry, all three translation bundles, parallel statistics, compact set summaries, thumbnail decoding and full-response compatibility.');
})().catch(error => { console.error(error); process.exitCode = 1; });
