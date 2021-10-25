import { knex } from "../../knexfile";
import pg from "pg";

process.env.TZ = "UTC";
process.env.DB_HOST = "localhost";
process.env.DB_PASSWORD = "postgres";
process.env.DB_USERNAME = "postgres";
process.env.DB_PORT = "5434";
process.env.PG_DB_NAME = "db_test";

async function createDatabase() {
    try {
        const client = new pg.Pool({
            host: process.env.DB_HOST,
            password: process.env.DB_PASSWORD,
            port: parseInt(process.env.DB_PORT!, 10),
            user: process.env.DB_USERNAME
        });
        
        console.log(client);
        
        await client.connect();
        await client.query("DROP DATABASE IF EXISTS " + process.env.PG_DB_NAME);
        await client.query("CREATE DATABASE " + process.env.PG_DB_NAME);
        await client.end(); 
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = async () => {
    await createDatabase();
    await knex.migrate.latest();
};
