import pg from "node-postgres";

process.env.TZ = "UTC";
process.env.PG_DB_HOST = "localhost";
process.env.PG_DB_PASSWORD = "postgres";
process.env.PG_DB_USER = "postgres";
process.env.PG_DB_PORT = "5432";
process.env.PG_DB_NAME = "dbtest";
process.env.JWT_SECRET = "HS256";

async function createDatabase() {
  try {
    const client = new pg.Client({
      user: "postgres",
      host: "localhost",
      database: "postgres",
      password: "password",
      port: 5432,
    });

    await client.connect();
    await client.query("DROP DATABASE IF EXISTS dbtest");
    await client.query("CREATE DATABASE dbtest");
    await client.end();
  } catch (error) {
    console.log(error);
  }
}

module.exports = async () => {
  await createDatabase();
};
