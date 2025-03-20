const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Home page
router.get('/', authController.showHome);

// Login page
router.get('/login', authController.showLogin);
router.post('/login', authController.handleLogin);

// Register page
//router.get('/register', authController.showRegister);
//router.post('/register', authController.handleRegister);

// Contact page
router.get('/contact', authController.showContact);

// Logout route
//router.get('/logout', authController.handleLogout);

//might not need 
// const studentRoutes = require('./student');
// const adminRoutes = require('./admin');

// router.use('/', studentRoutes);
// router.use('/', adminRoutes);

module.exports = router;