const ApiResponse = require('./ApiResponse');
const httpStatusCodes = require('../../utils/httpStatusCodes');

/**
 * A centralized error handling middleware that sends standardized API responses.
 * @param {Error} err - The error object.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || httpStatusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR.code;
  const message = err.message || httpStatusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR.message;
  const developer_message = {
    stack: err.stack,
  };

  const response = new ApiResponse(statusCode, message, null, req.originalUrl, developer_message);

  res.status(response.statusCode).json(response);
};

/**
 * Middleware to send a standardized success response.
 * It checks for data in res.locals and sends it.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
const successHandler = (req, res, next) => {
  if (res.locals.data) {
    const response = new ApiResponse(200, 'Success', res.locals.data, req.originalUrl);
    return res.status(response.statusCode).json(response);
  }
  next();
};

module.exports = {
    successHandler,
    errorHandler
};
