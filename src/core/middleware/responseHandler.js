/**
 * Middleware to add a custom success response method to the response object.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
const responseHandler = (req, res, next) => {
  /**
   * Sends a standardized success response.
   * @param {any} data - The payload to send in the response.
   * @param {string} message - A descriptive message.
   * @param {number} statusCode - The HTTP status code.
   */
  res.sendSuccess = (data, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  };

  next();
};

module.exports = responseHandler;
