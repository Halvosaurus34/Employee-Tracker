const mysql = require("mysql");

// use this wrapper to create promise around mysql
class Database {
  constructor(config) {
    this.connection = mysql.createConnection(config);
  }
  query(sql, args = []) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
  close() {
    return new Promise((resolve, reject) => {
      this.connection.end((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}
// at top INIT DB connection
const db = new Database({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "KpkhcBk3PL4n",
  database: "employee_db",
});

function getEmployee(employeeId) {
  const sql = `SELECT * FROM employee ` + (employeeId ? `WHERE id = ?` : "");
  // console.log(db.query(sql, [employeeId]));
  return db.query(sql, [employeeId]);
}

function getDepartments() {
  const sql = `SELECT * FROM department`;
  // console.log("Saved Quote!");
  return db.query(sql);
}

function getEmployeeByDepartment(id) {
  const sql = `SELECT * FROM employee WHERE id=?`;
  // console.log("Updated Quote!");
  return db.query(sql, [id]);
}

function getManager() {
  const sql = `SELECT * FROM employee WHERE role_id="4"`;
  // console.log("Received Data: ", sql);
  return db.query(sql);
}

function getEmployeeByManager(id) {
  const sql = `SELECT * FROM employee WHERE manager_id=?`;
  // console.log("Updated Quote!");
  return db.query(sql, [id]);
}

function getManagerId(firstName) {
  // console.log("GOT MANAGER ID", firstName);

  const sql = `SELECT * FROM employee WHERE first_name=?`;
  return db.query(sql, [firstName]);
}

function getDepartmentId(role) {
  // console.log("GOT DEPARTMENT ID", role);

  const sql = `SELECT * FROM emprole WHERE title=?`;
  return db.query(sql, [role]);
}

function addEmployee(firstName, lastName, role, manager) {
  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
  // console.log("ADDED EMPLOYEE");
  return db.query(sql, [firstName, lastName, role, manager]);
}

function deleteEmployee(employeeId) {
  const sql = `DELETE FROM employee WHERE id=?`;
  console.log("Deleted Employee!");
  return db.query(sql, [employeeId]);
}

function getRole(roleId) {
  const sql = `SELECT * FROM emprole ` + (roleId ? `WHERE id = ?` : "");
  console.log("Sent role data...");
  return db.query(sql, [roleId]);
}

function updateRole(roleId, empId) {
  const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
  // console.log("Sent role data...", sql, roleId, empId);
  return db.query(sql, [roleId, empId]);
}

function updateManager(manager, employee) {
  const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;
  // console.log("Sent role data...", sql, roleId, empId);
  return db.query(sql, [manager, employee]);
}

function addRole(title, salary, dep_id) {
  const sql = `INSERT INTO empRole (title, salary, department_id) VALUES (?, ?, ?)`;
  // console.log("ADDED EMPLOYEE");
  return db.query(sql, [title, salary, dep_id]);
}

function deleteRole(roleId) {
  const sql = `DELETE FROM empRole WHERE id=?`;
  console.log("Deleted Role!");
  return db.query(sql, [roleId]);
}

function closeORM() {
  return db.close();
}

module.exports = {
  getEmployee,
  getDepartments,
  deleteEmployee,
  getEmployeeByDepartment,
  getManager,
  getEmployeeByManager,
  addEmployee,
  getManagerId,
  getDepartmentId,
  getRole,
  updateRole,
  updateManager,
  addRole,
  deleteRole,
  closeORM,
};
