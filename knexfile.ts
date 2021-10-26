const config = {
  client: "pg",
  connection: {
    host: "localhost",
    port: 5432,
    database: "postgres",
    password: "postgres",
    user: "postgres"
  },
  migrations: {
    directory: "src/infra/migrations/",
    extension: "ts"
  }
}

export default config;
