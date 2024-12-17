// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/tasks', { name: 'tasks' }, async (req, reply) => {
      const query = app.objection.knex('tasks')
        .leftJoin('tasks_labels', 'tasks.id', 'tasks_labels.task_id')
        .distinct('tasks.id')
        .select('tasks.*');

      if (req.query.status) {
        query.andWhere('tasks.status_id', Number(req.query.status));
      }
      if (req.query.executor) {
        query.andWhere('tasks.executor_id', Number(req.query.executor));
      }
      if (req.query.label) {
        query.where('tasks_labels.label_id', Number(req.query.label));
      }

      const tasks = await query;
      const statuses = await app.objection.models.status.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();
      const tasksForView = await Promise.all(tasks.map(async (task) => {
        const taskLabels = await app.objection.models.taskLabel.query()
          .join('labels', 'tasks_labels.labelId', 'labels.id')
          .where('tasks_labels.taskId', task.id)
          .select('labels.*');

        return {
          ...task,
          id: task.id.toString(),
          status: statuses.find((status) => status.id === task.statusId),
          creator: users.find((user) => user.id === task.creatorId),
          executor: users.find((user) => user.id === task.executorId),
          labels: taskLabels,
        };
      }));

      const statusesForView = statuses.map((status) => ({
        value: status.id,
        label: status.name,
      }));
      statusesForView.unshift({ value: '', label: '' });

      const usersForView = users.map((user) => ({
        value: user.id,
        label: `${user.firstName} ${user.lastName}`,
      }));
      usersForView.unshift({ value: '', label: '' });

      const labelsForView = labels.map((label) => ({
        value: label.id,
        label: label.name,
      }));
      labelsForView.unshift({ value: '', label: '' });

      const search = {
        status: req.query.status ? Number(req.query.status) : '',
        executor: req.query.executor ? Number(req.query.executor) : '',
        label: req.query.label ? Number(req.query.label) : '',
      };

      reply.render('tasks/index', {
        tasks: tasksForView,
        search,
        statuses: statusesForView,
        users: usersForView,
        labels: labelsForView,
      });
      return reply;
    })
    .get('/tasks/new', { name: 'newTask' }, async (req, reply) => {
      if (!req.isAuthenticated()) {
        console.error('Cannot return a task creation form without authentication');
        req.flash('info', i18next.t('flash.authError'));
        return reply.redirect('/session/new');
      }

      const task = new app.objection.models.task();
      task.labels = [];
      task.executorId = '';
      const statuses = await app.objection.models.status.query();
      const statusesForSelect = statuses.map((status) => ({
        value: status.id,
        label: status.name,
      }));
      const labels = await app.objection.models.label.query();
      const labelsForSelect = labels.map((label) => ({
        value: label.id,
        label: label.name,
      }));
      const users = await app.objection.models.user.query();
      const usersForSelect = users.map((user) => ({
        value: user.id,
        label: `${user.firstName} ${user.lastName}`,
      }));
      usersForSelect.unshift({ value: '', label: i18next.t('views.tasks.notAssigned') });

      reply.render('tasks/new', {
        task, statuses: statusesForSelect, labels: labelsForSelect, users: usersForSelect,
      });
      return reply;
    })
    .get('/tasks/:id', { name: 'oneTask' }, async (req, reply) => {
      if (!req.isAuthenticated()) {
        console.error('Cannot view a task without authentication');
        req.flash('info', i18next.t('flash.authError'));
        return reply.redirect('/session/new');
      }

      const task = await app.objection.models.task.query().findById(req.params.id);
      const statuses = await app.objection.models.status.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.taskLabel.query()
        .join('labels', 'tasks_labels.labelId', 'labels.id')
        .where('tasks_labels.taskId', req.params.id)
        .select('labels.*');

      const status = statuses.find((s) => s.id === task.statusId);
      const creator = users.find((u) => u.id === task.creatorId);
      const executor = users.find((u) => u.id === task.executorId);
      reply.render('tasks/one', {
        task, status, creator, executor, labels,
      });
      return reply;
    })
    .get('/tasks/:id/edit', { name: 'editTask' }, async (req, reply) => {
      if (!req.isAuthenticated()) {
        console.error('Cannot edit a task without authentication');
        req.flash('info', i18next.t('flash.authError'));
        return reply.redirect('/session/new');
      }

      const task = await app.objection.models.task.query().findById(req.params.id);
      task.labels = await app.objection.models.taskLabel.query()
        .where('taskId', req.params.id)
        .select('labelId')
        .then((rows) => rows.map((row) => row.labelId));
      task.executorId = task.executorId || '';

      const statuses = await app.objection.models.status.query();
      const statusesForSelect = statuses.map((status) => ({
        value: status.id,
        label: status.name,
      }));
      const labels = await app.objection.models.label.query();
      const labelsForSelect = labels.map((label) => ({
        value: label.id,
        label: label.name,
      }));
      const users = await app.objection.models.user.query();
      const usersForSelect = users.map((user) => ({
        value: user.id,
        label: `${user.firstName} ${user.lastName}`,
      }));
      usersForSelect.unshift({ value: '', label: i18next.t('views.tasks.notAssigned') });

      reply.render('tasks/edit', {
        task, statuses: statusesForSelect, labels: labelsForSelect, users: usersForSelect,
      });
      return reply;
    })
    .post('/tasks', async (req, reply) => {
      if (!req.isAuthenticated()) {
        console.error('Cannot create a task without authentication');
        req.flash('info', i18next.t('flash.authError'));
        return reply.redirect('/session/new');
      }

      const task = new app.objection.models.task();
      task.$set({
        name: req.body.data.name,
        description: req.body.data.description,
        creatorId: req.user.id,
        statusId: Number(req.body.data.statusId),
        executorId: req.body.data.executorId ? Number(req.body.data.executorId) : null,
      });

      console.log('TASK : ', task);

      const selectedLabels = [];
      if (Array.isArray(req.body.data.labels)) {
        selectedLabels.push(...req.body.data.labels);
      } else if (req.body.data.labels) {
        selectedLabels.push(req.body.data.labels);
      }

      try {
        const validTask = await app.objection.models.task.fromJson(task);
        await app.objection.models.task.query().insert(validTask);
        await Promise.all((selectedLabels).map(async (labelId) => {
          const taskLabel = new app.objection.models.taskLabel();
          taskLabel.$set({
            taskId: validTask.id,
            labelId: Number(labelId),
          });
          await app.objection.models.taskLabel.query().insert(taskLabel);
        }));
        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('tasks'));
      } catch ({ data, message }) {
        console.error('Error during creating a task', message);
        req.flash('error', i18next.t('flash.tasks.create.error'));
        reply.render('tasks/new', { task, errors: data });
      }

      return reply;
    })
    .patch('/tasks/:id', { name: 'updateTask' }, async (req, reply) => {
      if (!req.isAuthenticated()) {
        console.error('Cannot update a task without authentication');
        req.flash('info', i18next.t('flash.authError'));
        return reply.redirect('/session/new');
      }

      const task = await app.objection.models.task.query().findById(req.params.id);
      if (!task) {
        console.error('Cannot update a task that does not exist');
        req.flash('error', i18next.t('flash.tasks.update.error'));
        return reply.redirect(app.reverse('tasks'));
      }

      task.$set({
        name: req.body.data.name,
        description: req.body.data.description,
        statusId: Number(req.body.data.statusId),
        executorId: req.body.data.executorId ? Number(req.body.data.executorId) : null,
      });

      const selectedLabels = [];
      if (Array.isArray(req.body.data.labels)) {
        selectedLabels.push(...req.body.data.labels);
      } else if (req.body.data.labels) {
        selectedLabels.push(req.body.data.labels);
      }

      try {
        const validTask = await app.objection.models.task.fromJson(task);
        await task.$query().patch({ ...validTask, updated_at: new Date() });
        await app.objection.models.taskLabel.query()
          .where('taskId', validTask.id)
          .del();
        await Promise.all((selectedLabels).map(async (labelId) => {
          const taskLabel = new app.objection.models.taskLabel();
          taskLabel.$set({
            taskId: validTask.id,
            labelId: Number(labelId),
          });
          await app.objection.models.taskLabel.query().insert(taskLabel);
        }));
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
        console.error('Cannot delete a task without authentication');
        req.flash('info', i18next.t('flash.authError'));
        return reply.redirect('/session/new');
      }

      const task = await app.objection.models.task.query().findById(req.params.id);
      if (!task) {
        console.error('Cannot delete a task that does not exist');
        req.flash('error', i18next.t('flash.tasks.delete.error'));
        return reply.redirect(app.reverse('tasks'));
      }

      await task.$query().delete();
      req.flash('info', i18next.t('flash.tasks.delete.success'));
      reply.redirect(app.reverse('tasks'));
      return reply;
    });
};
