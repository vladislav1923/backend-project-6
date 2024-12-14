// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/tasks', { name: 'tasks' }, async (req, reply) => {
      const tasks = await app.objection.models.task.query();
      const statuses = await app.objection.models.status.query();
      const users = await app.objection.models.user.query();
      const tasksForView = tasks.map((task) => ({
        ...task,
        id: task.id.toString(),
        status: statuses.find((status) => status.id === task.statusId),
        creator: users.find((user) => user.id === task.creatorId),
        executor: users.find((user) => user.id === task.executorId),
      }));

      reply.render('tasks/index', { tasks: tasksForView });
      return reply;
    })
    .get('/tasks/new', { name: 'newTask' }, async (req, reply) => {
      if (!req.isAuthenticated()) {
        req.flash('info', i18next.t('flash.authError'));
        return reply.redirect('/session/new');
      }

      const task = new app.objection.models.task();
      const statuses = await app.objection.models.status.query();
      const statusesForSelect = statuses.map((status) => ({
        value: status.id,
        label: status.name,
      }));
      reply.render('tasks/new', { task, statuses: statusesForSelect });
      return reply;
    })
    .get('/tasks/:id', { name: 'oneTask' }, async (req, reply) => {
      if (!req.isAuthenticated()) {
        req.flash('info', i18next.t('flash.authError'));
        return reply.redirect('/session/new');
      }

      const task = await app.objection.models.task.query().findById(req.params.id);
      const statuses = await app.objection.models.status.query();
      const users = await app.objection.models.user.query();

      const status = statuses.find((s) => s.id === task.statusId);
      const creator = users.find((u) => u.id === task.creatorId);
      const executor = users.find((u) => u.id === task.executorId);
      reply.render('tasks/one', {
        task, status, creator, executor,
      });
      return reply;
    })
    .get('/tasks/:id/edit', { name: 'editTask' }, async (req, reply) => {
      if (!req.isAuthenticated()) {
        req.flash('info', i18next.t('flash.authError'));
        return reply.redirect('/session/new');
      }

      const task = await app.objection.models.task.query().findById(req.params.id);
      const statuses = await app.objection.models.status.query();
      const statusesForSelect = statuses.map((status) => ({
        value: status.id,
        label: status.name,
      }));
      reply.render('tasks/edit', { task, statuses: statusesForSelect });
      return reply;
    })
    .post('/tasks', async (req, reply) => {
      if (!req.isAuthenticated()) {
        req.flash('info', i18next.t('flash.authError'));
        return reply.redirect('/session/new');
      }

      const task = new app.objection.models.task();
      task.$set({
        ...req.body.data,
        creatorId: req.user.id,
        statusId: Number(req.body.data.statusId),
      });

      try {
        const validTask = await app.objection.models.task.fromJson(task);
        await app.objection.models.task.query().insert(validTask);
        console.log('TASK CREATED:', validTask);
        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('tasks'));
      } catch ({ data, message }) {
        console.error('Error during creating a task', message);
        req.flash('error', i18next.t('flash.tasks.create.error'));
        reply.render('tasks/new', { task, errors: data });
      }

      return reply;
    })
    .post('/tasks/:id', { name: 'updateTask' }, async (req, reply) => {
      if (!req.isAuthenticated()) {
        req.flash('info', i18next.t('flash.authError'));
        return reply.redirect('/session/new');
      }

      const task = await app.objection.models.task.query().findById(req.params.id);
      if (!task) {
        req.flash('error', i18next.t('flash.tasks.update.error'));
        return reply.redirect(app.reverse('tasks'));
      }

      task.$set({
        ...req.body.data,
        statusId: Number(req.body.data.statusId),
      });

      try {
        const validTask = await app.objection.models.task.fromJson(task);
        await task.$query().patch(validTask);
        req.flash('info', i18next.t('flash.tasks.update.success'));
        reply.redirect(app.reverse('tasks'));
      } catch ({ data, message }) {
        console.error('Error during updating a task', message);
        req.flash('error', i18next.t('flash.tasks.update.error'));
        reply.render('tasks/edit', { task, errors: data });
      }

      return reply;
    })
    .delete('/tasks/:id', { name: 'deleteTask' }, async (req, reply) => {
      if (!req.isAuthenticated()) {
        req.flash('info', i18next.t('flash.authError'));
        return reply.redirect('/session/new');
      }

      const task = await app.objection.models.task.query().findById(req.params.id);
      if (!task) {
        req.flash('error', i18next.t('flash.tasks.delete.error'));
        return reply.redirect(app.reverse('tasks'));
      }

      await task.$query().delete();
      req.flash('info', i18next.t('flash.tasks.delete.success'));
      reply.redirect(app.reverse('root'));
      return reply;
    });
};
