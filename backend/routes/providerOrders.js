const express = require("express");
const router = express.Router();
const con = require("./db");

// כל הזמנות הספקים
router.get("/", (req, res) => {
  con.query("SELECT * FROM provider_orders", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// הזמנה חדשה לספק
router.post("/", (req, res) => {
  const {
    provider_id,
    order_id,
    order_date,
    order_to,
    product,
    quantity,
    price,
    paid,
    status_order,
    comments,
  } = req.body;
  con.query(
    "INSERT INTO provider_orders (provider_id, order_id, order_date, order_to, product, quantity, price, paid, status_order, comments) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      provider_id,
      order_id,
      order_date,
      order_to,
      product,
      quantity,
      price,
      paid,
      status_order,
      comments,
    ],
    (err, result) => {
      if (err) throw err;
      res.json({
        id: result.insertId,
        provider_id,
        order_id,
        order_date,
        order_to,
        product,
        quantity,
        price,
        paid,
        status_order,
        comments,
      });
    }
  );
});

module.exports = router;
