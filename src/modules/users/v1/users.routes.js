const express = require('express');
const router = express.Router();
const asyncHandler = require('./middlewares/asyncHandler'); // This will be a core utility
const httpStatusCodes = require('../../../utils/httpStatusCodes'); // Uses the new top-level util

// A "dumb" controller that only knows about its own business logic.
const getUser = (req, res) => {
  const user = { id: 1, name: 'John Doe' };
  // It simply returns the data.
  return user;
};

// A controller that throws a generic error with a suggested status code.
const getClientError = (req, res, next) => {
  const error = new Error('This is a simulated bad request.');
  error.statusCode = httpStatusCodes.CLIENT_ERROR.BAD_REQUEST.code;
  throw error;
};

// A controller that throws an unexpected error.
const getServerError = (req, res, next) => {
  // This will be caught by the asyncHandler and result in a 500.
  return someUndefinedVariable + 10;
};

// --- Routes ---
// Note: The asyncHandler is applied in the core, not here.
// This is just for demonstration until the core is fully refactored.
router.get('/', asyncHandler(getUser));
router.get('/client-error', asyncHandler(getClientError));
router.get('/server-error', asyncHandler(getServerError));

module.exports = router;

