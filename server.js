// dependencies
const inquirer = require('inquirer');
const { title } = require('process');
const db = require('./db/connection');

// start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database is connected');
    employeeTracker();
});

async function employeeTracker (){
    response = await inquirer.prompt([
        {
            // main purposes for users to choose
            type: 'list',
            name: 'request',
            message: 'What would you like to do?',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role', 'Quit']
        }
    ])

    // show department table
    if (response.request === 'View All Departments') {
        db.query(`SELECT * FROM department`, (err, result) => {
            if (err) throw err;
            console.log("View All Departments: ");
            console.table(result);
            employeeTracker();
        })
    };

    // show role table
    if(response.request === 'View All Roles'){
        db.query(`SELECT * FROM role`, (err, result)=>{
            if (err) throw err;
            console.log("View All Roles: ");
            console.table(result);
            employeeTracker();
        })
    };


    // show employee table
    if(response.request === 'View All Employees'){
        db.query(`SELECT * FROM employee`, (err, result)=>{
            if (err) throw err;
            console.log("View All Employees: ");
            console.table(result);
            employeeTracker();
        })
    };

    // add a department
    if(response.request === 'Add A Department'){
        inquirer.prompt([
            {
                type: 'input',
                name: 'department',
                message: 'Please enter the department name:',
                validate: departmentInput => {
                    if (departmentInput) {
                        return true;
                    } else {
                        console.log('Please add a department.')
                        return false;
                    }
                }
            }
        ]).then((answers) => {
            db.query(`INSERT INTO department (name) VALUES (?)`, [answers.department], (err, result) => {
                if (err) throw err;
                console.log(`${answers.department} is added to the database.`);
                employeeTracker();
            })
        })
    };

    // add a role
    if(response.request === 'Add A Role'){
        // beginning with department database, so users can choose department later
        const departments = [];
        db.query(`SELECT * FROM department`, (err, DepResult)=>{
            if (err) throw err;

            DepResult.forEach( dep=>{
                let depObject = {
                    name: dep.name,
                    value: dep.id
                };
                departments.push(depObject);
            })

            inquirer.prompt([
                { 
                    // input the name of the role
                    type: 'input',
                    name: 'role',
                    message: 'Please enter the name of the role:',
                    validate: roleInput =>{
                        if (roleInput) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                },
                {
                    // input the salary of the role
                    type: 'input',
                    name: 'salary',
                    message: 'Please enter the salary of this role:',
                    validate: salaryInput =>{
                        if (salaryInput) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                },
                {
                    // choose the department that the role belongs to
                    type: 'list',
                    name: 'roleDepartment',
                    choices: departments,
                    message: 'Please choose the department that this role belongs to:'
                }
            ]).then((answers)=>{
                db.query(`INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`, [answers.role, answers.salary, answers.roleDepartment],(err, result)=>{
                    if (err) throw err;
                    console.log(`${answers.role} with id ${result.insertId} is added to the database.`);
                    employeeTracker();
                });
            });
        });
    };

    if (response.request === 'Add An Employee'){
        // get all employee database, so users can choose later
        db.query(`SELECT * FROM employee`, (err, eeResult)=>{
            if (err) throw err;
            const employees=[
                {
                    name: 'None',
                    value: 0
                }
            ];
            eeResult.forEach(({ first_name, last_name, id }) => {
                employees.push({
                    name: first_name + " " + last_name,
                    value: id
                });
            });

            // get all the database of role table, so users can choose from them
            db.query(`SELECT * FROM role`, (err, roleResult)=>{
                if (err) throw err;
                const roles = [];
                roleResult.forEach(({ title, id }) => {
                    roles.push({
                        name: title,
                        value: id
                    });
                });

                inquirer.prompt([
                    {
                        // add the employee's first name
                        type: 'input',
                        name: 'firstName',
                        message: "Please enter the employee's first name:",
                        validate: firstNameInput => {
                            if (firstNameInput){
                                return true;
                            } else {
                                return false;
                            }
                        }
                    },
                    {
                        // add the employee's last name
                        type: 'input',
                        name: 'lastName',
                        message: "Please enter the employee's last name:",
                        validate: lastNameInput => {
                            if (lastNameInput){
                                return true;
                            } else {
                                return false;
                            }
                        }
                    },
                    {
                        // choose the employee role
                        type: 'list',
                        name: 'role',
                        choices: roles,
                        message: 'Please choose the employee role:'
                    },
                    {
                        // add the employee's manager
                        type: 'list',
                        name: 'manager',
                        choices: employees,
                        message: "Please choose the employee's manager:"
                    }
                ]).then((answers)=>{
                    const managerId=answers.manager !== 0? answers.manager: null;
                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, [answers.firstName, answers.lastName, answers.role, managerId], (err, result)=>{
                        if (err) throw err;
                        console.log(`${answers.firstName} ${answers.lastName} with id ${result.insertId} is added to the database.`);
                        employeeTracker();
                    });
                });
            });
        });
    };

    if(response.request === 'Update An Employee Role'){
        // get all employee database
        db.query(`SELECT * FROM employee`, (err, EEresult)=>{
            if (err) throw err;
            const employeesChoice = [];
            EEresult.forEach( ({ first_name, last_name, id })=>{
                employeesChoice.push({
                    name: first_name + " " + last_name,
                    value: id
                });
            });

            // get all role database
            db.query(`SELECT * FROM role`, (err, roleRes)=>{
                if (err) throw err;
                const rolesChoice = [];
                roleRes.forEach(({ title, id }) => {
                    rolesChoice.push({
                        name: title,
                        value: id
                    });
                });

                inquirer.prompt([
                    {
                        // choose an employee to update
                        type: 'list',
                        name: 'employee',
                        choices: employeesChoice,
                        message: 'Please choose the employee that you want to update:'
                    },
                    {
                        // update the new role
                        type: 'list',
                        name: 'role',
                        choices: rolesChoice,
                        message: 'Please choose his/her new role:'
                    }
                ]).then((answers)=>{
                    db.query(`UPDATE employee SET ? WHERE ??=?;`, [{role_id: answers.role}, "id", answers.employee], (err,result)=>{
                        if (err) throw err;
                        console.log(`New role is updated to the database.`);
                        employeeTracker();
                    });
                });
            });
        });
    };

    if (response.request === 'quit'){
        db.end();
        console.log('Bye');
    };
};