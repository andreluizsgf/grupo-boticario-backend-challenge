import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('orders', (table) => {
        table.uuid("id").notNullable();
        table.string("code").notNullable();
        table.string("dealer_cpf").notNullable();
        table.dateTime("date").notNullable();
        table.integer("subtotal").notNullable();
        table.integer("cashback_percentage").notNullable();
        table.integer("cashback_value_in_cents").notNullable();
        table.enu("status", ["Validating", "Approved"]).notNullable();
        table.datetime("created_at").notNullable();
        table.datetime("updated_at").notNullable();
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('orders');
}

