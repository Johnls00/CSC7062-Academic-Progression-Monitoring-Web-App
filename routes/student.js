/**
 * Routes for student-facing features in the Academic Progression Monitoring system.
 * All routes are protected by authentication and student role checks.
 * Handles:
 * - Student dashboard, modules, progression, and profile views
 * - Messaging hub access
 * - Profile update functionality
 *
 * @file routes/student.js
 * @module routes/student
 */
// routes/student.js
const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { ensureAuth, ensureStudent } = require("../middleware/auth");

// student page routes
router.get(
  "/student-dashboard",
  ensureAuth,
  ensureStudent,
  studentController.showDashboard
);
router.get(
  "/student-dashboard/modules",
  ensureAuth,
  ensureStudent,
  studentController.showModules
);
router.get(
  "/student-dashboard/progress",
  ensureAuth,
  ensureStudent,
  studentController.showProgress
);
router.get(
  "/student-dashboard/messaging-hub",
  ensureAuth,
  ensureStudent,
  studentController.showMessagingHub
);
router.get(
  "/student-dashboard/profile",
  ensureAuth,
  ensureStudent,
  studentController.showProfile
);
router.post(
  "/profile/update/:id",
  ensureAuth,
  ensureStudent,
  studentController.updateProfile
);

module.exports = router;
