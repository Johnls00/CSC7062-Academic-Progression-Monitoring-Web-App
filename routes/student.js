// routes/student.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const studentModel = require('../models/studentModel');
const { ensureAuth, ensureStudent } = require('../middleware/auth');

router.get('/student-dashboard', ensureAuth, ensureStudent, studentController.showDashboard);
router.get('/student-dashboard/courses', ensureAuth, ensureStudent, studentController.showCourses);
router.get('/student-dashboard/progress', ensureAuth, ensureStudent, studentController.showProgress);
router.get('/student-dashboard/notifications', ensureAuth, ensureStudent, studentController.showNotifications);

router.get('/student-dashboard/profile', ensureAuth, ensureStudent, studentController.showProfile);
// router.post('/profile/update', ensureAuth, ensureStudent, studentController.updateProfile);
// router.get('/submit/:moduleId', ensureAuth, ensureStudent, studentController.showSubmit);
// router.post('/submit/:moduleId', ensureAuth, ensureStudent, studentController.handleSubmit);

module.exports = router; 