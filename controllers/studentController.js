// controllers/studentController.js
// required models 
const studentModel = require("../models/studentModel");
const moduleModel = require("../models/moduleModel");
const studentRecordModel = require("../models/studentRecordModel");
const connection = require("../config/config");
// scripts 
const { determineProgression } = require("../utils/progression-logic");

exports.showDashboard = async (req, res) => {
  try {
    // console.log("Rendering student dashboard:", req.session.user);
    const userId = req.session.user.user_id;
    // console.log("User ID:", userId); // Debugging line
    const studentData = await studentModel.getStudentData(userId);

    res.render("student/student-dashboard", {
      title: "Student Dashboard",
      user: req.session.user,
      studentData: studentData[0]
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
    studentData: studentData[0],
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
  try {
    const userId = req.session.user.user_id;
    const [studentData] = await studentModel.getStudentData(userId);
    console.log("student data ",studentData);
    // const student = await studentModel.getStudentBySId(studentData.student_id);
    // console.log("student", student);
    const user_data = await studentModel.getStudentUserData(studentData.user_id);
    console.log("USER DATA", user_data);
    const module_data = await studentModel.getModulesByStudentId(
      studentData.student_id
    );

    // attach the student program details
    const studentWithProgramDetails = await studentModel.attachProgramDetails(
      [studentData] 
    );

    if (!studentWithProgramDetails) {
      return res.status(404).send("Student not found");
    }

    const studentRecord = await studentRecordModel.getStudentRecord(
      studentWithProgramDetails
    );
    console.log("student record", studentRecord);
    const studentProgression = await determineProgression(studentRecord);
    console.log(module_data);

    res.render("student/profile", {
      title: "Student Profile",
      user: req.session.user,
      studentData: studentWithProgramDetails[0],
      user_data: user_data[0],
      module_data,
      studentRecord: studentRecord,
      studentProgression: studentProgression,
    });
  } catch (err) {
    console.error("Error fetching student:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.updateProfile = async (req, res) => {
  const student_id = req.params.id;
  const [userResult] = await connection.query(
    "SELECT user_id FROM student WHERE student_id = ?",
    [student_id]
  );

  if (!userResult || userResult.length === 0) {
    return res.status(404).send("Student not found");
  }
  const userId = userResult[0].user_id;

  const {
    secondary_email,
  } = req.body;

  try {
    
    await connection.query(
      `
        UPDATE user 
        SET secondary_email = ? 
        WHERE user_id = ?`,
      [ secondary_email, userId]
    );

    res.redirect(`/student-dashboard/profile`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to update student.");
  }
};

