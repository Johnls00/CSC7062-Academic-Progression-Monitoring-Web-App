const connection = require('../config/config');

async function getProgramInfo(programId) {
    try {
      const query = "SELECT * FROM `program` WHERE ?";
      const results = await queryDatabase(query, [programId]);
      return results;
    } catch (err) {
      throw new Error("Failed to fetch module data");
    }
  }