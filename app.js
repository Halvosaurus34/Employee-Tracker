const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql");
const cTable = require("console.table");
const orm = require("./app/orm");

//starts prompt for number of team members
//starts main prompt for team member

let departmentChoices = [];
let managerChoices = [];

function initialPrompt() {
  return inquirer.prompt([
    {
      type: "checkbox",
      message: "What would you like to do?",
      name: "initResponse",
      choices: [
        "View all employees",
        "View employee by department",
        "View employee by manager",
        "Add employee",
        "Remove employee",
        "Update employee role",
        "Update employee manager",
        "View all roles",
        "Add role",
        "Remove role",
        "View all managers",
        "Add manager",
        "Remove manager",
      ],
    },
  ]);
}

function getDepartments() {
  const data = orm.getDepartments();
  data.then(async function (result) {
    // console.log("Received table data...", result);
    result.map((el) => departmentChoices.push(el.name));
    // console.log("DEPARTMENT CHOICES ARRAY: ", departmentChoices);
    // console.log("GETDEPARTMENTS RESULT: ", result);
    const depRes = await departmentPrompt();
    for (let i = 0; i < result.length; i++) {
      if (depRes.departmentSearch == result[i].name) {
        // console.log("FOUND TABLE RESULT: ", result[i].name);
        let employeeSearch = orm.getEmployeeByDepartment(result[i].id);
        employeeSearch.then(function (result) {
          // console.log("Received table data...", result);
          console.table(result);
        });
      }
    }
  });
}

function departmentPrompt() {
  return inquirer.prompt([
    {
      type: "checkbox",
      message: "Which department do you want to search?",
      name: "departmentSearch",
      choices: departmentChoices,
    },
  ]);
}

function getManager() {
  const data = orm.getManager();
  data.then(async function (result) {
    // console.log("Received table data...", result);
    result.map((el) => managerChoices.push(el.first_name));
    // console.log("DEPARTMENT CHOICES ARRAY: ", departmentChoices);
    // console.log("GETDEPARTMENTS RESULT: ", result);
    const manRes = await managerPrompt();
    for (let i = 0; i < result.length; i++) {
      if (manRes.managerSearch == result[i].name) {
        // console.log("FOUND TABLE RESULT: ", result[i].name);
        let employeeSearch = orm.getEmployeeByManager(result[i].id);
        employeeSearch.then(function (result) {
          // console.log("Received table data...", result);
          console.table(result);
        });
      }
    }
  });
}

function managerPrompt() {
  return inquirer.prompt([
    {
      type: "checkbox",
      message: "Which manager do you want to search?",
      name: "managerSearch",
      choices: managerChoices,
    },
  ]);
}

async function initialize() {
  try {
    const initResp = await initialPrompt();
    if (initResp.initResponse == "View all employees") {
      const data = orm.getEmployee();
      data.then(function (result) {
        // console.log("Received table data...", result);
        console.table(result);
      });
      initialize();
    } else if (initResp.initResponse == "View employee by department") {
      const getDep = await getDepartments();
      // console.log("DEPARTMENT PROMPT RESULT: ", depRes);
    } else if (initResp.initResponse == "View employee by manager") {
      const getDep = await getManager();
      // console.log("DEPARTMENT PROMPT RESULT: ", manRes);
    }
  } catch (error) {
    console.log(error);
  }
}
initialize();
