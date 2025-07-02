const config = require('./src/config');
const App = require('./src/core/app');

const app = new App();

app.getApp().listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
  console.log(`Worker thread pool size: ${process.env.UV_THREADPOOL_SIZE}`);
});
