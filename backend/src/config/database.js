const pgPromise = require('pg-promise');
const dotenv = require('dotenv');

dotenv.config();

const pgp = pgPromise();

const connection = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'school_inventory',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.DB_SSL === 'true'
};

const db = pgp(connection);

module.exports = { db, pgp };
