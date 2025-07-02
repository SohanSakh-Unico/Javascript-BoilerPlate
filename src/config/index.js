require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  
  // Worker thread pool size
  // https://nodejs.org/api/cli.html#cli_uv_threadpool_size_size
  workerThreadPoolSize: process.env.UV_THREADPOOL_SIZE || 4,

  // Database configuration (Drizzle ORM)
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },

  // Caching (e.g., Redis)
  cache: {
    host: process.env.CACHE_HOST,
    port: process.env.CACHE_PORT,
  },

  // Queue (e.g., RabbitMQ)
  queue: {
    url: process.env.QUEUE_URL,
  },

  // JWT Secret for authentication
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
};

module.exports = config;
