const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "301139",
  database: "orderlink",
});

con.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL!");
});

// // התחברות של משתמש
// // פונקציה להתחברות
// app.post("/users/login", (req, res) => {
//   const { name, password } = req.body;
//   if (!name || !password) {
//     return res.status(400).json({ success: false, message: "נא למלא את כל השדות." });
//   }

//   const sql = 'SELECT * FROM users WHERE name = ? AND password = ?';
//   con.query(sql, [name, password], (err, results) => {
//     if (err) {
//       console.error("Database error:", err);
//       return res.status(500).json({ success: false, message: "שגיאה בהתחברות." });
//     }

//     if (results.length > 0) {
//       // משתמש נמצא, הכניסה הצליחה
//       return res.status(200).json({ success: true, id: results[0].id });
//     } else {
//       // לא נמצא משתמש תואם
//       return res.status(401).json({ success: false, message: "שם משתמש או סיסמה שגויים." });
//     }
//   });
// });

// // רישום משתמש חדש
// app.post("/users/register", (req, res) => {
//   const { name, email, password } = req.body;

//   // בדוק אם השדות אינם ריקים
//   if (!name || !email || !password) {
//     return res.status(400).json({ success: false, message: "נא למלא את כל השדות." });
//   }

//   const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
//   con.query(sql, [name, email, password], (err, result) => {
//     if (err) {
//       console.error("Database error:", err);
//       return res.status(500).json({ success: false, message: "שגיאה בהרשמה." });
//     }

//     res.json({ success: true, id: result.insertId });
//   });
// });

// // Get all todos
// app.get('/todos/:userId', (req, res) => {
//   const { userId } = req.params;
//   console.log(userId);

//   con.query('SELECT * FROM todos WHERE user_id = ?', [userId], (err, results) => {
//     if (err) {
//       res.status(500).json({ error: "שגיאת מסד נתונים" });
//     } else {
//       console.log(results); // בדיקה
//       res.json(results);
//     }
//   });
// });

// // Add a new todo
// app.post("/todos", (req, res) => {
//   const { title, userId } = req.body;
//   con.query(
//     "INSERT INTO todos (title, completed, userId) VALUES (?, false, ?)",
//     [title, userId],
//     (err, result) => {
//       if (err) throw err;
//       res.json({ id: result.insertId, title, completed: false, userId });
//     }
//   );
// });

// // Update a todo
// app.put("/todos/:id", (req, res) => {
//   const { id } = req.params;
//   const { title, completed } = req.body;
//   con.query(
//     "UPDATE todos SET title = ?, completed = ? WHERE id = ?",
//     [title, completed, id],
//     (err) => {
//       if (err) throw err;
//       res.json({ success: true });
//     }
//   );
// });

// // Delete a todo
// app.delete("/todos/:id", (req, res) => {
//   const { id } = req.params;
//   con.query("DELETE FROM todos WHERE id = ?", [id], (err) => {
//     if (err) throw err;
//     res.json({ success: true });
//   });
// });

// Get all customers
app.get("/customers", (req, res) => {
  con.query("SELECT * FROM customers", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Add a new customer
app.post("/customers", (req, res) => {
  const { name, adres, email, phone, Paid_total, left_to_pay, Order_status } = req.body;
  con.query(
    "INSERT INTO customers (name, adres, email, phone, Paid_total, left_to_pay, Order_status) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [name, adres, email, phone, Paid_total, left_to_pay, Order_status],
    (err, result) => {
      if (err) throw err;
      res.json({ id: result.insertId, name });
    }
  );
});


// // Get all albums
// app.get("/albums/:userId", (req, res) => {
//   const { userId } = req.params;
//   console.log("albums");

//   con.query('SELECT * FROM albums WHERE user_id = ?', [userId], (err, results) => {
//     if (err) {
//       res.status(500).json({ error: "שגיאת מסד נתונים" });
//     } else {
//       console.log(results); // בדיקה
//       res.json(results);
//     }
//   });
// });

// // Get all posts
// app.get('/posts/:userId', (req, res) => {
//   const { userId } = req.params;
//   console.log(userId);
//   if (!userId) {
//     return res.status(400).json({ error: "User ID is required" });
//   }

//   con.query('SELECT * FROM posts WHERE user_id = ?', [userId], (err, results) => {
//     if (err) {
//       res.status(500).json({ error: "שגיאת מסד נתונים" });
//     } else {
//       console.log(results); // בדיקה
//       res.json(results);
//     }
//   });
// });

// app.get("/comments/:postId", (req, res) => {
//   const postId = req.params;
//   con.query("SELECT * FROM comments WHERE postId = ?", [postId], (err, results) => {
//     if (err) throw err;
//     res.json(results);
//   });
// });

// // Delete a post
// app.delete("/posts/:postId", (req, res) => {
//   const postId = req.params.postId;
//   con.query("DELETE FROM posts WHERE postId = ?", [postId], (err) => {
//     if (err) throw err;
//     res.json({ success: true });
//   });
// });

app.listen(5000, () => {
  console.log(`Server is running on port 5000`);
});
