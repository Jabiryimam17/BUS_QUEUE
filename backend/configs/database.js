const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config({path:"./../.env"});
let pool = null;
const create_pool = () => {
  if (!pool) {
    

    pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'busqueue',
      port: Number(process.env.DB_PORT) || 5432,
      max: Number(process.env.DB_POOL_MAX) || 10,
      idleTimeoutMillis: Number(process.env.DB_POOL_IDLE_TIMEOUT_MS) || 30000,
      connectionTimeoutMillis: Number(process.env.DB_POOL_CONNECTION_TIMEOUT_MS) || 2000,
      ssl: { rejectUnauthorized: process.env.SSL_MODE !== 'require' }
    });
  }
  return pool;
};

const connect_database = async () => {
  try {
    pool = create_pool();
    
    // Test connection
    const client = await pool.connect();
    console.log('PostgreSQL connected successfully');
    client.release();
    
    return pool;
  } catch (error) {
    console.error('Database connection error:', error);
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
    console.log("Testing connection...");
    await connect_database();
    console.log("Test complete!");
    process.exit(0);
  })();
}