/**
 * Routes for handling CSV file uploads and processing student academic records.
 * Uses multer for in-memory file storage and csv-parser to read the uploaded file.
 * Handles:
 * - Uploading and parsing a CSV of student and module data
 * - Updating or inserting student, module, and student_module records
 *
 * @file routes/uploadHandler.js
 * @module routes/uploadHandler
 */
// routes/uploadHandler.js
const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const { Readable } = require("stream");

// required models
const massUploadHandlerModel = require("../models/massUploadHandlerModel");

const router = express.Router();

// Set up multer storage using a buffer instead of destination
const upload = multer({ storage: multer.memoryStorage() });

// Route: Handle CSV upload
router.post("/", upload.single("studentData"), (req, res) => {
  const results = [];

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const cleanedCSV = req.file.buffer.toString("utf8").replace(/^\uFEFF/, "");
    const stream = Readable.from([cleanedCSV]);

    stream
      .pipe(csv())
      .on("data", (row) => results.push(row))
      .on("end", async () => {
        res.setHeader("Content-Type", "application/json"); // optional but safe
        try {
          const processed = [];

          for (const record of results) {
            const { studentId, userId } =
              await massUploadHandlerModel.updateStudentFromRecord(record);
            const moduleId =
              await massUploadHandlerModel.updateModuleFromRecord(record);
            await massUploadHandlerModel.updateStudentModule({
              studentId,
              moduleId,
              record,
            });
            processed.push({ studentId, userId, moduleId });
          }
          console.log(processed);
          res.json({ processed });
        } catch (err) {
          console.error("Error processing CSV:", err);
          res.status(500).json({ error: "Error processing data." });
        }
      })
      .on("error", (err) => {
        console.error("CSV parsing error:", err);
        res.status(500).json({ error: "CSV parsing failed." });
      });
  } catch (err) {
    console.error("Unexpected server error:", err);
    res.status(500).json({ error: "Unexpected server error." });
  }
});

// student record details handler
router.post("/studentDataHandler", async (req, res) => {
  try {
    //get all existing student details
    const existingStudentDetails = await studentModel.getAllStudents();
    console.log("existing students", existingStudentDetails);
  } catch (err) {
    console.error("Failed to handle student details.", err);
  }
});

module.exports = router;
