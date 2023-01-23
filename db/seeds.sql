-- insert names into department table --
INSERT INTO department (name)
VALUES ('Sales'),
       ('Finance'),
       ('IT'),
       ('Legal');

SELECT * FROM department;

-- insert roles into role table --
INSERT INTO role (title, salary, department_id)
VALUES ('Salesperson', 70000, 1),
       ('Sales Manager', 100000, 1),
       ('Accountant', 65000, 2),
       ('Accounting Manager', 95000, 2),
       ('IT Engineer', 90000, 3),
       ('Lawyer', 100000, 4);

SELECT * FROM role;

-- insert employee information into employee table --
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Alex', 'Caddel', 2, NULL),
       ('Leo', 'Lee', 1, 1),
       ('Amber', 'Katz', 1, 1),
       ('James', 'Laurier', 4, NULL),
       ('Lucy', 'Elrod', 3, 4);

SELECT * FROM employee;