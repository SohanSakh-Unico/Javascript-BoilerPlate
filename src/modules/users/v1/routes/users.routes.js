const express = require('express');
const router = express.Router();
const ApiError = require('../../../../core/ApiError');

router.get('/', (req, res) => {
  res.sendSuccess({ user: 'John Doe' }, 'User found successfully');
});

router.get('/error', (req, res, next) => {
  try {
    // Simulate an error
    throw new ApiError(400, 'This is a simulated bad request.');
  } catch (error) {
    next(error);
  }
});

module.exports = router;

