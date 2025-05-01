/**
 * Utility functions for securely handling user authentication tasks.
 * Provides:
 * - Hashing a plain-text password using bcrypt with a generated salt
 * - Comparing a plain-text password against a hashed password for logging in
 *
 * @file utils/auth.js
 * @module utils/auth
 */
const bcrypt = require("bcryptjs");

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

module.exports = { hashPassword, comparePassword };
