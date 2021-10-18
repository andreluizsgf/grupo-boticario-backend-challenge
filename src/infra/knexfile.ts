import Knex from "knex";

const config = {
  client: "pg",
  connection: {
    host: "localhost",
    port: 5434,
    database: process.env.PG_DB_NAME,
    password: "postgres",
    user: "postgres"
  }
}

export const knex = Knex(config)
