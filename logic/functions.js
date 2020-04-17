const connection = require('./connect');
const inquirer = require('inquirer');

const actionPrompt = [
    {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
            "View All Employees",
            "View All Employees by Department",
            "View All Departments",
            "View All Roles",
            "Add Employee",
            "Add Role",
            "Add Department",
            "Update Employee Role",
            "Exit"
        ]
    }
]

const func = {

    viewAll: () => {
        connection.query("SELECT employees.first_name, employees.last_name, roles.salary, roles.title, departments.department FROM employees LEFT JOIN roles ON roles.id = employees.role_id LEFT JOIN departments ON roles.department_id = departments.id", (err, res) => {
            if (err) throw err;
            console.table(res);
            func.main();
        })
    },

    viewByDept: () => {
        connection.query("SELECT employees.first_name, employees.last_name, roles.salary, roles.title, departments.department FROM employees LEFT JOIN roles ON roles.id = employees.role_id LEFT JOIN departments ON roles.department_id = departments.id ORDER BY departments.id", (err, res) => {
            if (err) throw err;
            console.table(res);
            func.main();
        })
    },
    viewDept: () => {
        connection.query("SELECT departments.department FROM departments", (err, res) => {
            if (err) throw err;
            console.table(res);
            func.main();
        })
    },
    viewRoles: () => {
        connection.query("SELECT roles.title FROM roles", (err, res) => {
            if (err) throw err;
            console.table(res);
            func.main();
        })
    },
    addDept: () => {
        inquirer.prompt([
            {
                type: "input",
                name: "dept_name",
                message: "Name of Department?"
             }
        ]).then(answers => {
            connection.query("INSERT INTO departments (department) VALUES (?);", [answers.dept_name], (err, res) => {
                if (err) throw err;
                console.log(res.affectedRows + " entries inserted");
                func.main();
            })
        })
    },
    addRole: () => {
        inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "Name of Role?"
            },
            {
                type: "input",
                name: "salary",
                message: "Salary?"
            }
        ]).then(({title, salary}) => {
            connection.query("SELECT * FROM departments", (err, res) => {
                if (err) throw err;
                const deptList = res.map(val => val.department);


                inquirer.prompt([
                    {
                        type: "list",
                        name: "department",
                        message: "Which Department?",
                        choices: deptList
                    }
                ]).then(({department}) => {
                    let department_id;

                    for (let i = 0; i < deptList.length; i++) {
                        if (deptList[i] === department) {
                            department_id = i + 1;
                        };
                    }
                    connection.query("INSERT INTO roles(title, salary, department_id) VALUES (?,?, ?)", [title, salary, department_id], (err, res) => {
                        if (err) throw err;
                        console.log(res.affectedRows + " entries inserted");
                        func.main();
                    })
                })
                

            })
        })
    },

    updateRole: () => {
        connection.query("SELECT * FROM employees", (err, res) => {
            if (err) throw err;
            let employeeList = res.map(val => {
                 return `${val.first_name} ${val.last_name}`
            });
            inquirer.prompt([{
                type: "list",
                name: "fullName",
                message: "Update which employee's role?",
                choices: employeeList
            }]).then(({fullName}) => {
                let employee_id;
                for (let i = 0; i < employeeList.length; i++) {
                    if (employeeList[i] == fullName) {
                        employee_id = i + 1;
                        break;
                    }  
                }
                console.log(employee_id);
                connection.query("SELECT * FROM roles", (err, res) => {
                    if (err) throw err;
                    let roleList = res.map(val => val.title);
                    inquirer.prompt([{
                        type: "list",
                        name: "role",
                        message: "What role?",
                        choices: roleList
                    }]).then (({role}) => {
                        let role_id;
                        for (let i = 0; i < roleList.length; i++) {
                            if (roleList[i] == role) {
                                role_id = i + 1;
                                break;
                            }
                        }
                        connection.query("UPDATE employees SET role_id = ? WHERE id = ?", [role_id, employee_id], (err,res) => {
                            if (err) throw err;
                            console.log(`updated ${res.affectedRows} entries`);
                            func.main();
                        })
                    })
                })
            })
        })
    },
    addEmployee: () => {
        inquirer.prompt([
            {
                type: "input",
                name: "first_name",
                message: "First Name?"
            },
            {
                type: "input",
                name: "last_name",
                message: "Last Name"
            }
        ]).then (
            ({first_name, last_name}) => {
                connection.query("SELECT * FROM roles", (err, res) => {
                    if (err) throw err;
                    roleList = res.map(val => val.title);
                    inquirer.prompt([{
                        type: "list",
                        name: "role",
                        message: "What is the employee's title?",
                        choices: roleList
                    }])
                    .then (({role}) => {
                        let role_id;
                        for (let i = 0; i < roleList.length; i++) {
                            if (roleList[i] === role) {
                                role_id = i + 1;
                            }
                        }
                        connection.query("INSERT INTO employees(first_name, last_name, role_id) VALUES (?, ?, ?)", [first_name, last_name, role_id], (err, res) => {
                            if (err) throw err;
                            console.log(res.affectedRows + " Entries inserted.");
                            func.main();
                        })
                    }

                    )

                })
            }
        )
    },

    main: () => {
        inquirer.prompt(actionPrompt).then(({action}) => {
            switch (action) {
                case "View All Employees":
                    func.viewAll();
                    break;
                case "View All Employees by Department":
                    func.viewByDept();
                    break;
                case "View All Departments":
                    func.viewDept();
                    break;
                case "View All Roles":
                    func.viewRoles();
                    break;
                case "Add Employee":
                    func.addEmployee();
                    break;
                case "Add Role":
                    func.addRole();
                    break;
                case "Add Department":
                    func.addDept();
                    break;
                case "Update Employee Role":
                    func.updateRole();
                    break;
                case "Exit":
                    process.exit();
            }
        })
        }


}

module.exports = func;