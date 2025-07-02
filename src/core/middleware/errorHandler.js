const config = require('../../config');

/**
 * A centralized error handling middleware.
 * @param {Error} err - The error object.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred';

  res.status(statusCode).json({
    success: false,
    error: {
      message: message,
      // We only expose the stack trace in development mode for security.
      stack: config.env === 'development' ? err.stack : undefined,
    },
  });
};

module.exports = errorHandler;
