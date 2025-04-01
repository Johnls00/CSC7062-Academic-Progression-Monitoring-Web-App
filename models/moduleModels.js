const connection = require('../config/config');

async function getModuleInfo(studentId) {
    try {
      const query = "SELECT * FROM `module` WHERE ?";
      const results = await queryDatabase(query, [moduleId]);
      return results;
    } catch (err) {
      throw new Error("Failed to fetch module data");
    }
  }