// routes/student.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
// const studentModel = require('../models/studentModel');
const { ensureAuth, ensureStudent } = require('../middleware/auth');

// student page routes 
router.get('/student-dashboard', ensureAuth, ensureStudent, studentController.showDashboard);
router.get('/student-dashboard/modules', ensureAuth, ensureStudent, studentController.showModules);
router.get('/student-dashboard/progress', ensureAuth, ensureStudent, studentController.showProgress);
router.get('/student-dashboard/messaging-hub', ensureAuth, ensureStudent, studentController.showMessagingHub);
router.get('/student-dashboard/profile', ensureAuth, ensureStudent, studentController.showProfile);
router.post('/profile/update/:id', ensureAuth, ensureStudent, studentController.updateProfile);

module.exports = router;