
const express = require("express");
const router = express.Router();
const con = require("./db");
// במקום import
const { sendEmail } = require("./email");


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

  // הכנסת ההזמנה למסד נתונים
  const sql = `
    INSERT INTO orders (customer_id, product_id, quantity, price)
    VALUES (?, ?, ?, ?)
  `;

  con.query(sql, [userId, productId, quantity, price], (err, results) => {
    if (err) {
      console.error("Error adding order:", err);
      return res.status(500).json({ error: "Failed to add order" });
    }

    // שלוף את מספר ההזמנה שנוצר
    const orderId = results.insertId; // החזרת ID של ההזמנה

    // עכשיו נוכל לשלוף את כל המידע של ההזמנה על פי מספר ההזמנה
    const orderSql = `SELECT id, price FROM orders WHERE id = ?`;
    con.query(orderSql, [orderId], (err, orderResults) => {
      if (err) {
        console.error("Error fetching order data:", err);
        return res.status(500).json({ error: "Failed to fetch order data" });
      }

      if (orderResults.length > 0) {
        const order = orderResults[0];
        const orderId = order.id;
        const price = order.price;

        // שלוף את המידע של הלקוח
        const userSql = `SELECT email FROM users WHERE id = ?`;
        con.query(userSql, [userId], (err, userResults) => {
          if (err) {
            console.error("Error fetching user data:", err);
            return res.status(500).json({ error: "Failed to fetch user data" });
          }

          if (userResults.length > 0) {
            const userEmail = userResults[0].email;

            // הכנת ההודעה ללקוח
            const emilHtml = `<!DOCTYPE html>
            <html lang="he">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>!תודה על ביצוע ההזמנה</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f7f7f7;
                        color: #333;
                        margin: 0;
                        padding: 0;
                        direction: rtl;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 8px;
                        overflow: hidden;
                    }
                    .header {
                        background-color: #4CAF50;
                        padding: 20px;
                        color: white;
                        text-align: center;
                    }
                    .content {
                        padding: 30px;
                        text-align: center;
                    }
                    .footer {
                        background-color: #f1f1f1;
                        padding: 15px;
                        text-align: center;
                        color: #888;
                        font-size: 12px;
                    }
                    .button {
                        display: inline-block;
                        background-color: #4CAF50;
                        color: white;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                    }
                    .button:hover {
                        background-color: #45a049;
                    }
                </style>
            </head>
            <body>
            
                <div class="container">
                    <div class="header">
                        <h1>תודה על ביצוע ההזמנה!</h1>
                    </div>
            
                    <div class="content">
                        <p>לקוח יקר,</p>
                        <p>!אנו שמחים להודיע לך כי ההזמנה שלך התקבלה בהצלחה</p>
                        <p>הצוות שלנו כבר עוסק בהכנה ומשלוח ההזמנה, ואתה תתעדכן ברגע שהיא תישלח אליך</p>
                        <p>סיכום הזמנה:</p>
                        <ul style="list-style-type: none; padding: 0;">
                            <li><strong>מספר הזמנה:</strong> ${orderId}</li>
                            <li><strong>סכום:</strong> ₪${price}</li>
                            <li><strong>סטטוס:</strong> בהכנה</li>
                        </ul>
            
                        <p>אם יש לך שאלות נוספות, אל תהסס לפנות לצוות התמיכה שלנו.</p>
                        <a href="http://localhost:3000/orders" class="button">הצג את ההזמנה שלך</a>
                    </div>
            
                    <div class="footer">
                        <p>תודה על קנייתך אצלנו!<br>
                        <strong>מן הסת"ם</strong><br>
                        <small>אם לא ביצעת את ההזמנה, אנא צור איתנו קשר מיידית.</small>
                        </p>
                    </div>
                </div>
            
            </body>
            </html>`;

            // שלח את המייל ללקוח
            sendEmail(userEmail, "New order", "You have a new order", emilHtml);

            console.log("Email sent to:", userEmail);

            // שלח תשובה ללקוח
            res.json({ success: true, message: "Order added successfully" });
          } else {
            console.log("User not found");
            res.status(500).json({ error: "User not found" });
          }
        });
      } else {
        console.log("Order not found");
        res.status(500).json({ error: "Order not found" });
      }
    });
  });
});




// מחיקת הזמנה
router.delete("/orders/:orderId", (req, res) => {
  const { orderId } = req.params;

  const sql = "DELETE FROM orders WHERE id = ?";
  con.query(sql, [orderId], (err) => {
    if (err) {
      console.error("Error deleting order:", err);
      return res.status(500).json({ error: "Failed to delete order" });
    }
    res.json({ success: true, message: "Order deleted successfully" });
  }
  );
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
