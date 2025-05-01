// models/massUploadHandlerModel.js
// required models
const studentModel = require("./studentModel");
const userModel = require("./userModel");
const moduleModel = require("./moduleModel");
const studentModuleModel = require("./studentModuleModel");

/**
 * Processes a student record by checking for existing entry or creating a new student and user.
 *
 * @function
 * @memberof module:massUploadHandlerModel
 * @param {Object} record - Contains sId, firstName, lastName, statusStudy, and entryLevel.
 *
 * @returns {Object} An object containing the studentId and userId.
 *
 * @throws Will throw an error if user or student creation fails.
 */
async function updateStudentFromRecord(record) {
  const { sId, firstName, lastName, statusStudy, entryLevel } = record;

  const student = await studentModel.getStudentBySId(sId);
  if (student && student.length > 0) {
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
    console.log(newUser.user_id,
      sId,
      firstName,
      lastName,
      statusStudy,
      entryLevel,)
    const newStudentId = await studentModel.createStudent({
      userId: newUser.user_id,
      sId,
      firstName,
      lastName,
      statusStudy,
      entryLevel,
    });

    return { studentId: newStudentId.student_id, userId: newUser.user_id };
  }
}

/**
 * Processes a module record by retrieving or creating a module.
 *
 * @function
 * @memberof module:massUploadHandlerModel
 * @param {Object} record - Contains subjCode, subjCatalog, moduleTitle, and creditCount.
 *
 * @returns {number} The module ID.
 *
 * @throws Will throw an error if module creation fails.
 */
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

/**
 * Updates or inserts a student module record based on academic year and identifiers.
 *
 * @function
 * @memberof module:massUploadHandlerModel
 * @param {Object} params - Object containing studentId, moduleId, and record with grading info.
 * @param {number} params.studentId - Student ID.
 * @param {number} params.moduleId - Module ID.
 * @param {Object} params.record - Contains firstGrade, gradeResult, resitGrade, resitResult, and acad_Yr.
 *
 * @returns {void}
 *
 * @throws Will throw an error if creation or update fails.
 */
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
