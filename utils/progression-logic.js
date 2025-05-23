/**
 * Logic for evaluating academic progression based on a student's performance record.
 * Applies institutional rules including:
 * - Minimum credits passed at current level
 * - Minimum grades across all modules
 * - Completion of core modules
 * - Maximum allowed module attempts
 *
 * Returns a progression decision object with detailed reasoning and recommended actions.
 *
 * @file utils/progression-logic.js
 * @module utils/progressionLogic
 */
const { level } = require("npmlog");

/**
 * a function that will determine the progression decision for a student based on student record object gathered by studentRecordModel
 * @param {*} record - example student record =
 * student record {
  averageMark: '82.3333',
  averageMarkPerYear: [ { level: 'L1', avg_mark: '82.3333' } ],
  coreModulesPassed: 'N/A',
  studentLevel: 'L1',
  moduleAttempts: [
    { module_id: 110, attempt_count: '1' },
    { module_id: 111, attempt_count: '1' },
    { module_id: 112, attempt_count: '1' },
    { module_id: 114, attempt_count: '1' },
    { module_id: 139, attempt_count: '1' },
    { module_id: 115, attempt_count: '1' }
  ],
  modules: [
    { module_id: 110, result: 'pass', grade: 78 },
    { module_id: 111, result: 'pass', grade: 91 },
    { module_id: 112, result: 'pass', grade: 85 },
    { module_id: 114, result: 'pass', grade: 72 },
    { module_id: 139, result: 'pass', grade: 80 },
    { module_id: 115, result: 'pass', grade: 88 }
  ],
  creditsPassed: [ { module_level: 'L1', credits_passed: 120 } ]
}
 * @returns student progression object
 */
async function determineProgression(record) {
  // required models
  const moduleModel = require("../models/moduleModel");
  // constants for progression rules
  const MIN_L1_CREDITS_TO_PASS = 120;
  const MIN_CREDITS_TO_PASS = 100;
  const MIN_MARK_TO_PASS = 40;
  const MAX_MODULE_ATTEMPTS = 4;

  //progression object
  const progression = {
    canProgress: false,
    reason: [],
    resits: [],
    contactSupportOfficer: false,
    outcome: [],
  };
  try {
    if (record.modules.length === 0) {
      progression.reason.push("No module data for Student.");
      progression.outcome.push("Student cannot progress to next level.");
      console.log(progression); // debug line
      return progression;
    } else {
      const levelCredits = record.creditsPassed.find(
        (item) => item.module_level === record.studentLevel
      );
      console.log("level credits", levelCredits);

      // Progression rule 1 - Pass at least 100 credits
      if (levelCredits.credits_passed < MIN_CREDITS_TO_PASS && levelCredits) {
        progression.reason.push(
          "Insufficient credits achieved at " +
            record.studentLevel +
            ". (minimum " +
            MIN_CREDITS_TO_PASS +
            " required)"
        );
      }

      // Progression rule 2 - Achieve a minimum mark of 40% in all modules
      for (const module of record.modules) {
        if (module.grade != null && module.grade < MIN_MARK_TO_PASS) {
          const [moduleInfo] = await moduleModel.getModuleInfo(
            module.module_id
          );
          progression.resits.push(
            moduleInfo.subject_code + moduleInfo.subject_catalog
          );
          progression.reason.push(
            "Student must resit module " +
              moduleInfo.subject_code +
              moduleInfo.subject_catalog
          );
        }
      }

      // progression rule 3 - must pass all core modules
      if (record.coreModulesPassed === "0") {
        progression.reason.push("Core modules have not all been passed.");
      }

      // progression rule 4 - insure only four attempts to pass
      for (const moduleAttempts of record.moduleAttempts) {
        if (moduleAttempts.attempt_count >= MAX_MODULE_ATTEMPTS) {
          const moduleResult = modules.find(
            (module) => module.id === moduleAttempts.module_id
          );
          if (
            moduleResult.result === "fail" ||
            moduleResult.result === "absent"
          ) {
            const [moduleInfo] = await moduleModel.getModuleInfo(
              module.module_id
            );
            progression.contactSupportOfficer = true;
            progression.reason.push(
              "Max attempts reached for " +
                moduleInfo.subject_code +
                moduleInfo.subject_catalog
            );
          }
        }
      }

      //final progression decision
      if (progression.reason.length === 0) {
        progression.canProgress = true;
        progression.outcome.push("Progress to next level.");
      } else {
        if (progression.contactSupportOfficer === true) {
          progression.outcome.push(
            "Please contact your Student Support Officer."
          );
        } else {
          progression.outcome.push("Student cannot progress to next level.");
        }
      }
      console.log(progression); // debug line
      return progression;
    }
  } catch (error) {
    console.error("Error in determineProgression:", error);
    progression.reason.push(
      "An unexpected error occurred while evaluating progression please contact the admin for more details."
    );
    progression.outcome.push("Progression decision could not be determined.");
    return progression;
  }
}

module.exports = { determineProgression };
