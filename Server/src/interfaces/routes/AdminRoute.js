import express from 'express';
import { con } from '../../infrastructure/database/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Public/Images/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// ============ ADMIN ROUTES ============
router.post('/adminlogin', (req, res) => {
    const sql = "SELECT * FROM admin WHERE email = ? AND password = ?";
    con.query(sql, [req.body.email, req.body.password], (err, result) => {
        if (err) {
            return res.json({LoginStatus:false, Error:"Query Error" });
        }
        if (result.length > 0) {
            const email = result[0].email;
            const token = jwt.sign (
                {role :"admin",email:email},
                "jwt_secret_key",
                {expiresIn:"1d"} 
            );
            res.cookie('token',token)
            return res.json({LoginStatus:true });
        }else{
            return res.json({LoginStatus:false, message: 'Invalid email or password' });
        }
    });
});

router.get('/admin_details', (req, res) => {
    const sql = "SELECT * FROM admin LIMIT 1";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.get('/admin_records', (req, res) => {
    const sql = "SELECT * FROM admin";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.get('/admin/:id', (req, res) => {
    const sql = "SELECT * FROM admin WHERE id = ?";
    con.query(sql, [req.params.id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.put('/edit_admin/:id', (req, res) => {
    let sql = "";
    let values = [];
    
    if(req.body.password && req.body.password.trim() !== "") {
        sql = "UPDATE admin SET email = ?, password = ? WHERE id = ?";
        values = [req.body.email, req.body.password, req.params.id];
    } else {
        sql = "UPDATE admin SET email = ? WHERE id = ?";
        values = [req.body.email, req.params.id];
    }
    
    con.query(sql, values, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true})
    })
})

router.delete('/delete_admin/:id', (req, res) => {
    const sql = "DELETE FROM admin WHERE id = ?";
    con.query(sql, [req.params.id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true})
    })
})

router.get('/admin_count', (req, res) => {
    const sql = "SELECT COUNT(id) as admin FROM admin";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

// ============ DEPARTMENT ROUTES ============
router.get('/department', (req, res) => {
    const sql = `
        SELECT d.*, COUNT(e.id) as employee_count 
        FROM department d 
        LEFT JOIN employee e ON d.id = e.department_id 
        GROUP BY d.id
    `;
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.post('/add_department', (req, res) => {
    const sql = "INSERT INTO department (`name`, `description`) VALUES (?, ?)"
    con.query(sql, [req.body.name, req.body.description], (err, result) => {
        if(err) 
            return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true})
    })
})

router.put('/edit_department/:id', (req, res) => {
    const sql = "UPDATE department SET name = ?, description = ? WHERE id = ?";
    con.query(sql, [req.body.name, req.body.description, req.params.id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true})
    })
})

router.delete('/delete_department/:id', (req, res) => {
    const sql = "DELETE FROM department WHERE id = ?";
    con.query(sql, [req.params.id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true})
    })
})

// ============ CATEGORY ROUTES (Chức vụ) ============
router.get('/category', (req, res) => {
    const departmentId = req.query.department_id;
    let sql = `
        SELECT c.*, d.name as department_name, COUNT(e.id) as employee_count 
        FROM category c 
        LEFT JOIN department d ON c.department_id = d.id
        LEFT JOIN employee e ON c.id = e.category_id 
    `;
    
    if (departmentId) {
        sql += ` WHERE c.department_id = ${departmentId}`;
    }
    
    sql += ` GROUP BY c.id`;
    
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.get('/category/:id/employees', (req, res) => {
    const sql = `
        SELECT e.id, e.name 
        FROM employee e 
        WHERE e.category_id = ?
    `;
    con.query(sql, [req.params.id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.post('/add_category', (req, res) => {
    const sql = "INSERT INTO category (`name`, `department_id`) VALUES (?, ?)"
    con.query(sql, [req.body.name, req.body.department_id], (err, result) => {
        if(err) 
            return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true})
    })
})

router.put('/edit_category/:id', (req, res) => {
    const sql = "UPDATE category SET name = ?, department_id = ? WHERE id = ?";
    con.query(sql, [req.body.name, req.body.department_id, req.params.id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true})
    })
})

router.delete('/delete_category/:id', (req, res) => {
    const sql = "DELETE FROM category WHERE id = ?";
    con.query(sql, [req.params.id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true})
    })
})

// ============ EMPLOYEE ROUTES ============
router.get('/employee', (req, res) => {
    const sql = `
        SELECT e.*, c.name as category_name, d.name as department_name
        FROM employee e
        LEFT JOIN category c ON e.category_id = c.id
        LEFT JOIN department d ON e.department_id = d.id
    `;
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.get('/employee/:id', (req, res) => {
    const sql = `
        SELECT e.*, c.name as category_name, d.name as department_name
        FROM employee e
        LEFT JOIN category c ON e.category_id = c.id
        LEFT JOIN department d ON e.department_id = d.id
        WHERE e.id = ?
    `;
    con.query(sql, [req.params.id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.post('/add_employee', upload.single('image'), (req, res) => {
    const sql = `INSERT INTO employee 
    (name, email, password, address, image, category_id, department_id) 
    VALUES (?)`;
    
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        const values = [
            req.body.name,
            req.body.email,
            hash,
            req.body.address,
            req.file.filename,
            req.body.category_id,
            req.body.department_id
        ]
        con.query(sql, [values], (err, result) => {
            if(err) return res.json({Status: false, Error: err})
            return res.json({Status: true, EmployeeId: result.insertId})
        })
    })
})

router.put('/edit_employee/:id', (req, res) => {
    const sql = "UPDATE employee SET name = ?, email = ?, address = ?, category_id = ?, department_id = ? WHERE id = ?";
    const values = [
        req.body.name,
        req.body.email,
        req.body.address,
        req.body.category_id,
        req.body.department_id,
        req.params.id
    ]
    con.query(sql, values, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true})
    })
})

router.delete('/delete_employee/:id', (req, res) => {
    const sql = "DELETE FROM employee WHERE id = ?";
    con.query(sql, [req.params.id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true})
    })
})

router.get('/employee_count', (req, res) => {
    const sql = "SELECT COUNT(id) as employee FROM employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

// ============ SALARY ROUTES ============
router.get('/salary', (req, res) => {
    const sql = `
        SELECT s.*, e.name as employee_name, c.name as category_name, 
               d.name as department_name, e.id as employee_id
        FROM salary s
        JOIN employee e ON s.employee_id = e.id
        JOIN category c ON e.category_id = c.id
        JOIN department d ON e.department_id = d.id
        ORDER BY s.effective_date DESC
    `;
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.post('/add_salary', (req, res) => {
    const sql = "INSERT INTO salary (employee_id, amount, effective_date) VALUES (?, ?, ?)"
    con.query(sql, [req.body.employee_id, req.body.amount, req.body.effective_date], (err, result) => {
        if(err) 
            return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true})
    })
})

router.put('/edit_salary/:id', (req, res) => {
    const sql = "UPDATE salary SET employee_id = ?, amount = ?, effective_date = ? WHERE id = ?";
    con.query(sql, [req.body.employee_id, req.body.amount, req.body.effective_date, req.params.id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true})
    })
})

router.delete('/delete_salary/:id', (req, res) => {
    const sql = "DELETE FROM salary WHERE id = ?";
    con.query(sql, [req.params.id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true})
    })
})

router.get('/salary_sum', (req, res) => {
    const sql = "SELECT SUM(amount) as total FROM salary";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

export { router as AdminRoute };