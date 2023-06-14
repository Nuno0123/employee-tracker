const mysql = require("mysql2");
const dotenv = require("dotenv");
const { prompt } = require("inquirer");
require("console.table");
dotenv.config();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) throw err;
});

function startQuestions() {
  prompt([
    {
      type: "list",
      name: "Option",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Roles",
        "View All Departments",
        "Add Employee",
        "Remove Employee",
        "Add Role",
        "Remove Role",
        "Add Department",
        "Remove Department",
        "Exit",
      ],
    },

  ]).then((data) => {
    switch (data.Option) {
      case "View All Employees":
        viewAllEmployees();
        break;
      case "View All Roles":
        viewAllRoles();
        break;
      case "View All Departments":
        viewAllDepartments();
        break;
      case "Add Employee":
        addEmployee();
        break;
      case "Remove Employee":
        removeEmployee();
        break;  
      case "Add Role":
        addRole();
        break;
      case "Remove Role":
        removeRole();
        break;  
      case "Add Department":
        addDepartment();
        break; 
      case "Remove Department":
        removeDepartment();
        break;
      case "Exit":
        exit(); 
        break;      
    }
  });
}

