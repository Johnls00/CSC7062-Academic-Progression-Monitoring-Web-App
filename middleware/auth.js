// middleware/auth.js

/**
 * Middleware to ensure the user is authenticated.
 * If authenticated, proceeds to next handler; otherwise redirects back to login.
 *
 * @function
 * @memberof module:authMiddleware
 * @param {Object} req - Express request object with session.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to pass control to the next middleware.
 *
 * @returns {void}
 */
function ensureAuth(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

/**
 * Middleware to ensure the user is authenticated and has a 'student' role.
 * Proceeds to next middleware if the role matches; otherwise redirects to login.
 *
 * @function
 * @memberof module:authMiddleware
 * @param {Object} req - Express request object with session and user role.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to pass control to the next middleware.
 *
 * @returns {void}
 */
function ensureStudent(req, res, next) {
  if (req.session.user && req.session.user.role === 'student') {
    return next();
  }
  res.redirect('/login'); // Redirect to login if not a student
}

/**
 * Middleware to ensure the user is authenticated and has an 'admin' role.
 * Proceeds to next middleware if the role matches; otherwise redirects to login.
 *
 * @function
 * @memberof module:authMiddleware
 * @param {Object} req - Express request object with session and user role.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to pass control to the next middleware.
 *
 * @returns {void}
 */
function ensureAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.redirect('/login'); // Redirect to login if not an admin
}

module.exports = { ensureAuth, ensureStudent, ensureAdmin };