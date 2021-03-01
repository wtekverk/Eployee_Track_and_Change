//Dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');



var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: 'HobGoblin93',

    database: "employer_DB"
})

connection.connect(function (err) {
    console.log("Connected as id: " + connection.threadId);
    start();
})



const start = function () {
    inquirer.prompt({
            name: "start",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "Add departments, roles, or employees",
                "View  departments, roles, or employees",
                "Update departments, roles, or employees",
            ]
        })
        .then(function (response) {
            switch (response.start) {
                case "Add departments, roles, or employees":

                    inquirer
                        .prompt({
                            name: "add",
                            type: "rawlist",
                            message: "What would you like to add?",
                            choices: [
                                "Add department",
                                "Add role",
                                "Add employee",
                            ]
                        })
                        .then(function (response) {
                            switch (response.add) {
                                case "Add department":
                                    addDepartment();
                                    break;
                                case "Add role":
                                    addRole();
                                    break;
                                case "Add employee":
                                    addEmployee();
                                    break;
                            }
                        });
                    break;

                case "View  departments, roles, or employees":
                    inquirer
                        .prompt({
                            type: "rawlist",
                            message: "What would you like to view?",
                            choices: [
                                "View department",
                                "View role",
                                "View employee",
                            ],
                            name: "view",

                        })
                        .then(function (response) {
                            switch (response.view) {
                                case "View department":
                                    viewDepartment();
                                    break;
                                case "View role":
                                    viewRole();
                                    break;
                                case "View employee":
                                    viewEmployee();
                                    break;
                            }
                        });
                    break;

                case "Update departments, roles, or employees":
                    inquirer
                        .prompt({
                            name: "update",
                            type: "rawlist",
                            message: "What would you like to update?",
                            choices: [
                                "Update department",
                                "Update role",
                                "Update employee",
                            ]
                        })
                        .then(function (response) {
                            switch (response.update) {
                                case "Update department":
                                    updateDepartment();
                                    break;
                                case "Update role":
                                    updateRole();
                                    break;
                                case "Update employee":
                                    updateEmployee();
                                    break;
                            }
                        });
                    break;

            }
        });
}


function addDepartment() {
    inquirer
        .prompt({
            name: "departmentAdd",
            type: "input",
            message: "Please enter the new department.",
        })
        .then(function (response) {
            var query = "INSERT INTO department SET ?";
            console.log(response.departmentAdd);
            connection.query(query, {
                name: response.departmentAdd
            }, function (err, res) {
                if (err) throw err;

                //allow user to run another search if they want
                inquirer.prompt({
                        name: "returnToStart",
                        type: "confirm",
                        message: "Would you like to do another search?",
                    })
                    .then(function (response) {
                        if (response.returnToStart === true) {
                            start();
                        } else {
                            connection.end();
                            return;
                        }

                    })
            });
        })
};



function addRole() {
    inquirer.prompt([{
                type: "input",
                message: "Please enter the name of the new role.",
                name: "Title",

            },
            {
                type: "input",
                message: "Please enter the salary for the new role.",
                name: "Salary",

            },
            {
                type: "input",
                message: "Please enter the department ID for the new role.",
                name: "DeptId",

            }
        ])
        .then(function (response) {
            connection.query("INSERT INTO role SET ?", {
                    title: response.Title,
                    salary: response.Salary,
                    department_id: response.DeptId
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " role added!")

                    inquirer.prompt({
                            name: "returnToStart",
                            type: "confirm",
                            message: "Would you like to do another search?",
                        })
                        .then(function (response) {
                            if (response.returnToStart === true) {
                                start();
                            } else {
                                connection.end();
                                return;
                            }

                        })
                });
        })
}

function addEmployee() {
    inquirer
        .prompt([{
                type: "input",
                message: "Please enter new employee's first name",
                name: "first_name",
            },
            {
                type: "input",
                message: "Please enter new employee's last name",
                name: "last_name",

            },
            {
                type: "input",
                message: "Please enter the role ID for the new role.",
                name: "EmpRoleId",

            },
            {
                type: "input",
                message: "Please enter new employee's managers id (or NULL if no manager).",
                name: "empManager",

            }
        ])
        .then(function (response) {
            var query = "INSERT INTO employee SET ?";
            connection.query(query, {
                    first_name: response.first_name,
                    last_name: response.last_name,
                    role_id: response.EmpRoleId,
                    manager_id: Number(response.empManager)
                },
                function (err, res) {
                    if (err) throw err;

                    inquirer.prompt({
                            name: "returnToStart",
                            type: "confirm",
                            message: "Would you like to do another search?",
                        })
                        .then(function (response) {
                            if (response.returnToStart === true) {
                                start();
                            } else {
                                connection.end();
                                return;
                            }

                        })
                });
        })
}

function viewDepartment() {
    var query = "SELECT id, name FROM department";
    connection.query(query, function (err, res) {
        var tableObj = [];
        for (var i = 0; i < res.length; i++) {
            tableObj.push({
                ID: res[i].id,
                Name: res[i].name
            });
        };

        console.log(cTable.getTable(tableObj));

        inquirer.prompt({
                name: "returnToStart",
                type: "confirm",
                message: "Would you like another search?",
            })
            .then(function (response) {
                if (response.returnToStart === true) {
                    start();
                } else {
                    connection.end();
                    return;
                }

            })
    });
}

function viewRole() {
    var query = "SELECT id, title, salary, department_id FROM role";
    connection.query(query, function (err, res) {
        var tableObj = [];
        for (var i = 0; i < res.length; i++) {
            tableObj.push({
                ID: res[i].id,
                Title: res[i].title,
                Salary: res[i].salary,
                Department: res[i].department_id
            });
        }

        console.log(cTable.getTable(tableObj));

        inquirer.prompt({
                name: "returnToStart",
                type: "confirm",
                message: "Would you like another search?",
            })
            .then(function (response) {
                if (response.returnToStart === true) {
                    start();
                } else {
                    connection.end();
                    return;
                }

            })
    });
}

function viewEmployee() {

    var query = "SELECT id, first_name, last_name, role_id, manager_id FROM employee";
    tableObj = [];
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            tableObj.push({
                ID: res[i].id,
                First_name: res[i].first_name,
                Last_name: res[i].last_name,
                Role: res[i].role_id,
                Manager: res[i].manager_id
            });
        }

        console.log(cTable.getTable(tableObj));

        inquirer.prompt({
                name: "returnToStart",
                type: "confirm",
                message: "Would you like another search?",
            })
            .then(function (response) {
                if (response.returnToStart === true) {
                    start();
                } else {
                    connection.end();
                    return;
                }

            })
    });
}

function updateDepartment() {
    inquirer.prompt([{
                name: "departmentUpdate",
                type: "input",
                message: "Please enter department you wish to update.",
            },
            {
                name: "departmentNew",
                type: "input",
                message: "Please enter the updated department name.",
            }
        ])
        .then(function (response) {
            var query = "UPDATE department SET ? WHERE ?";
            console.log(response.departmentAdd);
            connection.query(query, [{
                    name: response.departmentNew
                },
                {
                    name: response.departmentUpdate
                }
            ], function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " department updated!")

                inquirer.prompt({
                        name: "returnToStart",
                        type: "confirm",
                        message: "Would you like another search?",
                    })
                    .then(function (response) {
                        if (response.returnToStart === true) {
                            start();
                        } else {
                            connection.end();
                            return;
                        }

                    })
            });
        })
}

function updateRole() {
    inquirer.prompt([{
                name: "roleUpdate",
                type: "input",
                message: "Please enter the role you wish to update.",
            },
            {
                name: "roleField",
                type: "rawlist",
                message: "Which field needs updating?",
                choices: ["title", "salary", "department_id"]
            },
            {
                name: "roleNew",
                type: "input",
                message: "Please enter the new value.",
            }
        ])
        .then(function (response) {
            console.log(response.roleField)
            var query = "UPDATE role SET ? WHERE ?";
            switch (response.roleField) {
                case "title":
                    connection.query(query, [{
                            title: response.roleNew
                        },
                        {
                            title: response.roleUpdate
                        }
                    ], function (err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + " role updated!")
                    });
                    break;

                case "salary":
                    connection.query(query, [{
                            salary: response.roleNew
                        },
                        {
                            title: response.roleUpdate
                        }
                    ], function (err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + " role updated!")
                    });
                    break;

                case "department_id":
                    connection.query(query, [{
                            department_id: response.roleNew
                        },
                        {
                            title: response.roleUpdate
                        }
                    ], function (err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + " role updated!")
                    });
                    break;
            }

            inquirer.prompt({
                    name: "returnToStart",
                    type: "confirm",
                    message: "Would you like another search?",
                })
                .then(function (response) {
                    if (response.returnToStart === true) {
                        start();
                    } else {
                        connection.end();
                        return;
                    }

                })
        });
}

function updateEmployee() {
    inquirer.prompt([{
                name: "employeeUpdate",
                type: "input",
                message: "Please enter the employee_id you wish to update.",
            },
            {
                name: "employeeField",
                type: "rawlist",
                message: "Which field needs updating?",
                choices: ["first_name", "last_name", "role_id", "manager_id"]
            },
            {
                name: "employeeNew",
                type: "input",
                message: "Please enter the new value.",
            }
        ])
        .then(function (response) {
            console.log(response.employeeField)
            var query = "UPDATE employee SET ? WHERE ?";
            switch (response.employeeField) {
                case "first_name":
                    connection.query(query, [{
                            first_name: response.employeeNew
                        },
                        {
                            id: response.employeeUpdate
                        }
                    ], function (err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + " employee updated!")
                    });
                    break;

                case "last_name":
                    connection.query(query, [{
                            last_name: response.employeeNew
                        },
                        {
                            id: response.employeeUpdate
                        }
                    ], function (err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + " employee updated!")
                    });
                    break;

                case "role_id":
                    connection.query(query, [{
                            role_id: response.employeeNew
                        },
                        {
                            id: response.employeeUpdate
                        }
                    ], function (err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + " employee updated!")
                    });
                    break;

                case "manager_id":
                    connection.query(query, [{
                            manager_id: response.employeeNew
                        },
                        {
                            id: response.employeeUpdate
                        }
                    ], function (err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + " employee updated!")
                    });
                    break;
            }

            inquirer.prompt({
                    name: "returnToStart",
                    type: "confirm",
                    message: "Would you like another search?",
                })
                .then(function (response) {
                    if (response.returnToStart === true) {
                        start();
                    } else {
                        connection.end();
                        return;
                    }

                })
        });
}