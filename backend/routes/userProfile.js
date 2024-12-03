const express = require("express");
const router = express.Router();
const con = require("../db");

// הצגת פרטי משתמש
router.get("/:id/profile", (req, res) => {
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

// עריכת פרטי משתמש
router.put("/:id/profile", (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;

  const sql = "UPDATE users SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?";
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
  const { id } = req.params;

  const sql = `
    SELECT o.id, o.product, o.quantity, o.price, o.status_order, o.order_date, o.order_to
    FROM orders o
    WHERE o.customer_id = ?
  `;
  con.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching user orders:", err);
      return res.status(500).json({ error: "Failed to fetch user orders" });
    }
    res.json(results);
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
