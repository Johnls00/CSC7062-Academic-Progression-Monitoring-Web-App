const connection = require("../config/config");

/**
 * This function will gather a student records and return an object with the calculated details
 * @param {*} studentId
 */
async function getStudentRecord(student) {
  // gather the required data to get records for each student using the sId

  const studentId = student[0].student_id;
  const programId = student[0].program_id;

  console.log("student id", studentId);
  console.log("program id", programId);

  const studentRecord = {};

  // calculate the average result achieved for enrolled degree
  const [averageMark] = await connection.query(
    `SELECT AVG(
    CASE
    WHEN COALESCE(sm.resit_result, sm.grade_result) = 'pass capped' THEN 40
    WHEN sm.resit_grade IS NOT NULL THEN sm.resit_grade
    ELSE sm.first_grade
    END )
    AS avg_mark
    FROM student_module sm
    JOIN (
    SELECT MAX(user_module_id) AS latest_id
    FROM student_module
    WHERE student_id = ?
    GROUP BY module_id )
    latest_attempts ON sm.user_module_id = latest_attempts.latest_id
    JOIN program_module pm ON sm.module_id = pm.module_id
    WHERE pm.program_id = ?
    AND sm.student_id = ?
    AND ( sm.resit_grade IS NOT NULL OR sm.first_grade IS NOT NULL );`,
    [studentId, programId, studentId]
  );
  studentRecord.averageMark =
    averageMark.length > 0 ? averageMark[0].avg_mark : null;

  // calculate average grade per year
  const [averageMarkPerYear] = await connection.query(
    `
    SELECT
        pm.level AS level,
        AVG(
            CASE
            WHEN COALESCE(sm.resit_result, sm.grade_result) = 'pass capped' THEN 40
            WHEN sm.resit_grade IS NOT NULL THEN sm.resit_grade
            ELSE sm.first_grade
            END
        ) AS avg_mark
        FROM student_module sm
        JOIN (
        SELECT MAX(user_module_id) AS latest_id
        FROM student_module
        WHERE student_id = ?
        GROUP BY module_id
        ) latest_attempts ON sm.user_module_id = latest_attempts.latest_id
        JOIN program_module pm ON sm.module_id = pm.module_id
        WHERE pm.program_id = ?
        AND sm.student_id = ?
        AND (sm.resit_grade IS NOT NULL OR sm.first_grade IS NOT NULL)
        GROUP BY pm.level;`,
    [studentId, programId, studentId]
  );
  studentRecord.averageMarkPerYear = averageMarkPerYear.map((year) => ({
    level: year.level,
    avg_mark: year.avg_mark,
  }));

  // check if the core modules have been passed
  const [coreModulesPassed] = await connection.query(
    `
    SELECT
    IFNULL(
    COUNT(*) = SUM(
        CASE
        WHEN COALESCE(sm.resit_result, sm.grade_result) IN ('pass', 'pass capped') THEN 1
        ELSE 0
        END
        ), "N/A"
    ) AS core_modules_passed
    FROM student_module sm
    JOIN program_module pm ON sm.module_id = pm.module_id
    WHERE sm.student_id = ?
    AND pm.is_core = 1;`,
    [studentId]
  );
  //  if the user has complete any core modules it will check if they passed those modules
  //  if they havent completed any core modules it will return N/A
  studentRecord.coreModulesPassed = coreModulesPassed[0].core_modules_passed;

  // work out the students level
  const [studentLevel] = await connection.query(
    `
    SELECT MAX(pm.level) AS highest_level
        FROM student_module sm
        JOIN program_module pm ON sm.module_id = pm.module_id
        WHERE sm.student_id = ?
        AND pm.program_id = ?
        `,
    [studentId, programId]
  );
  //   mapping results to student record
  studentRecord.studentLevel = studentLevel[0].highest_level;

  // work out attempts per module
  const [moduleAttempts] = await connection.query(
    `
        SELECT
        sm.module_id,
        SUM(
            CASE
            WHEN sm.grade_result != 'excused' AND sm.first_grade IS NOT NULL THEN 1
            ELSE 0
            END
        ) +
        SUM(
            CASE
            WHEN sm.resit_result != 'excused' AND sm.resit_grade IS NOT NULL THEN 1
            ELSE 0
            END
        ) AS attempt_count
        FROM student_module sm
        WHERE sm.student_id = ?
        GROUP BY sm.module_id;
        `,
    [studentId]
  );
  //   mapping results to student record
  studentRecord.moduleAttempts = moduleAttempts.map((module) => ({
    module_id: module.module_id,
    attempt_count: module.attempt_count,
  }));

  // get the final grade and result achieved per module for the most recent year
  const [moduleGradesAndResults] = await connection.query(
    `
    SELECT
        m.module_id AS module_id,
        COALESCE(sm.resit_result, sm.grade_result) AS result,
        CASE
            WHEN sm.resit_result = 'pass capped' THEN 40
            ELSE COALESCE(sm.resit_grade, sm.first_grade)
        END AS grade
        FROM student_module sm
        JOIN (
            SELECT module_id, MAX(RIGHT(academic_year, 2)) AS latest_year
            FROM student_module
            WHERE student_id = ?
            GROUP BY module_id
        ) latest_attempts
        ON sm.module_id = latest_attempts.module_id
        AND RIGHT(sm.academic_year, 2) = latest_attempts.latest_year
        JOIN module m ON sm.module_id = m.module_id
        WHERE sm.student_id = ?;`,
    [studentId, studentId]
  );
  //   mapping results to student record
  studentRecord.modules = moduleGradesAndResults.map((module) => ({
    module_id: module.module_id,
    result: module.result,
    grade: module.grade,
  }));

  // calculate credits passed using already fetched module results
  const creditMap = {
    'L1': 0,
    'L2': 0,
  };
  for (const module of moduleGradesAndResults) {
    if (["pass", "pass capped"].includes(module.result)) {
      const [moduleInfo] = await connection.query(
        `SELECT m.credit_value, pm.level
         FROM module m
         JOIN program_module pm ON m.module_id = pm.module_id
         WHERE m.module_id = ? AND pm.program_id = ?`,
        [module.module_id, programId]
      );
      if (moduleInfo.length > 0) {
        const level = moduleInfo[0].level;
        const credit = moduleInfo[0].credit_value;
        creditMap[level] = (creditMap[level] || 0) + credit;
      }
    }
  }
  studentRecord.creditsPassed = Object.entries(creditMap).map(
    ([level, credits]) => ({
      module_level: level,
      credits_passed: credits,
    })
  );

  //  return the student record
  return studentRecord;
}

module.exports = { getStudentRecord };
