// File: models/programModels.js
// required models
const connection = require("../config/config");
const moduleModel = require("../models/moduleModel");

/**
 * Retrieves program details using the program code given.
 *
 * @function
 * @memberof module:programModel
 * @param {string} programCode - The code of the program to retrieve.
 * @returns {Promise<Array>} An array of program records.
 *
 * @throws Will throw an error if the query fails.
 */
async function getProgramInfo(programCode) {
  try {
    const [results] = await connection.query(
      "SELECT * FROM `program` WHERE program_code = ?",
      [programCode]
    );
    return results;
  } catch (err) {
    throw new Error("Failed to fetch program data");
  }
}

/**
 * Retrieves program details using the given program ID.
 *
 * @function
 * @memberof module:programModel
 * @param {number} programId - The ID of the program to retrieve.
 * @returns {Promise<Array>} An array of program records.
 *
 * @throws Will throw an error if the query fails.
 */
async function getProgramInfoWithProgramId(programId) {
  try {
    const [results] = await connection.query(
      "SELECT * FROM `program` WHERE program_id = ?",
      [programId]
    );
    return results;
  } catch (err) {
    throw new Error("Failed to fetch program data");
  }
}

/**
 * Retrieves all degree programs from the database.
 *
 * @function
 * @memberof module:programModel
 * @returns {Promise<Array>} An array of all program records.
 *
 * @throws Will throw an error if the query fails.
 */
async function getAllPrograms() {
  try {
    const [results] = await connection.query("SELECT * FROM `program`");
    return results;
  } catch (err) {
    throw new Error("Failed to fetch programs");
  }
}

/**
 * Retrieves all modules associated with a given program ID and attaches the module details.
 *
 * @function
 * @memberof module:programModel
 * @param {number} programCode - The ID of the program.
 * @returns {Promise<Array>} An array of enriched module details for the program.
 *
 * @throws Will throw an error if module or program data retrieval fails.
 */
async function getProgramModulesDetails(programCode) {
  try {
    const [programModules] = await connection.query(
      "SELECT * FROM `program_module` WHERE `program_id` = ?",
      programCode
    );

    for (let i = 0; i < programModules.length; i++) {
      const moduleId = programModules[i].module_id;
      const module_Info = await moduleModel.getModuleInfo(moduleId);

      if (module_Info && module_Info.length > 0) {
        programModules[i].module_id = module_Info[0].moduleId;
        programModules[i].subject_code = module_Info[0].subject_code;
        programModules[i].subject_catalog = module_Info[0].subject_catalog;
        programModules[i].module_title = module_Info[0].module_title;
        programModules[i].credit_value = module_Info[0].credit_value;
      } else {
        programModules[i].module_id = "Unknown";
        programModules[i].subject_code = "Unknown";
        programModules[i].subject_catalog = "Unknown";
        programModules[i].module_title = "Unknown";
        programModules[i].credit_value = "Unknown";
      }
    }

    return programModules;
  } catch (err) {
    throw new Error("Failed to fetch program module data");
  }
}

module.exports = {
  getProgramInfo,
  getProgramInfoWithProgramId,
  getAllPrograms,
  getProgramModulesDetails,
};
