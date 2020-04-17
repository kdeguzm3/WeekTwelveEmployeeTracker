const inquirer = require('inquirer');
const mysql = require('mysql');
const envPass = require('../db/pass');
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: envPass,
    database: "company_db"
});

connection.connect(err => {
    if (err) throw err;
    console.log(`ID: ${connection.threadId}`);
});

module.exports = connection;