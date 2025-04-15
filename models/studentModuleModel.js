const connection = require("../config/config");

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
