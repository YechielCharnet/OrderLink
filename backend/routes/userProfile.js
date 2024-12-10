const express = require("express");
const router = express.Router();
const con = require("./db");

// הצגת פרטי משתמש
router.get("/:id/profile", (req, res) => {
  console.log("req.params.id:", req.params.id);

  const { id } = req.params;

  const sql = "SELECT * FROM users WHERE id = ?";

  con.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching user profile:", err);
      return res.status(500).json({ error: "Failed to fetch user profile" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(results[0]);
  });
});

// router.get("/:id/profile", (req, res) => {
//   console.log("req.params.id:", req.params.id);

//   const { id } = req.params;

//   // שאילתת המשתמש
//   const sql = "SELECT * FROM users WHERE id = ?";
//   con.query(sql, [id], (err, userResults) => {
//     if (err) {
//       console.error("Error fetching user profile:", err);
//       return res.status(500).json({ error: "Failed to fetch user profile" });
//     }

//     if (userResults.length === 0) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // שאילתת ספירת ההזמנות
//     const sql2 = "SELECT COUNT(*) as order_count FROM orders WHERE customer_id = ? AND status_order = 0";
//     con.query(sql2, [id], (err, orderResults) => {
//       if (err) {
//         console.error("Error fetching orders:", err);
//         return res.status(500).json({ error: "Failed to fetch orders" });
//       }

//       // שולחים את התגובה עם פרטי המשתמש ומספר ההזמנות
//       res.json({
//         user: userResults[0], // פרטי המשתמש
//         order_count: orderResults[0].order_count // מספר ההזמנות
//       });
//     });
//   });
// });

// עריכת פרטי משתמש
router.put("/:id/update", (req, res) => {
  console.log("req.params.id:", req.params.id);

  const { id } = req.params;
  const { name, email, phone, address } = req.body;

  const sql =
    "UPDATE users SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?";
  con.query(sql, [name, email, phone, address, id], (err) => {
    if (err) {
      console.error("Error updating user profile:", err);
      return res.status(500).json({ error: "Failed to update user profile" });
    }
    res.json({ success: true, message: "Profile updated successfully" });
  });
});

// הצגת כל ההזמנות של משתמש
router.get("/:id/orders", (req, res) => {
  console.log("req.params.id:", req.params.id);

  const { id } = req.params;

  const sql = `SELECT 
      id, order_date, order_to, product_id, quantity, price, paid, delivered, status, comments
    FROM orders WHERE customer_id = ?`;

  con.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching user orders:", err);
      return res.status(500).json({ error: "Failed to fetch user orders" });
    }
    res.json(results);
  });
});
// // הוספת הזמנה חדשה
// router.post("/orders", (req, res) => {
//   const { userId, title } = req.body;
//   const sql = "INSERT INTO orders (customer_id, title) VALUES (?, ?)";
//   con.query(sql, [userId, title], (err, results) => {
//     if (err) {
//       console.error("Error adding order:", err);
//       return res.status(500).json({ error: "Failed to add order" });
//     }
//     res.json({ success: true, message: "Order added successfully" });
//   });
// });

// Route to get all products with their price
router.get("/products", (req, res) => {
  const sql = "SELECT * FROM products";
  con.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching products" });
    }
    res.json(results);
  });
});

// Route to add a new order
router.post("/orders", (req, res) => {
  const { userId, productId, quantity, price } = req.body; // מקבלים את ה-ID של המוצר ישירות מהלקוח

  const sql = `
    INSERT INTO orders (customer_id, product_id, quantity, price)
    VALUES (?, ?, ?, ?)
  `;

  con.query(sql, [userId, productId, quantity, price], (err, results) => {
    if (err) {
      console.error("Error adding order:", err);
      return res.status(500).json({ error: "Failed to add order" });
    }
    res.json({ success: true, message: "Order added successfully" });
  });
});

// עריכת פרטי הזמנה (רק למנהל)
router.put("/orders/:orderId", (req, res) => {
  const { orderId } = req.params;
  const { status_order, comments } = req.body;

  const sql = `
    UPDATE orders
    SET status_order = ?, comments = ?
    WHERE id = ?
  `;
  con.query(sql, [status_order, comments, orderId], (err) => {
    if (err) {
      console.error("Error updating order:", err);
      return res.status(500).json({ error: "Failed to update order" });
    }
    res.json({ success: true, message: "Order updated successfully" });
  });
});

// בדיקת הזמנות פתוחות (משתמש או ספק)
router.get("/:type/:id/open-orders", (req, res) => {
  const { type, id } = req.params;

  if (!["customer", "provider"].includes(type)) {
    return res.status(400).json({ error: "Invalid type specified" });
  }

  const table = type === "customer" ? "orders" : "provider_orders";
  const column = type === "customer" ? "customer_id" : "provider_id";

  const sql = `SELECT * FROM ${table} WHERE ${column} = ? AND status_order = 0`;
  con.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error checking open orders:", err);
      return res.status(500).json({ error: "Failed to check open orders" });
    }
    res.json({ openOrders: results.length, orders: results });
  });
});

module.exports = router;
