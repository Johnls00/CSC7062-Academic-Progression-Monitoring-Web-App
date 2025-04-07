const connection = require("../config/config");


//Get student user data by user ID
async function getStudentUserData(userId) {
  const [userData] = await connection.query(
    "SELECT * FROM `user` WHERE `user_id` = ?",
    [userId]
  );
  if (!userData) {
    console.warn("No student found with user ID:", userId);
    return res.status(404).send("Student not found");
  }

  if (userData.length === 0) {
    return null; // No student found
  }
  return userData; // Return the first student found
}

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
async function getStudentBySId(sId) {
  const [studentData] = await connection.query(
    "SELECT * FROM `student` WHERE `sId` = ?",
    [sId]
  );
  if (!studentData) {
    console.warn("No student found with user ID:", sId);
    return res.status(404).send("Student not found");
  }

  if (studentData.length === 0) {
    return null; // No student found
  }
  return studentData; // Return the first student found
}

// Get courses by student ID
async function getModulesByStudentId(studentId) {
  try {
    const [modules] = await connection.query(
      "SELECT * FROM `student_module` WHERE `student_id` = ?",
      [studentId]
    );
    return modules;
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
  getStudentUserData,
  getStudentData,
  getStudentBySId,
  getModulesByStudentId,
  getAllStudents,
};
