const express = require("express");
const router = express.Router();
const con = require("./db");


function errorMessage(res, statusCode, message) {
    res.status(statusCode).json({ success: false, message });  
}

router.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) 
        return errorMessage(res, 400, "Please provide username and password");
    const sql = "SELECT role FROM users WHERE name = ? AND password = ?";
    con.query(sql, [username, password], (err, results) => {
        if (err){
            console.error("Database error:", err);
            return errorMessage(res, 500, 'Failed to login.');
        }
        if (results.length > 0) {
            const role = results[0].role;
            return res.status(200).json({ success: true, role });
        }
        else
            return errorMessage(res, 401, "Incorrect username or password.");
    });
})
  
router.post("/register", (req, res) => {

    console.log("req.body", req.body);
    
    const { username, email, password, address, phone, comments, role } = req.body;
    if (!username || !email || !password || !address || !phone || !role)
        return errorMessage(res, 400, "Please fill in required fields");
    const sql = "INSERT INTO users (name, email, password, address, phone, comments, role) VALUES (?, ?, ?, ?, ?, ?, ?)";
    con.query(sql, [username, email, password, address, phone, comments, role], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: "Failed to register." });
        }
        res.json({success: true});
    });
});

//update user.
router.put('update/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, password, address, phone, comments, role } = req.body;
    const sql = "UPDATE users SET name = ?, email = ?, password = ?, address = ?, phone = ?, comments = ?, role = ? WHERE id = ?";
    con.query(sql, [name, email, password, address, phone, comments, role, id], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: "Failed to update user." });
        }
        res.json({ success: true });
    });
});

//active user.
router.put('/active/:id', (req, res) => {
    const { id } = req.params;
    const sql = `UPDATE users SET is_active = ${!req.body.active} WHERE id = ?`;
    con.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: "Failed to active user." });
        }
        res.json({ success: true });
    });
});

router.get('/', (req, res) => {
    con.query('SELECT * FROM users', (err, results) => {
        if (err)
            return res.status(500).send(err.message);
        res.json(results);
    });
});
router.get('/users:id', (req, res) => {
    con.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, results) => {
        if (err)
            return res.status(500).send(err.message);
        res.json(results);
    });
});

router.get('/customers', (req, res) => {
    con.query('SELECT * FROM users WHERE role = "customer"', (err, results) => {
        if (err)
            return res.status(500).send(err.message);
        res.json(results);
    });
});

router.get('/providers', (req, res) => {
    con.query('SELECT * FROM users WHERE role = "provider"', (err, results) => {
        if (err)
            return res.status(500).send(err.message);
        res.json(results);
    });
});



module.exports = router;