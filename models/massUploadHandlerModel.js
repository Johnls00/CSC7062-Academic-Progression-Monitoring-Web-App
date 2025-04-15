const studentModel = require("./studentModel");
const userModel = require("./userModel");
const moduleModel = require("./moduleModel");
// const studentModuleModel = require("./studentModuleModel");

async function updateStudentFromRecord(record) {
  const { sId, firstName, lastName, statusStudy} = record;

  let student = await studentModel.getStudentBySId(sId);
  if (student) {
    return { studentId: student[0].student_id, userId: student[0].user_id };
  }

  const baseEmail = `${firstName.substring(0,1).toLowerCase()}.${lastName.toLowerCase()}@university.edu`;
  const password = `${lastName}${sId}`;
  const newUser = await userModel.createUser({
    baseEmail,
    password,
    role: "student"
  });

  const newStudent = await studentModel.createStudent({
    userId: newUser.user_id,
    sId,
    firstName,
    lastName,
    statusStudy
  });

  return { studentId: newStudent.student_id, userId: newUser.user_id };
}



module.exports = {
  updateStudentFromRecord,
};