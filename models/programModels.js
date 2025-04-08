// File: models/programModels.js
const connection = require("../config/config");

async function getProgramInfo(programCode) {
  try {
    const [results] = await connection.query("SELECT * FROM `program` WHERE program_code = ?", [programCode]);
    return results;
  } catch (err) {
    throw new Error("Failed to fetch program data");
  }
}

async function getAllPrograms() {
  try {
    const [results] = await connection.query("SELECT * FROM `program`");
    return results;
  } catch (err) {
    throw new Error("Failed to fetch program data");
  }
}

module.exports = {
  getProgramInfo,
  getAllPrograms
};
