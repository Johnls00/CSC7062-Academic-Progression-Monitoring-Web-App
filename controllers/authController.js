const bcrypt = require('bcryptjs');
const connection = require('../config/config'); // Ensure this path is correct


// Home page
exports.showHome = (req, res) => {
    res.render('public/index', { title: 'Home' });
};

// Contact page
exports.showContact = (req, res) => {
    console.log("Routing to contact"); // Debugging line
    res.render('public/contact', { title: 'Contact Us' });
};

// Login page (GET)
exports.showLogin = (req, res) => {
    res.render('public/login', { title: 'Login' });
};

// Handle login (POST)
exports.handleLogin = async (req, res) => {
  try {
      console.log("Request body:", req.body);  // Debugging line
      const { email, password } = req.body;

      if (!email || !password) {
          return res.status(400).render('public/login', { title: 'Login', error: 'Email and password are required.' });
      }

      // Fetch user from the database
      const [rows] = await connection.query("SELECT * FROM `user` WHERE `email` = ?", [email]);

      if (rows.length === 0) {
          return res.status(400).render('public/login', { title: 'Login', error: 'User not found' });
      }

      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
          return res.status(400).render('public/login', { title: 'Login', error: 'Invalid password' });
      }

      // Set session and redirect based on role
      req.session.user = {id: user.user_id, email: user.email, role: user.role};
      console.log("Session user before redirect:", req.session.user); // Debugging line
      if (user.role === 'admin') {
          return res.redirect('/admin/admin-dashboard');
      } else if (user.role === 'student') {
          console.log("Redirecting to student dashboard"); // Debugging line
          return res.redirect('/student-dashboard');
      }

      // If no role matches
      res.status(400).render('public/login', { title: 'Login', error: 'User role not recognized' });

  } catch (err) {
      console.error('Login error:', err);
      res.status(500).render('public/login', { title: 'Login', error: 'Login failed due to server error' });
  }
};

// Register page (GET)
exports.showRegister = (req, res) => {
    res.render('public/register', { title: 'Register' });
};

// Handle registration (POST)
exports.handleRegister = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).render('public/register', { title: 'Register', error: 'Email and password are required.' });
    }

    try {
        // Check if the user already exists
        const [existingUser] = await connection.query("SELECT * FROM `user` WHERE `email` = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).render('public/register', { title: 'Register', error: 'Email is already registered.' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user into the database
        await connection.query("INSERT INTO `user` (`email`, `password`) VALUES (?, ?)", [email, hashedPassword]);

        res.redirect('/login');
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).render('public/register', { title: 'Register', error: 'Registration failed due to server error' });
    }
};

// Logout route
exports.handleLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).render('public/login', { title: 'Login', error: 'Logout failed' });
        }
        res.redirect('/login');
    });
};