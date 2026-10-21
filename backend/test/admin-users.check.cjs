// Run with: npm run test:admin-users (no database connection or email is used).
const path = require('node:path');
const assert = require('node:assert/strict');
require('ts-node').register({ project: path.join(__dirname, '../tsconfig.json'), transpileOnly: true });
const { AdminUsersController } = require('../src/user/admin-users.controller');
const { PurchaseService } = require('../src/purchase/purchase.service');
const { JwtStrategy } = require('../src/auth/strategies/jwt.strategy');
const { AuthService } = require('../src/auth/auth.service');
const bcrypt = require('bcryptjs');
const id = '507f1f77bcf86cd799439011';
const item = '507f191e810c19729de860ea';
let user = { _id: id, name: 'Test Member', email: 'member@example.com', phone: '555', location: 'Tbilisi', fullAccess: false, deletedAt: null, passwordResetTokenHash: 'old-reset-link' };
let purchased = false, lastFilter, lastSelection, lastUpdate;
function matches(query) {
  return user && (query.deletedAt !== null || !user.deletedAt) && (!query.email || query.email === user.email);
}
function projection(query) {
  const result = matches(query) ? user : null;
  return { select(selection) { lastSelection = selection; return this; }, lean: async () => result, then(resolve, reject) { return Promise.resolve(result).then(resolve, reject); } };
}
const users = {
  findOne: query => projection(query),
  exists: async query => matches(query),
  updateOne: async (query, update) => {
    lastUpdate = update;
    if (!matches(query)) return { matchedCount: 0 };
    if (update.$set?.email === 'duplicate@example.com') throw { code: 11000 };
    Object.assign(user, update.$set);
    for (const field in update.$unset) delete user[field];
    return { matchedCount: 1 };
  },
  find(query) { lastFilter = query; return { select(value) { lastSelection = value; return this; }, sort() { return this; }, skip() { return this; }, limit() { return this; }, lean: async () => matches(query) ? [user] : [] }; },
  countDocuments: async query => matches(query) ? 1 : 0,
};
const purchases = {
  aggregate: async () => [],
  findOne: async () => purchased ? { isActive: true } : null,
  find() { return { select() { return this; }, populate() { return this; }, sort() { return this; }, lean: async () => [{ isActive: true }, { isActive: true, expiresAt: new Date(0) }, { isActive: false }] }; },
};
const admin = new AdminUsersController(users, purchases);
const access = new PurchaseService(purchases, users);
const jwt = new JwtStrategy({ get: () => 'test-only-jwt-secret' }, users);
(async () => {
  await admin.list('a.*', '1');
  assert.equal(lastFilter.deletedAt, null);
  assert.equal(lastFilter.$or[0].name.$regex, 'a\\.\\*');
  assert.ok(!lastSelection.includes('password'));
  await assert.rejects(() => admin.list('', '0'));
  await assert.rejects(() => admin.detail('invalid'));
  await admin.detail(id); assert.ok(!lastSelection.includes('password')); assert.ok(lastSelection.includes('statistics'));
  await assert.rejects(() => admin.edit(id, { email: 'bad-email' }));
  await assert.rejects(() => admin.edit(id, { fullAccess: 'true' }));
  await assert.rejects(() => admin.edit(id, { diseases: [{}] }));
  await assert.rejects(() => admin.edit(id, { email: 'duplicate@example.com' }), error => error.getStatus() === 409);
  await admin.edit(id, { name: ' Updated Member ', diseases: [' condition '], additionalInfo: ' notes ', password: 'must-not-be-saved', deletedAt: new Date() });
  assert.equal(user.name, 'Updated Member'); assert.deepEqual(user.diseases, ['condition']); assert.equal(user.additionalInfo, 'notes');
  assert.equal(user.password, undefined); assert.equal(user.deletedAt, null);
  assert.equal(await access.checkUserAccess(id, item), false);
  assert.equal(await access.checkUserCourseAccess(id, item), false);
  await admin.edit(id, { fullAccess: true });
  assert.equal(await access.checkUserAccess(id, item), true);
  assert.equal(await access.checkUserCourseAccess(id, item), true);
  assert.equal(purchased, false, 'Full access must not create fake purchases');
  await admin.edit(id, { fullAccess: false });
  assert.equal(await access.checkUserCourseAccess(id, item), false);
  purchased = true;
  assert.equal(await access.checkUserAccess(id, item), true, 'Revoking full access preserves purchased content');
  assert.equal(await access.checkUserCourseAccess(id, item), true);
  await assert.rejects(() => admin.changePassword(id, { password: 'short' }));
  await admin.changePassword(id, { password: 'new-test-password' });
  assert.ok(await bcrypt.compare('new-test-password', user.password)); assert.equal(user.passwordResetTokenHash, undefined);
  const history = await admin.history(id); assert.deepEqual(history.map(row => row.hasAccess), [true, false, false]);
  assert.equal((await jwt.validate({ sub: id, exp: Math.floor(Date.now()/1000)+3600 })).email, user.email);
  await admin.remove(id);
  assert.ok(user.deletedAt instanceof Date); assert.equal(user.fullAccess, false);
  assert.equal(await access.checkUserAccess(id, item), false); assert.equal(await access.checkUserCourseAccess(id, item), false);
  await assert.rejects(() => jwt.validate({ sub: id, exp: Math.floor(Date.now()/1000)+3600 }));
  await assert.rejects(() => admin.detail(id)); await assert.rejects(() => admin.changePassword(id, { password: 'new-password-2' }));
  const auth = new AuthService(users, {}, {}, {});
  await assert.rejects(() => auth.validateUser('member@example.com', 'new-test-password'));
  assert.equal((await admin.list()).users.length, 0);
  let sentEmail = false;
  const deletedAuth = new AuthService(users, {}, { sendEmail: async () => { sentEmail = true; } }, { get: () => 'https://example.com' });
  await deletedAuth.forgotPassword('member@example.com'); assert.equal(sentEmail, false);

  // Exercise actual frontend API request logic to catch missing Bearer headers.
  const fs = require('node:fs'), vm = require('node:vm'), ts = require('typescript');
  const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, '../../app/config/api.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
  const mod = { exports: {} }; const requests = [];
  vm.runInNewContext(code, { module: mod, exports: mod.exports, require: () => ({ create: () => ({ interceptors: { request: { use() {} } } }) }),
    window: {}, localStorage: { getItem: () => 'test-session-token' }, process: { env: { NODE_ENV: 'test', NEXT_PUBLIC_API_URL: 'http://localhost:4000' } },
    AbortController, setTimeout, clearTimeout, console,
    fetch: async (_url, config) => { requests.push(config); return { ok: true, json: async () => true }; },
  });
  for (const endpoint of ['/api/purchases/check-access/' + item, '/api/purchases/check-course-access/' + item, '/api/purchases/my-courses', '/users/me/statistics']) await mod.exports.apiRequest(endpoint);
  assert.ok(requests.every(config => config.headers.Authorization === 'Bearer test-session-token'));
  await mod.exports.apiRequest('/api/categories'); assert.equal(requests.at(-1).headers.Authorization, undefined);
  console.log('PASS: user profile validation, safe fields, duplicate email, full access on/off, purchased access retention, hashed passwords, purchase status, deletion, deleted-account login and JWT rejection.');
})().catch(error => { console.error(error); process.exitCode = 1; });
