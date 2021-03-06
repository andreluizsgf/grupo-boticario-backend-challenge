import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("orders", (table) => {
    table.uuid("id").primary();
    table.string("code").notNullable().unique();
    table.string("dealer_cpf").notNullable();
    table.uuid("dealer_id").notNullable().references("dealers.id");
    table.dateTime("date").notNullable();
    table.integer("value_in_cents").notNullable();
    table.integer("cashback_percentage").notNullable();
    table.integer("cashback_value_in_cents").notNullable();
    table.enu("status", ["validating", "approved"]).notNullable();
    table.datetime("created_at").notNullable();
    table.datetime("updated_at").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("orders");
}
