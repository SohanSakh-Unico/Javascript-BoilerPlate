/**
 * A custom error class for handling API errors.
 * @extends Error
 */
class ApiError extends Error {
  /**
   * Creates an instance of ApiError.
   * @param {number} statusCode - The HTTP status code.
   * @param {string} message - The error message.
   */
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
