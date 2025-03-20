// middleware/auth.js

// Check if user is authenticated
function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Ensure user is a student
function ensureStudent(req, res, next) {
  if (req.user && req.user.role === 'student') {
    return next();
  }
  res.redirect('/dashboard'); // or a suitable route
}

// Ensure user is an admin
function ensureAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.redirect('/admin'); // or a suitable route
}

module.exports = { ensureAuth, ensureStudent, ensureAdmin };