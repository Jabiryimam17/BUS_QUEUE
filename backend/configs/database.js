const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

let pool = null;

const ssl_option_for_remote = () => {
  if (process.env.DB_SSL === 'false' || process.env.PGSSLMODE === 'disable') {
    return undefined;
  }
  return {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true'
  };
};

const create_pool = () => {
  if (!pool) {
    const max = Number(process.env.DB_POOL_MAX) || 1;
    const idleTimeoutMillis = Number(process.env.DB_POOL_IDLE_TIMEOUT_MS) || 10000;
    const connectionTimeoutMillis =
      Number(process.env.DB_POOL_CONNECTION_TIMEOUT_MS) || 25000;

    const database_url =
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL;

    if (database_url) {
      // Prefer a single URL from Neon / Supabase / Railway / Vercel Postgres.
      // Use the pooled / "transaction" pooler URL for serverless (e.g. Neon *-pooler host).
      pool = new Pool({
        connectionString: database_url,
        max,
        idleTimeoutMillis,
        connectionTimeoutMillis
      });
    } else {
      const host = process.env.DB_HOST || 'localhost';
      const is_local = host === 'localhost' || host === '127.0.0.1';
      const force_ssl = process.env.DB_SSL === 'true' || process.env.PGSSLMODE === 'require';

      pool = new Pool({
        host,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'busqueue',
        port: Number(process.env.DB_PORT) || 5432,
        max,
        idleTimeoutMillis,
        connectionTimeoutMillis,
        ssl: !is_local || force_ssl ? ssl_option_for_remote() : undefined
      });
    }
  }
  return pool;
};

const connect_database = async () => {
  try {
    pool = create_pool();

    const client = await pool.connect();
    console.log('PostgreSQL connected successfully');
    client.release();

    return pool;
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

const get_pool = () => {
  if (!pool) {
    return create_pool();
  }
  return pool;
};

module.exports = {
  connect_database,
  get_pool
};

if (require.main === module) {
  (async () => {
    console.log('Testing connection...');
    await connect_database();
    console.log('Test complete!');
    process.exit(0);
  })();
}
