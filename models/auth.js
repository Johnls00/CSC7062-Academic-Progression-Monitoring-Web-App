// middleware/auth.js
const { hashPassword, comparePassword } = require('../utils/auth');

/**
 * Registers a new user by hashing their password and saving the user data.
 * This has not been fully implemented and should be used by admin side if functionality is added later to create new users
 *
 * @route POST /api/register
 * @function
 * @memberof module:authModel
 * @param {Object} req - Express request object containing user details and plaintext password.
 * @param {Object} res - Express response object used to return the result.
 *
 * @returns {Object} JSON response indicating success or failure.
 *
 * @throws Will return a 500 response if registration or hashing fails.
 */
async function registerUser(req, res) {
    try {
        const hashedPassword = await hashPassword(req.body.password);
        // Save hashedPassword to database with user details
        res.json({ message: 'User registered successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed' });
    }
}

/**
 * Authenticates a user by verifying the email and password against stored credentials.
 *
 * @route POST /api/login
 * @function
 * @memberof module:authModel
 * @param {Object} req - Express request object containing email and plaintext password.
 * @param {Object} res - Express response object used to return the result.
 *
 * @returns {Object} JSON response indicating login success or failure.
 *
 * @throws Will return a 400 response if credentials are invalid, or a 500 response if the process fails.
 */
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const [rows] = await connection.query("SELECT * FROM user WHERE email = ?", [email]);

        if (rows.length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        const isMatch = await comparePassword(password, rows[0].password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        res.json({ message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
}

module.exports = { registerUser, loginUser };