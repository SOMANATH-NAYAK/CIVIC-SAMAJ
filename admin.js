// routes/admin.js
const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// PUT /api/admin/complaints/:id/status
router.put('/complaints/:id/status', auth('admin'), async (req, res) => {
    try {
        const { status } = req.body;
        const allowed = ['reported', 'in_progress', 'resolved'];
        if (!allowed.includes(status))
            return res.status(400).json({ message: 'Invalid status' });

        const conn = await pool.getConnection();
        await conn.execute(
            'UPDATE complaints SET status=? WHERE id=?',
            [status, req.params.id]
        );
        conn.release();

        res.json({ message: 'Status updated' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Update failed' });
    }
});

// GET /api/admin/stats
router.get('/stats', auth('admin'), async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const [rows] = await conn.execute(`
      SELECT
        COUNT(*) AS total,
        SUM(status='reported') AS reported,
        SUM(status='in_progress') AS in_progress,
        SUM(status='resolved') AS resolved
      FROM complaints
    `);
        conn.release();
        res.json(rows[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Stats failed' });
    }
});

module.exports = router;
