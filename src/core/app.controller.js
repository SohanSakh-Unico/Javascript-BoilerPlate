const ApiResponse = require('./lib/utils/ApiResponse');
const httpStatusCodes = require('./lib/constants/httpStatusCodes');

/**
 * Global application controller for initial request processing and final response formatting.
 */
class AppController {
  /**
   * Middleware for global request filtering and logging.
   * @param {import('express').Request} req - The Express request object.
   * @param {import('express').Response} res - The Express response object.
   * @param {import('express').NextFunction} next - The Express next middleware function.
   */
  static filterRequest(req, res, next) {
    console.log(`Incoming Request: ${req.method} ${req.originalUrl}`);
    // Example: Attach a common property to the request object
    req.globalProperty = 'This is a global property from AppController';
    next();
  }

  /**
   * Middleware to handle the root path or health check.
   * @param {import('express').Request} req - The Express request object.
   * @param {import('express').Response} res - The Express response object.
   */
  static getRoot(req, res) {
    // This will be caught by the responseFormatter to ensure ApiResponse format
    res.locals.data = { message: 'Welcome to the Boilerplate API!', globalProperty: req.globalProperty };
    res.locals.statusCode = httpStatusCodes.SUCCESS.OK.code;
    res.locals.message = httpStatusCodes.SUCCESS.OK.message;
    res.status(res.locals.statusCode);
    next(); // Pass to the next middleware (responseFormatter)
  }

  /**
   * Middleware to format all successful responses into a consistent ApiResponse structure.
   * This runs after route handlers but before the response is sent.
   * @param {import('express').Request} req - The Express request object.
   * @param {import('express').Response} res - The Express response object.
   * @param {import('express').NextFunction} next - The Express next middleware function.
   */
  static formatResponse(req, res, next) {
    if (res.locals.data) {
      const statusCode = res.locals.statusCode || httpStatusCodes.SUCCESS.OK.code;
      const message = res.locals.message || httpStatusCodes.SUCCESS.OK.message;
      const response = new ApiResponse(statusCode, message, res.locals.data, req.originalUrl);
      return res.status(response.statusCode).json(response);
    }
    next(); // If no data in res.locals, pass to next (e.g., 404 handler)
  }

  /**
   * Global error handling middleware.
   * @param {Error} err - The error object.
   * @param {import('express').Request} req - The Express request object.
   * @param {import('express').Response} res - The Express response object.
   * @param {import('express').NextFunction} next - The Express next middleware function.
   */
  static handleError(err, req, res, next) {
    console.error(err);

    const statusCode = err.statusCode || httpStatusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR.code;
    const message = err.message || httpStatusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR.message;
    const developer_message = {
      stack: err.stack,
    };

    const response = new ApiResponse(statusCode, message, null, req.originalUrl, developer_message);

    res.status(response.statusCode).json(response);
  }

  /**
   * Middleware to handle 404 Not Found errors.
   * @param {import('express').Request} req - The Express request object.
   * @param {import('express').Response} res - The Express response object.
   * @param {import('express').NextFunction} next - The Express next middleware function.
   */
  static handleNotFound(req, res, next) {
    const error = new Error(`The requested URL ${req.originalUrl} was not found on this server.`);
    error.statusCode = httpStatusCodes.CLIENT_ERROR.NOT_FOUND.code;
    next(error);
  }
}

module.exports = AppController;
