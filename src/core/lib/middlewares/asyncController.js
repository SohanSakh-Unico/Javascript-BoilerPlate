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

    let data = null;
    let statusCode = null;
    let message = null;
    // The contract: An object is a response descriptor if it has a .data property.
    // if (typeof result === 'object' && result !== null && Object.prototype.hasOwnProperty.call(result, 'data')) {
    const isDescriptorObject =
      typeof result === 'object' &&
      result !== null &&
      !Array.isArray(result) &&
      ('data' in result || 'statusCode' in result || 'message' in result);

    if (isDescriptorObject) {
      data = 'data' in result ? result.data : null;
      statusCode = result.statusCode || null;
      message = result.message || null;
    } else {
      data = result;
    }
    res.locals.data = data;
    res.locals.statusCode = statusCode;
    res.locals.message = message;

    return next();
  } catch (error) {
    // If the controller throws an error, pass it to the global error handler
    return next(error);
  }
};

module.exports = asyncController;




