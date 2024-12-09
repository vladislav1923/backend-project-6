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
        req.flash('info', i18next.t('flash.authError'));
        return reply.redirect('/session/new');
      }

      const status = new app.objection.models.status();
      reply.render('statuses/new', { status });
      return reply;
    })
    .get('/statuses/:id/edit', { name: 'editStatus' }, async (req, reply) => {
      if (!req.isAuthenticated()) {
        req.flash('info', i18next.t('flash.authError'));
        return reply.redirect('/session/new');
      }

      const status = await app.objection.models.status.query().findById(req.params.id);
      reply.render('status/edit', { status });
      return reply;
    })
    .post('/statuses', async (req, reply) => {
      if (!req.isAuthenticated()) {
        req.flash('info', i18next.t('flash.authError'));
        return reply.redirect('/session/new');
      }

      const status = new app.objection.models.status();
      status.$set(req.body.data);

      try {
        const validStatus = await app.objection.models.status.fromJson(req.body.data);
        await app.objection.models.status.query().insert(validStatus);
        req.flash('info', i18next.t('flash.statuses.create.success'));
        reply.redirect(app.reverse('root'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.create.error'));
        reply.render('statuses/new', { status, errors: data });
      }

      return reply;
    })
    .post('/statuses/:id', { name: 'updateStatus' }, async (req, reply) => {
      if (!req.isAuthenticated()) {
        req.flash('info', i18next.t('flash.authError'));
        return reply.redirect('/session/new');
      }

      const status = await app.objection.models.status.query().findById(req.params.id);
      if (!status) {
        req.flash('error', i18next.t('flash.statuses.update.error'));
        return reply.redirect(app.reverse('statuses'));
      }

      try {
        await status.$query().patch(req.body.data);
        req.flash('info', i18next.t('flash.statuses.update.success'));
        reply.redirect(app.reverse('root'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.update.error'));
        reply.render('users/edit', { status, errors: data });
      }

      return reply;
    })
    .delete('/statuses/:id', { name: 'deleteStatus' }, async (req, reply) => {
      if (!req.isAuthenticated()) {
        req.flash('info', i18next.t('flash.authError'));
        return reply.redirect('/session/new');
      }

      const status = await app.objection.models.status.query().findById(req.params.id);
      if (!status) {
        req.flash('error', i18next.t('flash.statuses.delete.error'));
        return reply.redirect(app.reverse('statuses'));
      }

      await status.$query().delete();
      req.flash('info', i18next.t('flash.statuses.delete.success'));
      reply.redirect(app.reverse('root'));
      return reply;
    });
};
