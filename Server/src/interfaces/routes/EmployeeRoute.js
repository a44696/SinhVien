import express from 'express';
import { con } from '../../infrastructure/database/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();

// Employee Login
router.post('/employee_login', (req, res) => {
    const sql = "SELECT * FROM employee WHERE email = ?";
    con.query(sql, [req.body.email], (err, result) => {
        if (err) {
            return res.json({ loginStatus: false, Error: "Query Error" });
        }
        if (result.length > 0) {
            bcrypt.compare(req.body.password, result[0].password, (err, isPasswordMatch) => {
                if (err) {
                    return res.json({ loginStatus: false, Error: "Password comparison error" });
                }
                if (isPasswordMatch) {
                    const id = result[0].id;
                    const email = result[0].email;
                    const token = jwt.sign(
                        { role: "employee", id: id, email: email },
                        "jwt_secret_key",
                        { expiresIn: "1d" }
                    );
                    res.cookie('token', token);
                    return res.json({ loginStatus: true, id: id });
                } else {
                    return res.json({ loginStatus: false, Error: 'Invalid email or password' });
                }
            });
        } else {
            return res.json({ loginStatus: false, Error: 'Invalid email or password' });
        }
    });
});

// Get Employee Detail
router.get('/detail/:id', (req, res) => {
    const sql = "SELECT * FROM employee WHERE id = ?";
    con.query(sql, [req.params.id], (err, result) => {
        if (err) {
            return res.json({ Status: false, Error: "Query Error" });
        }
        return res.json(result);
    });
});

// Employee Logout
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: true });
});

export { router as EmployeeRoute };
