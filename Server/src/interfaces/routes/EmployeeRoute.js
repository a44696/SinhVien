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
    const sql = `
        SELECT e.*, c.name as category_name, d.name as department_name, s.amount as salary
        FROM employee e
        LEFT JOIN category c ON e.category_id = c.id
        LEFT JOIN department d ON e.department_id = d.id
        LEFT JOIN salary s ON e.id = s.employee_id
        WHERE e.id = ?
        ORDER BY s.effective_date DESC
        LIMIT 1
    `;
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

// Update Employee Profile
router.put('/edit_profile/:id', (req, res) => {
    const sql = "UPDATE employee SET name = ?, email = ?, address = ? WHERE id = ?";
    const values = [
        req.body.name,
        req.body.email,
        req.body.address,
        req.params.id
    ]
    con.query(sql, values, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true})
    })
});

// Create Leave Request
router.post('/leave_request', (req, res) => {
    const sql = "INSERT INTO leave_request (employee_id, leave_type, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, ?, 'pending')";
    const values = [
        req.body.employee_id,
        req.body.leave_type,
        req.body.start_date,
        req.body.end_date,
        req.body.reason
    ]
    con.query(sql, values, (err, result) => {
        if(err) {
            console.log(err);
            return res.json({Status: false, Error: "Query Error: " + err.message})
        }
        return res.json({Status: true, Message: "Leave request submitted successfully"})
    })
});

// Get Leave Requests for Employee
router.get('/leave_requests/:id', (req, res) => {
    const sql = "SELECT * FROM leave_request WHERE employee_id = ? ORDER BY created_at DESC";
    con.query(sql, [req.params.id], (err, result) => {
        if(err) {
            console.log(err);
            return res.json({Status: false, Error: "Query Error"})
        }
        return res.json({Status: true, Result: result})
    })
});

// Change Password
router.post('/change_password/:id', (req, res) => {
    const employeeId = req.params.id;
    const { currentPassword, newPassword } = req.body;

    // Get employee from database
    const sql = "SELECT * FROM employee WHERE id = ?";
    con.query(sql, [employeeId], (err, result) => {
        if (err) {
            return res.json({ Status: false, Error: "Query Error" });
        }

        if (result.length === 0) {
            return res.json({ Status: false, Error: "Employee not found" });
        }

        const employee = result[0];

        // Compare current password with stored password
        bcrypt.compare(currentPassword, employee.password, (err, isPasswordMatch) => {
            if (err) {
                return res.json({ Status: false, Error: "Password comparison error" });
            }

            if (!isPasswordMatch) {
                return res.json({ Status: false, Error: "Mật khẩu hiện tại không chính xác" });
            }

            // Hash new password
            bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
                if (err) {
                    return res.json({ Status: false, Error: "Password hashing error" });
                }

                // Update password in database
                const updateSql = "UPDATE employee SET password = ? WHERE id = ?";
                con.query(updateSql, [hashedPassword, employeeId], (err, result) => {
                    if (err) {
                        return res.json({ Status: false, Error: "Failed to update password" });
                    }
                    return res.json({ Status: true, Message: "Password changed successfully" });
                });
            });
        });
    });
});

// Update Leave Request (only when status is pending)
router.put('/leave_request/:id', (req, res) => {
    const leaveRequestId = req.params.id;
    const { leave_type, start_date, end_date, reason } = req.body;

    // Check if request is still pending
    const checkSql = "SELECT status FROM leave_request WHERE id = ?";
    con.query(checkSql, [leaveRequestId], (err, result) => {
        if(err) {
            return res.json({Status: false, Error: "Query Error"})
        }
        
        if(result.length === 0) {
            return res.json({Status: false, Error: "Leave request not found"})
        }

        if(result[0].status !== 'pending') {
            return res.json({Status: false, Error: "Can only edit pending leave requests"})
        }

        // Update the leave request
        const updateSql = "UPDATE leave_request SET leave_type = ?, start_date = ?, end_date = ?, reason = ? WHERE id = ?";
        con.query(updateSql, [leave_type, start_date, end_date, reason, leaveRequestId], (err, result) => {
            if(err) {
                console.log(err);
                return res.json({Status: false, Error: "Query Error"})
            }
            return res.json({Status: true, Message: "Leave request updated successfully"})
        })
    })
});

// Delete Leave Request (only when status is pending)
router.delete('/leave_request/:id', (req, res) => {
    const leaveRequestId = req.params.id;

    // Check if request is still pending
    const checkSql = "SELECT status FROM leave_request WHERE id = ?";
    con.query(checkSql, [leaveRequestId], (err, result) => {
        if(err) {
            return res.json({Status: false, Error: "Query Error"})
        }
        
        if(result.length === 0) {
            return res.json({Status: false, Error: "Leave request not found"})
        }

        if(result[0].status !== 'pending') {
            return res.json({Status: false, Error: "Can only delete pending leave requests"})
        }

        // Delete the leave request
        const deleteSql = "DELETE FROM leave_request WHERE id = ?";
        con.query(deleteSql, [leaveRequestId], (err, result) => {
            if(err) {
                console.log(err);
                return res.json({Status: false, Error: "Query Error"})
            }
            return res.json({Status: true, Message: "Leave request deleted successfully"})
        })
    })
});

export { router as EmployeeRoute };
