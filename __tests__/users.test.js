// @ts-check

import _ from 'lodash';
import fastify from 'fastify';

import init from '../server/plugin.js';
import encrypt from '../server/lib/secure.cjs';
import { getTestData, prepareData } from './helpers/index.js';

describe('test users CRUD', () => {
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
      url: app.reverse('users'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newUser'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.users.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('users'),
      payload: {
        data: params,
      },
      cookies,
    });

    expect(response.statusCode).toBe(302);
    const expected = {
      ..._.omit(params, 'password'),
      passwordDigest: encrypt(params.password),
    };
    const user = await models.user.query().findOne({ email: params.email });
    expect(user).toMatchObject(expected);
  });

  it('update', async () => {
    const params = testData.users.new;
    await app.inject({
      method: 'POST',
      url: app.reverse('users'),
      payload: {
        data: params,
      },
      cookies,
    });

    const user = await models.user.query().findOne({ email: params.email });
    const newEmail = 'new@email.com';

    const response = await app.inject({
      method: 'POST',
      url: app.reverse('updateUser', { id: user.id }),
      payload: {
        data: { ...params, email: newEmail },
      },
      cookies,
    });

    expect(response.statusCode).toBe(302);
    const updatedUser = await models.user.query().findOne({ email: newEmail });
    expect(updatedUser.id).toBe(user.id);
    expect(updatedUser.email).not.toBe(user.email);
  });

  it('delete', async () => {
    const params = testData.users.new;
    await app.inject({
      method: 'POST',
      url: app.reverse('users'),
      payload: {
        data: params,
      },
      cookies,
    });

    const user = await models.user.query().findOne({ email: params.email });
    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteUser', { id: user.id }),
      cookies,
    });

    expect(response.statusCode).toBe(302);
    const deletedUser = await models.user.query().findById(user.id);
    expect(deletedUser).toBeUndefined();
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
