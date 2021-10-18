import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    knex.schema.createTable('users', (table) => {
        table.uuid("id").notNullable();
        table.integer("age").notNullable();
        table.string("name").notNullable();
        table.datetime("createdAt").notNullable();
        table.datetime("updatedAt").notNullable();
    })
}


export async function down(knex: Knex): Promise<void> {
}

