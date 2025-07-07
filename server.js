const config = require('./src/config');

// IMPORTANT: Set the main thread's UV_THREADPOOL_SIZE before any other modules are loaded.
process.env.UV_THREADPOOL_SIZE = config.mainUvThreadPoolSize;

const App = require('./src/core/app');
const http = require('http');

let server;

const startServer = async () => {
  try {
    const appInstance = new App();
    await appInstance.initialize(); // Await the async initialization
    const app = appInstance.getApp();
    server = http.createServer(app);

    server.listen(config.port, () => {
      console.log(`🚀 Server listening on port ${config.port}`);
      console.log(`   Environment: ${config.env}`);
      console.log(`   Main thread UV pool size: ${process.env.UV_THREADPOOL_SIZE}`);
      console.log(`   Worker pool size: ${config.workerPoolSize}`);
      console.log(`   Worker's internal UV pool size: ${config.workerUvThreadPoolSize}`);
    });
  } catch (error) {
    console.error("🚨 Failed to start server:", error);
    process.exit(1);
  }
};

const gracefulShutdown = (signal) => {
  console.log(`
🚨 Received ${signal}, shutting down gracefully...`);
  
  if (!server) {
    console.log("✅ Server not started, exiting.");
    process.exit(0);
  }

  server.close(() => {
    console.log('✅ Closed out remaining connections.');
    // If you have a database connection, close it here.
    // e.g., db.close(() => { ... });
    process.exit(0);
  });

  // Forcefully shutdown after a timeout
  setTimeout(() => {
    console.error('❌ Could not close connections in time, forcefully shutting down.');
    process.exit(1);
  }, 10000); // 10 seconds
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();

