const config = require('./src/config');

// IMPORTANT: Set the main thread's UV_THREADPOOL_SIZE before any other modules are loaded.
process.env.UV_THREADPOOL_SIZE = config.mainUvThreadPoolSize;

const App = require('./src/core/app');
const http = require('http');

const appInstance = new App();
const app = appInstance.getApp();
const server = http.createServer(app);

server.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
  console.log(`Environment: ${config.env}`);
  console.log(`Main thread UV pool size: ${process.env.UV_THREADPOOL_SIZE}`);
  console.log(`Worker pool size: ${config.workerPoolSize}`);
  console.log(`Worker's internal UV pool size: ${config.workerUvThreadPoolSize}`);
});
