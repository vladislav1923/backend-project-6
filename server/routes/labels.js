import i18next from 'i18next';

export default (app) => {
  app
    .get('/labels', { name: 'labels' }, async (req, reply) => {
      const labels = await app.objection.models.label.query();
      reply.render('labels/index', { labels });
      return reply;
    })
    .get('/labels/new', { name: 'newLabel' }, (req, reply) => {
      if (!req.isAuthenticated()) {
        console.error('Cannot return a label creation form without authentication');
        req.flash('info', i18next.t('flash.authError'));
        return reply.redirect('/session/new');
      }

      const label = new app.objection.models.label();
      reply.render('labels/new', { label });
      return reply;
    })
    .get('/labels/:id/edit', { name: 'editLabel' }, async (req, reply) => {
      if (!req.isAuthenticated()) {
        console.error('Cannot edit a label without authentication');
        req.flash('info', i18next.t('flash.authError'));
        return reply.redirect('/session/new');
      }

      const label = await app.objection.models.label.query().findById(req.params.id);
      reply.render('labels/edit', { label });
      return reply;
    })
    .post('/labels', async (req, reply) => {
      if (!req.isAuthenticated()) {
        console.error('Cannot create a label without authentication');
        req.flash('info', i18next.t('flash.authError'));
        return reply.redirect('/session/new');
      }

      const label = new app.objection.models.label();
      label.$set(req.body.data);

      try {
        const validLabel = await app.objection.models.label.fromJson(req.body.data);
        await app.objection.models.label.query().insert(validLabel);
        req.flash('info', i18next.t('flash.labels.create.success'));
        reply.redirect(app.reverse('labels'));
      } catch ({ data, message }) {
        console.error('Error during creating a label', message);
        req.flash('error', i18next.t('flash.labels.create.error'));
        reply.render('labels/new', { label, errors: data });
      }

      return reply;
    })
    .patch('/labels/:id', { name: 'updateLabel' }, async (req, reply) => {
      if (!req.isAuthenticated()) {
        console.error('Cannot update a label without authentication');
        req.flash('info', i18next.t('flash.authError'));
        return reply.redirect('/session/new');
      }

      const label = await app.objection.models.label.query().findById(req.params.id);
      if (!label) {
        console.error('Cannot update a label that does not exist');
        req.flash('error', i18next.t('flash.labels.update.error'));
        return reply.redirect(app.reverse('labels'));
      }

      label.$set(req.body.data);

      try {
        const validLabel = await app.objection.models.label.fromJson(req.body.data);
        await label.$query().patch(validLabel);
        req.flash('info', i18next.t('flash.labels.update.success'));
        reply.redirect(app.reverse('labels'));
      } catch ({ data, message }) {
        console.error('Error during updating a label', message);
        req.flash('error', i18next.t('flash.labels.update.error'));
        reply.render('labels/edit', { label, errors: data });
      }

      return reply;
    })
    .delete('/labels/:id', { name: 'deleteLabel' }, async (req, reply) => {
      if (!req.isAuthenticated()) {
        console.error('Cannot delete a label without authentication');
        req.flash('info', i18next.t('flash.authError'));
        return reply.redirect('/session/new');
      }

      const label = await app.objection.models.label.query().findById(req.params.id);
      if (!label) {
        console.error('Cannot delete a label that does not exist');
        req.flash('error', i18next.t('flash.labels.delete.error'));
        return reply.redirect(app.reverse('labels'));
      }

      const isUsed = await app.objection.models.taskLabel.query()
        .where({ labelId: req.params.id }).first();
      if (isUsed) {
        console.error('Cannot delete a label that is in use');
        req.flash('error', i18next.t('flash.labels.delete.error'));
        return reply.redirect(app.reverse('labels'));
      }

      await label.$query().delete();
      req.flash('info', i18next.t('flash.labels.delete.success'));
      reply.redirect(app.reverse('labels'));
      return reply;
    });
};
