/**
 * A utility function to wrap asynchronous route handlers.
 * It catches errors and attaches the controller's return value to res.locals.
 * @param {Function} fn - The asynchronous controller function to execute.
 * @returns {Function} A new function that handles promise rejections and data passing.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .then(data => {
      res.locals.data = data;
      next();
    })
    .catch(next);
};

module.exports = asyncHandler;
