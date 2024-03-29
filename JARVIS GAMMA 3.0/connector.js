//This module connects my app to the database server mentioned below
const mysql=require('mysql2');
let connection=mysql.createConnection({
    host:"sql6.freemysqlhosting.net",
    user:"sql6695220",
    password:"cA7VUZBBJ1",
    database:"sql6695220"
});
module.exports=connection;