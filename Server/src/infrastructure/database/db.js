import mysql from 'mysql2';

const con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "123456",
    database: "employeems"
});

con.connect(function(err) {
    if (err) {
        console.error('Error connecting to database: ');
    } else {
        console.log("Connected to database!");
    }
});

export { con };
