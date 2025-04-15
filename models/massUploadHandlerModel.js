const studentModel = require("./studentModel");
const userModel = require("./userModel");
const moduleModel = require("./moduleModel");
const studentModuleModel = require("./studentModuleModel");

async function updateStudentFromRecord(record) {
  const { sId, firstName, lastName, statusStudy, entryLevel } = record;

  const student = await studentModel.getStudentBySId(sId);
  if (student.length > 0) {
    return { studentId: student[0].student_id, userId: student[0].user_id };
  } else {
    const baseEmail = `${firstName
      .substring(0, 1)
      .toLowerCase()}.${lastName.toLowerCase()}@university.edu`;
    const password = `${lastName}${sId}`;
    const newUser = await userModel.createUser({
      baseEmail,
      password,
      role: "student",
    });

    const newStudent = await studentModel.createStudent({
      userId: newUser.user_id,
      sId,
      firstName,
      lastName,
      statusStudy,
      entryLevel,
    });

    return { studentId: newStudent.student_id, userId: newUser.user_id };
  }
}

async function updateModuleFromRecord(record) {
  const { subjCode, subjCatalog, moduleTitle, creditCount } = record;

  const module = await moduleModel.getModuleWithModuleTitle(moduleTitle);
  if (module.length > 0) {
    return module[0].module_id ;
  }

  module  = await moduleModel.createModule({
    subjCode,
    subjCatalog,
    moduleTitle,
    creditCount,
  });

  console.log("module", module_id);
  return module[0].module_id ;
}

async function updateStudentModule({ studentId, moduleId, record }) {
  const { firstGrade, gradeResult, resitGrade, resitResult, acad_Yr } = record;

  const [existingRecord] = await studentModuleModel.findRecord(
    studentId,
    moduleId, 
    acad_Yr,
  );
  if (!existingRecord) {
    await studentModuleModel.createRecord({
      studentId,
      moduleId,
      firstGrade,
      gradeResult,
      resitGrade,
      resitResult,
      acad_Yr,
    });
  } else {
    console.log("existing module id = ", existingRecord.user_module_id)
    await studentModuleModel.updateRecord({
      firstGrade,
      gradeResult,
      resitGrade,
      resitResult,
      acad_Yr,
      userModuleId: existingRecord.user_module_id,
    });
  }
}

module.exports = {
  updateStudentFromRecord,
  updateModuleFromRecord,
  updateStudentModule,
};
