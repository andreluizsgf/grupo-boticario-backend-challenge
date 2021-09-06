import pg from 'pg';

const pool = new pg.Pool({
    host: "localhost",
    port: 5432,
    database: process.env.PG_DB_NAME,
    password: "password",
    user: "postgres"
});

export const query = (text: string, params: any) => {
    return pool.query(text, params)
}