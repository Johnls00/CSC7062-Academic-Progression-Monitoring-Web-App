const bcrypt = require("bcryptjs");
const connection = require("../config/config"); // Ensure this path is correct

// Home page
exports.showHome = (req, res) => {
  res.render("public/login", { title: "Login" });
};

// Contact page
exports.showContact = (req, res) => {
  console.log("Routing to contact"); // Debugging line
  res.render("public/contact", { title: "Contact Us" });
};

// Login page (GET)
exports.showLogin = (req, res) => {
  res.render("public/login", { title: "Login" });
};

// Handle login (POST)
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
    console.log("Session user before redirect:", req.session); // Debugging line

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
      console.log("Session saved successfully:", req.session); // Debugging line
      // Redirect based on user role

      if (user.role === "admin") {
        return res.redirect("/admin/admin-dashboard");
      } else if (user.role === "student") {
        console.log("Redirecting to student dashboard"); // Debugging line
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


// Logout route
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
