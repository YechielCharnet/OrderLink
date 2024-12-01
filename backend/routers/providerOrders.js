const express = require("express");
const router = express.Router();
const con = require("./db");

router.get("/", (req, res) => {
  con.query("SELECT * FROM provider_orders", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});
router.get("/providerOrders/:id", (req, res) => {
  const { id } = req.params;
  con.query(`SELECT * FROM provider_orders WHERE id = ${id}`, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.post("/providerOrders", (req, res) => {
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

router.put("/providerOrders/:id", (req, res) => {
  const { id } = req.params;
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
    `UPDATE provider_orders SET provider_id = ?, order_id = ?, order_date = ?, order_to = ?, product = ?, quantity = ?, price = ?, paid = ?, status_order = ?, comments = ? WHERE id = ${id}`,
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
    (err) => {
      if (err) throw err;
      res.json({ id, provider_id, order_id, order_date, order_to, product, quantity, price, paid, status_order, comments });
    }
  );
});

router.delete("/providerOrders/:id", (req, res) => {
  const { id } = req.params;
  con.query(`DELETE FROM provider_orders WHERE id = ${id}`, (err) => {
    if (err) throw err;
    res.json({ id });
  });
});
    

module.exports = router;