// routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { ensureAuth, ensureAdmin } = require('../middleware/auth');
const connection = require('../config/config');

// Admin Dashboard
router.get('/admin/admin-dashboard', ensureAuth, ensureAdmin, adminController.showDashboard);

// Manage Students
router.get('/admin/students', ensureAuth, ensureAdmin, adminController.showStudents);
router.get('/admin/student/:id', ensureAuth, ensureAdmin, adminController.viewStudent);
router.post('/admin/student/add', ensureAuth, ensureAdmin, adminController.addStudent);
router.post('/update-student/:id', async (req, res) => {
    const studentId = req.params.id;
    const [userResult] = await connection.query(
      'SELECT user_id FROM student WHERE sId = ?',
      [studentId]
    );
    if (!userResult || userResult.length === 0) {
      return res.status(404).send("Student not found");
    }
    const userId = userResult[0].user_id;
    const { first_name, last_name, sId, email, secondary_email, status_study, entry_level } = req.body;
  
    try {
      await connection.query(`
        UPDATE student 
        SET first_name = ?, last_name = ?, sId = ?, status_study = ?, entry_level = ? 
        WHERE sId = ?`, 
        [first_name, last_name, sId, status_study, entry_level, studentId]);
  
      await connection.query(`
        UPDATE user 
        SET email = ?, secondary_email = ? 
        WHERE user_id = ?`, 
        [email, secondary_email, userId]);
  
      res.redirect(`/admin/student/${sId}`);
    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to update student.");
    }
  });
// router.post('/admin/student/delete/:id', ensureAuth, ensureAdmin, adminController.deleteStudent);

// Manage degrees 
router.get('/admin/degree-programs', ensureAuth, ensureAdmin, adminController.showDegreePrograms);
router.get('/admin/degree-details/:id', ensureAuth, ensureAdmin, adminController.showDegreeDetails);
// Manage Modules
router.get('/admin/modules', ensureAuth, ensureAdmin, adminController.showModules);
// router.post('/admin/course/add', ensureAuth, ensureAdmin, adminController.addCourse);
// router.post('/admin/course/update/:id', ensureAuth, ensureAdmin, adminController.updateCourse);
// router.post('/admin/course/delete/:id', ensureAuth, ensureAdmin, adminController.deleteCourse);

// Reports
router.get('/admin/reports', ensureAuth, ensureAdmin, adminController.generateReports);

// Notification Management
router.get('/admin/messaging', ensureAuth, ensureAdmin, adminController.showMessagingHub);

// Mass uploading records 
router.get('/admin/mass-upload', ensureAuth, ensureAdmin, adminController.showMassUpload);

module.exports = router;