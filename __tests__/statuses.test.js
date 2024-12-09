// @ts-check

import fastify from 'fastify';

import init from '../server/plugin.js';
import { getTestData, prepareData } from './helpers/index.js';

describe('test statuses CRUD', () => {
  let app;
  let knex;
  let models;
  const testData = getTestData();

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: { target: 'pino-pretty' },
    });
    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;

    // TODO: пока один раз перед тестами
    // тесты не должны зависеть друг от друга
    // перед каждым тестом выполняем миграции
    // и заполняем БД тестовыми данными
    await knex.migrate.latest();
    await prepareData(app);
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
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.statuses.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('statuses'),
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    const expected = {
      name: params.name,
    };
    const status = await models.status.query().findOne({ name: params.name });
    expect(status).toMatchObject(expected);
  });

  it('update', async () => {
    const params = testData.statuses.new;
    await app.inject({
      method: 'POST',
      url: app.reverse('statuses'),
      payload: {
        data: params,
      },
    });

    const status = await models.status.query().findOne({ name: params.name });
    const newName = 'On Hold';

    const response = await app.inject({
      method: 'POST',
      url: app.reverse('updateStatus', { id: status.id }),
      payload: {
        data: { name: newName },
      },
    });

    expect(response.statusCode).toBe(302);
    const updatedStatus = await models.status.query().findOne({ name: newName });
    expect(updatedStatus.id).toBe(status.id);
    expect(updatedStatus.name).not.toBe(status.name);
  });

  it('delete', async () => {
    const params = testData.statuses.new;
    await app.inject({
      method: 'POST',
      url: app.reverse('statuses'),
      payload: {
        data: params,
      },
    });

    const status = await models.status.query().findOne({ name: params.name });
    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteStatus', { id: status.id }),
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
