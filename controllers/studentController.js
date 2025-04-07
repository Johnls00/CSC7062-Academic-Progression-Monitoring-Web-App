// controllers/studentController.js
const studentModel = require("../models/studentModel");
const moduleModel = require("../models/moduleModel");

exports.showDashboard = async (req, res) => {
  try {
    // console.log("Rendering student dashboard:", req.session.user);
    const userId = req.session.user.user_id;
    // console.log("User ID:", userId); // Debugging line
    const studentData = await studentModel.getStudentData(userId);

    res.render("student/student-dashboard", {
      title: "Student Dashboard",
      user: req.session.user,
      studentData,
    });
  } catch (err) {
    console.error("Error in showDashboard controller:", err);
    return res.status(500).send("Internal Server Error");
  }
};

// Show courses page with data
exports.showModules = async (req, res) => {
  const userId = req.session.user.user_id;
  const studentData = await studentModel.getStudentData(userId);
  const modules = await studentModel.getModulesByStudentId(
    studentData[0].student_id
  );

  // console.log("Courses data:", courses); // Debugging line
  res.render("student/modules", {
    title: "Modules",
    user: req.session.user,
    studentData,
    modules,
  });
};

exports.showProgress = async (req, res) => {
  const userId = req.session.user.user_id;
  const studentData = await studentModel.getStudentData(userId);

  res.render("student/progress", {
    title: "Progress",
    user: req.session.user,
    studentData,
  });
};

exports.showNotifications = async (req, res) => {
  const userId = req.session.user.user_id;
  const studentData = await studentModel.getStudentData(userId);

  res.render("student/notifications", {
    title: "Notifications",
    user: req.session.user,
    studentData,
  });
};

exports.showProfile = async (req, res) => {
  const userId = req.session.user.user_id;
  const studentData = await studentModel.getStudentData(userId);

  res.render("student/profile", {
    title: "Student Profile",
    user: req.session.user,
    studentData,
  });
};

// exports.updateProfile = (req, res) => {
//   // Process the profile update logic here
//   res.redirect('student/profile', { title: 'Student Profile', user: req.session.user });
// };

// exports.showSubmit = (req, res) => {
//   const moduleId = req.params.moduleId;
//   res.render('student/submit', { title: 'Submit Assignment', user: req.user, moduleId });
// };

// exports.handleSubmit = (req, res) => {
//   // Process assignment submission logic here
//   res.redirect('/dashboard');
// };
