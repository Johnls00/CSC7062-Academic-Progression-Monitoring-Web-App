const { hashPassword, comparePassword } = require('../utils/auth');

async function registerUser(req, res) {
    try {
        const hashedPassword = await hashPassword(req.body.password);
        // Save hashedPassword to database with user details
        res.json({ message: 'User registered successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed' });
    }
}

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