const express = require("express");
const router = express.Router();
const ejs = require("ejs");
const path = require("path");
const pdf = require("pdf-creator-node");
const fs = require("fs");

// models
const studentModel = require("../models/studentModel");
const studentRecordModel = require("../models/studentRecordModel");
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
          `student-summary-${studentId}.pdf`,
          (err) => {
            if (err) {
              console.error("Error downloading the file:", err);
            } else {
              // Clean up: optional - delete file after download
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

module.exports = router;
