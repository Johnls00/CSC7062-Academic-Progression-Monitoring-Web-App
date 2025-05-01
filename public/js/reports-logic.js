/**
 * Provides all interactive logic for the Reports dashboard, including:
 * - Loading and displaying degree program progression statistics.
 * - Loading pass/fail rates by program or module and visualizing with Chart.js.
 * - Handling dropdown interactions and chart rendering logic.
 *
 * @file public/js/reports-logic.js
 * @module reportsLogic
 * @description Manages all charting, dropdown selection, and fetch-driven reporting features for the admin Reports view.
 */
let selectedProgramId = null;
let selectedProgramName = null;
let selectedId = null;
let selectedName = null;
let modulesGroupedByLevel = {};
let selectedLevel = null;

async function loadDegreePrograms() {
  try {
    console.log("Fetching degree programs...");
    const results = await fetch("/reports/getDegreePrograms");
    const programs = await results.json();
    console.log("results", programs);

    const dropdownContent = document.getElementById(
      "progression-left-dropdown-content"
    );
    dropdownContent.innerHTML = "";

    programs.forEach((program) => {
      console.log("Creating item for:", program);
      const a = document.createElement("a");
      a.className = "dropdown-item";
      a.textContent = program.name;
      a.onclick = () => {
        document.getElementById(
          "progression-left-dropdown-button-text"
        ).textContent = program.name;
        selectedProgram(program.program_id, program.name);
      };
      dropdownContent.appendChild(a);
    });
  } catch (err) {
    console.error("Failed to load degree programs:", err);
  }
}

function selectedProgram(id, name) {
  selectedProgramId = id;
  selectedProgramName = name;
  loadProgressionStats(id);
}

async function loadProgressionStats(programId) {
  try {
    const response = await fetch(
      `/reports/getProgressionRatesByProgram/${programId}`
    );
    const data = await response.json();
    console.log(data);

    document.getElementById("Program-name").textContent = selectedProgramName;
    document.getElementById("total-enrolled").textContent = data.totalEnrolled;
    document.getElementById("level1-enrolled").textContent =
      data.levelStats["L1"].totalEnrolled + " / " + data.totalEnrolled;
    document.getElementById("level1-progressing").textContent =
      data.levelStats["L1"].progress +
      " / " +
      data.levelStats["L1"].totalEnrolled;
    document.getElementById("level1-not-progressing").textContent =
      data.levelStats["L1"].notProgress +
      " / " +
      data.levelStats["L1"].totalEnrolled;
    document.getElementById("level1-passing-percentage").textContent =
      Math.round(
        100 -
          (data.levelStats["L1"].notProgress /
            data.levelStats["L1"].totalEnrolled) *
            100
      ) + "%";
    document.getElementById("level2-enrolled").textContent =
      data.levelStats["L2"].totalEnrolled + " / " + data.totalEnrolled;
    document.getElementById("level2-progressing").textContent =
      data.levelStats["L2"].progress +
      " / " +
      data.levelStats["L2"].totalEnrolled;
    document.getElementById("level2-not-progressing").textContent =
      data.levelStats["L2"].notProgress +
      " / " +
      data.levelStats["L2"].totalEnrolled;
    document.getElementById("level2-passing-percentage").textContent =
      Math.round(
        100 -
          (data.levelStats["L2"].notProgress /
            data.levelStats["L2"].totalEnrolled) *
            100
      ) + "%";
    document.getElementById("null-data").textContent =
      data.levelStats["null"].totalEnrolled + " / " + data.totalEnrolled;
  } catch (err) {
    console.error("Failed to load progression stats", err);
  }
}

async function selectType(type) {
  try {
    const response = await fetch(`/reports/getOptions?type=${type}`);
    const data = await response.json();

    const rightDropdownContent = document.getElementById(
      "right-dropdown-content"
    );
    rightDropdownContent.innerHTML = "";

    data.forEach((option) => {
      const a = document.createElement("a");
      a.className = "dropdown-item";
      a.textContent = option.name || option.module_title;
      a.onclick = () => {
        const id = option.program_id || option.module_id;
        selectOption(id, a.textContent, type);
      };
      rightDropdownContent.appendChild(a);
    });

    document.getElementById(
      "right-dropdown-button-text"
    ).textContent = `Select ${type === "program" ? "Program" : "Module"}`;
  } catch (error) {
    console.error("Error loading options:", error);
  }
}

function selectOption(id, name, type) {
  selectedId = id;
  selectedName = name;
  selectedType = type;
  if (type === "program") {
    document.getElementById("progressionChartTitle").textContent = selectedName;
    document.getElementById("progressionChartSubtitle").textContent =
      "Pass and Fail Percentages Per Modules";
    loadModulesGroupedByLevel(selectedId);
  }
  if (type === "module") {
    document.getElementById("progressionChartTitle").textContent = selectedName;
    document.getElementById("progressionChartSubtitle").textContent =
      "Pass and Fail Percentages For Module";
    loadModuleResultsData(selectedId);
  } else {
    console.error("Error loading selection:", error);
  }
}

async function loadModulesGroupedByLevel(programId) {
  console.log("Loading modules for program:", programId);

  const response = await fetch(
    `/reports/getModuleResultsByProgram/${programId}`
  );

  const data = await response.json();

  console.log("Modules fetched:", data);

  // Group the modules by level
  modulesGroupedByLevel = {};

  data.forEach((module) => {
    const level = module.level;
    if (!modulesGroupedByLevel[level]) {
      modulesGroupedByLevel[level] = [];
    }
    modulesGroupedByLevel[level].push(module);
  });

  console.log(modulesGroupedByLevel);

  console.log("Grouped modules:", modulesGroupedByLevel);

  populateLevelDropdown(modulesGroupedByLevel);
}

function populateLevelDropdown(modulesGroupedByLevel) {
  const levelDropdown = document.getElementById("program-level-dropdown");
  levelDropdown.style.display = "block";
  levelDropdown.innerHTML = "";

  // Get the levels from the grouped data
  const levels = Object.keys(modulesGroupedByLevel);
  levels.forEach((level) => {
    const a = document.createElement("a");
    a.className = "dropdown-item";
    a.textContent = `Level ${level}`;
    a.onclick = () => {
      selectedLevel = level;
      drawChartForLevel(level);
    };
    levelDropdown.appendChild(a);
  });
}

function drawChartForLevel(level) {
  const modules = modulesGroupedByLevel[level];

  const labels = modules.map((m) => m.module_title);
  const passRates = modules.map((m) => m.pass_percentage);
  const failRates = modules.map((m) => m.fail_percentage);

  const ctx = document.getElementById("progressionRatesChart").getContext("2d");

  if (window.myChart) {
    window.myChart.destroy();
  }

  window.myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Pass %",
          data: passRates,
          backgroundColor: "green",
        },
        {
          label: "Fail %",
          data: failRates,
          backgroundColor: "red",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      scales: {
        y: {
          max: 100,
          beginAtZero: true,
        },
      },
    },
  });
}

async function loadModuleResultsData(moduleId) {
  console.log("Loading module results:", moduleId);

  const response = await fetch(`/reports/getModuleResults/${moduleId}`);

  const data = await response.json();

  console.log("Module fetched:", data);

  //generate chart
  drawChartForModule(data);
}

function drawChartForModule(moduleData) {
  const module = moduleData[0];

  const labels = ["Pass %", "Fail %"];
  const data = [module.pass_percentage, module.fail_percentage];

  const ctx = document.getElementById("progressionRatesChart");

  if (window.myChart) {
    window.myChart.destroy();
  }

  window.myChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Pass vs Fail",
          data: data,
          backgroundColor: ["green", "red"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

// Left Dropdown program selector
const progressionDegreeButton = document.getElementById(
  "progression-left-dropdown-button"
);
const progressionDegreeDropdown = document.getElementById(
  "progression-left-dropdown-wrapper"
);
const progressionDegreeDropdownContent = document.getElementById(
  "progression-left-dropdown-menu"
);

// Pass and fail rates dropdown
// Left Dropdown
const leftButton = document.querySelector(
  '[aria-controls="left-dropdown-menu"]'
);
const leftDropdown = document.getElementById("left-dropdown");
const leftDropdownContent = document.getElementById("left-dropdown-menu");

// Right Dropdown
const rightButton = document.querySelector(
  '[aria-controls="right-dropdown-menu"]'
);
const rightDropdown = document.getElementById("right-dropdown");
const rightDropdownContent = document.getElementById("right-dropdown-menu");

// Function to handle a dropdown
function setupDropdown(button, dropdown, menu) {
  let keepOpen = false;

  button.addEventListener("click", () => {
    dropdown.classList.toggle("is-active");
  });

  menu.addEventListener("mouseenter", () => {
    keepOpen = true;
  });

  menu.addEventListener("mouseleave", () => {
    keepOpen = false;
    dropdown.classList.remove("is-active");
  });

  button.addEventListener("mouseleave", () => {
    setTimeout(() => {
      if (!keepOpen) {
        dropdown.classList.remove("is-active");
      }
    }, 300);
  });
}

setupDropdown(
  progressionDegreeButton,
  progressionDegreeDropdown,
  progressionDegreeDropdownContent
);
setupDropdown(leftButton, leftDropdown, leftDropdownContent);
setupDropdown(rightButton, rightDropdown, rightDropdownContent);

document.addEventListener("DOMContentLoaded", () => {
  loadDegreePrograms();
});
