// controllers/studentController.js
const studentModel = require('../models/studentModel');

exports.showDashboard = (req, res) => {
  console.log("Rendering student dashboard:", req.session.user);
  res.render('student/student-dashboard', { title: 'Student Dashboard', user: req.session.user });
};

// Show courses page with data
exports.showCourses = async (req, res) => {
  // try {
  //   console.log("Session data in showCourses:", req.session); // Debugging line
  //   if (!req.session.user) {
  //     return res.status(401).send("Unauthorized: Please log in.");
  //   }

  //   const userId = req.session.user.user_id; 
  //   if (!userId) {
  //     return res.status(401).send("Unauthorized: User ID not found.");
  //   }

  //   // Fetch student data from the model
  //   const studentData = await studentModel.getStudentData(userId);
  //   if (!studentData) {
  //     console.warn("No student found with user ID:", userId);
  //     return res.status(404).send("Student not found");
  //   }

  //   const student_id = studentData.student_id;
  //   console.log("Student ID:", student_id); // Debugging line

  //   // Fetch courses data from the model
  //   const courses = await studentModel.getCoursesByStudentId(student_id);
  //   if (courses.length === 0) {
  //     console.warn("No courses found for user:", student_id);
  //   }

    // Render the courses page with data
    //res.render('student/courses', { title: 'My Courses', user: req.session.user, courses });

  // } catch (err) {
  //   console.error("Error in showCourses controller:", err);
  //   return res.status(500).send("Internal Server Error");
  // }

  res.render('student/courses', { title: 'Courses', user: req.session.user, courses: [] });
};


exports.showProgress = (req, res) => {
  res.render('student/progress', { title: 'Progress', user: req.session.user });
};

exports.showNotifications = (req, res) => {
  res.render('student/notifications', { title: 'Notifications', user: req.session.user });
};

exports.showProfile = (req, res) => {
  res.render('student/profile', { title: 'Student Profile', user: req.session.user });
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