// @ts-check

import _ from 'lodash';
import fastify from 'fastify';

import init from '../server/plugin.js';
import { getTestData, prepareData } from './helpers/index.js';

describe('test tasks CRUD', () => {
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
      url: app.reverse('tasks'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newTask'),
      cookies,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
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

    const response = await app.inject({
      method: 'POST',
      url: app.reverse('tasks'),
      payload: {
        data: {
          ...testData.tasks.new,
          statusId: status.id,
          creatorId: user.id,
        },
      },
      cookies,
    });

    expect(response.statusCode).toBe(302);

    const task = await models.task.query().findOne({ name: testData.tasks.new.name });
    expect(task).not.toBeUndefined();
  });

  it('update', async () => {
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

    await app.inject({
      method: 'POST',
      url: app.reverse('tasks'),
      payload: {
        data: {
          ...testData.tasks.new,
          statusId: status.id,
          creatorId: user.id,
        },
      },
      cookies,
    });

    await app.inject({
      method: 'POST',
      url: app.reverse('statuses'),
      payload: {
        data: testData.statuses.onHold,
      },
      cookies,
    });

    const task = await models.task.query().findOne({ name: testData.tasks.new.name });
    const newStatus = await models.status.query().findOne({ name: testData.statuses.onHold.name });

    const response = await app.inject({
      method: 'PATCH',
      url: app.reverse('oneTask', { id: task.id }),
      payload: {
        data: {
          ...testData.tasks.new,
          statusId: newStatus.id,
        },
      },
      cookies,
    });

    expect(response.statusCode).toBe(302);

    const updatedTask = await models.task.query().findById(task.id);
    expect(updatedTask.statusId).toBe(newStatus.id);
  });

  it('delete', async () => {
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

    await app.inject({
      method: 'POST',
      url: app.reverse('tasks'),
      payload: {
        data: {
          ...testData.tasks.new,
          statusId: status.id,
          creatorId: user.id,
        },
      },
      cookies,
    });

    const task = await models.task.query().findOne({ name: testData.tasks.new.name });

    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('oneTask', { id: task.id }),
      cookies,
    });

    expect(response.statusCode).toBe(302);

    const deletedTask = await models.task.query().findById(task.id);
    expect(deletedTask).toBeUndefined();
  });
});
