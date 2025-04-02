// File: models/programModels.js
const connection = require("../config/config");

async function getProgramInfo(programCode) {
  try {
    console.log("inside getProgramInfo"); // Debugging line
    console.log("Fetching program info for code:", programCode); // Debugging line

    const [results] = await connection.query("SELECT * FROM `program` WHERE program_code = ?", [programCode]);
    return results;
  } catch (err) {
    throw new Error("Failed to fetch program data");
  }
}

module.exports = {
  getProgramInfo,
};
