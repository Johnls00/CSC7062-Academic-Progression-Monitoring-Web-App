// routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { ensureAuth, ensureAdmin } = require('../middleware/auth');

// Admin Dashboard
router.get('/admin/admin-dashboard', ensureAuth, ensureAdmin, adminController.showDashboard);

// Manage Students
// router.get('/admin/students', ensureAuth, ensureAdmin, adminController.listStudents);
// router.get('/admin/student/:id', ensureAuth, ensureAdmin, adminController.viewStudent);
// router.post('/admin/student/add', ensureAuth, ensureAdmin, adminController.addStudent);
// router.post('/admin/student/update/:id', ensureAuth, ensureAdmin, adminController.updateStudent);
// router.post('/admin/student/delete/:id', ensureAuth, ensureAdmin, adminController.deleteStudent);

// Manage Courses
// router.get('/admin/courses', ensureAuth, ensureAdmin, adminController.listCourses);
// router.post('/admin/course/add', ensureAuth, ensureAdmin, adminController.addCourse);
// router.post('/admin/course/update/:id', ensureAuth, ensureAdmin, adminController.updateCourse);
// router.post('/admin/course/delete/:id', ensureAuth, ensureAdmin, adminController.deleteCourse);

// Reports
// router.get('/admin/reports', ensureAuth, ensureAdmin, adminController.generateReports);

// Notification Management
// router.get('/admin/notifications', ensureAuth, ensureAdmin, adminController.showNotifications);
// router.post('/admin/notifications/send', ensureAuth, ensureAdmin, adminController.sendNotification);

module.exports = router;