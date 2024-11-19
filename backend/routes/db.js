const mysql2 = require('mysql2');

// חיבור למסד הנתונים
const con = mysql2.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

con.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL!");
});

module.exports = con;
