// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/statuses', { name: 'statuses' }, async (req, reply) => {
      const statuses = await app.objection.models.status.query();
      reply.render('statuses/index', { statuses });
      return reply;
    })
    .get('/statuses/new', { name: 'newStatus' }, (req, reply) => {
      if (!req.isAuthenticated()) {
        console.error('Cannot return a status creation form without authentication');
        req.flash('info', i18next.t('flash.authError'));
        return reply.redirect('/session/new');
      }

      const status = new app.objection.models.status();
      reply.render('statuses/new', { status });
      return reply;
    })
    .get('/statuses/:id/edit', { name: 'editStatus' }, async (req, reply) => {
      if (!req.isAuthenticated()) {
        console.error('Cannot edit a status without authentication');
        req.flash('info', i18next.t('flash.authError'));
        return reply.redirect('/session/new');
      }

      const status = await app.objection.models.status.query().findById(req.params.id);
      reply.render('statuses/edit', { status });
      return reply;
    })
    .post('/statuses', async (req, reply) => {
      if (!req.isAuthenticated()) {
        console.error('Cannot create a status without authentication');
        req.flash('info', i18next.t('flash.authError'));
        return reply.redirect('/session/new');
      }

      const status = new app.objection.models.status();
      status.$set(req.body.data);

      try {
        const validStatus = await app.objection.models.status.fromJson(req.body.data);
        await app.objection.models.status.query().insert(validStatus);
        req.flash('info', i18next.t('flash.statuses.create.success'));
        reply.redirect(app.reverse('statuses'));
      } catch ({ data, message }) {
        console.error('Error during creating a status', message);
        req.flash('error', i18next.t('flash.statuses.create.error'));
        reply.render('statuses/new', { status, errors: data });
      }

      return reply;
    })
    .patch('/statuses/:id', { name: 'updateStatus' }, async (req, reply) => {
      if (!req.isAuthenticated()) {
        console.error('Cannot update a status without authentication');
        req.flash('info', i18next.t('flash.authError'));
        return reply.redirect('/session/new');
      }

      const status = await app.objection.models.status.query().findById(req.params.id);
      if (!status) {
        console.error('Cannot update a status that does not exist');
        req.flash('error', i18next.t('flash.statuses.update.error'));
        return reply.redirect(app.reverse('statuses'));
      }

      try {
        await status.$query().patch({ ...req.body.data, updated_at: new Date() });
        req.flash('info', i18next.t('flash.statuses.update.success'));
        reply.redirect(app.reverse('statuses'));
      } catch ({ data, message }) {
        console.error('Error during updating a status', message);
        req.flash('error', i18next.t('flash.statuses.update.error'));
        reply.render('users/edit', { status, errors: data });
      }

      return reply;
    })
    .delete('/statuses/:id', { name: 'deleteStatus' }, async (req, reply) => {
      if (!req.isAuthenticated()) {
        console.error('Cannot delete a status without authentication');
        req.flash('info', i18next.t('flash.authError'));
        return reply.redirect('/session/new');
      }

      const status = await app.objection.models.status.query().findById(req.params.id);
      if (!status) {
        console.error('Cannot delete a status that does not exist');
        req.flash('error', i18next.t('flash.statuses.delete.error'));
        return reply.redirect(app.reverse('statuses'));
      }

      await status.$query().delete();
      req.flash('info', i18next.t('flash.statuses.delete.success'));
      reply.redirect(app.reverse('statuses'));
      return reply;
    });
};
