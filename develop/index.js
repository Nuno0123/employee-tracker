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

function viewAllEmployees() {
    const data = connection.promise().query("SELECT * FROM employee");
    data.then(([data]) => {
      console.table(data);
      startQuestions();
    });
  }

  function viewAllRoles() {
    const data = connection.promise().query("SELECT * FROM role");
    data.then(([data]) => {
      console.table(data);
      startQuestions();
    });
}

function addEmployee() {
    prompt([
      { name: "firstName", message: "What is the employee`s first name?" },
      { name: "lastName", message: "What is the employee`s last name?" },
    ]).then(({firstName, lastName}) => {
      const roleData =connection.promise().query('SELECT * FROM role')
      roleData.then(([data]) => {
          const roleChoices = data.map(({id, title }) => ({
              name: title,
              value: id
          }))
  
          
          prompt({
              type: 'list',
              name: 'selectedRole',
              message:'What is their role?',
              choices: roleChoices
          }).then(res => {
             const roleId = res.selectedRole;
          const managerData = connection.promise().query('SELECT * FROM employee');
          managerData.then(([data]) => {
            const managerChoices = data.map(({id, first_name, last_name}) => ({
              name: `${first_name} ${last_name}`,
              value: id,
            }));
            managerChoices.unshift({name: 'None', value: null});
  
            prompt({
              type: 'list',
              name: 'selectedManager',
              message: 'Who is their manager? (you must select one)',
              choices: managerChoices,
            }).then(managerRes => {
              const managerId = managerRes.selectedManager;
              const query = connection.promise().query(
                'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
                [firstName, lastName, roleId, managerId],
              );
              query.then(() => {
                console.log('Employee entered successfully.');
                startQuestions();
              });
            });
          });
        });
      });
    });
}


  




