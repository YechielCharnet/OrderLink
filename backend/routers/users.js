const express = require("express");
const router = express.Router();
const pool = require("./db");
const bcrypt = require("bcrypt");
const validator = require("validator");

function errorMessage(res, statusCode, message) {
    return res.status(statusCode).json({ success: false, message });  
}

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) 
        return errorMessage(res, 400, "Please provide username and password");
    try {
        const [results] = await pool.execute("SELECT role, password FROM users WHERE name = ?", [username]);
        if (results.length === 0)
            return errorMessage(res, 401, "Incorrect username or password.");
        const isMatch = await bcrypt.compare(password, results[0].password);
        if (!isMatch)
            return errorMessage(res, 401, "Incorrect username or password.");
        const role = results[0].role;
        return res.status(200).json({ success: true, role });
    }
    catch (err) {
        console.error("Database error:", err);
        return errorMessage(res, 500, 'Failed to login.');
    }
});
  
router.post("/register", async (req, res) => {
    const { role, username, password, phone, email, address, comments, is_active } = req.body;
    if (!username || !email || !password || !phone || !role)
        return errorMessage(res, 400, "Please fill in required fields");
    if (!validator.isEmail(email))
        return errorMessage(res, 400, "Please enter a valid email.");

    const connection = await pool.getConnection();
    try {
        const [existingUsers] = await connection.execute(
            "SELECT COUNT(*) AS count FROM users WHERE email = ?", [email]
        );
        if (existingUsers[0].count > 0)
            return errorMessage(res, 409, "Email already exists.");

        const saltRounds = 10;//להעביר לENV.
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const [result] = await connection.execute(
            "INSERT INTO users (role, name, password, phone, email, address, comments, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [role, username, hashedPassword, phone, email, address, comments, is_active]
        );
        res.status(201).json({ 
            success: true, 
            message: "Registration successful",
            userId: result.insertId 
        });
    }
    catch (err) {
        console.error("Database error:", err);
        return errorMessage(res, 500, "Failed to register.");
    }
    finally {
        connection.release();
    }
});

//update user.
router.put('/update/:id', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { id } = req.params;
        const { name, email, password, address, phone, comments, role } = req.body;
        
        let hashedPassword = password;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        
        const [result] = await connection.execute(
            "UPDATE users SET name = ?, email = ?, password = ?, address = ?, phone = ?, comments = ?, role = ? WHERE id = ?",
            [name, email, hashedPassword, address, phone, comments, role, id]
        );
        
        if (result.affectedRows === 0)
            return errorMessage(res, 404, "User not found");
        
        res.json({ success: true, message: "User updated successfully" });
    }
    catch (err) {
        console.error("Database error:", err);
        return errorMessage(res, 500, "Failed to update user.");
    }
    finally {
        connection.release();
    }
});

//active user.
router.put('/active/:id', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { id } = req.params;
        const newActiveStatus = !req.body.active;
        
        const [result] = await connection.execute(
            "UPDATE users SET is_active = ? WHERE id = ?",
            [newActiveStatus, id]
        );
        
        if (result.affectedRows === 0)
            return errorMessage(res, 404, "User not found");
        
        res.json({ success: true, message: "User status updated" });
    }
    catch (err) {
        console.error("Database error:", err);
        return errorMessage(res, 500, "Failed to update user status.");
    }
    finally {
        connection.release();
    }
});

router.get('/', async (req, res) => {
    try {
        const [results] = await pool.execute('SELECT * FROM users');
        res.json(results);
    }
    catch (err) {
        console.error("Database error:", err);
        res.status(500).send(err.message);
    }
});

router.get('/users/:id', async (req, res) => {
    try {
        const [results] = await pool.execute(
            'SELECT * FROM users WHERE id = ?', 
            [req.params.id]
        );
        
        if (results.length === 0)
            return errorMessage(res, 404, "User not found");
        
        res.json(results[0]);
    }
    catch (err) {
        console.error("Database error:", err);
        res.status(500).send(err.message);
    }
});

router.get('/customers', async (req, res) => {
    try {
        const [results] = await pool.execute(
            'SELECT * FROM users WHERE role = ?', 
            ['customer']
        );
        res.json(results);
    }
    catch (err) {
        console.error("Database error:", err);
        res.status(500).send(err.message);
    }
});

router.get('/providers', async (req, res) => {
    try {
        const [results] = await pool.execute(
            'SELECT * FROM users WHERE role = ?', 
            ['provider']
        );
        res.json(results);
    }
    catch (err) {
        console.error("Database error:", err);
        res.status(500).send(err.message);
    }
});

module.exports = router;