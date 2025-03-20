// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Home/Landing page
router.get('/', authController.showHome);

// Login page (GET displays the form, POST processes login)
router.get('/login', authController.showLogin);
router.post('/login', authController.handleLogin);

// Register page (if registration is allowed; similar split as login)
router.get('/register', authController.showRegister);
router.post('/register', authController.handleRegister);

// Logout route (clears session and redirects to home/login)
router.get('/logout', authController.handleLogout);

router.get('/contact', authController.showContact);

module.exports = router;