// models/userModel.js
const pool = require('../db');

const UserModel = {
    // New user create
    create: async ({ name, email, passwordHash, phone }) => {
        const conn = await pool.getConnection();
        try {
            const [result] = await conn.execute(
                'INSERT INTO users (name, email, password, phone) VALUES (?,?,?,?)',
                [name, email, passwordHash, phone || null]
            );
            return result.insertId;
        } finally {
            conn.release();
        }
    },

    // Email se user nikalna (login ke liye)
    findByEmail: async (email) => {
        const conn = await pool.getConnection();
        try {
            const [rows] = await conn.execute(
                'SELECT * FROM users WHERE email = ? LIMIT 1',
                [email]
            );
            return rows[0] || null;
        } finally {
            conn.release();
        }
    },

    // ID se user nikalna (JWT payload ke baad)
    findById: async (id) => {
        const conn = await pool.getConnection();
        try {
            const [rows] = await conn.execute(
                'SELECT id, name, email, role FROM users WHERE id = ? LIMIT 1',
                [id]
            );
            return rows[0] || null;
        } finally {
            conn.release();
        }
    }
};

module.exports = UserModel;
