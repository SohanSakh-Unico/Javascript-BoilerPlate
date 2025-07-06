const express = require('express');
const router = express.Router();
const httpStatusCodes = require('../../../../core/lib/constants/httpStatusCodes');

// --- "Dumb" Controllers ---

const getUser = async (req) => {
  return { id: 1, name: 'John Doe' };
};

const createUser = async (req) => {
  return {
    data: { id: 2, ...req.body },
    statusCode: httpStatusCodes.SUCCESS.CREATED.code,
    message: 'User created successfully'
  };
};

const getNullDataWithCustomMessage = async (req) => {
  // The contract: .data key exists, so this is a descriptor.
  return {
    data: null,
    message: 'No user data is available, but the request was successful.'
  };
};

const getMessageOnly = async (req) => {
  // The contract: .data key does NOT exist, so this is the data payload.
  return {
    message: 'This is a message object, not a response descriptor.'
  };
};

const getClientError = async (req) => {
  const error = new Error('This is a simulated bad request.');
  error.statusCode = httpStatusCodes.CLIENT_ERROR.BAD_REQUEST.code;
  throw error;
};

const getServerError = async (req) => {
  return someUndefinedVariable + 10;
};


// --- Routes ---
router.get('/', getUser);
router.post('/', createUser);
router.get('/null-data', getNullDataWithCustomMessage);
router.get('/message-only', getMessageOnly);
router.get('/client-error', getClientError);
router.get('/server-error', getServerError);

module.exports = router;





