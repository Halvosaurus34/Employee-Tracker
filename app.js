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
    departmentChoices = [];
    for (let i = 0; i < result.length; i++) {
      if (depRes.departmentSearch == result[i].name) {
        // console.log("FOUND TABLE RESULT: ", result[i].name);
        let employeeSearch = orm.getEmployeeByDepartment(result[i].id);
        employeeSearch.then(function (result) {
          // console.log("Received table data...", result);
          console.table(result);
          initialize();
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
    console.log("MANAGER CHOICES ARRAY: ", departmentChoices);
    console.log("GETMANAGERS RESULT: ", result);
    const manRes = await managerPrompt();
    managerChoices = [];
    for (let i = 0; i < result.length; i++) {
      if (manRes.managerSearch == result[i].first_name) {
        console.log("FOUND TABLE RESULT: ", result[i].name);
        let employeeSearch = orm.getEmployeeByManager(result[i].id);
        employeeSearch.then(function (result) {
          // console.log("Received table data...", result);
          console.table(result);
          initialize();
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

function addEmployeePrompt() {
  return inquirer.prompt([
    {
      type: "input",
      message: "What is their first name?",
      name: "firstName",
    },
    {
      type: "input",
      message: "What is their last name?",
      name: "lastName",
    },
    {
      type: "checkbox",
      message: "What is their role?",
      name: "role",
      choices: [
        "Engineer",
        "Human Resources",
        "Accountant",
        "Manager",
        "Intern",
      ],
    },
    {
      type: "checkbox",
      message: "Who is their manager?",
      name: "manager",
      choices: managerChoices,
    },
  ]);
}

async function getManagerId(firstName) {
  const getManager = await orm.getManagerId(firstName);
  // console.log("MANAGER ID:", getManager);
  return getManager[0].id;
}

function removeEmployeePrompt() {
  return inquirer.prompt([
    {
      type: "input",
      message: "What is the id number of the employee you want to remove?",
      name: "employeeId",
    },
  ]);
}

function removeEmployeePrompt2(employee) {
  console.log("REMOVEEMPLOYEE: ", employee);
  return inquirer.prompt([
    {
      type: "checkbox",
      message: `Are you sure you want to delete ${employee[0].first_name} ${employee[0].last_name} from the employee database?`,
      name: "areYouSure",
      choices: ["Yes", "No"],
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
    } else if (initResp.initResponse == "Add employee") {
      const departmentData = orm.getDepartments();
      departmentData.then(async function (result) {
        // console.log("Received table data...", result);
        result.map((el) => departmentChoices.push(el.name));
      });
      const managerData = orm.getManager();
      managerData.then(async function (result) {
        // console.log("Received table data...", result);
        result.map((el) => managerChoices.push(el.first_name));
      });
      const addEmp = await addEmployeePrompt();

      const manId = await getManagerId(addEmp.manager);
      const getDepartment = await orm.getDepartmentId(addEmp.role);
      // console.log("GET DEPARTMENT: ", getDepartment);
      // console.log("MANID: ", manId);
      const addEmployee = orm.addEmployee(
        addEmp.firstName,
        addEmp.lastName,
        getDepartment[0].id,
        manId
      );
      console.log("Added Employee!");
      initialize();
    } else if (initResp.initResponse == "Remove employee") {
      const remEmp = await removeEmployeePrompt();
      const getEmp = await orm.getEmployee(remEmp.employeeId);
      const secondRemEmp = await removeEmployeePrompt2(getEmp);
      if (secondRemEmp.areYouSure == "Yes") {
        const delEmp = await orm.deleteEmployee(getEmp[0].id);
        initialize();
      } else {
        initialize();
      }
    }
  } catch (error) {
    console.log(error);
  }
}
initialize();
