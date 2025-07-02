const { Worker } = require('worker_threads');
const path = require('path');

class WorkerPool {
  constructor(workerPath, numThreads) {
    this.workerPath = workerPath;
    this.numThreads = numThreads;
    this.workers = [];
    this.queue = [];

    this.initialize();
  }

  initialize() {
    for (let i = 0; i < this.numThreads; i++) {
      const worker = new Worker(this.workerPath);
      
      worker.on('message', (result) => {
        // Find the task in the queue and resolve its promise
        const task = this.queue.shift();
        if (task) {
          task.resolve(result);
        }
        this.checkQueue();
      });

      worker.on('error', (err) => {
        // Find the task in the queue and reject its promise
        const task = this.queue.shift();
        if (task) {
          task.reject(err);
        }
        console.error(err);
        // In a real app, you might want to replace the failed worker
      });

      this.workers.push(worker);
    }
  }

  run(taskData) {
    return new Promise((resolve, reject) => {
      this.queue.push({ taskData, resolve, reject });
      this.checkQueue();
    });
  }

  checkQueue() {
    if (this.queue.length === 0) {
      return;
    }

    const availableWorker = this.workers.find(w => !w.isBusy);
    if (availableWorker) {
      const { taskData } = this.queue.shift();
      availableWorker.isBusy = true;
      availableWorker.postMessage(taskData);

      availableWorker.once('message', (result) => {
        availableWorker.isBusy = false;
        const task = this.queue.find(t => t.taskData === taskData);
        if(task) {
            task.resolve(result);
        }
        this.checkQueue();
      });
    }
  }

  terminate() {
    for (const worker of this.workers) {
      worker.terminate();
    }
  }
}

module.exports = WorkerPool;
