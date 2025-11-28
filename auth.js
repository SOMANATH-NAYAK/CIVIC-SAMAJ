// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: 'Missing fields' });

        const conn = await pool.getConnection();
        const [existing] = await conn.execute(
            'SELECT id FROM users WHERE email=?',
            [email]
        );
        if (existing.length) {
            conn.release();
            return res.status(400).json({ message: 'Email exists' });
        }

        const hash = await bcrypt.hash(password, 10);
        const [result] = await conn.execute(
            'INSERT INTO users (name,email,password,phone) VALUES (?,?,?,?)',
            [name, email, hash, phone || null]
        );
        conn.release();

        const token = jwt.sign(
            { id: result.insertId, name, email, role: 'citizen' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({ token });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Register failed' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const conn = await pool.getConnection();
        const [rows] = await conn.execute(
            'SELECT * FROM users WHERE email=?',
            [email]
        );
        conn.release();

        if (!rows.length)
            return res.status(400).json({ message: 'Invalid credentials' });

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Login failed' });
    }
});
// Google login
router.post('/google', async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) {
            return res.status(400).json({ message: 'No credential' });
        }

        // 1) Google se verify
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload.email;
        const name = payload.name || email.split('@')[0];

        // 2) DB me user find ya create
        const conn = await pool.getConnection();
        const [rows] = await conn.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        let user;
        if (rows.length) {
            user = rows[0];
        } else {
            const [result] = await conn.execute(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                [name, email, '', 'citizen']
            );
            user = { id: result.insertId, name, email, role: 'citizen' };
        }
        conn.release();

        // 3) Apna JWT token
        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token, name: user.name });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Google login failed' });
    }
});


module.exports = router;
