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
        status: statuses.find((status) => status.id === task.statusId),
        creator: users.find((user) => user.id === task.creatorId),
        executor: users.find((user) => user.id === task.executorId),
      }));
      reply.render('tasks/index', { tasks: tasksForView });
      return reply;
    });
};
