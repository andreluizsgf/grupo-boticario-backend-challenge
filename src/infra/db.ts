import Knex from "knex";

export const knex = Knex({
    client: "pg",
    connection: {
        host: "localhost",
        port: 5432,
        database: process.env.PG_DB_NAME,
        password: "postgres",
        user: "postgres"
    }
})