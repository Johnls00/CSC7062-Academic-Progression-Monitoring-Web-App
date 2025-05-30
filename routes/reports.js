/**
 * Defines routes for generating student academic reports and progression analytics.
 * Handles:
 * - Generating and downloading PDF summary reports for individual students
 * - Fetching program progression data (enrollment and advancement)
 * - Retrieving pass/fail statistics by module or program
 * - Providing available options for charts and reports
 *
 * @file routes/reports.js
 * @module routes/reports
 */
// routes/reports.js
const express = require("express");
const router = express.Router();
const ejs = require("ejs");
const path = require("path");
const pdf = require("pdf-creator-node");
const fs = require("fs");

// models
const studentModel = require("../models/studentModel");
const studentRecordModel = require("../models/studentRecordModel");
const programModel = require("../models/programModels");
const moduleModel = require("../models/moduleModel");
const connection = require("../config/config");
// scripts
const { determineProgression } = require("../utils/progression-logic");

router.get("/generateReport/studentSummary/:id", async (req, res) => {
  try {
    // student id set to fetch data for report
    const studentId = req.params.id;
    //fetching student data to fill report
    const student = await studentModel.getStudentBySId(studentId);
    const studentWithProgramDetails = await studentModel.attachProgramDetails(
      student
    );
    const userData = await studentModel.getStudentUserData(student[0].user_id);
    const moduleData = await studentModel.getModulesByStudentId(
      student[0].student_id
    );
    const studentRecord = await studentRecordModel.getStudentRecord(
      studentWithProgramDetails
    );
    const studentProgression = await determineProgression(studentRecord);
    // data object to fill report
    const data = {
      student: studentWithProgramDetails[0],
      userData: userData[0],
      moduleData: moduleData,
      studentRecord: studentRecord,
      studentProgression: studentProgression,
      dateGenerated: new Date().toLocaleDateString(),
    };

    // Render EJS into HTML
    const html = await ejs.renderFile(
      path.join(__dirname, "../views/report-templates/student-summary.ejs"),
      data,
      { async: true }
    );
    // document set up
    const document = {
      html: html,
      data: {},
      path: "./generated-reports/student-summary.pdf",
      type: "",
    };
    // document formating
    const options = {
      format: "A4",
      orientation: "portrait",
      border: "5mm",
      timeout: 30000,
      header: {},
      footer: {
        height: "15mm",
        contents: {
          default:
            '<div style="text-align: center; font-size: 8px;">Page {{page}} of {{pages}}</div>',
        },
      },
    };
    //  create and download the report
    pdf
      .create(document, options)
      .then((result) => {
        res.download(
          result.filename,
          `Student-Summary-${studentId}.pdf`,
          (err) => {
            if (err) {
              console.error("Error downloading the file:", err);
            } else {
              fs.unlink(result.filename, (err) => {
                if (err) console.error("Failed to delete temp pdf:", err);
              });
            }
          }
        );
      })
      .catch((error) => {
        console.error("PDF creation error:", error);
        res.status(500).send("Failed to create PDF");
      });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).send("Failed to generate report");
  }
});

router.get('/getDegreePrograms', async (req, res) => {
  try {
    const programs = await programModel.getAllPrograms();
    res.json(programs);
  } catch (err) {
    console.error('Error in /getDegreePrograms:', err);
    res.status(500).send('Server error while fetching programs');
  }
});

router.get("/getProgressionRatesByProgram/:id", async (req, res) => {
  try {
    // program details fetch 
    const programId = req.params.id;
    console.log("programs id ", programId);
    const programDetails = await programModel.getProgramInfoWithProgramId(programId);

    const programCode = programDetails[0].program_code;
    console.log("program code ", programCode);
    // get students enrolled on program 
    const programEnrolledStudents = await studentModel.getStudentByProgramCode(
      programCode
    );

    let enrolledStudentsProgression = [];
    // get student progression and record for each student 
    for (const student of programEnrolledStudents) {
      student.program_id = programId;
      const studentRecord = await studentRecordModel.getStudentRecord(
        [student]
      );
      const studentProgression = await determineProgression(studentRecord);

      enrolledStudentsProgression.push({
        studentId: student.student_id,
        record: studentRecord,
        progression: studentProgression,
      });
    }

    console.log("enrolledStudentsProgression", enrolledStudentsProgression);

    // get student progresion details for the degree program 
    const totalEnrolled = enrolledStudentsProgression.length;
    const levelStats = {};

    // count the student progressing and no progressing per level
    for (const student of enrolledStudentsProgression) {
      const level = student.record.studentLevel;
      console.log("student level: ", level);

      if (!levelStats[level]) {
        levelStats[level] = {
          totalEnrolled: 0,
          progress: 0,
          notProgress: 0,
        };
      }

      levelStats[level].totalEnrolled += 1;
      if (student.progression.canProgress === true) {
        console.log("student can progress ", student.progression.canProgress);
        levelStats[level].progress += 1;
      } else {
        levelStats[level].notProgress += 1;
        console.log("student can progress ", student.progression.canProgress);
      }
    }

    res.json({
      totalEnrolled,
      levelStats,
    });


  } catch (err) {
    console.error("Failed to get students for degree Program:", err);
    res
      .status(500)
      .json({ message: "Failed to get students for degree Program" });
  }
});

// chart type option getter
router.get("/getOptions", async (req, res) => {
  const type = req.query.type;

  try {
    let data;
    if (type === "program") {
      data = await programModel.getAllPrograms();
    } else if (type === "module") {
      data = await moduleModel.getAllModules();
    } else {
      return res.status(400).json({ message: "Invalid type" });
    }

    res.json(data);
  } catch (error) {
    console.error("Error fetching options:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/getModuleResultsByProgram/:id", async (req, res) => {
  const programId = req.params.id;

  try {
    const [programModuleResults] = await connection.query(
      `SELECT 
  pm.level,
  m.module_id,
  m.module_title,
  SUM(CASE WHEN sm.grade_result = 'pass' THEN 1 ELSE 0 END) +
  SUM(CASE WHEN sm.resit_result = 'pass' THEN 1 ELSE 0 END) AS pass_count,
  SUM(CASE WHEN sm.grade_result = 'fail' THEN 1 ELSE 0 END) +
  SUM(CASE WHEN sm.resit_result = 'fail' THEN 1 ELSE 0 END) AS fail_count,
  ROUND(
    ( (SUM(CASE WHEN sm.grade_result = 'pass' THEN 1 ELSE 0 END) +
       SUM(CASE WHEN sm.resit_result = 'pass' THEN 1 ELSE 0 END)
      ) /
      (
       (SUM(CASE WHEN sm.grade_result = 'pass' THEN 1 ELSE 0 END) +
        SUM(CASE WHEN sm.resit_result = 'pass' THEN 1 ELSE 0 END)) +
       (SUM(CASE WHEN sm.grade_result = 'fail' THEN 1 ELSE 0 END) +
        SUM(CASE WHEN sm.resit_result = 'fail' THEN 1 ELSE 0 END))
      )
    ) * 100, 2
  ) AS pass_percentage,
  ROUND(
    ( (SUM(CASE WHEN sm.grade_result = 'fail' THEN 1 ELSE 0 END) +
       SUM(CASE WHEN sm.resit_result = 'fail' THEN 1 ELSE 0 END)
      ) /
      (
       (SUM(CASE WHEN sm.grade_result = 'pass' THEN 1 ELSE 0 END) +
        SUM(CASE WHEN sm.resit_result = 'pass' THEN 1 ELSE 0 END)) +
       (SUM(CASE WHEN sm.grade_result = 'fail' THEN 1 ELSE 0 END) +
        SUM(CASE WHEN sm.resit_result = 'fail' THEN 1 ELSE 0 END))
      )
    ) * 100, 2
  ) AS fail_percentage
FROM
  program_module pm
JOIN
  module m ON pm.module_id = m.module_id
JOIN
  student_module sm ON sm.module_id = m.module_id
WHERE
  pm.program_id = ?
GROUP BY
  pm.level, m.module_id, m.module_title
ORDER BY
  pm.level ASC, m.module_title ASC;`,
      [programId]
    );

    res.json(programModuleResults);
  } catch (error) {
    console.error("Error fetching modules:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/getModuleResults/:id", async (req, res) => {
  const moduleId = req.params.id;

  try {
    const [ModuleResult] = await connection.query(
      `
      SELECT 
  m.module_id,
  m.module_title,
  SUM(CASE WHEN sm.grade_result = 'pass' THEN 1 ELSE 0 END) +
  SUM(CASE WHEN sm.resit_result = 'pass' THEN 1 ELSE 0 END) AS pass_count,
  SUM(CASE WHEN sm.grade_result = 'fail' THEN 1 ELSE 0 END) +
  SUM(CASE WHEN sm.resit_result = 'fail' THEN 1 ELSE 0 END) AS fail_count,
  ROUND(
    (
      (
        SUM(CASE WHEN sm.grade_result = 'pass' THEN 1 ELSE 0 END) +
        SUM(CASE WHEN sm.resit_result = 'pass' THEN 1 ELSE 0 END)
      ) /
      NULLIF(
        (
          SUM(CASE WHEN sm.grade_result = 'pass' THEN 1 ELSE 0 END) +
          SUM(CASE WHEN sm.resit_result = 'pass' THEN 1 ELSE 0 END) +
          SUM(CASE WHEN sm.grade_result = 'fail' THEN 1 ELSE 0 END) +
          SUM(CASE WHEN sm.resit_result = 'fail' THEN 1 ELSE 0 END)
        ),
        0
      )
    ) * 100, 2
  ) AS pass_percentage,
  ROUND(
    (
      (
        SUM(CASE WHEN sm.grade_result = 'fail' THEN 1 ELSE 0 END) +
        SUM(CASE WHEN sm.resit_result = 'fail' THEN 1 ELSE 0 END)
      ) /
      NULLIF(
        (
          SUM(CASE WHEN sm.grade_result = 'pass' THEN 1 ELSE 0 END) +
          SUM(CASE WHEN sm.resit_result = 'pass' THEN 1 ELSE 0 END) +
          SUM(CASE WHEN sm.grade_result = 'fail' THEN 1 ELSE 0 END) +
          SUM(CASE WHEN sm.resit_result = 'fail' THEN 1 ELSE 0 END)
        ),
        0
      )
    ) * 100, 2
  ) AS fail_percentage
FROM
  student_module sm
JOIN
  module m ON sm.module_id = m.module_id
WHERE
  sm.module_id = ?
`,
      [moduleId]
    );

    res.json(ModuleResult);
  } catch (error) {
    console.error("Error fetching modules:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
