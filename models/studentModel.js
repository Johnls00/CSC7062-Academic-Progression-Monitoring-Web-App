const connection = require('../config/config');

// Utility to execute a query and return a promise
// function queryDatabase(query, params = []) {
//     return new Promise((resolve, reject) => {
//       connection.query(query, params, (err, results) => {
//         if (err) {
//           console.error("Database Query Error:", err);
//           return reject(err);
//         }
//         resolve(results);
//       });
//     });
//   }



  
  // Get student data by user ID
  // async function getStudentData(userId) {
  //   try {
  //     const query = "SELECT * FROM `student` WHERE `user_id` = ?";
  //     const results = await queryDatabase(query, [userId]);
  //     return results.length ? results[0] : null;
  //   } catch (err) {
  //     throw new Error("Failed to fetch student data");
  //   }
  // }

  //Get student data by user ID
  async function getStudentData(userId) {
    const studentData = await connection.query(
      "SELECT * FROM `student` WHERE `user_id` = ?",
      [userId]
    );
    if (studentData.length === 0) {
      return null; // No student found
    }
    return studentData[0]; // Return the first student found
  }

  // Get courses by student ID
  async function getCoursesByStudentId(studentId) {
    try {
      const query = "SELECT * FROM `student_module` WHERE `student_id` = ?";
      const results = await queryDatabase(query, [studentId]);
      return results;
    } catch (err) {
      throw new Error("Failed to fetch courses data");
    }
  }
  
  module.exports = {
    getStudentData,
    getCoursesByStudentId
  };