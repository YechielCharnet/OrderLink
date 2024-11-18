const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

const con = mysql.createConnection({
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

function errorMessage(res, statusCode, message) {
  res.status(statusCode).json({ success: false, message });  
}

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) 
    return errorMessage(res, 400, "Please provide username and password");
  else {
    const sql = "SELECT * FROM users WHERE name = ? AND password = ?";
    con.query(sql, [username, password], (err, results) => {
      if (err){
        console.error("Database error:", err);
        return errorMessage(res, 500, 'Failed to login.');
      }
      if (results.length > 0) {
        res.status(200).json({ success: true, id: results[0].id });
      }
      else
        return errorMessage(res, 401, "Incorrect username or password.");
    });
  }
})

app.post("/register", (req, res) => {
  const { username, email, password, address, phone, comments, role } = req.body;
  if (!username || !email || !password || !address || !phone || !role)
    return errorMessage(res, 400, "Please fill in required fields");
  const sql = "INSERT INTO users (name, email, password, address, phone, comments, role) VALUES (?, ?, ?, ?, ?, ?, ?)";
  con.query(sql, [username, email, password, address, phone, comments, role], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ success: false, message: "Failed to register." });
    }
    res.json({ success: true, id: result.insertId });
  });
});


app.listen(5000, () => {
  console.log(`Server is running on port 5000`);
});