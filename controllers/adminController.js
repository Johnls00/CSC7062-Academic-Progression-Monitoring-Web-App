// controllers/adminController.js
// required models
const studentModel = require("../models/studentModel");
const programModels = require("../models/programModels");
const moduleModel = require("../models/moduleModel");
const messageModel = require("../models/messageModel");
const notificationModel = require("../models/notificationModel");
const massUploadHandlerModel = require("../models/massUploadHandlerModel");
const studentRecordModel = require("../models/studentRecordModel");
const connection = require("../config/config");
// scripts
const { determineProgression } = require("../utils/progression-logic");

/**
 * Renders the Admin Dashboard view.
 * 
 * @route GET /admin/dashboard
 * @function
 * @memberof module:adminController
 * @param {Object} req - Express request object containing session data.
 * @param {Object} res - Express response object used to render the dashboard.
 * 
 * @returns {void} Renders the 'admin/admin-dashboard' EJS view with user data.
 * 
 * @throws Will send a 500 response if an internal error occurs.
 */
exports.showDashboard = async (req, res) => {
  try {
    const userId = req.session.user.user_id;

    res.render("admin/admin-dashboard", {
      title: "Admin Dashboard",
      user: req.session.user,
    });
  } catch (err) {
    console.error("Error in showDashboard controller:", err);
    return res.status(500).send("Internal Server Error");
  }
};

/**
 * Displays a list of all students along with their associated degree program details.
 * Extracts the program code from each student's ID and attaches student data with program info.
 *
 * @route GET /admin/students
 * @function
 * @memberof module:adminController
 * @param {Object} req - Express request object containing session and user data.
 * @param {Object} res - Express response object used to render the view.
 *
 * @returns {void} Renders the 'admin/students' view with the list of students and their degree programs.
 *
 * @throws Will send a 500 response if an error occurs while retrieving or processing student data.
 */
exports.showStudents = async (req, res) => {
  try {
    const students = await studentModel.getAllStudents();

    for (let i = 0; i < students.length; i++) {
      const program_code = students[i].sId.substring(3, 7);
      try {
        const program_details = await programModels.getProgramInfo(
          program_code
        );

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
      title: "Student Management",
      user: req.session.user,
      students,
    });
  } catch (err) {
    console.error("Error in listStudents controller:", err);
    return res.status(500).send("Internal Server Error");
  }
};

/**
 * Displays detailed student information for a specific student including user data, modules, academic record, and progression status.
 *
 * @route GET /admin/student/:id
 * @function
 * @memberof module:adminController
 * @param {Object} req - Express request object containing the student ID in params.
 * @param {Object} res - Express response object used to render the student details view.
 *
 * @returns {void} Renders the 'admin/student-details' view with detailed student information.
 *
 * @throws Will send a 404 response if the student is not found.
 * @throws Will send a 500 response if an error occurs during data retrieval or rendering.
 */
exports.viewStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await studentModel.getStudentBySId(studentId);
    const user_data = await studentModel.getStudentUserData(student[0].user_id);
    const module_data = await studentModel.getModulesByStudentId(
      student[0].student_id
    );

    // attach the student program details
    const studentWithProgramDetails = await studentModel.attachProgramDetails(
      student
    );

    if (!studentWithProgramDetails) {
      return res.status(404).send("Student not found");
    }

    const studentRecord = await studentRecordModel.getStudentRecord(
      studentWithProgramDetails
    );
    const studentProgression = await determineProgression(studentRecord);
    console.log("student record", studentRecord);
    console.log("module data ", module_data);

    res.render("admin/student-details", {
      title: "Student Details",
      user: req.session.user,
      student: studentWithProgramDetails[0],
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
 * Displays a list of all available degree programs.
 *
 * @route GET /admin/degree-programs
 * @function
 * @memberof module:adminController
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object used to render the view.
 *
 * @returns {void} Renders the 'admin/degree-programs' view with the list of programs.
 *
 * @throws Will send a 500 response if an error occurs while fetching data.
 */
exports.showDegreePrograms = async (req, res) => {
  try {
    const degrees = await programModels.getAllPrograms();
    console.log("degrees", degrees);

    res.render("admin/degree-programs", {
      title: "Degree Programs",
      user: req.session.user,
      degrees,
    });
  } catch (err) {
    console.error("Error fetching student:", err);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * Adds a new degree program to the system.
 *
 * @route POST /admin/degree-programs/add
 * @function
 * @memberof module:adminController
 * @param {Object} req - Express request object containing programCode and programName in body.
 * @param {Object} res - Express response object.
 *
 * @returns {void} Redirects to the degree programs page upon success.
 *
 * @throws Will send a 500 response if insertion fails.
 */
exports.addProgram = async (req, res) => {
  try {
    const { programCode, programName } = req.body;
    console.log(programCode, programName);

    await connection.query(
      `INSERT INTO program(program_code, name) VALUES (?,?)`,
      [programCode, programName]
    );

    res.redirect(`/admin/degree-programs`);
  } catch (error) {
    console.error("Error adding program", error);
    return res.status(500).send("Error adding program.");
  }
};

/**
 * Deletes a degree program and its module associations.
 *
 * @route DELETE /admin/degree-programs/:id
 * @function
 * @memberof module:adminController
 * @param {Object} req - Express request object containing program ID in params.
 * @param {Object} res - Express response object.
 *
 * @returns {Object} JSON response indicating success.
 *
 * @throws Will send a 500 response if transaction fails.
 */
exports.deleteProgram = async (req, res) => {
  const  programId = req.params.id;
  console.log(programId);

  let deleteConnection;
  try {
    // new connection allows the delete operation to be a Transaction
    deleteConnection = await connection.getConnection();

    await deleteConnection.beginTransaction();
    await deleteConnection.query(
      "DELETE FROM `program` WHERE `program_id` = ?",
      [programId]
    );

    await deleteConnection.query(
      "DELETE FROM `program_module` WHERE `program_id` = ?",
      [programId]
    );

    await deleteConnection.commit();
    deleteConnection.release();

    return res.status(200).json({ message: "Program deleted" });
  } catch (err) {
    if (deleteConnection) {
      await deleteConnection.rollback();
      deleteConnection.release();
    }
    console.error("Transaction failed:", err);
    res.status(500).send("Failed to delete program.");
  }
};

/**
 * Displays details and modules of a specific degree program.
 *
 * @route GET /admin/degree-details/:id
 * @function
 * @memberof module:adminController
 * @param {Object} req - Express request object containing program ID.
 * @param {Object} res - Express response object used to render the view.
 *
 * @returns {void} Renders the 'admin/degree-details' view.
 *
 * @throws Will send a 500 response if data retrieval fails.
 */
exports.showDegreeDetails = async (req, res) => {
  try {
    const program_id = req.params.id;
    const program_details = await programModels.getProgramInfoWithProgramId(
      program_id
    );
    const program_modules = await programModels.getProgramModulesDetails(
      program_id
    );

    res.render("admin/degree-details", {
      title: "Degree Details",
      user: req.session.user,
      program_id,
      program_details: program_details[0],
      program_modules: program_modules,
    });
  } catch (err) {
    console.error("Error fetching student:", err);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * Adds a module to a specific degree program.
 *
 * @route POST /admin/degree-details/:id/add-module
 * @function
 * @memberof module:adminController
 * @param {Object} req - Express request object with module data.
 * @param {Object} res - Express response object.
 *
 * @returns {void} Redirects to the updated degree details page.
 *
 * @throws Will send a 500 response if module addition fails.
 */
exports.addProgramModule = async (req, res) => {
  try {
    const program_id = req.params.id;
    const {
      new_module_name,
      new_module_level,
      new_module_semester,
      new_module_core,
    } = req.body;
    console.log("body", req.body);
    const moduleInfo = await moduleModel.getModuleWithModuleTitle(
      new_module_name
    );

    if (!moduleInfo[0].module_id) {
      return res.status(404).send("Module not found.");
    }

    const moduleId = moduleInfo[0].module_id;

    await connection.query(
      "INSERT INTO `program_module`(`program_id`, `module_id`, `level`, `semester`, `is_core`) VALUES (?,?,?,?,?)",
      [
        program_id,
        moduleId,
        new_module_level,
        new_module_semester,
        new_module_core,
      ]
    );

    res.redirect(`/admin/degree-details/${program_id}`);
  } catch (error) {
    console.error("Error adding module", error);
    return res.status(500).send("Error adding program module");
  }
};

/**
 * Deletes a module from a specific degree program.
 *
 * @route DELETE /admin/program-module/:id
 * @function
 * @memberof module:adminController
 * @param {Object} req - Express request object with program module ID.
 * @param {Object} res - Express response object.
 *
 * @returns {Object} JSON response indicating success.
 *
 * @throws Will send a 500 response if transaction fails.
 */
exports.deleteProgramModule = async (req, res) => {
  const programModuleId = req.params.id;
  
  let deleteConnection;
  try {
    // new connection allows the delete operation to be a Transaction
    deleteConnection = await connection.getConnection();

    await deleteConnection.beginTransaction();
    await deleteConnection.query(
      "DELETE FROM `program_module` WHERE `program_module_id` = ?",
      [programModuleId]
    );

    await deleteConnection.commit();
    deleteConnection.release();

    return res.status(200).json({ message: "program module deleted" });
  } catch (err) {
    if (deleteConnection) {
      await deleteConnection.rollback();
      deleteConnection.release();
    }
    console.error("Transaction failed:", err);
    res.status(500).send("Failed to delete student.");
  }
};

/**
 * Displays a list of all modules available in the system.
 *
 * @route GET /admin/modules
 * @function
 * @memberof module:adminController
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object used to render the modules view.
 *
 * @returns {void} Renders the 'admin/modules' view with the list of modules.
 *
 * @throws Will send a 500 response if data retrieval fails.
 */
exports.showModules = async (req, res) => {
  try {
    const modules = await moduleModel.getAllModules();

    res.render("admin/modules", {
      title: "Manage Modules",
      user: req.session.user,
      modules: modules,
    });
  } catch (err) {
    console.error("Error fetching student:", err);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * Adds a new module to the system.
 *
 * @route POST /admin/modules/add
 * @function
 * @memberof module:adminController
 * @param {Object} req - Express request object containing module details.
 * @param {Object} res - Express response object.
 *
 * @returns {void} Redirects to the module list page upon success.
 *
 * @throws Will send a 500 response if insertion fails.
 */
exports.addModule = async (req, res) => {
  try {
    const { subjectCode, subjectCatalog, moduleTitle, credits } = req.body;
    await connection.query(
      `INSERT INTO module(subject_code, subject_catalog, module_title, credit_value) VALUES (?,?,?,?)`,
      [subjectCode, subjectCatalog, moduleTitle, credits]
    );

    res.redirect("/admin/modules");
  } catch (err) {
    console.error("Error fetching student:", err);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * Deletes a module from the system.
 *
 * @route DELETE /admin/modules/:id
 * @function
 * @memberof module:adminController
 * @param {Object} req - Express request object containing the module ID.
 * @param {Object} res - Express response object.
 *
 * @returns {Object} JSON response indicating success.
 *
 * @throws Will send a 500 response if deletion fails.
 */
exports.deleteModule = async (req, res) => {
  console.log("in delete module controller");
  const moduleId = req.params.id;
  console.log("module id ", moduleId);

  let deleteConnection;
  try {
    // new connection allows the delete operation to be a Transaction
    deleteConnection = await connection.getConnection();

    await deleteConnection.beginTransaction();
    await deleteConnection.query("DELETE FROM `module` WHERE `module_id` = ?", [
      moduleId,
    ]);
    await deleteConnection.commit();
    deleteConnection.release();

    return res.status(200).json({ message: "Module deleted" });
  } catch (err) {
    if (deleteConnection) {
      await deleteConnection.rollback();
      deleteConnection.release();
    }
    console.error("Transaction failed:", err);
    res.status(500).send("Failed to delete module.");
  }
};

/**
 * Adds a new student to the system using submitted form data.
 *
 * @route POST /admin/students/add
 * @function
 * @memberof module:adminController
 * @param {Object} req - Express request object containing student details.
 * @param {Object} res - Express response object.
 *
 * @returns {void} Redirects to the students list view upon success.
 *
 * @throws Will send a 500 response if student addition fails.
 */
exports.addStudent = async (req, res) => {
  // Logic to add a new student
  try {
    const { sId, firstName, lastName, statusStudy, entryLevel } = req.body;
    const record = { sId, firstName, lastName, statusStudy, entryLevel };
    await massUploadHandlerModel.updateStudentFromRecord(record);

    res.redirect("/admin/students");
  } catch (err) {
    console.error("Error inserting student:", err);
    return res.status(500).send("Error adding student");
  }
};

/**
 * Updates existing student and user details.
 *
 * @route POST /admin/student/:id/update
 * @function
 * @memberof module:adminController
 * @param {Object} req - Express request object with updated student/user data.
 * @param {Object} res - Express response object.
 *
 * @returns {void} Redirects to the updated student detail view upon success.
 *
 * @throws Will send a 404 if student is not found.
 * @throws Will send a 500 response if update fails.
 */
exports.updateStudent = async (req, res) => {
  const studentId = req.params.id;
  const [userResult] = await connection.query(
    "SELECT user_id FROM student WHERE sId = ?",
    [studentId]
  );
  if (!userResult || userResult.length === 0) {
    return res.status(404).send("Student not found");
  }
  const userId = userResult[0].user_id;
  const {
    first_name,
    last_name,
    sId,
    email,
    secondary_email,
    status_study,
    entry_level,
  } = req.body;

  try {
    await connection.query(
      `
        UPDATE student 
        SET first_name = ?, last_name = ?, sId = ?, status_study = ?, entry_level = ? 
        WHERE sId = ?`,
      [first_name, last_name, sId, status_study, entry_level, studentId]
    );

    await connection.query(
      `
        UPDATE user 
        SET email = ?, secondary_email = ? 
        WHERE user_id = ?`,
      [email, secondary_email, userId]
    );

    res.redirect(`/admin/student/${sId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to update student.");
  }
};

/**
 * Deletes a student and all related records from the system.
 *
 * @route DELETE /admin/student/:id
 * @function
 * @memberof module:adminController
 * @param {Object} req - Express request object containing student sId.
 * @param {Object} res - Express response object.
 *
 * @returns {Object} JSON response indicating deletion success.
 *
 * @throws Will send a 404 if student is not found.
 * @throws Will send a 500 response if transaction fails.
 */
exports.deleteStudent = async (req, res) => {
  const sId = req.params.id;

  let deleteConnection;
  try {
    const [userResult] = await connection.query(
      "SELECT student_id, user_id FROM student WHERE sId = ?",
      [sId]
    );
    if (!userResult || userResult.length === 0) {
      return res.status(404).send("Student not found");
    }
    const { student_id, user_id } = userResult[0];

    // new connection allows the delete operation to be a Transaction
    deleteConnection = await connection.getConnection();

    await deleteConnection.beginTransaction();
    await deleteConnection.query(
      "DELETE FROM `student_module` WHERE `student_id` = ?",
      [student_id]
    );
    await deleteConnection.query(
      "DELETE FROM `student` WHERE `student_id` = ?",
      [student_id]
    );
    await deleteConnection.query("DELETE FROM `user` WHERE user_id = ?", [
      user_id,
    ]);
    await deleteConnection.commit();
    deleteConnection.release();

    return res.status(200).json({ message: "Student deleted" });
  } catch (err) {
    if (deleteConnection) {
      await deleteConnection.rollback();
      deleteConnection.release();
    }
    console.error("Transaction failed:", err);
    res.status(500).send("Failed to delete student.");
  }
};

/**
 * Adds a module to a student's record.
 *
 * @route POST /admin/student/:id/add-module
 * @function
 * @memberof module:adminController
 * @param {Object} req - Express request object containing module name and student ID.
 * @param {Object} res - Express response object.
 *
 * @returns {void} Redirects to the student's detail view upon success.
 *
 * @throws Will send a 404 response if module or student is not found.
 * @throws Will send a 500 response if insertion fails.
 */
exports.addStudentModule = async (req, res) => {
  try {
    const sId = req.params.id;
    const { new_module_name } = req.body;
    const moduleInfo = await moduleModel.getModuleWithModuleTitle(
      new_module_name
    );

    if (!moduleInfo[0].module_id) {
      return res.status(404).send("Module not found.");
    }

    const studentData = await studentModel.getStudentBySId(sId);
    if (!studentData || studentData.length === 0) {
      return res.status(404).send("Student not found");
    }

    const studentId = studentData[0].student_id;
    const moduleId = moduleInfo[0].module_id;

    await connection.query(
      "INSERT INTO `student_module` (`student_id`, `module_id`) VALUES (?, ?)",
      [studentId, moduleId]
    );

    res.redirect(`/admin/student/${sId}`);
  } catch (error) {
    console.error("Error adding module", error);
    res.status(500).send("Error adding module.");
  }
};

/**
 * Updates grades and results for a student's modules.
 *
 * @route POST /admin/student/:id/update-modules
 * @function
 * @memberof module:adminController
 * @param {Object} req - Express request object containing module result data.
 * @param {Object} res - Express response object.
 *
 * @returns {void} Redirects to the student's detail page upon success.
 *
 * @throws Will send a 500 response if update fails.
 */
//update student modules grades and results
exports.updateStudentModules = async (req, res) => {
  const sId = req.params.id;

  try {
    const {
      user_module_ids,
      first_grades,
      grade_results,
      resit_grades,
      resit_results,
      academic_year,
    } = req.body;

    for (let i = 0; i < user_module_ids.length; i++) {
      await connection.query(
        `UPDATE student_module 
     SET first_grade = ?, grade_result = ?, resit_grade = ?, resit_result = ?, academic_year = ?
     WHERE user_module_id = ? `,
        [
          first_grades[i] === "N/A" ? null : first_grades[i],
          grade_results[i] === "N/A" ? null : grade_results[i],
          resit_grades[i] === "N/A" ? null : resit_grades[i],
          resit_results[i] === "N/A" ? null : resit_results[i],
          academic_year[i] === "N/A" ? null : academic_year[i],
          user_module_ids[i],
        ]
      );
    }

    res.redirect(`/admin/student/${sId}`);
  } catch (error) {
    console.error("Error updating modules:", error);
    res.status(500).send("Error updating module results.");
  }
};

/**
 * Deletes a specific module record from a student's academic history.
 *
 * @route DELETE /admin/student-module/:userModuleId
 * @function
 * @memberof module:adminController
 * @param {Object} req - Express request object with userModuleId in params.
 * @param {Object} res - Express response object.
 *
 * @returns {Object} JSON response indicating deletion success.
 *
 * @throws Will send a 500 response if deletion fails.
 */
exports.deleteStudentModule = async (req, res) => {
  const { userModuleId } = req.params;

  let deleteConnection;
  try {
    // new connection allows the delete operation to be a Transaction
    deleteConnection = await connection.getConnection();

    await deleteConnection.beginTransaction();
    await deleteConnection.query(
      "DELETE FROM `student_module` WHERE `user_module_id` = ?",
      [userModuleId]
    );
    await deleteConnection.commit();
    deleteConnection.release();

    return res.status(200).json({ message: "Student module record deleted" });
  } catch (err) {
    if (deleteConnection) {
      await deleteConnection.rollback();
      deleteConnection.release();
    }
    console.error("Transaction failed:", err);
    res.status(500).send("Failed to delete student module record.");
  }
};

/**
 * Displays the Reports dashboard view.
 *
 * @route GET /admin/reports
 * @function
 * @memberof module:adminController
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 *
 * @returns {void} Renders the 'admin/reports' view.
 */
exports.generateReports = (req, res) => {
  res.render("admin/reports", { title: "Reports", user: req.session.user });
};

/**
 * Displays the Messaging Hub with all conversations and notifications.
 *
 * @route GET /admin/messaging
 * @function
 * @memberof module:adminController
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object used to render the messaging view.
 *
 * @returns {void} Renders the 'admin/messaging' view.
 *
 * @throws Will send a 500 response if message or notification retrieval fails.
 */
exports.showMessagingHub = async (req, res) => {
  try {
    const allConversationsForAdmin =
      await messageModel.getAllStudentConversationsForAdmin();
    const allNotificationsForAdmin =
      await notificationModel.getAllNotifications();

    res.render("admin/messaging", {
      title: "Messaging Hub",
      user: req.session.user,
      allConversations: allConversationsForAdmin,
      allNotifications: allNotificationsForAdmin,
    });
  } catch (err) {
    console.error("Error fetching Messages or notifications for admin:", err);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * Displays the mass upload interface for batch student record management.
 *
 * @route GET /admin/mass-upload
 * @function
 * @memberof module:adminController
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 *
 * @returns {void} Renders the 'admin/mass-upload' view.
 *
 * @throws Will send a 500 response if the view fails to load.
 */
exports.showMassUpload = (req, res) => {
  try {
    res.render("admin/mass-upload", {
      title: "Mass record management",
      user: req.session.user,
    });
  } catch (err) {
    console.error("Error fetching mass upload page for admin", err);
    res.status(500).send("Internal Server Error");
  }
};
