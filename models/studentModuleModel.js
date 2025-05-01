// models/studentModuleModel.js
// required models
const connection = require("../config/config");

/**
 * Finds a student_module record matching a specific student ID, module ID, and academic year.
 *
 * @function
 * @memberof module:studentModuleModel
 * @param {number} studentId - The ID of the student.
 * @param {number} moduleId - The ID of the module.
 * @param {string} acad_Yr - The academic year (e.g. "2023/2024").
 * @returns {Promise<Array>} An array containing the matched record(s).
 *
 * @throws Will throw an error if the query fails.
 */
// fetch record with student id and module id
async function findRecord(studentId, moduleId, acad_Yr) {
  try {
    const [studentModuleRecord] = await connection.query(
      "SELECT * FROM `student_module` WHERE (`student_id`, `module_id`, `academic_year`) = (?, ?, ?)",
      [studentId, moduleId, acad_Yr]
    );
    return studentModuleRecord;
  } catch (err) {
    throw new Error("Failed to fetch student module record: " + err.message);
  }
}

/**
 * Creates a new student_module record.
 *
 * @function
 * @memberof module:studentModuleModel
 * @param {Object} param0 - Object containing student module record fields.
 * @param {number} param0.studentId - Student ID.
 * @param {number} param0.moduleId - Module ID.
 * @param {string|null} param0.firstGrade - First attempt grade or null.
 * @param {string|null} param0.gradeResult - Result of the first attempt or null.
 * @param {string|null} param0.resitGrade - Resit grade or null.
 * @param {string|null} param0.resitResult - Resit result or null.
 * @param {string} param0.acad_Yr - Academic year.
 * @returns {Promise<number>} The ID of the newly inserted record.
 *
 * @throws Will throw an error if insertion fails.
 */
// create new student module record
async function createRecord({
  studentId,
  moduleId,
  firstGrade,
  gradeResult,
  resitGrade,
  resitResult,
  acad_Yr,
}) {
  try {
    const [newRecord] = await connection.query(
      "INSERT INTO `student_module`(`student_id`, `module_id`, `first_grade`, `grade_result`, `resit_grade`, `resit_result`, `academic_year`) VALUES (?,?,?,?,?,?,?)",
      [
        studentId,
        moduleId,
        firstGrade === '' ? null : firstGrade,
        gradeResult === '' ? null : gradeResult,
        resitGrade === '' ? null : resitGrade,
        resitResult === '' ? null : resitResult,
        acad_Yr,
      ]
    );
    return newRecord.insertId;
  } catch (err) {
    throw new Error("Failed to create student module record: " + err.message);
  }
}
/**
 * Updates an existing student_module record.
 *
 * @function
 * @memberof module:studentModuleModel
 * @param {Object} param0 - Object containing updated student module fields.
 * @param {string|null} param0.firstGrade - Updated first grade or null.
 * @param {string|null} param0.gradeResult - Updated grade result or null.
 * @param {string|null} param0.resitGrade - Updated resit grade or null.
 * @param {string|null} param0.resitResult - Updated resit result or null.
 * @param {string} param0.acad_Yr - Academic year.
 * @param {number} param0.userModuleId - The unique ID of the student_module record.
 * @returns {Promise<number>} The ID of the updated record.
 *
 * @throws Will throw an error if the update fails.
 */
//update existing record with record details 
async function updateRecord({
  firstGrade,
  gradeResult,
  resitGrade,
  resitResult,
  acad_Yr,
  userModuleId,
}) {
  try {
    await connection.query(
      "UPDATE `student_module` SET `first_grade`= ?,`grade_result`= ?,`resit_grade`= ?,`resit_result`= ?,`academic_year`= ? WHERE `user_module_id` = ?",
      [
        firstGrade === '' ? null : firstGrade,
        gradeResult === '' ? null : gradeResult,
        resitGrade === '' ? null : resitGrade,
        resitResult === '' ? null : resitResult,
        acad_Yr,
        userModuleId,
      ]
    );
    return userModuleId ;
  } catch (err) {
    throw new Error("Failed to update student module record: " + err.message);
  }
}

module.exports = {
  findRecord,
  createRecord,
  updateRecord,
};
