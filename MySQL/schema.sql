DROP DATABASE IF EXISTS employer_DB;
CREATE database employer_DB;

USE employer_DB;


-- Create the table plans.
CREATE TABLE department (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(30) NOT NULL,
  PRIMARY KEY (id)
);


-- Create the table plans.
CREATE TABLE role (
  id int NOT NULL AUTO_INCREMENT,
  title varchar(30) NOT NULL,
  salary DECIMAL(10,2),
  department_id int, 
  PRIMARY KEY (id),
  CONSTRAINT department_role FOREIGN KEY (department_id) REFERENCES department(id)
);

-- Create the table plans.
CREATE TABLE employee (
  id int NOT NULL AUTO_INCREMENT,
  first_Name varchar(30) NOT NULL,
  last_name varchar(30) NOT NULL,
  role_id int,
  manager_id int,
  PRIMARY KEY (id),
  CONSTRAINT role_identification FOREIGN KEY (role_id) REFERENCES role(id),
  CONSTRAINT manager_identification FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
  
);



