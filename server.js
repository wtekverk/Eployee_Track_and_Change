//Dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');


//connection information for MySQL
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",

    //your password here
    password: 'HobGoblin93',

    //make sure to run the schema.sql in workbench
    database: "employer_DB"
})

//connection function for MySQL
connection.connect(function (err) {
    console.log("Connected as id: " + connection.threadId);
    start();
})


//start function runs FIRST after node server.js
const start = function () {
    //connecting to inquirer 
    inquirer.prompt({
            //first question
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
            //once choice is picked which rout to take 
            switch (response.start) {
                //if add is chosen 
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

                        //depending on the choice which function will run 
                        .then(function (response) {
                            switch (response.add) {
                                //which add function will run
                                case "Add department":
                                    addDept();
                                    break;
                                case "Add role":
                                    addRole();
                                    break;
                                case "Add employee":
                                    addEmp();
                                    break;
                            }
                        });
                    break;

                    //if view is chosen 
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

                        //depending on the choice which function will run 
                        .then(function (response) {
                            switch (response.view) {
                                //which view function will run
                                case "View department":
                                    viewDept();
                                    break;
                                case "View role":
                                    viewRole();
                                    break;
                                case "View employee":
                                    vieEmp();
                                    break;
                            }
                        });
                    break;

                    //if update is chosen
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

                        //depending on the choice which function will run 
                        .then(function (response) {
                            switch (response.update) {
                                //which update function will run 
                                case "Update department":
                                    updateDept();
                                    break;
                                case "Update role":
                                    updateRole();
                                    break;
                                case "Update employee":
                                    updateEmp();
                                    break;
                            }
                        });
                    break;

            }
        });
}



//* ADD FUNCTIONS */

//function that adds NEW department information
function addDept() {
    //new department name 
    inquirer.prompt({
            name: "departmentAdd",
            type: "input",
            message: "Please enter the new department.",
        })
        //then insert that name to the sql 
        .then(function (response) {
            var query = "INSERT INTO department SET ?";
            console.log(response.departmentAdd);
            connection.query(query, {
                name: response.departmentAdd
            }, function (err, res) {
                if (err) throw err;

                //after they have added new information start over or stop 
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

//function that adds NEW role information
function addRole() {

    //collect information for new role 
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
            //insert new role into database 
            connection.query("INSERT INTO role SET ?", {
                    title: response.Title,
                    salary: response.Salary,
                    department_id: response.DeptId
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " role added!")

                    //after they have added new information start over or stop 
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

//function that adds NEW employee information
function addEmp() {

    //prompts for new employee information 
    inquirer.prompt([{
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

        //add information for new employee into database 
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

                    //after they have added new information start over or stop
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

//* VIEW FUNCTIONS */

//function that displays department info in a table using console table
function viewDept() {
    var query = "SELECT id, name FROM department";
    connection.query(query, function (err, res) {

        //display the databases information using console.table
        console.table(res)

        //after they have added new information start over or stop
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

//function that displays role info in a table using console table
function viewRole() {
    var query = "SELECT id, title, salary, department_id FROM role";
    connection.query(query, function (err, res) {

        //display the databases information using console.table
        console.table(res);

        //after they have added new information start over or stop
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

//function that displays employee info in a table using console table
function vieEmp() {

    var query = "SELECT id, first_name, last_name, role_id, manager_id FROM employee";

    connection.query(query, function (err, res) {

        //display the databases information using console.table
        console.table(res);

        //after they have added new information start over or stop
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

//* UPDATE FUNCTIONS */

//function that updates an existing department 
function updateDept() {

    //prompts to get info for updating a department
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
            //changing department info in database 
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

                //after they have added new information start over or stop
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

//function that updates an existing role 
function updateRole() {
    //adding prompts for updating role 
    inquirer.prompt([{
                name: "roleUpdate",
                type: "input",
                message: "Please enter the role you wish to update.",
            },
            {

                //which information is being updated 
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
            //updating role in database 
            console.log(response.roleField)
            var query = "UPDATE role SET ? WHERE ?";
            switch (response.roleField) {
                case "title":

                    //updating title 
                    connection.query(query, [{
                            title: response.roleNew
                        },
                        {
                            title: response.roleUpdate
                        }
                    ], function (err, res) {
                        if (err) throw err;

                    });
                    break;


                case "salary":

                    //updating salary information
                    connection.query(query, [{
                            salary: response.roleNew
                        },
                        {
                            title: response.roleUpdate
                        }
                    ], function (err, res) {
                        if (err) throw err;

                    });
                    break;

                case "department_id":

                    //updating department info
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

            //after they have added new information start over or stop
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

//function that updates an existing employee 
function updateEmp() {

    //prompts to update an employee 
    inquirer.prompt([{
                name: "employeeUpdate",
                type: "input",
                message: "Please enter the employee_id you wish to update.",
            },
            {
                //which field is being updated 
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
            //adding updated information to the database 
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

            //after they have added new information start over or stop
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
        })
}