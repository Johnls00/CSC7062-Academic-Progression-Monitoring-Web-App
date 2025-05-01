// Establish connection with the mysql database
const mysql = require("mysql2/promise");

// connection settings
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',       // '' XAMPP or 'root' MAMP
    database: '40430805',       // B name
    port: '8889', 
    connectionLimit: 10,          // XAMPP 3306 or 8889 MAMP
});

// error handler
connection.getConnection((err)=>{
    if(err) return console.log(err.message);
    console.log("connected to local mysql db");
});


module.exports = connection;