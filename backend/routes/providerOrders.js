const express = require("express");
const router = express.Router();
const con = require("./db"); // חיבור למסד הנתונים

// קבלת כל ההזמנות של הספקים
router.get("/", (req, res) => {
  con.query("SELECT * FROM provider_orders", (err, results) => {
    if (err) {
      console.error("שגיאה בקבלת הנתונים:", err);
      return res.status(500).json({ error: "שגיאה בקבלת הנתונים מהשרת" });
    }
    res.json(results);
  });
});

// הצגת כל ההזמנות של משתמש
router.get("/:id/orders", (req, res) => {
  console.log("req.params.id:", req.params.id);

  const { id } = req.params;

  const sql = `
  SELECT 
  id, 
  provider_id, 
DATE_FORMAT(order_date, '%Y-%m-%d') AS order_date,
DATE_FORMAT(order_to, '%Y-%m-%d') AS order_to,
  product, 
  quantity, 
  price, 
  paid, 
  status, 
  comments
FROM provider_orders
WHERE provider_id = ?`;

  con.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching user orders:", err);
      return res.status(500).json({ error: "Failed to fetch user orders" });
    }
    res.json(results);
  });
});

// הוספת הזמנה חדשה לספק
router.post("/orders", (req, res) => {
  const {
    provider_id,
    order_date,
    order_to,
    product,
    quantity,
    price,
    paid,
    status,
    comments,
  } = req.body;

  // בדיקת שדות חובה
  if (
    !provider_id ||
    !order_date ||
    !order_to ||
    !product ||
    !quantity ||
    !price
  ) {
    return res.status(400).json({ error: "חלק מהשדות החיוניים חסרים" });
  }

  // ולידציה לפורמט תאריכים
  const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);
  if (!isValidDate(order_date) || !isValidDate(order_to)) {
    return res.status(400).json({ error: "פורמט תאריך לא חוקי" });
  }

  // שאילתה להוספת הזמנה חדשה
  const sql = `
    INSERT INTO provider_orders 
    (provider_id, order_date, order_to, product, quantity, price, paid, status, comments)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // שליחת השאילתה עם פרמטרים
  con.query(
    sql,
    [
      provider_id,
      order_date,
      order_to,
      product,
      quantity,
      price,
      paid || 0, // ברירת מחדל
      status || 0, // ברירת מחדל
      comments || "", // ברירת מחדל
    ],
    (err, result) => {
      if (err) {
        console.error("שגיאה בהכנסת הנתונים:", err);
        return res.status(500).json({ error: "שגיאה בהכנסת הנתונים לשרת" });
      }
      res.json({
        message: "הזמנה נוספה בהצלחה",
        orderId: result.insertId, // מזהה ההזמנה
        provider_id,
        order_date,
        order_to,
        product,
        quantity,
        price,
        paid: paid || 0,
        status: status || 0,
        comments: comments || "",
      });
    }
  );
});

// מחיקת הזמנה
router.delete("/orders/:orderId", (req, res) => {
  console.log("req.params.orderId:", req.params.orderId);

  const { orderId } = req.params;

  // שאילתה לבדוק אם עברו פחות מ-48 שעות מההזמנה
  const checkOrderTimeSql = `
    SELECT order_date
    FROM provider_orders
    WHERE id = ?`;

  con.query(checkOrderTimeSql, [orderId], (err, results) => {
    if (err) {
      console.error("שגיאה בבדיקת הזמן של ההזמנה:", err);
      return res.status(500).json({ error: "שגיאה בבדיקת הזמן של ההזמנה" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "ההזמנה לא נמצאה" });
    }

    const orderDate = results[0].order_date;
    const currentTime = new Date();
    const orderTime = new Date(orderDate);

    // חישוב ההפרש בין הזמן הנוכחי לזמן ההזמנה
    const diffInMillis = currentTime - orderTime;
    const diffInHours = diffInMillis / (1000 * 60 * 60);

    if (diffInHours > 48) {
      return res
        .status(400)
        .json({ error: "לא ניתן למחוק הזמנה אחרי 48 שעות" });
    }

    // אם ההזמנה היא בתוך 48 שעות, מבצעים מחיקה
    con.query(
      "DELETE FROM provider_orders WHERE id = ?",
      [orderId],
      (err, result) => {
        if (err) {
          console.error("שגיאה במחיקת הנתונים:", err);
          return res.status(500).json({ error: "שגיאה במחיקת הנתונים מהשרת" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "ההזמנה לא נמצאה" });
        }
        res.json({ message: "ההזמנה נמחקה בהצלחה" });
      }
    );
  });
});

module.exports = router;
