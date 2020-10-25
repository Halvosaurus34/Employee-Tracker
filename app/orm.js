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
  console.log("Got Quotes? QOUTE ID", employeeId);
  return db.query(sql, [employeeId]);
}

function saveQuote(author, quote) {
  const sql = `INSERT INTO quotes (quote, author) VALUES (?, ?)
  `;
  console.log("Saved Quote!");
  return db.query(sql, [author, quote]);
}

function updateQuote(id, quoteData) {
  const sql = `UPDATE quotes SET quote = ? WHERE id = ?`;
  console.log("Updated Quote!");
  return db.query(sql, [quoteData, id]);
}

function deleteQuote(quoteId) {
  const sql = `DELETE FROM quotes WHERE id=?`;
  console.log("Deleted quote!");
  return db.query(sql, [quoteId]);
}

function closeORM() {
  return db.close();
}

module.exports = { getEmployee, saveQuote, deleteQuote, updateQuote, closeORM };
