// models/studentModel.js
// required models
const connection = require("../config/config");
const moduleModel = require("../models/moduleModel");
const programModel = require("../models/programModels");


/**
 * Retrieves user data for a given user ID from the user table.
 *
 * @function
 * @memberof module:studentModel
 * @param {number} userId - The user ID of the student.
 * @returns {Promise<Object|null>} The user data or null if not found.
 *
 * @throws Will throw an error if the query fails.
 */
//Get student user data by user ID
async function getStudentUserData(userId) {
  const [userData] = await connection.query(
    "SELECT * FROM `user` WHERE `user_id` = ?",
    [userId]
  );
  if (!userData) {
    console.warn("No student found with user ID:", userId);
    return res.status(404).send("Student not found");
  }

  if (userData.length === 0) {
    return null; // No student found
  }
  return userData; // Return the first student found
}

/**
 * Retrieves student data from the student table for a given user ID.
 *
 * @function
 * @memberof module:studentModel
 * @param {number} userId - The user ID of the student.
 * @returns {Promise<Object|null>} The student data or null if not found.
 *
 * @throws Will throw an error if the query fails.
 */
//Get student data by user ID
async function getStudentData(userId) {
  const [studentData] = await connection.query(
    "SELECT * FROM `student` WHERE `user_id` = ?",
    [userId]
  );
  if (!studentData) {
    console.warn("No student found with user ID:", userId);
    return res.status(404).send("Student not found");
  }

  if (studentData.length === 0) {
    return null; // No student found
  }
  return studentData; // Return the first student found
}

/**
 * Retrieves student data using the student id (sId).
 *
 * @function
 * @memberof module:studentModel
 * @param {string} sId - The student identifier.
 * @returns {Promise<Object|null>} The student data or null if not found.
 *
 * @throws Will throw an error if the query fails.
 */
//Get student data by `student_id`
async function getStudentBySId(sId) {
  const [studentData] = await connection.query(
    "SELECT * FROM `student` WHERE `sId` = ?",
    [sId]
  );
  if (!studentData) {
    console.warn("No student found with user ID:", sId);
    return res.status(404).send("Student not found");
  }

  if (studentData.length === 0) {
    return null; // No student found
  }
  return studentData; // Return the first student found
}

/**
 * Retrieves all modules linked to a student by their student ID.
 * attaches to each student_module the full module details.
 *
 * @function
 * @memberof module:studentModel
 * @param {number} studentId - The student ID.
 * @returns {Promise<Array>} An array of enriched student module records.
 *
 * @throws Will throw an error if the query or enrichment fails.
 */
// Get courses by student ID
async function getModulesByStudentId(studentId) {
  try {
    const [modules] = await connection.query(
      "SELECT * FROM `student_module` WHERE `student_id` = ?",
      [studentId]
    );

     for (let i = 0; i < modules.length; i++) {
        const moduleId = modules[i].module_id;
        const module_Info = await moduleModel.getModuleInfo(moduleId);
    
        if (module_Info && module_Info.length > 0) {
          modules[i].module_id = module_Info[0].module_id;
          modules[i].subject_code = module_Info[0].subject_code;
          modules[i].subject_catalog = module_Info[0].subject_catalog;
          modules[i].module_title = module_Info[0].module_title;
          modules[i].credit_value = module_Info[0].credit_value;
        } else {
          modules[i].module_id = "Unknown";
          modules[i].subject_code = "Unknown";
          modules[i].subject_catalog = "Unknown";
          modules[i].module_title = "Unknown";
          modules[i].credit_value = "Unknown";
        }
      }

    return modules;
  } catch (err) {
    throw new Error("Failed to fetch courses data");
  }
}

/**
 * Retrieves all student records from the database.
 *
 * @function
 * @memberof module:studentModel
 * @returns {Promise<Array>} An array of all student records.
 *
 * @throws Will throw an error if the query fails.
 */
// Get all students
async function getAllStudents() {
  try {
    const [students] = await connection.query("SELECT * FROM `student`");
    return students;
  } catch (err) {
    throw new Error("Failed to fetch students data");
  }
}

/**
 * Extracts the program code from a student sId and attaches corresponding program details.
 *
 * @function
 * @memberof module:studentModel
 * @param {Array} student - An array containing a single student object.
 * @returns {Promise<Array>} The updated student array with program_id, code, and name.
 *
 * @throws Will assign "Unknown" values if fetching program info fails.
 */
// get the students degree program info and attach it to the students details array 
async function attachProgramDetails(student) {
  const program_code = student[0].sId.substring(3, 7);

  try {
    const program_details = await programModel.getProgramInfo(program_code);

    if (program_details && program_details.length > 0) {
      student[0].program_id = program_details[0].program_id;
      student[0].program_code = program_details[0].program_code;
      student[0].program_name = program_details[0].name;
    } else {
      student[0].program_id = "Unknown";
      student[0].program_code = "Unknown";
      student[0].program_name = "Unknown";
    }
  } catch (err) {
    console.warn("Failed to fetch program info for:", program_code, err.message);
    student[0].program_id = "Unknown";
    student[0].program_code = "Unknown";
    student[0].program_name = "Unknown";
  }

  return student;
}

/**
 * Creates a new student record in the database.
 *
 * @function
 * @memberof module:studentModel
 * @param {Object} param0 - An object containing student details.
 * @param {number} param0.userId - Linked user ID.
 * @param {string} param0.sId - Student identifier.
 * @param {string} param0.firstName - Student's first name.
 * @param {string} param0.lastName - Student's last name.
 * @param {string} param0.statusStudy - Student's study status.
 * @param {string} param0.entryLevel - Level at which the student entered the degree program.
 * @returns {Promise<Object>} The ID of the created student.
 *
 * @throws Will throw an error if the insert fails.
 */
// create new student 
async function createStudent({ userId, sId, firstName, lastName, statusStudy, entryLevel}) {
  try {
    const [newStudent] = await connection.query(
      "INSERT INTO `student`(`user_id`, `sId`, `first_name`, `last_name`, `status_study`, `entry_level`) VALUES (?,?,?,?,?,?)",
      [userId, sId, firstName, lastName, statusStudy, entryLevel]);
      return { student_id: newStudent.insertId };
  } catch (err) {
    throw new Error("Failed to create student: " + err.message);
  }
}

/**
 * Retrieves all students whose sId contains the given program code.
 *
 * @function
 * @memberof module:studentModel
 * @param {string} programCode - The program code to match against student sIds.
 * @returns {Promise<Array>} An array of matching student records.
 *
 * @throws Will throw an error if the query fails.
 */
async function getStudentByProgramCode(programCode) {
  try {
    const [ProgramStudents] = await connection.query(
      "SELECT * FROM student WHERE sId LIKE ?",
      [`%${programCode}%`] 
    );

    return ProgramStudents;
  } catch (err) {
    throw new Error("Failed to fetch students data");
  }
}

module.exports = {
  getStudentUserData,
  getStudentData,
  getStudentBySId,
  getModulesByStudentId,
  getAllStudents,
  attachProgramDetails,
  createStudent,
  getStudentByProgramCode,
};
