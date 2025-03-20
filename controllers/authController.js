// controllers/authController.js

exports.showHome = (req, res) => {
    res.render('public/index', { title: 'Home' });
  };
  
  exports.showLogin = (req, res) => {
    res.render('public/login', { title: 'Login' });
  };
  
  exports.handleLogin = (req, res) => {
    // Add authentication logic here.
    
    res.redirect('/dashboard');
  };
  
  exports.showRegister = (req, res) => {
    res.render('public/register', { title: 'Register' });
  };
  
  exports.handleRegister = (req, res) => {
    // Add registration logic here 
    res.redirect('/login');
  };
  
  exports.handleLogout = (req, res) => {
    // Add logout logic 
    res.redirect('/login');
  };