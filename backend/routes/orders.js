const express = require("express");
const router = express.Router();
const con = require("./db");

// כל ההזמנות
router.get("/orders", (req, res) => {
  con.query("SELECT * FROM orders", (err, results) => {
    if (err) throw err;
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
      if (err) throw err;
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

// // Update an order
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
    (err) => {
      if (err) throw err;
      res.json({ success: true });
    }
  );
});

// Delete an order
router.delete("/orders/:id", (req, res) => {
  const { id } = req.params;
  con.query("DELETE FROM orders WHERE id = ?", [id], (err) => {
    if (err) throw err;
    res.json({ success: true });
  });
});
module.exports = router;
