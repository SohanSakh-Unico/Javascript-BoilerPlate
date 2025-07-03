const config = require('./src/config');
const App = require('./src/core/app');

// IMPORTANT: Set the thread pool size before any other modules are loaded.
process.env.UV_THREADPOOL_SIZE = config.workerThreadPoolSize;

const appInstance = new App();
const app = appInstance.getApp();

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
  console.log(`Worker thread pool size: ${process.env.UV_THREADPOOL_SIZE}`);
});