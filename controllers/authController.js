// controllers/authController.js

exports.showHome = (req, res) => {
    res.render('/index', { title: 'Home' });
  };
  
  exports.showLogin = (req, res) => {
    res.render('public/login', { title: 'Login' });
  };
  
  exports.handleLogin = (req, res) => {
    // Add your authentication logic here.
    // For example: verify credentials, set req.user, etc.
    res.redirect('/dashboard');
  };
  
  exports.showRegister = (req, res) => {
    res.render('public/register', { title: 'Register' });
  };
  
  exports.handleRegister = (req, res) => {
    // Add registration logic here (e.g., create new user record)
    res.redirect('/login');
  };
  
  exports.handleLogout = (req, res) => {
    // Add logout logic (e.g., destroy session)
    res.redirect('/login');
  };