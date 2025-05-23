// controllers/studentController.js
// required models 
const studentModel = require("../models/studentModel");
const moduleModel = require("../models/moduleModel");
const studentRecordModel = require("../models/studentRecordModel");
const messageModel = require("../models/messageModel");
const notificationModel = require("../models/notificationModel");
const connection = require("../config/config");
// scripts 
const { determineProgression } = require("../utils/progression-logic");

/**
 * Renders the student dashboard view with student data.
 *
 * @route GET /student-dashboard
 * @function
 * @memberof module:studentController
 * @param {Object} req - Express request object containing session data.
 * @param {Object} res - Express response object used to render the dashboard.
 *
 * @returns {void} Renders 'student/student-dashboard' view.
 *
 * @throws Will send a 500 response if data retrieval fails.
 */
exports.showDashboard = async (req, res) => {
  try {
    const userId = req.session.user.user_id;
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

/**
 * Renders the student modules view with the modules enrolled by the student.
 *
 * @route GET /student-dashboard/modules
 * @function
 * @memberof module:studentController
 * @param {Object} req - Express request object containing session data.
 * @param {Object} res - Express response object used to render the modules.
 *
 * @returns {void} Renders 'student/modules' view.
 */
exports.showModules = async (req, res) => {
  const userId = req.session.user.user_id;
  const studentData = await studentModel.getStudentData(userId);
  const modules = await studentModel.getModulesByStudentId(
    studentData[0].student_id
  );

  res.render("student/modules", {
    title: "Modules",
    user: req.session.user,
    studentData: studentData[0],
    modules,
  });
};

/**
 * Renders the student progress view with student data.
 *
 * @route GET /student-dashboard/progress
 * @function
 * @memberof module:studentController
 * @param {Object} req - Express request object containing session data.
 * @param {Object} res - Express response object used to render the progress view.
 *
 * @returns {void} Renders 'student/progress' view.
 */
exports.showProgress = async (req, res) => {
  const userId = req.session.user.user_id;
  const studentData = await studentModel.getStudentData(userId);

  res.render("student/progress", {
    title: "Progress",
    user: req.session.user,
    studentData,
  });
};

/**
 * Renders the messaging hub for the student, showing conversations and notifications.
 *
 * @route GET /student-dashboard/messaging
 * @function
 * @memberof module:studentController
 * @param {Object} req - Express request object with session user ID.
 * @param {Object} res - Express response object.
 *
 * @returns {void} Renders 'student/messaging' view.
 *
 * @throws Will send a 500 response if data fetch fails.
 */
exports.showMessagingHub = async (req, res) => {
  try {
    const userId = req.session.user.user_id;
    const studentData = await studentModel.getStudentData(userId);

    const allConversationsForUser = await messageModel.getAllUserConversations(userId);
    const allNotificationsForUser = await notificationModel.getUserNotifications(userId);
    console.log("notifications ", allNotificationsForUser);

    res.render("student/messaging", {
      title: "Messaging Hub",
      user: req.session.user,
      studentData: studentData[0],
      allConversations: allConversationsForUser,
      allNotifications: allNotificationsForUser,
    });
  } catch (err) {
    console.error("Error fetching Messages or notifications for user:", err);
    res.status(500).send("Internal Server Error");
  }
};


/**
 * Renders the student's profile with academic data, user info, and progression analysis.
 *
 * @route GET /student-dashboard/profile
 * @function
 * @memberof module:studentController
 * @param {Object} req - Express request object with session data.
 * @param {Object} res - Express response object.
 *
 * @returns {void} Renders 'student/profile' view.
 *
 * @throws Will send a 404 if the student is not found.
 * @throws Will send a 500 response if data retrieval or analysis fails.
 */
exports.showProfile = async (req, res) => {
  try {
    const userId = req.session.user.user_id;
    const [studentData] = await studentModel.getStudentData(userId);
    console.log("student data ",studentData);
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
      userData: user_data[0],
      moduleData: module_data,
      studentRecord: studentRecord,
      studentProgression: studentProgression,
    });
  } catch (err) {
    console.error("Error fetching student:", err);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * Updates the student's secondary email address.
 *
 * @route POST /student-dashboard/profile/:id
 * @function
 * @memberof module:studentController
 * @param {Object} req - Express request object with student ID param and secondary_email in body.
 * @param {Object} res - Express response object.
 *
 * @returns {void} Redirects to the student profile page upon success.
 *
 * @throws Will send a 404 if the student is not found.
 * @throws Will send a 500 response if update fails.
 */
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

