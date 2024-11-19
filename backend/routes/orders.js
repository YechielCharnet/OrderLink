const express = require("express");
const router = express.Router();
const con = require("./db");

// כל ההזמנות
router.get("/", (req, res) => {
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

module.exports = router;
