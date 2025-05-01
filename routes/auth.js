/**
 * Defines routes related to user authentication and public pages in the Academic Progression Monitoring system.
 * Handles:
 * - Login form display and submission
 * - Logout
 * - Public home and contact page access
 *
 * @file routes/auth.js
 * @module routes/auth
 */
// routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Home page
router.get("/", authController.showHome);

// Login page
router.get("/login", authController.showLogin);
router.post("/login", authController.handleLogin);

// Contact page
router.get("/contact", authController.showContact);

//Logout route
router.get("/logout", authController.handleLogout);

module.exports = router;
