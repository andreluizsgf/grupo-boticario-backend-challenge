import { Client } from "pg";

async function dropDatabase() {
  try {
    const client = new Client({
      host: process.env.PG_DB_HOST,
      password: process.env.PG_DB_PASSWORD,
      port: parseInt(process.env.PG_DB_PORT ?? "5432", 10),
      user: process.env.PG_DB_USER,
    });

    await client.connect();
    await client.query(`DROP DATABASE IF EXISTS ${process.env.PG_DB_NAME} WITH (FORCE)`);
    await client.end();
  } catch (error) {
    console.log(error);
  }
}

module.exports = async () => {
  await dropDatabase();
};
