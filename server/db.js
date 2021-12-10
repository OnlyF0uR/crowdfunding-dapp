const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOSTNAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0,
    max: 25
});

module.exports = {
    query: (query, params) => !params ? pool.query(query) : pool.query(query, params)
}