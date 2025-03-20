// routes/student.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { ensureAuth, ensureStudent } = require('../middleware/auth');

router.get('/dashboard', ensureAuth, ensureStudent, studentController.showDashboard);
router.get('/my-courses', ensureAuth, ensureStudent, studentController.showCourses);
router.get('/progress', ensureAuth, ensureStudent, studentController.showProgress);
router.get('/notifications', ensureAuth, ensureStudent, studentController.showNotifications);
router.get('/profile', ensureAuth, ensureStudent, studentController.showProfile);
router.post('/profile/update', ensureAuth, ensureStudent, studentController.updateProfile);
router.get('/submit/:moduleId', ensureAuth, ensureStudent, studentController.showSubmit);
router.post('/submit/:moduleId', ensureAuth, ensureStudent, studentController.handleSubmit);

module.exports = router;