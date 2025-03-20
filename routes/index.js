// routes/index.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('public/index', { title: 'Home' });
});

// Import all route files
const authRoutes = require('./auth');
const studentRoutes = require('./student');
const adminRoutes = require('./admin');

// Use the routes - note that each file handles its own endpoints
router.use('/', authRoutes);
router.use('/', studentRoutes);
router.use('/', adminRoutes);

// 404 Error Handler (any unmatched routes)
router.use((req, res) => {
  res.status(404).render('error/404', { title: 'Page Not Found' });
});

module.exports = router;