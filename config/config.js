const mysql = require("mysql2");

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',       // '' XAMPP or 'root' MAMP
    database: 'APMS',       // your DB name
    port: '8889',           // XAMPP 3306 or 8889 MAMP
});

connection.getConnection((err)=>{
    if(err) return console.log(err.message);
    console.log("connected to local mysql db");
});

module.exports = connection;