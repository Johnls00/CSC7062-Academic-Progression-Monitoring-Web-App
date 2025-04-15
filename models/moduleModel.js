const connection = require("../config/config");

async function getAllModules() {
  try {
    const [modules] = await connection.query("SELECT * FROM `module`");

    return modules;
  } catch (err) {
    throw new Error("Failed to fetch modules");
  }
}

async function getModuleInfo(moduleId) {
  try {
    const [moduleInfo] = await connection.query(
      "SELECT * FROM `module` WHERE `module_id` = ?",
      [moduleId]
    );
    //  console.log("Module Info:", moduleInfo); // Debugging line
    return moduleInfo;
  } catch (err) {
    throw new Error("Failed to fetch module data");
  }
}

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
