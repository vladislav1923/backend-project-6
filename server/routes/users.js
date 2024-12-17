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
      if (!req.isAuthenticated()) {
        console.error('Cannot edit a user without authentication');
        req.flash('info', i18next.t('flash.authError'));
        return reply.redirect('/session/new');
      }

      if (req.user.id !== Number(req.params.id)) {
        console.error('Cannot edit other users');
        req.flash('error', i18next.t('flash.users.edit.forbidden'));
        return reply.redirect(app.reverse('users'));
      }

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
      } catch ({ data, message }) {
        console.error('Error during creating a user', message);
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user, errors: data });
      }

      return reply;
    })
    .patch('/users/:id', { name: 'updateUser' }, async (req, reply) => {
      if (!req.isAuthenticated()) {
        console.error('Cannot update a user without authentication');
        req.flash('info', i18next.t('flash.authError'));
        return reply.redirect('/session/new');
      }

      const user = await app.objection.models.user.query().findById(req.params.id);
      if (!user) {
        console.error('Cannot update a user that does not exist');
        req.flash('error', i18next.t('flash.users.update.error'));
        return reply.redirect(app.reverse('users'));
      }

      if (req.user.id !== Number(req.params.id)) {
        console.error('Cannot update other users');
        req.flash('error', i18next.t('flash.users.update.forbidden'));
        return reply.redirect(app.reverse('users'));
      }

      try {
        await user.$query().patch({
          ...req.body.data,
          updated_at: new Date(),
        });
        req.flash('info', i18next.t('flash.users.update.success'));
        reply.redirect(app.reverse('users'));
      } catch ({ data, message }) {
        console.error('Error during updating a user', message);
        req.flash('error', i18next.t('flash.users.update.error'));
        reply.render('users/edit', { user, errors: data });
      }

      return reply;
    })
    .delete('/users/:id', { name: 'deleteUser' }, async (req, reply) => {
      if (!req.isAuthenticated()) {
        console.error('Cannot delete a user without authentication');
        req.flash('info', i18next.t('flash.authError'));
        return reply.redirect('/session/new');
      }

      const user = await app.objection.models.user.query().findById(req.params.id);
      if (!user) {
        console.error('Cannot delete a user that does not exist');
        req.flash('error', i18next.t('flash.users.delete.error'));
        return reply.redirect(app.reverse('users'));
      }

      if (req.user.id !== Number(req.params.id)) {
        console.error('Cannot delete other users');
        req.flash('error', i18next.t('flash.users.delete.forbidden'));
        return reply.redirect(app.reverse('users'));
      }

      req.logOut();
      await user.$query().delete();
      req.flash('info', i18next.t('flash.users.delete.success'));
      reply.redirect(app.reverse('users'));
      return reply;
    });
};
