const mysql=require('mysql2');
let connection=mysql.createConnection({
    host:"sql6.freemysqlhosting.net",
    user:"sql6695220",
    password:"cA7VUZBBJ1",
    database:"sql6695220"
});
module.exports=connection;
/*const mysql=require('mysql2');
let connection=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"28469",
    database:"jarvis2"
});
module.exports=connection;*/