const path = require('node:path'), assert = require('node:assert/strict');
require('ts-node').register({ project: path.join(__dirname, '../tsconfig.json'), transpileOnly: true });
const { JwtService } = require('@nestjs/jwt');
const { AuthService } = require('../src/auth/auth.service');
const { JwtStrategy } = require('../src/auth/strategies/jwt.strategy');
const { UserSchema } = require('../src/schemas/user.schema');
const id = '507f1f77bcf86cd799439011';
const account = { _id: id, name: 'Test Member', email: 'test@example.com', sessionIds: [], deletedAt: null };
const users = {
  findOne(query) { const user = account.deletedAt ? null : account; return { select() { return this; }, then(resolve, reject) { return Promise.resolve(user).then(resolve, reject); } }; },
  async updateOne(query, update) {
    if (account.deletedAt && query.deletedAt === null) return { matchedCount: 0 };
    if (update.$push?.sessionIds) account.sessionIds.push(update.$push.sessionIds);
    if (update.$pull?.sessionIds) account.sessionIds = account.sessionIds.filter(value => value !== update.$pull.sessionIds);
    return { matchedCount: 1 };
  },
};
const secret = 'persistent-sessions-test-only';
const jwt = new JwtService({ secret });
const service = new AuthService(users, jwt, {}, {});
const strategy = new JwtStrategy({ get: () => secret }, users);
(async () => {
  assert.equal(UserSchema.path('sessionIds').options.select, false);
  const first = await service.login({ id, name: account.name, email: account.email });
  const payload = jwt.verify(first.token, { clockTimestamp: Math.floor(Date.now() / 1000) + 25 * 3600 });
  assert.equal(payload.exp, undefined); assert.ok(payload.sid);
  assert.equal((await strategy.validate(payload)).sessionId, payload.sid);
  const second = await service.login({ id, name: account.name, email: account.email });
  const otherPayload = jwt.decode(second.token); assert.notEqual(otherPayload.sid, payload.sid);
  const restored = await service.restoreSession(id, payload.sid);
  assert.equal(restored.user.email, account.email); assert.equal(restored.token, undefined);
  await service.logout(id, payload.sid);
  await assert.rejects(() => strategy.validate(payload));
  assert.equal((await strategy.validate(otherPayload)).sessionId, otherPayload.sid, 'Logout must only revoke this browser session');
  await assert.rejects(() => strategy.validate({ sub: id, sid: 'unknown-session' }));
  await assert.rejects(() => strategy.validate({ sub: id }));
  const legacy = { sub: id, exp: Math.floor(Date.now() / 1000) + 3600 };
  await strategy.validate(legacy);
  const migrated = await service.restoreSession(id);
  assert.ok(jwt.decode(migrated.token).sid); assert.equal(jwt.decode(migrated.token).exp, undefined);
  account.sessionIds = []; await assert.rejects(() => strategy.validate(otherPayload));
  account.deletedAt = new Date(); await assert.rejects(() => service.login({ id }));
  console.log('PASS: sessions survive 24 hours, restore without token churn, migrate legacy tokens, logout revokes only the current browser, revoked sessions and deleted accounts are denied.');
})().catch(error => { console.error(error); process.exitCode = 1; });
