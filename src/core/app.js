const express = require('express');
const contentType = require('content-type');
const getRawBody = require('raw-body');
const createRouter = require('./app.routes');
const AppController = require('./app.controller');
const toobusy = require('toobusy-js');

class App {
  constructor() {
    this.app = express();
    // We will call the async initialization from an external method.
  }

  async initialize() {
    this.initializeMiddlewares();
    await this.initializeRoutes(); // This is now an async method
    this.initializeErrorAndNotFoundHandlers();
  }

  initializeMiddlewares() {
    // IMPORTANT: toobusy must be the first middleware
    this.app.use((req, res, next) => {
      if (toobusy()) {
        res.status(503).send("Server Too Busy");
      } else {
        next();
      }
    });

    this.app.use(express.json({ limit: '1mb' }));

    // Global raw body parser for POST/PUT/DELETE requests
    this.app.use((req, res, next) => {
      if (!['POST', 'PUT', 'DELETE'].includes(req.method)) {
        return next();
      }
      try {
        getRawBody(req, {
          length: req.headers['content-length'],
          limit: '1mb',
          encoding: contentType.parse(req).parameters.charset
        }, (err, string) => {
          if (err) return next(err);
          req.rawBody = string;
          next();
        });
      } catch (error) {
        next(error);
      }
    });
  }

  async initializeRoutes() {
    const mainRouter = await createRouter();
    this.app.use('/', mainRouter);
  }

  initializeErrorAndNotFoundHandlers() {
    // The 404 handler should come after the main router and before the global error handler.
    this.app.use(AppController.handleNotFound);
    this.app.use(AppController.handleError);
  }

  getApp() {
    return this.app;
  }
}

module.exports = App;
