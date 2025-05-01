// routes/admin.js
/**
 * Route definitions for admin-related operations in the Academic Progression Monitoring system.
 * Protects all routes using authentication and role-based authorization middleware.
 * Handles:
 * - Admin dashboard access
 * - Student, degree, and module CRUD operations
 * - Academic reports and progression management
 * - Messaging and notification administration
 * - Mass upload functionality for student records
 *
 * @file routes/admin.js
 * @module routes/admin
 */

const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { ensureAuth, ensureAdmin } = require("../middleware/auth");

// Admin Dashboard
router.get(
  "/admin/admin-dashboard",
  ensureAuth,
  ensureAdmin,
  adminController.showDashboard
);

// Manage Students
router.get(
  "/admin/students",
  ensureAuth,
  ensureAdmin,
  adminController.showStudents
);
router.get(
  "/admin/student/:id",
  ensureAuth,
  ensureAdmin,
  adminController.viewStudent
);
router.post(
  "/admin/student/add",
  ensureAuth,
  ensureAdmin,
  adminController.addStudent
);
router.post(
  "/admin/update-student/:id",
  ensureAuth,
  ensureAdmin,
  adminController.updateStudent
);
router.delete(
  "/admin/student/delete/:id",
  ensureAuth,
  ensureAdmin,
  adminController.deleteStudent
);
router.post(
  "/admin/student/add-student-module/:id",
  ensureAuth,
  ensureAdmin,
  adminController.addStudentModule
);
router.post(
  "/admin/student/update-student-modules/:id",
  ensureAuth,
  ensureAdmin,
  adminController.updateStudentModules
);
router.delete(
  "/admin/student/delete-student-module/:userModuleId",
  ensureAuth,
  ensureAdmin,
  adminController.deleteStudentModule
);

// Manage degrees
router.get(
  "/admin/degree-programs",
  ensureAuth,
  ensureAdmin,
  adminController.showDegreePrograms
);
router.post(
  "/admin/degree-programs/new-degree",
  ensureAuth,
  ensureAdmin,
  adminController.addProgram
);
router.delete(
  "/admin/degree-programs/delete-degree/:id",
  ensureAuth,
  ensureAdmin,
  adminController.deleteProgram
);
router.get(
  "/admin/degree-details/:id",
  ensureAuth,
  ensureAdmin,
  adminController.showDegreeDetails
);
router.post(
  "/admin/degree-details/add-degree-module/:id",
  ensureAuth,
  ensureAdmin,
  adminController.addProgramModule
);
router.delete(
  "/admin/degree-details/delete-degree-module/:id",
  ensureAuth,
  ensureAdmin,
  adminController.deleteProgramModule
);

// Manage Modules
router.get(
  "/admin/modules",
  ensureAuth,
  ensureAdmin,
  adminController.showModules
);
router.post(
  "/admin/modules/add-module",
  ensureAuth,
  ensureAdmin,
  adminController.addModule
);
router.delete(
  "/admin/modules/delete-module/:id",
  ensureAuth,
  ensureAdmin,
  adminController.deleteModule
);

// Reports
router.get(
  "/admin/reports",
  ensureAuth,
  ensureAdmin,
  adminController.generateReports
);

// Notification Management
router.get(
  "/admin/messaging",
  ensureAuth,
  ensureAdmin,
  adminController.showMessagingHub
);

// Mass uploading records
router.get(
  "/admin/mass-upload",
  ensureAuth,
  ensureAdmin,
  adminController.showMassUpload
);

module.exports = router;
