import { knex } from "../../src/infra/knex";
import pg from "pg";

process.env.TZ = "UTC";
process.env.DB_HOST = "localhost";
process.env.DB_PASSWORD = "postgres";
process.env.DB_USERNAME = "postgres";
process.env.DB_PORT = "5432";
process.env.PG_DB_NAME = "db_test";

async function createDatabase() {
    try {
        const client = new pg.Pool({
            host: process.env.DB_HOST,
            password: process.env.DB_PASSWORD,
            port: parseInt(process.env.DB_PORT!, 10),
            user: process.env.DB_USERNAME
        });

        console.log(process.env.PG_DB_NAME)
        await client.connect();
        console.log("chegou aqui");
        await client.query("DROP DATABASE IF EXISTS " + process.env.PG_DB_NAME);
        console.log("chegou aqui");
        await client.query("CREATE DATABASE " + process.env.PG_DB_NAME);
        console.log("chegou aqui");
        await client.end();
        console.log("chegou aqui");
    } catch (error) {
        console.log(error);
    }
}

module.exports = async () => {
    await createDatabase();
    
    await knex.migrate.latest();
};
