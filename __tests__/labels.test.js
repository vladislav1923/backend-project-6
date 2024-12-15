// @ts-check

import fastify from 'fastify';

import init from '../server/plugin.js';
import { getTestData, prepareData } from './helpers/index.js';

describe('test labels CRUD', () => {
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
      url: app.reverse('labels'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newLabel'),
      cookies,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.labels.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('labels'),
      payload: {
        data: params,
      },
      cookies,
    });

    expect(response.statusCode).toBe(302);
    const expected = {
      name: params.name,
    };
    const label = await models.label.query().findOne({ name: params.name });
    expect(label).toMatchObject(expected);
  });

  it('update', async () => {
    const params = testData.labels.new;
    await app.inject({
      method: 'POST',
      url: app.reverse('labels'),
      payload: {
        data: params,
      },
      cookies,
    });

    const label = await models.label.query().findOne({ name: params.name });
    const newName = 'Label 2';

    const response = await app.inject({
      method: 'POST',
      url: app.reverse('updateLabel', { id: label.id }),
      payload: {
        data: { name: newName },
      },
      cookies,
    });

    expect(response.statusCode).toBe(302);
    const updatedLabel = await models.label.query().findOne({ name: newName });
    expect(updatedLabel.id).toBe(label.id);
    expect(updatedLabel.name).not.toBe(label.name);
  });

  it('delete', async () => {
    const params = testData.labels.new;
    await app.inject({
      method: 'POST',
      url: app.reverse('labels'),
      payload: {
        data: params,
      },
      cookies,
    });

    const label = await models.label.query().findOne({ name: params.name });
    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteLabel', { id: label.id }),
      cookies,
    });

    expect(response.statusCode).toBe(302);
    const deletedLabel = await models.label.query().findById(label.id);
    expect(deletedLabel).toBeUndefined();
  });

  it('tasks to labels', async () => {
    const params = testData.labels.new;
    await app.inject({
      method: 'POST',
      url: app.reverse('labels'),
      payload: {
        data: params,
      },
      cookies,
    });

    await app.inject({
      method: 'POST',
      url: app.reverse('statuses'),
      payload: {
        data: testData.statuses.inProgress,
      },
      cookies,
    });

    const user = await models.user.query().findOne({ email: testData.users.existing.email });
    const status = await models.status.query().findOne({ name: testData.statuses.inProgress.name });
    const label = await models.label.query().findOne({ name: params.name });

    await app.inject({
      method: 'POST',
      url: app.reverse('tasks'),
      payload: {
        data: {
          ...testData.tasks.new,
          statusId: status.id,
          creatorId: user.id,
          labels: label.id.toString(),
        },
      },
      cookies,
    });

    const task = await models.task.query().findOne({ name: testData.tasks.new.name });
    const taskLabel = await models.taskLabel.query().findOne({ taskId: task.id });

    expect(taskLabel.labelId).toBe(label.id);
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
