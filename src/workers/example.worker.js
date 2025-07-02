const { parentPort } = require('worker_threads');

parentPort.on('message', (task) => {
  // In a real scenario, you would perform a CPU-intensive task here.
  const result = task.a + task.b;
  parentPort.postMessage(result);
});
