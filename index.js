const App = require('./src/core/app');

// IMPORTANT: Set the thread pool size before any other modules are loaded.
process.env.UV_THREADPOOL_SIZE = require('./src/config').workerThreadPoolSize;

const app = new App();

module.exports = app.getApp();
