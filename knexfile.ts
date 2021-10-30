const config = {
  client: 'pg',
  connection: {
    host: process.env.PG_DB_HOST,
    port: parseInt(process.env.PG_DB_PORT ?? '5432', 10),
    database: process.env.PG_DB_NAME,
    password: process.env.PG_DB_PASSWORD,
    user: process.env.PG_DB_USER,
  },
  migrations: {
    directory: 'src/infra/migrations/',
    extension: 'ts',
  },
};

export default config;
