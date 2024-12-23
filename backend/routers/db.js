const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectionTimeout: 10000,
    acquireTimeout: 10000
});

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("Connected to MySQL successfully!");
        connection.release();
    } catch (err) {
        console.error("Failed to connect to MySQL:", err);
        process.exit(1);
    }
}

// בדיקת החיבור בעת הפעלה
testConnection();
module.exports = pool;



// const mysql = require("mysql2");

// const con = mysql.createConnection({
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//   });
  
//   con.connect((err) => {
//     if (err) throw err;
//     console.log("Connected to MySQL!");
//   });

//   module.exports = con


// const mysql = require("mysql2/promise");

// const con = mysql.createPool({
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
// });

// module.exports = con;
  