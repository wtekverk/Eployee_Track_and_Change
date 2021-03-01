

USE employer_DB;

INSERT INTO department(name) VALUES ("Science", "English", "Arts", "Math", "S.S.");

INSERT INTO role (title, salary, department_id) VALUES ("English Teacher", 40508, 2),("Spanish Teacher", 40508, 3),("Math Teacher", 40508, 4);

INSERT INTO employee (first_name, Last_name, role_id, manager_id) VALUES ("Barbra", "Sue", 1, NULL), ("John", "Smith", 2, 1)