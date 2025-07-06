const os = require('os');
require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  
  // --- Main Thread UV Pool Size ---
  // For the main thread's I/O-bound tasks (e.g., file system).
  mainUvThreadPoolSize: parseInt(process.env.MAIN_UV_THREADPOOL_SIZE, 10) || 4,

  // --- Worker Thread Pool (for CPU-bound tasks) ---
  // The number of dedicated worker threads for running module logic.
  // Defaults to the number of CPU cores minus one, or at least 1.
  workerPoolSize: parseInt(process.env.WORKER_POOL_SIZE, 10) || Math.max(os.cpus().length - 1, 1),

  // --- Worker's Internal UV Pool Size ---
  // The size of the libuv thread pool *inside* each worker thread.
  // Keep this small to avoid resource exhaustion.
  workerUvThreadPoolSize: parseInt(process.env.WORKER_UV_THREADPOOL_SIZE, 10) || 2,

  // Database configuration (Drizzle ORM)
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },

  // JWT Secret for authentication
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
};

module.exports = config;

