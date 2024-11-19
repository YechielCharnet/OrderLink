const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// קישורים לקבצים נוספים
const usersRouter = require("./routes/users");
const ordersRouter = require("./routes/orders");
const providerOrdersRouter = require("./routes/providerOrders");
const con = require("./routes/db");


// השתמש בנתיבים הנכונים
app.use("/users", usersRouter);
app.use("/orders", ordersRouter);
app.use("/provider_orders", providerOrdersRouter)

// הפעלת השרת
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// const express = require("express");
// const mysql2 = require('mysql2');
// const cors = require("cors");
// const app = express();
// const nodemailer = require("nodemailer");
// require("dotenv").config();

// app.use(cors());
// app.use(express.json());

// // יצירת קישור למשרת דואר
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "yl77743@gmail.com", // כתובת המייל שלך
//     pass: process.env.EMAIL_PASSWORD, // סיסמת המייל שלך או טוקן (אם יש)
//   },
// });

// // פונקציה לשליחת המייל
// const sendEmail = (to, subject, text) => {
//   const mailOptions = {
//     from: "yl77743@gmail.com",
//     to,
//     subject,
//     text,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log("Error sending email:", error);
//     } else {
//       console.log("Email sent: " + info.response);
//     }
//   });
// };

// const con = mysql2.createConnection({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// con.connect((err) => {
//   if (err) throw err;
//   console.log("Connected to MySQL!");
// });

// // התחברות של משתמש
// app.post("/users/login", (req, res) => {
//   const { username, password } = req.body; // שים לב לשימוש ב-username
//   if (!username || !password) {
//     return res
//       .status(400)
//       .json({ success: false, message: "נא למלא את כל השדות." });
//   }

//   const sql = "SELECT id, role FROM users WHERE name = ? AND password = ?";
//   con.query(sql, [username, password], (err, results) => {
//     // עדכון השם כאן ל-username
//     if (err) {
//       console.error("Database error:", err);
//       return res
//         .status(500)
//         .json({ success: false, message: "שגיאה בהתחברות." });
//     }

//     if (results.length > 0) {
//       const { id, role } = results[0];
//       return res.status(200).json({ success: true, id, role });
//     } else {
//       return res.status(401).json({
//         success: false,
//         message: " שם משתמש או סיסמה שגויים נסה שוב או הירשם כמשתמש חדש.",
//       });
//     }
//   });
// });

// // רישום משתמש חדש
// app.post("/users/register", (req, res) => {
//   const { name, email, password, role } = req.body;
//   if (!name || !email || !password || !role) {
//     return res
//       .status(400)
//       .json({ success: false, message: "נא למלא את כל השדות." });
//   }

//   const sql =
//     "INSERT INTO users (name,  email, password, role) VALUES (?, ?, ?, ?)";
//   con.query(sql, [name, email, password, role], (err, results) => {
//     if (err) {
//       console.error("Database error:", err);
//       return res.status(500).json({ success: false, message: "שגיאה ברישום." });
//     }

//     return res.status(200).json({ success: true });
//   });
// });

// // Get all users (customers and providers)
// app.get("/users", (req, res) => {
//   con.query("SELECT * FROM users ORDER BY id DESC", (err, results) => {
//     if (err) throw err;
//     res.json(results);
//   });
// });

// // Get all customers
// app.get("/customers", (req, res) => {
//   con.query("SELECT * FROM users WHERE role = 'customer'", (err, results) => {
//     if (err) throw err;
//     res.json(results);
//   });
// });

// // Get all providers
// app.get("/providers", (req, res) => {
//   con.query("SELECT * FROM users WHERE role = 'provider'", (err, results) => {
//     if (err) throw err;
//     res.json(results);
//   });
// });

// // Add a new user
// app.post("/users", (req, res) => {
//   const {
//     name,
//     address,
//     email,
//     phone,
//     total_paid,
//     left_to_pay,
//     open_orders,
//     comments,
//     role,
//   } = req.body;
//   con.query(
//     "INSERT INTO users (name, address, email, phone, total_paid, left_to_pay, open_orders, comments, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
//     [
//       name,
//       address,
//       email,
//       phone,
//       total_paid,
//       left_to_pay,
//       open_orders,
//       comments,
//       role,
//     ],
//     (err, result) => {
//       if (err) throw err;
//       res.json({ id: result.insertId, name });
//     }
//   );
// });

// // Update a user
// app.put("/users/:id", (req, res) => {
//   const { id } = req.params;
//   const {
//     name,
//     address,
//     email,
//     phone,
//     total_paid,
//     left_to_pay,
//     open_orders,
//     comments,
//     role,
//   } = req.body;
//   con.query(
//     "UPDATE users SET name = ?, address = ?, email = ?, phone = ?, total_paid = ?, left_to_pay = ?, open_orders = ?, comments = ?, role = ? WHERE id = ?",
//     [
//       name,
//       address,
//       email,
//       phone,
//       total_paid,
//       left_to_pay,
//       open_orders,
//       comments,
//       role,
//       id,
//     ],
//     (err) => {
//       if (err) throw err;
//       res.json({ success: true });
//     }
//   );
// });

// // Delete a user
// app.delete("/users/:id", (req, res) => {
//   const { id } = req.params;
//   con.query("DELETE FROM users WHERE id = ?", [id], (err) => {
//     if (err) throw err;
//     res.json({ success: true });
//   });
// });

// // ------------------------------------------------------------------------

// // Get all orders
// app.get("/orders", (req, res) => {
//   con.query("SELECT * FROM orders", (err, results) => {
//     if (err) throw err;
//     res.json(results);
//   });
// });

// // Add a new order
// app.post("/orders", (req, res) => {
//   const {
//     order_date,
//     order_to,
//     user_id,
//     product,
//     quantity,
//     price,
//     paid,
//     delivered,
//     status,
//     comments,
//   } = req.body;
//   con.query(
//     "INSERT INTO orders (order_date, order_to, user_id, product, quantity, price, paid, delivered, status, comments) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
//     [
//       order_date,
//       order_to,
//       user_id,
//       product,
//       quantity,
//       price,
//       paid,
//       delivered,
//       status,
//       comments,
//     ],
//     (err, result) => {
//       if (err) throw err;
//       res.json({
//         id: result.insertId,
//         order_date,
//         order_to,
//         user_id,
//         product,
//         quantity,
//         price,
//         paid,
//         delivered,
//         status,
//         comments,
//       });
//     }
//   );
// });

// // Update an order
// app.put("/orders/:id", (req, res) => {
//   const { id } = req.params;
//   const {
//     order_date,
//     order_to,
//     user_id,
//     product,
//     quantity,
//     price,
//     paid,
//     delivered,
//     status,
//     comments,
//   } = req.body;
//   con.query(
//     "UPDATE orders SET order_date = ?, order_to = ?, user_id = ?, product = ?, quantity = ?, price = ?, paid = ?, delivered = ?, status = ?, comments = ? WHERE id = ?",
//     [
//       order_date,
//       order_to,
//       user_id,
//       product,
//       quantity,
//       price,
//       paid,
//       delivered,
//       status,
//       comments,
//       id,
//     ],
//     (err) => {
//       if (err) throw err;
//       res.json({ success: true });
//     }
//   );
// });

// // Delete an order
// app.delete("/orders/:id", (req, res) => {
//   const { id } = req.params;
//   con.query("DELETE FROM orders WHERE id = ?", [id], (err) => {
//     if (err) throw err;
//     res.json({ success: true });
//   });
// });

// // ------------------------------------------------------------------------

// // Get all provider orders
// app.get("/provider_orders", (req, res) => {
//   con.query("SELECT * FROM provider_orders", (err, results) => {
//     if (err) throw err;
//     res.json(results);
//   });
// });

// // Add a new provider order
// app.post("/provider_orders", (req, res) => {
//   const {
//     provider_id,
//     order_id,
//     order_date,
//     order_to,
//     product,
//     quantity,
//     price,
//     paid,
//     status_order,
//     comments,
//   } = req.body;
//   con.query(
//     "INSERT INTO provider_orders (provider_id, order_id, order_date, order_to, product, quantity, price, paid, status_order, comments) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
//     [
//       provider_id,
//       order_id,
//       order_date,
//       order_to,
//       product,
//       quantity,
//       price,
//       paid,
//       status_order,
//       comments,
//     ],
//     (err, result) => {
//       if (err) throw err;
//       res.json({
//         id: result.insertId,
//         provider_id,
//         order_id,
//         order_date,
//         order_to,
//         product,
//         quantity,
//         price,
//         paid,
//         status_order,
//         comments,
//       });
//     }
//   );
// });

// // Update a provider order
// app.put("/provider_orders/:id", (req, res) => {
//   const { id } = req.params;
//   const {
//     provider_id,
//     order_id,
//     order_date,
//     order_to,
//     product,
//     quantity,
//     price,
//     paid,
//     status_order,
//     comments,
//   } = req.body;
//   con.query(
//     "UPDATE provider_orders SET provider_id = ?, order_id = ?, order_date = ?, order_to = ?, product = ?, quantity = ?, price = ?, paid = ?, status_order = ?, comments = ? WHERE id = ?",
//     [
//       provider_id,
//       order_id,
//       order_date,
//       order_to,
//       product,
//       quantity,
//       price,
//       paid,
//       status_order,
//       comments,
//       id,
//     ],
//     (err) => {
//       if (err) throw err;
//       res.json({ success: true });
//     }
//   );
// });

// // Delete a provider order
// app.delete("/provider_orders/:id", (req, res) => {
//   const { id } = req.params;
//   con.query("DELETE FROM provider_orders WHERE id = ?", [id], (err) => {
//     if (err) throw err;
//     res.json({ success: true });
//   });
// });
// // ------------------------------------------------------------------------

// // Get all orders for a specific user
// app.get("/orders/:customerId", (req, res) => {
//   const { customerId } = req.params;

//   con.query(
//     "SELECT * FROM orders WHERE customer_id = ?",
//     [customerId],
//     (err, results) => {
//       if (err) {
//         res.status(500).json({ error: "שגיאת מסד נתונים" });
//       } else {
//         console.log(results); // בדיקה
//         res.json(results);
//       }
//     }
//   );
// });

// // Add a new order
// app.post("/orders", (req, res) => {
//   const { order_date, order_to, customer_id, product, quantity, comments } =
//     req.body;
//   con.query(
//     "INSERT INTO orders (order_date, order_to, customer_id, product, quantity, comments) VALUES (?, ?, ?, ?, ?, ?, ?)",
//     [order_date, order_to, customer_id, product, quantity, comments],
//     (err, result) => {
//       if (err) throw err;
//       res.json({
//         id: result.insertId,
//         order_date,
//         order_to,
//         customer_id,
//         product,
//         quantity,
//         comments,
//       });
//     }
//   );
// });

// app.put("/provider-orders/:orderId", (req, res) => {
//   const { orderId } = req.params;
//   const { status } = req.body;

//   // אימות: נוודא שהמשתמש מחובר ושהוא ספק
//   if (!req.user || req.user.role !== "provider") {
//     return res.status(403).json({ message: "Unauthorized" });
//   }

//   //חיפוש ההזמנה במסד הנתונים כדי למצוא את כתובת המייל של המנהל
//   const adminEmailQuery = 'SELECT email FROM users WHERE role = "admin"';
//   db.query(adminEmailQuery, (err, adminEmailResult) => {
//     if (err) {
//       return res.status(500).json({ message: "Error fetching admin email" });
//     }

//     const adminEmail = adminEmailResult[0].email;

//     // עדכון הסטאטוס במסד הנתונים
//     const updateQuery =
//       "UPDATE provider_orders SET status_order = ? WHERE id = ?";
//     db.query(updateQuery, [status, orderId], (err, result) => {
//       if (err) {
//         return res.status(500).json({ message: "Error updating order status" });
//       }

//       // שליחת המייל לאחר העדכון
//       const subject = "הזמנתך השתנתה";
//       const text = `הסטאטוס של ההזמנה מספר ${orderId} השתנה ל-${status}.`;

//       sendEmail(userEmail, subject, text); // שליחת המייל לסוכן

//       return res
//         .status(200)
//         .json({ message: "Order status updated and email sent" });
//     });
//   });
// });

// // // Update a order
// // app.put("/orders/:id", (req, res) => {
// //   const { id } = req.params;
// //   const { title, completed } = req.body;
// //   con.query(
// //     "UPDATE todos SET title = ?, completed = ? WHERE id = ?",
// //     [title, completed, id],
// //     (err) => {
// //       if (err) throw err;
// //       res.json({ success: true });
// //     }
// //   );
// // });

// app.listen(5000, () => {
//   console.log(`Server is running on port 5000`);
// });
