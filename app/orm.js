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
  const sql = `SELECT * FROM department `;
  // console.log("Saved Quote!");
  return db.query(sql);
}

function getEmployeeByDepartment(id) {
  const sql = `SELECT * FROM employee WHERE id=?`;
  // console.log("Updated Quote!");
  return db.query(sql, [id]);
}

function getManager() {
  const sql = `SELECT * FROM employee WHERE role_id="1" `;
  console.log("Received Data: ", sql);
  return db.query(sql);
}

function getEmployeeByManager(id) {
  const sql = `SELECT * FROM employee WHERE manager_id=?`;
  // console.log("Updated Quote!");
  return db.query(sql, [id]);
}

function deleteQuote(quoteId) {
  const sql = `DELETE FROM quotes WHERE id=?`;
  console.log("Deleted quote!");
  return db.query(sql, [quoteId]);
}

function closeORM() {
  return db.close();
}

module.exports = {
  getEmployee,
  getDepartments,
  deleteQuote,
  getEmployeeByDepartment,
  getManager,
  getEmployeeByManager,
  closeORM,
};
