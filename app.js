const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql");
const cTable = require("console.table");

//starts prompt for number of team members
//starts main prompt for team member
function promptUser() {
  return inquirer.prompt([
    {
      type: "input",
      message: "What is their name?",
      name: "name",
    },
    {
      type: "input",
      message: "What is their ID number?",
      name: "id",
    },
    {
      type: "input",
      message: "What is their email?",
      name: "email",
    },
    {
      type: "checkbox",
      message: "What is their role?",
      choices: ["Engineer", "Intern"],
      name: "role",
    },
  ]);
}
//specific prompt for engineer
//starts prompts and uses await to wait for response
async function initialize() {
  try {
    const managerResponse = await promptManager();
  } catch (error) {
    console.log(error);
  }
}
initialize();
