// required 
const bcrypt = require("bcryptjs");
const connection = require("../config/config");

/**
 * Renders the login page as the home route.
 *
 * @route GET /
 * @function
 * @memberof module:authController
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 *
 * @returns {void} Renders the 'public/login' view.
 */
exports.showHome = (req, res) => {
  res.render("public/login", { title: "Login" });
};

/**
 * Renders the contact us page.
 *
 * @route GET /contact
 * @function
 * @memberof module:authController
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 *
 * @returns {void} Renders the 'public/contact' view.
 */
exports.showContact = (req, res) => {
  res.render("public/contact", { title: "Contact Us" });
};

/**
 * Renders the login form.
 *
 * @route GET /login
 * @function
 * @memberof module:authController
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 *
 * @returns {void} Renders the 'public/login' view.
 */
exports.showLogin = (req, res) => {
  res.render("public/login", { title: "Login" });
};

/**
 * Handles login form submission, verifies credentials and sets session.
 *
 * @route POST /login
 * @function
 * @memberof module:authController
 * @param {Object} req - Express request object containing email and password.
 * @param {Object} res - Express response object.
 *
 * @returns {void} Redirects to user dashboard based on role, or renders error.
 *
 * @throws Will render login page with error on failure to authenticate or save session.
 */
exports.handleLogin = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Debugging line
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .render("public/login", {
          title: "Login",
          error: "Email and password are required.",
        });
    }
    const query = "SELECT * FROM `user` WHERE `email` = ?";
    // Fetch user from the database
    const [rows] = await connection.query(query, [email]);

    if (rows.length === 0) {
      return res
        .status(400)
        .render("public/login", { title: "Login", error: "User not found" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .render("public/login", { title: "Login", error: "Invalid password" });
    }

    // Set session and redirect based on role
    req.session.user = {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
    };

    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res
          .status(500)
          .render("public/login", {
            title: "Login",
            error: "Session save failed",
          });
      }
      // Redirect based on user role

      if (user.role === "admin") {
        return res.redirect("/admin/admin-dashboard");
      } else if (user.role === "student") {
        return res.redirect("/student-dashboard");
      }

      // If no role matches
      res
        .status(400)
        .render("public/login", {
          title: "Login",
          error: "User role not recognized",
        });
    });
  } catch (err) {
    console.error("Login error:", err);
    res
      .status(500)
      .render("public/login", {
        title: "Login",
        error: "Login failed due to server error",
      });
  }
};

/**
 * Logs out the user and destroys the session.
 *
 * @route GET /logout
 * @function
 * @memberof module:authController
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 *
 * @returns {void} Redirects to login page on success.
 *
 * @throws Will render login view with error message if session destruction fails.
 */
exports.handleLogout = (req, res) => {
  console.log("Logging out user:", req.session.user); // Debugging line
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res
        .status(500)
        .render("public/login", { title: "Login", error: "Logout failed" });
    }
    console.log("Session destroyed", req.session); // Debugging line
    res.redirect("/login");
  });
};
