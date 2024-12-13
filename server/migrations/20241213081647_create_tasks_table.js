
exports.up = function(knex) {
    knex.schema.createTable('tasks', (table) => {
        table.increments('id').primary();
        table.string('name');
        table.string('description');
        table.integer('statusId').references('id').inTable('statuses');
        table.integer('creatorId').references('id').inTable('users');
        table.integer('executorId').references('id').inTable('users');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
};

exports.down = function(knex) {

};
