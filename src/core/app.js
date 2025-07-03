const express = require('express');
const contentType = require('content-type');
const getRawBody = require('raw-body');
const appRoutes = require('./app.routes');
const AppController = require('./app.controller');

class App {
  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorAndNotFoundHandlers();
  }

  initializeMiddlewares() {
    this.app.use(express.json({ limit: '1mb' }));

    // Global raw body parser for POST/PUT/DELETE requests
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

  initializeRoutes() {
    this.app.use('/', appRoutes);
  }

  initializeErrorAndNotFoundHandlers() {
    // These handlers are now part of AppController and applied via app.routes.js
    // However, Express requires error handling middleware to be explicitly added last.
    // The 404 handler should come before the global error handler.
    this.app.use(AppController.handleNotFound);
    this.app.use(AppController.handleError);
  }

  getApp() {
    return this.app;
  }
}

module.exports = App;
