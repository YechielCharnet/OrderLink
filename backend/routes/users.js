const express = require("express");
const router = express.Router();
const con = require("./db");

// התחברות של משתמש
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "נא למלא את כל השדות." });
  }

  const sql = "SELECT id, role FROM users WHERE name = ? AND password = ?";
  con.query(sql, [username, password], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "שגיאה בהתחברות." });
    }
    if (results.length > 0) {
      const { id, role } = results[0];
      return res.status(200).json({ success: true, id, role });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "שם משתמש או סיסמה שגויים." });
    }
  });
});

// רישום משתמש חדש
router.post("/register", (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res
      .status(400)
      .json({ success: false, message: "נא למלא את כל השדות." });
  }

  const sql =
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
  con.query(sql, [name, email, password, role], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "שגיאה ברישום." });
    }
    return res.status(200).json({ success: true });
  });
});

// קבלת כל המשתמשים
router.get("/users", (req, res) => {
  con.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).send(err.message);
    res.json(results);
  });
});

// קבלת כל הלקוחות
router.get("/customers", (req, res) => {
  con.query('SELECT * FROM users WHERE role = "customer"', (err, results) => {
    if (err) return res.status(500).send(err.message);
    res.json(results);
  });
});

// קבלת כל הספקים
router.get("/providers", (req, res) => {
  con.query('SELECT * FROM users WHERE role = "provider"', (err, results) => {
    if (err) return res.status(500).send(err.message);
    res.json(results);
  });
});
// Add a new user
router.post("/users", (req, res) =>
  app.post("/users", (req, res) => {
    const {
      name,
      address,
      email,
      phone,
      total_paid,
      left_to_pay,
      open_orders,
      comments,
      role,
    } = req.body;
    con.query(
      "INSERT INTO users (name, address, email, phone, total_paid, left_to_pay, open_orders, comments, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        address,
        email,
        phone,
        total_paid,
        left_to_pay,
        open_orders,
        comments,
        role,
      ],
      (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, name });
      }
    );
  })
);

// Update a user
router.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const {
    name,
    address,
    email,
    phone,
    total_paid,
    left_to_pay,
    open_orders,
    comments,
    role,
  } = req.body;
  con.query(
    "UPDATE users SET name = ?, address = ?, email = ?, phone = ?, total_paid = ?, left_to_pay = ?, open_orders = ?, comments = ?, role = ? WHERE id = ?",
    [
      name,
      address,
      email,
      phone,
      total_paid,
      left_to_pay,
      open_orders,
      comments,
      role,
      id,
    ],
    (err) => {
      if (err) throw err;
      res.json({ success: true });
    }
  );
});

// router.patch("/users/:type/:id/deactivate", (req, res) => {
//   const { type, id } = req.params;

//   if (!["customer", "provider"].includes(type)) {
//     return res.status(400).json({ error: "Invalid type specified" });
//   }

//   const table = type === "customer" ? "orders" : "provider_orders";
//   const column = type === "customer" ? "customer_id" : "provider_id";

//   // בדיקה להזמנות פתוחות
//   con.query(
//     `SELECT * FROM ${table} WHERE ${column} = ? AND status_order = 0`,
//     [id],
//     (err, results) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ error: "Failed to check orders" });
//       }

//       if (results.length > 0) {
//         // יש הזמנות פתוחות
//         return res
//           .status(400)
//           .json({
//             error: `This ${type} has open orders, cannot deactivate directly.`,
//           });
//       }

//       // עדכון סטטוס הלקוח ל"לא פעיל"
//       con.query(
//         `UPDATE ${type} SET is_active = 0 WHERE id = ?`,
//         [id],
//         (err) => {
//           if (err) {
//             console.error(err);
//             return res
//               .status(500)
//               .json({ error: `Failed to deactivate ${type}` });
//           }
//           res.json({ success: true });
//         }
//       );
//     }
//   );
// });



// בדיקת הזמנות פתוחות
router.get("/:type/:id/open", (req, res) => {
    const { type, id } = req.params;

    if (!["customer", "provider"].includes(type)) {
        return res.status(400).json({ error: "Invalid type specified" });
    }

    const table = type === "customer" ? "orders" : "provider_orders";
    const column = type === "customer" ? "customer_id" : "provider_id";

    // בדיקת הזמנות פתוחות
    con.query(
        `SELECT * FROM ${table} WHERE ${column} = ? AND status = 0`,
        [id],
        (err, results) => {
            if (err) {
                console.error("Error checking open orders:", err);
                return res.status(500).json({ error: "Failed to check orders" });
            }

            if (results.length > 0) {
                // יש הזמנות פתוחות
                return res.status(400).json({
                    openOrders: results.length,
                    error: `This ${type} has open orders, cannot deactivate directly.`,
                });
            }

            // אם אין הזמנות פתוחות, מצביעים על הצלחה
            res.json({ openOrders: 0, success: true });
        }
    );
});

// עדכון סטטוס ל"לא פעיל"
router.patch("/:type/:id/deactivate", (req, res) => {
    const { type, id } = req.params;

    if (!["customer", "provider"].includes(type)) {
        return res.status(400).json({ error: "Invalid type specified" });
    }

    // עדכון סטטוס ל"לא פעיל"
    con.query(
        `UPDATE users SET is_active = 0 WHERE id = ?`,
        [id],
        (err) => {
            if (err) {
                console.error("Error deactivating user:", err);
                return res.status(500).json({ error: `Failed to deactivate ${type}` });
            }
            res.json({ success: true, message: `${type} deactivated successfully.` });
        }
    );
});

module.exports = router;


