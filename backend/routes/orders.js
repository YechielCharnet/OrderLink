const express = require("express");
const router = express.Router();
const con = require("./db");

// כל ההזמנות
router.get("/orders", (req, res) => {
  con.query("SELECT * FROM orders", (err, results) => {
    if (err) {
      console.error("Error fetching orders: ", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
});

// הזמנה חדשה
router.post("/", (req, res) => {
  const {
    order_date,
    order_to,
    user_id,
    product,
    quantity,
    price,
    paid,
    delivered,
    status,
    comments,
  } = req.body;

  // בדיקה אם כל הערכים קיימים
  if (
    !order_date ||
    !order_to ||
    !user_id ||
    !product ||
    !quantity ||
    !price ||
    paid === undefined ||
    delivered === undefined ||
    !status
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  con.query(
    "INSERT INTO orders (order_date, order_to, user_id, product, quantity, price, paid, delivered, status, comments) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      order_date,
      order_to,
      user_id,
      product,
      quantity,
      price,
      paid,
      delivered,
      status,
      comments,
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting order: ", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json({
        id: result.insertId,
        order_date,
        order_to,
        user_id,
        product,
        quantity,
        price,
        paid,
        delivered,
        status,
        comments,
      });
    }
  );
});

// עדכון הזמנה
router.put("/orders/:id", (req, res) => {
  const { id } = req.params;
  const {
    order_date,
    order_to,
    user_id,
    product,
    quantity,
    price,
    paid,
    delivered,
    status,
    comments,
  } = req.body;

  // בדיקה אם כל הערכים קיימים
  if (
    !order_date ||
    !order_to ||
    !user_id ||
    !product ||
    !quantity ||
    !price ||
    paid === undefined ||
    delivered === undefined ||
    !status
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  con.query(
    "UPDATE orders SET order_date = ?, order_to = ?, user_id = ?, product = ?, quantity = ?, price = ?, paid = ?, delivered = ?, status = ?, comments = ? WHERE id = ?",
    [
      order_date,
      order_to,
      user_id,
      product,
      quantity,
      price,
      paid,
      delivered,
      status,
      comments,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating order: ", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.json({ success: true });
    }
  );
});

// מחיקת הזמנה
router.delete("/orders/:id", (req, res) => {
  const { id } = req.params;

  con.query("DELETE FROM orders WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting order: ", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ success: true });
  });
});

module.exports = router;
