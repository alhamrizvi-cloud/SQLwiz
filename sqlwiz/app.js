const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');

/* =========================
   Database (RETRY SAFE)
   ========================= */

let db;

function connectWithRetry() {
    db = mysql.createConnection({
        host: process.env.DB_HOST || 'db',   // container name
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || 'root',
        database: process.env.DB_NAME || 'vulnerable_ecommerce'
    });

    db.connect(err => {
        if (err) {
            console.log('❌ MySQL not ready, retrying in 3 seconds...');
            setTimeout(connectWithRetry, 3000);
            return;
        }
        console.log('✅ Connected to MySQL');
    });
}

connectWithRetry();

/* =========================
   Express App Setup
   ========================= */

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

/* =========================
   Auth Middleware
   ========================= */

function requireLogin(req, res, next) {
    if (req.session.user) return next();
    res.redirect('/login');
}

/* =========================
   Routes
   ========================= */

// Login page
app.get('/login', (req, res) => {
    res.send(`
        <h1>Login</h1>
        <form method="POST">
            Username: <input name="username"><br>
            Password: <input name="password"><br>
            <button>Login</button>
        </form>
    `);
});

// VULNERABLE LOGIN
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const sql = `
        SELECT * FROM users
        WHERE username = '${username}'
        AND password = '${password}'
    `;

    db.query(sql, (err, results) => {
        if (err) return res.send(err.message);

        if (results.length > 0) {
            req.session.user = results[0];
            res.redirect('/dashboard');
        } else {
            res.send('Invalid login');
        }
    });
});

// Dashboard
app.get('/dashboard', requireLogin, (req, res) => {
    const user = req.session.user;
    let html = `<h1>Welcome ${user.username}</h1>`;

    if (user.role === 'admin') {
        html += `<p><b>FLAG{SQLI_AUTH_BYPASS}</b></p>`;
    }

    html += `
        <a href="/products">Products</a> |
        <a href="/orders">Orders</a> |
        <a href="/debug?param=SELECT+1">Debug</a>
    `;

    res.send(html);
});

// LIKE injection
app.get('/products', requireLogin, (req, res) => {
    const q = req.query.q || '';
    const sql = `SELECT * FROM products WHERE name LIKE '%${q}%'`;

    db.query(sql, (err, rows) => {
        if (err) return res.send(err.message);
        res.send(JSON.stringify(rows));
    });
});

// Numeric injection
app.get('/product/:id', requireLogin, (req, res) => {
    const sql = `SELECT * FROM products WHERE id = ${req.params.id}`;
    db.query(sql, (err, rows) => {
        if (err) return res.send(err.message);
        res.send(JSON.stringify(rows));
    });
});

// String injection
app.get('/categories', requireLogin, (req, res) => {
    const sql = `SELECT * FROM products WHERE category = '${req.query.cat || ''}'`;
    db.query(sql, (err, rows) => {
        if (err) return res.send(err.message);
        res.send(JSON.stringify(rows));
    });
});

// ORDER BY injection
app.get('/sort', requireLogin, (req, res) => {
    const sql = `SELECT * FROM products ORDER BY ${req.query.sort || 'id'}`;
    db.query(sql, (err, rows) => {
        if (err) return res.send(err.message);
        res.send(JSON.stringify(rows));
    });
});

// GROUP BY injection
app.get('/group', requireLogin, (req, res) => {
    const sql = `SELECT category, COUNT(*) AS count FROM products GROUP BY ${req.query.group || 'category'}`;
    db.query(sql, (err, rows) => {
        if (err) return res.send(err.message);
        res.send(JSON.stringify(rows));
    });
});

// Orders (numeric injection)
app.get('/orders', requireLogin, (req, res) => {
    const uid = req.query.uid || req.session.user.id;
    const sql = `SELECT * FROM orders WHERE user_id = ${uid}`;
    db.query(sql, (err, rows) => {
        if (err) return res.send(err.message);
        res.send(JSON.stringify(rows));
    });
});

// Admin lookup
app.get('/admin/users', requireLogin, (req, res) => {
    if (req.session.user.role !== 'admin') {
        return res.send('Access denied');
    }

    const sql = `SELECT * FROM users WHERE username = '${req.query.username || ''}'`;
    db.query(sql, (err, rows) => {
        if (err) return res.send(err.message);
        res.send(JSON.stringify(rows));
    });
});

// RAW SQL EXECUTION (INTENTIONAL)
app.get('/debug', requireLogin, (req, res) => {
    const sql = req.query.param || 'SELECT 1';
    db.query(sql, (err, rows) => {
        if (err) return res.send(err.message);
        res.send(JSON.stringify(rows));
    });
});

/* =========================
   Start Server
   ========================= */

app.listen(3000, () => {
    console.log('🚀 App running on port 3000');
});
