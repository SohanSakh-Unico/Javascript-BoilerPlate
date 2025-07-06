const httpStatusCodes = require('../constants/httpStatusCodes');

/**
 * A pre-computed, flat map of HTTP status codes for efficient O(1) lookups.
 * The structure is: { 200: { code: 200, message: 'OK', ... }, 404: { ... } }
 */
const httpStatusMap = {};

for (const category in httpStatusCodes) {
  for (const status in httpStatusCodes[category]) {
    const statusCodeData = httpStatusCodes[category][status];
    httpStatusMap[statusCodeData.code] = statusCodeData;
  }
}

module.exports = httpStatusMap;
