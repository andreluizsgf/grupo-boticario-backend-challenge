import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('dealers', (table) => {
        table.uuid("id").notNullable();
        table.string("name").notNullable();
        table.string("cpf").notNullable();
        table.string("email").notNullable();
        table.string("password").notNullable();
        table.datetime("createdAt").notNullable();
        table.datetime("updatedAt").notNullable();
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('dealers');
}

