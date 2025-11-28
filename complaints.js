// routes/complaints.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// POST /api/complaints  (create)
router.post('/', auth(), upload.single('image'), async (req, res) => {
    try {
        const { title, description, category, latitude, longitude } = req.body;
        if (!title || !description || !category)
            return res.status(400).json({ message: 'Missing fields' });

        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const conn = await pool.getConnection();
        const [result] = await conn.execute(
            `INSERT INTO complaints
       (user_id,title,description,category,latitude,longitude,image_url)
       VALUES (?,?,?,?,?,?,?)`,
            [
                req.user.id,
                title,
                description,
                category,
                latitude || null,
                longitude || null,
                imageUrl
            ]
        );
        conn.release();

        res.status(201).json({ id: result.insertId });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Create failed' });
    }
});

// GET /api/complaints  (all + filters)
router.get('/', async (req, res) => {
    try {
        const { status, category } = req.query;
        let sql = `SELECT c.*, u.name AS user_name
               FROM complaints c
               JOIN users u ON c.user_id=u.id
               WHERE 1=1`;
        const params = [];
        if (status) { sql += ' AND c.status=?'; params.push(status); }
        if (category) { sql += ' AND c.category=?'; params.push(category); }
        sql += ' ORDER BY c.created_at DESC LIMIT 100';

        const conn = await pool.getConnection();
        const [rows] = await conn.execute(sql, params);
        conn.release();

        res.json(rows);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Fetch failed' });
    }
});

// GET /api/complaints/my
router.get('/my', auth(), async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const [rows] = await conn.execute(
            'SELECT * FROM complaints WHERE user_id=? ORDER BY created_at DESC',
            [req.user.id]
        );
        conn.release();
        res.json(rows);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Fetch failed' });
    }
});

module.exports = router;
