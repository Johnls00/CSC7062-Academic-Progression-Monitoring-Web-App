const connection = require("../config/config");

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

//Get student data by `student_id`
async function getStudentBySId(studentId) {
  const [studentData] = await connection.query(
    "SELECT * FROM `student` WHERE `student_id` = ?",
    [studentId]
  );
  if (!studentData) {
    console.warn("No student found with user ID:", studentId);
    return res.status(404).send("Student not found");
  }

  if (studentData.length === 0) {
    return null; // No student found
  }
  return studentData; // Return the first student found
}

// Get courses by student ID
async function getCoursesByStudentId(studentId) {
  try {
    const [courses] = await connection.query(
      "SELECT * FROM `student_module` WHERE `student_id` = ?",
      [studentId]
    );
    return courses;
  } catch (err) {
    throw new Error("Failed to fetch courses data");
  }
}

// Get all students
async function getAllStudents() {
  try {
    const [students] = await connection.query("SELECT * FROM `student`");
    return students;
  } catch (err) {
    throw new Error("Failed to fetch students data");
  }
}

module.exports = {
  getStudentData,
  getStudentBySId,
  getCoursesByStudentId,
  getAllStudents,
};
