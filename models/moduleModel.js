const connection = require('../config/config');

async function getAllModules() {
  try {
    const [modules] = await connection.query("SELECT * FROM `module`");

    return modules;

  }catch (err) {
    throw new Error("Failed to fetch modules");
  }
}



async function getModuleInfo(moduleId) {
    try {
      const [moduleInfo] = await connection.query(
        "SELECT * FROM `module` WHERE `module_id` = ?", [moduleId]);
      //  console.log("Module Info:", moduleInfo); // Debugging line
      return moduleInfo;
    } catch (err) {
      throw new Error("Failed to fetch module data");
    }
    
  }

  module.exports = {
    getAllModules,
    getModuleInfo
  };