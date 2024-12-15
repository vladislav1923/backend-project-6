// @ts-check
const BaseModel = require('./BaseModel.cjs');

module.exports = class TaskLabel extends BaseModel {
  static get tableName() {
    return 'tasks_labels';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['taskId', 'labelId'],
      properties: {
        id: { type: 'integer' },
        taskId: { type: 'integer' },
        labelId: { type: 'integer' },
      },
    };
  }
};
