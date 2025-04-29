// routes/index.js
const express = require('express');
const router = express.Router();

// Import all route files
const authRoutes = require('./auth');
const studentRoutes = require('./student');
const adminRoutes = require('./admin');

// Use the routes 
router.use('/', authRoutes);
router.use('/', studentRoutes);
router.use('/', adminRoutes);

// Redirect root to login page
router.get('/', (req, res) => {
  res.redirect('/auth/login');
});

// 404 Error Handler (any unmatched routes)
router.use((req, res) => {
  res.status(404).render('error/404', { title: 'Page Not Found' });
});

module.exports = router;