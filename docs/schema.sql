create database employee_db;

use employee_db;

CREATE TABLE department (
  id INT NOT NULL primary key,
  name VARCHAR(30) NULL
);

CREATE TABLE empRole (
	id INT NOT NULL auto_increment primary key,
	title VARCHAR(30) NULL,
	salary VARCHAR(30) NULL,
	department_id VARCHAR(30) NULL
);

CREATE TABLE employee (
	id INT NOT NULL auto_increment primary key,
	first_name VARCHAR(30) NULL,
	last_name VARCHAR(30) NULL,
	role_id INT NULL,
	manager_id INT NULL
);