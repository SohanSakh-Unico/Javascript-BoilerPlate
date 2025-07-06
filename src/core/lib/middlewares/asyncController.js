/**
 * A powerful async controller adapter that isolates business logic from the Express req/res objects.
 * It standardizes controller logic to either return data on success or throw an error on failure.
 * @param {Function} controller - The business logic controller function. It receives only the `req` object.
 * @returns {Function} An Express-compatible middleware function.
 */
const asyncController = (controller) => async (req, res, next) => {
  try {
    // Execute the business logic
    const result = await controller(req);

    // If the controller returns undefined, it did not handle the request.
    if (result === undefined) {
      return next();
    }

    // The controller handled the request. Set the flag.
    res.locals.isHandled = true;

    // The contract: An object is a response descriptor if it has a .data property.
    // if (typeof result === 'object' && result !== null && Object.prototype.hasOwnProperty.call(result, 'data')) {
    if (typeof result === 'object' && result !== null) {
      // It's a descriptor. Use its properties.
      res.locals.data = result.data || null; // Ensure data is at least null if not provided
      res.locals.statusCode = result.statusCode || 200; // Default to 200 OK if not specified
      res.locals.message = result.message;
    } else {
      // It's not a descriptor, so the entire result is the data payload.
      res.locals.data = result;
    }

    return next();
  } catch (error) {
    // If the controller throws an error, pass it to the global error handler
    return next(error);
  }
};

module.exports = asyncController;




