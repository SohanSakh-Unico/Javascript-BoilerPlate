const express = require('express');
const fs = require('fs');
const path = require('path');
const responseHandler = require('./middleware/responseHandler');
const errorHandler = require('./middleware/errorHandler');

class App {
  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.loadModules();
    this.initializeErrorHandling();
  }

  initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(responseHandler);
    // Add other global middlewares here (e.g., cors, helmet, morgan)
  }

  loadModules() {
    const modulesPath = path.join(__dirname, '..', 'modules');
    fs.readdirSync(modulesPath).forEach(moduleName => {
      const modulePath = path.join(modulesPath, moduleName);
      if (fs.statSync(modulePath).isDirectory()) {
        // Scan for version directories (v1, v2, etc.)
        fs.readdirSync(modulePath).forEach(versionName => {
          const versionPath = path.join(modulePath, versionName);
          if (fs.statSync(versionPath).isDirectory() && versionName.match(/^v[0-9]+$/)) {
            const routesPath = path.join(versionPath, 'routes');
            if (fs.existsSync(routesPath)) {
              fs.readdirSync(routesPath).forEach(file => {
                if (file.endsWith('.js')) {
                  const route = require(path.join(routesPath, file));
                  const apiPrefix = `/api/${versionName}/${moduleName}`;
                  this.app.use(apiPrefix, route);
                  console.log(`Loaded routes from ${moduleName} (${versionName}) at ${apiPrefix}`);
                }
              });
            }
          }
        });
      }
    });
  }

  initializeErrorHandling() {
    this.app.use(errorHandler);
  }

  getApp() {
    return this.app;
  }
}

module.exports = App;


