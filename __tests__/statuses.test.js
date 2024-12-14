// @ts-check

import fastify from 'fastify';

import init from '../server/plugin.js';
import { getTestData, prepareData } from './helpers/index.js';

describe('test statuses CRUD', () => {
  let app;
  let knex;
  let models;
  let cookies;
  const testData = getTestData();

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: { target: 'pino-pretty' },
    });
    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;
    await knex.migrate.latest();
    await prepareData(app);

    const responseSignIn = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: {
        data: testData.users.existing,
      },
    });

    const [sessionCookie] = responseSignIn.cookies;
    const { name, value } = sessionCookie;
    cookies = { [name]: value };
  });

  beforeEach(async () => {
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('statuses'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newStatus'),
      cookies,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.statuses.inProgress;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('statuses'),
      payload: {
        data: params,
      },
      cookies,
    });

    expect(response.statusCode).toBe(302);
    const expected = {
      name: params.name,
    };
    const status = await models.status.query().findOne({ name: params.name });
    expect(status).toMatchObject(expected);
  });

  it('update', async () => {
    const params = testData.statuses.inProgress;
    await app.inject({
      method: 'POST',
      url: app.reverse('statuses'),
      payload: {
        data: params,
      },
      cookies,
    });

    const status = await models.status.query().findOne({ name: params.name });
    const newName = 'On Hold';

    const response = await app.inject({
      method: 'POST',
      url: app.reverse('updateStatus', { id: status.id }),
      payload: {
        data: { name: newName },
      },
      cookies,
    });

    expect(response.statusCode).toBe(302);
    const updatedStatus = await models.status.query().findOne({ name: newName });
    expect(updatedStatus.id).toBe(status.id);
    expect(updatedStatus.name).not.toBe(status.name);
  });

  it('delete', async () => {
    const params = testData.statuses.inProgress;
    await app.inject({
      method: 'POST',
      url: app.reverse('statuses'),
      payload: {
        data: params,
      },
      cookies,
    });

    const status = await models.status.query().findOne({ name: params.name });
    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteStatus', { id: status.id }),
      cookies,
    });

    expect(response.statusCode).toBe(302);
    const deletedStatus = await models.status.query().findById(status.id);
    expect(deletedStatus).toBeUndefined();
  });

  afterEach(async () => {
    // Пока Segmentation fault: 11
    // после каждого теста откатываем миграции
    // await knex.migrate.rollback();
  });

  afterAll(async () => {
    await app.close();
  });
});
