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

function updateRolePrompt(getEmp) {
  console.log("Update Role:");
  const empList = getEmp.map((el) => el.first_name);
  console.log("EMP LIST:", empList);
  return inquirer.prompt([
    {
      type: "checkbox",
      message: `Which employee role do you want to update?`,
      name: "updateRole",
      choices: empList,
    },
  ]);
}

function updateRolePrompt2(promptData, roleData) {
  return inquirer.prompt([
    {
      type: "checkbox",
      message: `What do you want ${promptData.updateRole}'s role to be?`,
      name: "roleChoices",
      choices: roleData,
    },
  ]);
}

function updateManPrompt(empData, manData) {
  const empList = empData.map((el) => el.first_name);
  // const manList = manData.map((el) => el.first_name);
  console.log("EMP LIST: ", empList, "MAN LIST: ", manData);
  return inquirer.prompt([
    {
      type: "checkbox",
      message: `Which employee do you want to change manager?`,
      name: "empChoices",
      choices: empList,
    },
    {
      type: "checkbox",
      message: `Who do you want their manager to be?`,
      name: "manChoices",
      choices: manData,
    },
  ]);
}
async function initialize() {
  try {
    const initResp = await initialPrompt();
    // View all
    if (initResp.initResponse == "View all employees") {
      const data = orm.getEmployee();
      data.then(function (result) {
        // console.log("Received table data...", result);
        console.table(result);
      });
      initialize();
    }
    // View by departmnet
    else if (initResp.initResponse == "View employee by department") {
      const getDep = await getDepartments();
      // console.log("DEPARTMENT PROMPT RESULT: ", depRes);
    }
    // View by manager
    else if (initResp.initResponse == "View employee by manager") {
      const getDep = await getManager();
      // console.log("DEPARTMENT PROMPT RESULT: ", manRes);
    }
    // Add Employee
    else if (initResp.initResponse == "Add employee") {
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
    }
    // Remove Employee
    else if (initResp.initResponse == "Remove employee") {
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
    // Update employee role
    else if (initResp.initResponse == "Update employee role") {
      const getEmp = await orm.getEmployee();
      const getRole = await orm.getRole();
      const getRoleData = getRole.map((el) => el.title);
      const updateRoleEmp = await updateRolePrompt(getEmp);
      const secondRoleEmp = await updateRolePrompt2(updateRoleEmp, getRoleData);
      // console.log("role choice: ", secondRoleEmp.roleChoices);
      const roleId = getRole.filter(
        (el) => el.title == secondRoleEmp.roleChoices
      );
      // console.log("emp choice: ", updateRoleEmp.updateRole);
      const empId = getEmp.filter(
        (el) => el.first_name == updateRoleEmp.updateRole
      );
      // console.log("EMP ID: ", empId, "ROLE ID: ", roleId);
      const changeRole = await orm.updateRole(roleId[0].id, empId[0].id);
      // console.log("CHANGE ROLE: ", changeRole);
    }
    //Update employee manager
    else if (initResp.initResponse == "Update employee manager") {
      const getEmp = await orm.getEmployee();
      const getMan = await orm.getManager();
      console.log("GET MANAGER: ", getMan);
      const getManData = getMan.map((el) => el.first_name);
      const updateEmpMan = await updateManPrompt(getEmp, getManData);
      console.log(updateEmpMan.manChoices, updateEmpMan.empChoices);
      const empId = getEmp.filter(
        (el) => el.first_name == updateEmpMan.empChoices
      );
      const manId = getMan.filter(
        (el) => el.first_name == updateEmpMan.manChoices
      );
      console.log("EMP ID AND MAN ID:", empId, manId);
      const updateManager = await orm.updateManager(manId[0].id, empId[0].id);
      initialize();
    }
  } catch (error) {
    console.log(error);
  }
}
initialize();
