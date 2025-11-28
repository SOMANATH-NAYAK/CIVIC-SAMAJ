// models/complaintModel.js
const pool = require('../db');

const ComplaintModel = {
    // Naya complaint create
    create: async ({
        userId,
        title,
        description,
        category,
        latitude,
        longitude,
        imageUrl
    }) => {
        const conn = await pool.getConnection();
        try {
            const [result] = await conn.execute(
                `INSERT INTO complaints 
         (user_id, title, description, category, latitude, longitude, image_url) 
         VALUES (?,?,?,?,?,?,?)`,
                [
                    userId,
                    title,
                    description,
                    category,
                    latitude || null,
                    longitude || null,
                    imageUrl || null
                ]
            );
            return result.insertId;
        } finally {
            conn.release();
        }
    },

    // Sab complaints + filters
    findAll: async ({ status, category }) => {
        const conn = await pool.getConnection();
        try {
            let sql = `
        SELECT c.*, u.name AS user_name, u.email AS user_email
        FROM complaints c
        JOIN users u ON c.user_id = u.id
        WHERE 1=1
      `;
            const params = [];

            if (status) {
                sql += ' AND c.status = ?';
                params.push(status);
            }
            if (category) {
                sql += ' AND c.category = ?';
                params.push(category);
            }

            sql += ' ORDER BY c.created_at DESC LIMIT 100';

            const [rows] = await conn.execute(sql, params);
            return rows;
        } finally {
            conn.release();
        }
    },

    // Kisi user ke complaints
    findByUser: async (userId) => {
        const conn = await pool.getConnection();
        try {
            const [rows] = await conn.execute(
                `SELECT * FROM complaints 
         WHERE user_id = ? 
         ORDER BY created_at DESC`,
                [userId]
            );
            return rows;
        } finally {
            conn.release();
        }
    },

    // Status update (admin)
    updateStatus: async (id, status) => {
        const conn = await pool.getConnection();
        try {
            await conn.execute(
                'UPDATE complaints SET status = ? WHERE id = ?',
                [status, id]
            );
        } finally {
            conn.release();
        }
    },

    // Dashboard ke stats
    getStats: async () => {
        const conn = await pool.getConnection();
        try {
            const [rows] = await conn.execute(`
        SELECT
          COUNT(*) AS total,
          SUM(status = 'reported') AS reported,
          SUM(status = 'in_progress') AS in_progress,
          SUM(status = 'resolved') AS resolved
        FROM complaints
      `);
            return rows[0];
        } finally {
            conn.release();
        }
    }
};

module.exports = ComplaintModel;
