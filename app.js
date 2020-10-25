const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql");
const cTable = require("console.table");
const orm = require("./app/orm");
//starts prompt for number of team members
//starts main prompt for team member

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

//specific prompt for engineer
//starts prompts and uses await to wait for response
async function initialize() {
  try {
    const initResp = await initialPrompt();
    if (initResp.initResponse === "View all employees") {
      console.log("BANG");
      orm.getEmployee();
    }
  } catch (error) {
    console.log(error);
  }
}
initialize();
