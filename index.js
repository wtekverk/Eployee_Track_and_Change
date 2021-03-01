const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');



const connection = mysql.createConnection({
    host:"localhost",
    port: 3306,
    user:"root",
    database:"employer_DB"
})

connection.connect(function(err){
    console.log("Connected as id: "+connection.threadId);
    start();
})

connection.connect(function (err) {
    if (err) throw err;
    Start();
});
