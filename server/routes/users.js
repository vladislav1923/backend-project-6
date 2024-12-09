// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users });
      return reply;
    })
    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
      return reply;
    })
    .get('/users/:id/edit', { name: 'editUser' }, async (req, reply) => {
      const user = await app.objection.models.user.query().findById(req.params.id);
      delete user.passwordDigest;
      reply.render('users/edit', { user });
      return reply;
    })
    .post('/users', async (req, reply) => {
      const user = new app.objection.models.user();
      user.$set(req.body.data);

      try {
        const validUser = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(validUser);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user, errors: data });
      }

      return reply;
    })
    .post('/users/:id', { name: 'updateUser' }, async (req, reply) => {
      const user = await app.objection.models.user.query().findById(req.params.id);
      if (!user) {
        req.flash('error', i18next.t('flash.users.update.error'));
        return reply.redirect(app.reverse('users'));
      }

      try {
        await user.$query().patch(req.body.data);
        req.flash('info', i18next.t('flash.users.update.success'));
        reply.redirect(app.reverse('root'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.update.error'));
        reply.render('users/edit', { user, errors: data });
      }

      return reply;
    })
    .delete('/users/:id', { name: 'deleteUser' }, async (req, reply) => {
      const user = await app.objection.models.user.query().findById(req.params.id);
      if (!user) {
        req.flash('error', i18next.t('flash.users.delete.error'));
        return reply.redirect(app.reverse('users'));
      }

      await user.$query().delete();
      req.flash('info', i18next.t('flash.users.delete.success'));
      reply.redirect(app.reverse('root'));
      return reply;
    });
};
