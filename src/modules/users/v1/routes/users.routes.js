const express = require('express');
const router = express.Router();
const asyncHandler = require('../../../../src/core/lib/middlewares/asyncHandler');
const ApiError = require('../../../../src/core/ApiError');
const httpStatusCodes = require('../../../../src/core/lib/constants/httpStatusCodes');

// A "dumb" controller that only knows about its own business logic.
const getUser = (req, res, next) => {
  const user = { id: 1, name: 'John Doe', globalProperty: req.globalProperty };
  // Set data and status code in res.locals for AppController.formatResponse
  res.locals.data = user;
  res.locals.statusCode = httpStatusCodes.SUCCESS.OK.code;
  next(); // Pass to AppController.formatResponse
};

// A controller that throws a generic error with a suggested status code.
const getClientError = (req, res, next) => {
  throw new ApiError(httpStatusCodes.CLIENT_ERROR.BAD_REQUEST.code, 'This is a simulated bad request.');
};

// A controller that throws an unexpected error.
const getServerError = (req, res, next) => {
  // This will be caught by the asyncHandler and result in a 500.
  return someUndefinedVariable + 10;
};

// --- Routes ---
router.get('/', asyncHandler(getUser));
router.get('/client-error', asyncHandler(getClientError));
router.get('/server-error', asyncHandler(getServerError));

module.exports = router;