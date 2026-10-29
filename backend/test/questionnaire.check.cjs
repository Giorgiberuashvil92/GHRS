// No real users, health records, database connections, email or SMS are used.
const assert = require('node:assert/strict');
const path = require('node:path');
require('ts-node').register({ project: path.join(__dirname, '../tsconfig.json'), transpileOnly: true });
require('reflect-metadata');
const { ValidationPipe } = require('@nestjs/common');
const { Types } = require('mongoose');
const { SubmitQuestionnaireDto } = require('../src/questionnaire/dto/submit-questionnaire.dto');
const { QuestionnaireService } = require('../src/questionnaire/questionnaire.service');
const { QuestionnaireController } = require('../src/questionnaire/questionnaire.controller');
const { findCatalogSection } = require('../src/questionnaire/conditions');
const userId = new Types.ObjectId(), categoryId = new Types.ObjectId(), subId = new Types.ObjectId();
const records = [];
let currentUser = { _id: userId, name: 'Fixture User', email: 'fixture@example.test' }, lastQuery, lastUpdate;
const lean = value => ({ select() { return this; }, sort() { return this; }, skip() { return this; }, limit() { return this; }, lean: async () => value });
const questionnaires = {
  create: async record => { const saved = { ...record, _id: new Types.ObjectId(), createdAt: new Date(), status: 'new' }; records.push(saved); return saved; },
  findOne: query => { lastQuery = query; return lean(records.at(-1) || null); },
  find: query => { lastQuery = query; return lean(records); },
  countDocuments: async () => records.length,
  findByIdAndUpdate: (id, update) => { lastUpdate = update; return lean({ ...records[0], ...update.$set }); },
};
const users = { findOne: query => { assert.equal(query.deletedAt, null); assert.equal(String(query._id), String(userId)); return lean(currentUser); } };
const categories = { find: query => { assert.equal(query.isPublished, true); assert.equal(query.isActive, true); return lean([
  { _id: categoryId, name: { en: 'Orthopedics', ru: 'Ортопедия' } },
  { _id: subId, parentId: categoryId, name: { en: 'Cervical Spine Problems', ru: 'Шейный отдел позвоночника' } },
]); } };
const sets = { find: query => { assert.equal(query.isActive, true); assert.equal(query.isPublished, true); return lean([{ categoryId, subCategoryId: subId }]); } };
const service = new QuestionnaireService(questionnaires, users, categories, sets);
const controller = new QuestionnaireController(service);
const pipe = new ValidationPipe({ transform: true, whitelist: true });
const validate = body => pipe.transform(body, { type: 'body', metatype: SubmitQuestionnaireDto });
const valid = { locale: 'ru', purpose: 'rehabilitation', nickname: ' Fixture ', phone: '+995 555 123 456', conditionDetails: ' More fixture details ', additionalInfo: ' Additional fixture information ', consent: true };
const context = email => ({ switchToHttp: () => ({ getRequest: () => ({ user: { email } }) }) });
(async () => {
  const clean = await validate({ ...valid, userId: 'forged', createdAt: '2000-01-01', status: 'reviewed', outcome: 'catalog' });
  assert.equal(clean.nickname, 'Fixture'); assert.equal(clean.conditionDetails, 'More fixture details'); assert.equal(clean.additionalInfo, 'Additional fixture information'); assert.equal(clean.userId, undefined); assert.equal(clean.createdAt, undefined); assert.equal(clean.status, undefined);
  for (const invalid of [{ consent: false }, { nickname: '  ' }, { age: 121 }, { weight: -1 }, { trainingLevel: 'expert' }, { locale: 'ka' }, { phone: 'invalid' }, { email: 'not-an-email' }, { additionalInfo: 'x'.repeat(5001) }, { conditionDetails: 'x'.repeat(2001) }]) await assert.rejects(() => validate({ ...valid, ...invalid }));
  assert.equal(Reflect.getMetadata('__guards__', QuestionnaireController.prototype.list), undefined);
  assert.equal(Reflect.getMetadata('__guards__', QuestionnaireController.prototype.review), undefined);
  assert.equal(Reflect.getMetadata('__guards__', QuestionnaireController.prototype.submit).length, 1);
  const options = await controller.options(); assert.equal(options.groups.length, 3); assert.equal(options.catalog.length, 2);
  const saved = await controller.submit({ user: { userId: String(userId), email: 'not-trusted@example.test' } }, { ...clean, conditionId: 'neck' });
  assert.equal(String(saved.userId), String(userId)); assert.equal(saved.accountEmail, currentUser.email); assert.ok(saved.createdAt instanceof Date);
  assert.equal(saved.answers.conditionDetails, 'More fixture details'); assert.equal(saved.answers.additionalInfo, 'Additional fixture information');
  assert.equal(saved.outcome, 'catalog'); assert.equal(saved.links[0].href, `/categories/section?subcategoryId=${subId}&categoryId=${categoryId}`);
  const direct = await service.submit(String(userId), { ...clean, locale: 'en', conditionId: `catalog:${subId}` }); assert.equal(direct.outcome, 'catalog');
  await assert.rejects(() => service.submit(String(userId), { ...clean, conditionId: 'general-other', conditionDetails: ' ' }));
  await assert.rejects(() => service.submit(String(userId), { ...clean, conditionId: 'unknown' }));
  await assert.rejects(() => service.submit(String(userId), { ...clean, phone: '() () ()' }));
  const manual = await service.submit(String(userId), { ...clean, conditionId: 'general-other', conditionDetails: 'Fixture condition, not a real health record' });
  assert.equal(manual.outcome, 'review'); assert.deepEqual(manual.links, []);
  const professional = await service.submit(String(userId), { ...clean, purpose: 'professional' });
  assert.equal(professional.links[0].href, '/professional'); assert.equal(records.length, 4);
  await controller.latest({ user: { userId: String(userId) } }); assert.equal(String(lastQuery.userId), String(userId));
  const list = await service.list('a.*', 'new', '1'); assert.equal(list.total, 4); assert.equal(lastQuery.$or[0].accountName.$regex, 'a\\.\\*'); assert.equal(lastQuery.status, 'new');
  await assert.rejects(() => service.list('', '', '0')); await assert.rejects(() => service.list('', 'bad', '1'));
  await service.review(String(saved._id), 'reviewed', ' Follow up ', 'admin@example.test');
  assert.equal(lastUpdate.$set.curatorNotes, 'Follow up'); assert.ok(lastUpdate.$set.reviewedAt instanceof Date);
  await service.review(String(saved._id), 'new', '', 'admin@example.test'); assert.equal(lastUpdate.$set.reviewedAt, null);
  await assert.rejects(() => service.review('invalid', 'new', '', 'admin@example.test'));
  assert.equal(findCatalogSection('neck', []), undefined);
  assert.equal(findCatalogSection('neck', [options.catalog[1], options.catalog[1]]), undefined);
  assert.equal(findCatalogSection('general-other', options.catalog), undefined);
  currentUser = null; await assert.rejects(() => service.submit(String(userId), clean), error => error.getStatus() === 404);
  console.log('Passed: validation, consent, authenticated ownership, catalog mapping, manual follow-up, submission history, search, review transitions.');
})().catch(error => { console.error(error); process.exitCode = 1; });
