const mysql=require('mysql2');
let connection=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"28469",
    database:"jarvis"
});
module.exports=connection;