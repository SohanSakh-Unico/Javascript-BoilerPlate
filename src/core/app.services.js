const express = require('express');
const fs = require('fs');
const path = require('path');
const contentType = require('content-type');
const getRawBody = require('raw-body');
const { successHandler, errorHandler } = require('./middlewares/responseHandlers');
const httpStatusCodes = require('../utils/httpStatusCodes');

class App {
  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.loadModules();
    this.initializeResponseHandlers();
  }

  initializeMiddlewares() {
    this.app.use(express.json({ limit: '1mb' }));

    this.app.use((req, res, next) => {
      if (!['POST', 'PUT', 'DELETE'].includes(req.method)) {
        return next();
      }
      getRawBody(req, {
        length: req.headers['content-length'],
        limit: '1mb',
        encoding: contentType.parse(req).parameters.charset
      }, (err, string) => {
        if (err) return next(err);
        req.rawBody = string;
        next();
      });
    });
  }

  loadModules() {
    const modulesPath = path.join(__dirname, '..', 'modules');
    fs.readdirSync(modulesPath).forEach(moduleName => {
      const modulePath = path.join(modulesPath, moduleName);
      if (fs.statSync(modulePath).isDirectory()) {
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

  initializeResponseHandlers() {
    this.app.use(successHandler);

    this.app.use((req, res, next) => {
      const error = new Error(`The requested URL ${req.originalUrl} was not found on this server.`);
      error.statusCode = httpStatusCodes.CLIENT_ERROR.NOT_FOUND.code;
      next(error);
    });

    this.app.use(errorHandler);
  }

  getApp() {
    return this.app;
  }
}

module.exports = App;


