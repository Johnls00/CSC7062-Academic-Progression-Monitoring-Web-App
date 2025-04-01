// controllers/studentController.js
const studentModel = require("../models/studentModel");
const moduleModel = require("../models/moduleModel");

exports.showDashboard = async (req, res) => {
  try {
    // console.log("Rendering student dashboard:", req.session.user);
    const userId = req.session.user.user_id;
    // console.log("User ID:", userId); // Debugging line
    const studentData = await studentModel.getStudentData(userId);

    // console.log("Student data:", studentData); // Debugging line
    const student_id = studentData[0].student_id; // Debugging line
    // console.log("Student ID:", student_id); // Debugging line

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
exports.showCourses = async (req, res) => {
  const userId = req.session.user.user_id;
  const studentData = await studentModel.getStudentData(userId);
  const courses = await studentModel.getCoursesByStudentId(
    studentData[0].student_id
  );

  for (let i = 0; i < courses.length; i++) {
    const moduleId = courses[i].module_id;
    const module_Info = await moduleModel.getModuleInfo(moduleId);
    // console.log(`Module Info for module_id ${moduleId}:`, module_Info);

    if (module_Info && module_Info.length > 0) {
      courses[i].subject_code = module_Info[0].subject_code;
      courses[i].module_title = module_Info[0].module_title;
    } else {
      courses[i].subject_code = "Unknown";
      courses[i].module_title = "Unknown";
    }
  }

  // const moduleInfo = await moduleModel.getModuleInfo(courses[0].module_id);

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

  // console.log("Courses data:", courses); // Debugging line
  res.render("student/courses", {
    title: "Courses",
    user: req.session.user,
    studentData,
    courses,
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
