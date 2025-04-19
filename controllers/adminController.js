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

exports.viewStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await studentModel.getStudentBySId(studentId);
    const user_data = await studentModel.getStudentUserData(student[0].user_id);
    const module_data = await studentModel.getModulesByStudentId(
      student[0].student_id
    );

    // attach the student program details
    const studentWithProgramDetails = await studentModel.attachProgramDetails(student);

    if (!studentWithProgramDetails) {
      return res.status(404).send("Student not found");
    }

    const studentRecord = await studentRecordModel.getStudentRecord(studentWithProgramDetails);
    console.log("student record", studentRecord);
    const studentProgression = determineProgression(studentRecord);

    res.render("admin/student-details", {
      title: "Student Details",
      user: req.session.user,
      student: studentWithProgramDetails[0],
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
      degrees,
    });
  } catch (err) {
    console.error("Error fetching student:", err);
    res.status(500).send("Internal Server Error");
  }
};

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

exports.deleteProgramModule = async (req, res) => {
  try {
    const program_module_id = req.params.id;

    // new connection allows the delete operation to be a Transaction
    const deleteConnection = await connection.getConnection();

    await deleteConnection.beginTransaction();
    await deleteConnection.query(
      "DELETE FROM `program_module` WHERE `program_module_id` = ?",
      [program_module_id]
    );

    await deleteConnection.commit();
    deleteConnection.release();

    return res.status(200).json({ message: "program module deleted" });
  } catch (err) {
    await deleteConnection.rollback();
    deleteConnection.release();
    console.error("Transaction failed:", err);
    res.status(500).send("Failed to delete student.");
  }
};

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

exports.deleteStudent = async (req, res) => {
  const sId = req.params.id;

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
    const deleteConnection = await connection.getConnection();

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
    await deleteConnection.rollback();
    deleteConnection.release();
    console.error("Transaction failed:", err);
    res.status(500).send("Failed to delete student.");
  }
};

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

exports.deleteStudentModule = async (req, res) => {
  const { sId, moduleId } = req.params;

  try {
    const [userResult] = await connection.query(
      "SELECT student_id, user_id FROM student WHERE sId = ?",
      [sId]
    );
    if (!userResult || userResult.length === 0) {
      return res.status(404).send("Student not found");
    }
    const studentId = userResult[0].student_id;

    // new connection allows the delete operation to be a Transaction
    const deleteConnection = await connection.getConnection();

    await deleteConnection.beginTransaction();
    await deleteConnection.query(
      "DELETE FROM `student_module` WHERE `student_id` = ? AND `module_id` = ?",
      [studentId, moduleId]
    );
    await deleteConnection.commit();
    deleteConnection.release();

    return res.status(200).json({ message: "Student module record deleted" });
  } catch (err) {
    await deleteConnection.rollback();
    deleteConnection.release();
    console.error("Transaction failed:", err);
    res.status(500).send("Failed to delete student module record.");
  }
};

exports.generateReports = (req, res) => {
  res.render("admin/reports", { title: "Reports", user: req.session.user });
};

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
