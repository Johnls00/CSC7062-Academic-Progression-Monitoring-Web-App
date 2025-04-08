// controllers/adminController.js
const studentModel = require("../models/studentModel");
const programModels = require("../models/programModels");

exports.showDashboard = async (req, res) => {
  try {
    // console.log("Rendering admin dashboard:", req.session.user);
    const userId = req.session.user.user_id;
    // console.log("User ID:", userId); // Debugging line

    res.render("admin/admin-dashboard", {
      title: "Admin Dashboard",
      user: req.session.user,
    });
  } catch (err) {
    console.error("Error in showDashboard controller:", err);
    return res.status(500).send("Internal Server Error");
  }
};

exports.showStudents = async (req, res) => {
  try {
    const students = await studentModel.getAllStudents();

    for (let i = 0; i < students.length; i++) {
      const program_code = students[i].sId.substring(3, 7);
      try {
        const program_details = await programModels.getProgramInfo(
          program_code
        );
        // console.log("Program details:", program_details); // Debugging line
        if (program_details && program_details.length > 0) {
          students[i].program_code = program_details[0].program_code;
          students[i].program_name = program_details[0].name;
        } else {
          students[i].program_code = "Unknown";
          students[i].program_name = "Unknown";
        }
      } catch (err) {
        console.warn(
          "Failed to fetch program info for:",
          program_code,
          err.message
        );
        students[i].program_code = "Unknown";
        students[i].program_name = "Unknown";
      }
    }
    res.render("admin/students", {
      title: "Manage Students",
      user: req.session.user,
      students,
    });
  } catch (err) {
    console.error("Error in listStudents controller:", err);
    return res.status(500).send("Internal Server Error");
  }
};

exports.viewStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await studentModel.getStudentBySId(studentId);
    const user_data = await studentModel.getStudentUserData(student[0].user_id);
    const module_data = await studentModel.getModulesByStudentId(
      student[0].student_id
    );

    const program_code = student[0].sId.substring(3, 7);

    try {
      const program_details = await programModels.getProgramInfo(program_code);

      if (program_details && program_details.length > 0) {
        student[0].program_code = program_details[0].program_code;
        student[0].program_name = program_details[0].name;
      } else {
        student[0].program_code = "Unknown";
        student[0].program_name = "Unknown";
      }
    } catch (err) {
      console.warn(
        "Failed to fetch program info for:",
        program_code,
        err.message
      );
      student[0].program_code = "Unknown";
      student[0].program_name = "Unknown";
    }

    console.log(student);

    if (!student) {
      return res.status(404).send("Student not found");
    }

    res.render("admin/student-details", {
      title: "Student Details",
      user: req.session.user,
      student: student[0],
      user_data: user_data[0],
      module_data,
    });
  } catch (err) {
    console.error("Error fetching student:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.showDegreePrograms = async (req, res) => {
  try {

    const degrees = await programModels.getAllPrograms();

    res.render("admin/degree-programs", {
      title: "Degree Programs",
      user: req.session.user,
      degrees: degrees,
    })
  } catch (err) {
    console.error("Error fetching student:", err);
    res.status(500).send("Internal Server Error");
  }
};

// exports.addStudent = (req, res) => {
//   // Logic to add a new student
//   res.redirect('/admin/students');
// };

// exports.updateStudent = (req, res) => {
//   // Logic to update a student
//   res.redirect('/admin/students');
// };

// exports.deleteStudent = (req, res) => {
//   // Logic to delete a student
//   res.redirect('/admin/students');
// };

// exports.listCourses = (req, res) => {
//   const courses = []; // Replace with actual courses data
//   res.render('admin/courses', { title: 'Manage Courses', user: req.user, courses });
// };

// exports.addCourse = (req, res) => {
//   // Logic to add a new course
//   res.redirect('/admin/courses');
// };

// exports.updateCourse = (req, res) => {
//   // Logic to update a course
//   res.redirect('/admin/courses');
// };

// exports.deleteCourse = (req, res) => {
//   // Logic to delete a course
//   res.redirect('/admin/courses');
// };

exports.generateReports = (req, res) => {
  res.render("admin/reports", { title: "Reports", user: req.user });
};

exports.showNotifications = (req, res) => {
  res.render("admin/notifications", {
    title: "Manage Notifications",
    user: req.user,
  });
};

// exports.sendNotification = (req, res) => {
//   // Logic to send notifications
//   res.redirect('/admin/notifications');
// };
