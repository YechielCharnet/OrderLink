const express = require("express");
const router = express.Router();
const con = require("./db");

// התחברות של משתמש
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "נא למלא את כל השדות." });
  }

  const sql = "SELECT id, role FROM users WHERE name = ? AND password = ?";
  con.query(sql, [username, password], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "שגיאה בהתחברות." });
    }
    if (results.length > 0) {
      const { id, role } = results[0];
      return res.status(200).json({ success: true, id, role });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "שם משתמש או סיסמה שגויים." });
    }
  });
});

// רישום משתמש חדש
router.post("/register", (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res
      .status(400)
      .json({ success: false, message: "נא למלא את כל השדות." });
  }

  const sql =
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
  con.query(sql, [name, email, password, role], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "שגיאה ברישום." });
    }
    return res.status(200).json({ success: true });
  });
});

// פעולה לקבלת כל המשתמשים
router.get("/", (req, res) => {
  con.query("SELECT * FROM users ORDER BY id DESC", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

module.exports = router;
