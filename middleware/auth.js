// middleware/auth.js

// Check if user is authenticated
function ensureAuth(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

// Ensure user is a student
function ensureStudent(req, res, next) {
  if (req.session.user && req.session.user.role === 'student') {
    return next();
  }
  res.redirect('/login'); // Redirect to login if not a student
}

// Ensure user is an admin
function ensureAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.redirect('/login'); // Redirect to login if not an admin
}

module.exports = { ensureAuth, ensureStudent, ensureAdmin };