const { Worker } = require('worker_threads');
const config = require('../config');

class WorkerPool {
  constructor(workerPath) {
    this.workerPath = workerPath;
    this.numThreads = config.workerPoolSize;
    this.workers = [];
    this.queue = [];

    this.initialize();
  }

  initialize() {
    for (let i = 0; i < this.numThreads; i++) {
      const worker = new Worker(this.workerPath, {
        // Pass the configured UV_THREADPOOL_SIZE to the worker's environment
        env: {
          UV_THREADPOOL_SIZE: config.workerUvThreadPoolSize
        }
      });

      worker.on('message', (result) => {
        const task = this.queue.shift();
        if (task) {
          if (result.error) {
            task.reject(Object.assign(new Error(), result.error));
          } else {
            task.resolve(result.data);
          }
        }
        this.checkQueue();
      });

      worker.on('error', (err) => {
        const task = this.queue.shift();
        if (task) {
          task.reject(err);
        }
        console.error(`Worker error: ${err}`);
        // In a real app, you might want to replace the failed worker
      });

      this.workers.push(worker);
    }
  }

  run(taskData) {
    return new Promise((resolve, reject) => {
      const availableWorker = this.workers.find(w => !w.isBusy);

      if (availableWorker) {
        this.executeTask(availableWorker, taskData, resolve, reject);
      } else {
        this.queue.push({ taskData, resolve, reject });
      }
    });
  }

  checkQueue() {
    if (this.queue.length > 0) {
      const availableWorker = this.workers.find(w => !w.isBusy);
      if (availableWorker) {
        const { taskData, resolve, reject } = this.queue.shift();
        this.executeTask(availableWorker, taskData, resolve, reject);
      }
    }
  }

  executeTask(worker, taskData, resolve, reject) {
    worker.isBusy = true;
    worker.postMessage(taskData);

    const messageHandler = (result) => {
      worker.isBusy = false;
      if (result.error) {
        reject(Object.assign(new Error(), result.error));
      } else {
        resolve(result.data);
      }
      worker.off('message', messageHandler);
      this.checkQueue();
    };

    worker.on('message', messageHandler);
  }

  terminate() {
    for (const worker of this.workers) {
      worker.terminate();
    }
  }
}

module.exports = WorkerPool;

