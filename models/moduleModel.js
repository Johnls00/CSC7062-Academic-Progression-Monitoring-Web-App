// models/moduleModel.js
// required models
const connection = require("../config/config");

/**
 * Retrieves all modules from the database.
 *
 * @function
 * @memberof module:moduleModel
 * @returns {Promise<Array>} An array of module objects.
 *
 * @throws Will throw an error if the query fails.
 */
async function getAllModules() {
  try {
    const [modules] = await connection.query("SELECT * FROM `module`");

    return modules;
  } catch (err) {
    throw new Error("Failed to fetch modules");
  }
}

/**
 * Retrieves information for a specific module by its ID.
 *
 * @function
 * @memberof module:moduleModel
 * @param {number} moduleId - The ID of the module to retrieve.
 * @returns {Promise<Array>} An array containing the module information.
 *
 * @throws Will throw an error if the query fails.
 */
async function getModuleInfo(moduleId) {
  try {
    const [moduleInfo] = await connection.query(
      "SELECT * FROM `module` WHERE `module_id` = ?",
      [moduleId]
    );
    return moduleInfo;
  } catch (err) {
    throw new Error("Failed to fetch module data");
  }
}

/**
 * Retrieves a module by its title.
 *
 * @function
 * @memberof module:moduleModel
 * @param {string} moduleTitle - The title of the module to retrieve.
 * @returns {Promise<Array>} An array containing the module information.
 *
 * @throws Will throw an error if the query fails.
 */
async function getModuleWithModuleTitle(moduleTitle) {
  try {
    const [moduleInfo] = await connection.query(
      "SELECT * FROM `module` WHERE `module_title` = ?",
      [moduleTitle]
    );
    return moduleInfo;
  } catch (err) {
    throw new Error("Failed to fetch module data");
  }
}

/**
 * Creates a new module entry in the database.
 *
 * @function
 * @memberof module:moduleModel
 * @param {Object} param0 - Object containing subject code, catalog, title, and credit count.
 * @param {string} param0.subjCode - Subject code of the module.
 * @param {string} param0.subjCatalog - Subject catalog number of the module.
 * @param {string} param0.moduleTitle - Title of the module.
 * @param {number} param0.creditCount - Number of credits assigned to the module.
 * @returns {Promise<number>} The ID of the newly created module.
 *
 * @throws Will throw an error if creation fails.
 */
async function createModule({subjCode, subjCatalog, moduleTitle, creditCount}) {
  try {
    const [newModule] = await connection.query(
      "INSERT INTO `module`(`subject_code`, `subject_catalog`, `module_title`, `credit_value`) VALUES (?,?,?,?)",
      [subjCode, subjCatalog, moduleTitle, creditCount]);
    return newModule.module_id;
  } catch (err) {
    throw new Error("Failed to create module " + err.message);
  }
}

module.exports = {
  getAllModules,
  getModuleInfo,
  getModuleWithModuleTitle,
  createModule,
};
