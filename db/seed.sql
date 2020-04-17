USE company_db;

INSERT INTO departments(department)
VALUES ("Management"),
('Sales'),
('Finance'),
('Human Resources');

INSERT INTO roles(title, salary, department_id)
VALUES ("Manager", 80000, 1),
("Secretary", 40000, 1),
("Associate", 50000, 2);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES ("Michael", "Scott", 1, 1),
("Jim", "Halpert", 3, 1 ),
("Pam", "Beasley", 2, 1),
("Dwight", "Schrute", 3, 1);