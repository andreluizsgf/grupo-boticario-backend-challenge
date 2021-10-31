import { Client } from "pg";
import dotenv from "dotenv";
import path from "path";
import faker from "faker";
dotenv.config({ path: path.join(__dirname, "../", ".env") });

process.env.TEST = "true";

async function createDatabase() {
  process.env.PG_DB_NAME = faker.random.word();
  try {
    const client = new Client({
      host: process.env.PG_DB_HOST,
      password: process.env.PG_DB_PASSWORD,
      port: parseInt(process.env.PG_DB_PORT ?? "5432", 10),
      user: process.env.PG_DB_USER,
    });

    await client.connect();
    await client.query(`DROP DATABASE IF EXISTS ${process.env.PG_DB_NAME}`);
    await client.query(`CREATE DATABASE ${process.env.PG_DB_NAME}`);

    await client.end();
  } catch (error) {
    console.log(error);
  }
}

module.exports = async () => {
  await createDatabase();
};
