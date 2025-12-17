# Employee Management System - Clean Architecture

Hệ thống quản lý nhân viên được xây dựng theo nguyên tắc Clean Architecture.

## Cấu Trúc Dự Án

### Frontend (EmployeeMS)
```
src/
├── domain/entities/         # Business entities
├── application/services/    # API services
├── infrastructure/api/      # API client
└── presentation/            # UI Components & Pages
    ├── pages/              # Page components
    ├── components/         # Layout components
    └── style.css
```

### Backend (Server)
```
src/
├── domain/entities/         # Business entities
├── application/usecases/   # Business logic
├── infrastructure/database/ # Database connection
└── interfaces/
    ├── routes/             # Express routes
    └── controllers/        # Request handlers
```

## Cách Chạy

### 1. Setup Backend
```bash
cd Server
npm install
npm start  # Chạy trên port 3000
```

### 2. Setup Frontend
```bash
cd EmployeeMS
npm install
npm run dev  # Chạy trên port 5173
```

### 3. Đăng Nhập
- URL: http://localhost:5173/adminlogin
- Email: admin@example.com (hoặc email đã tạo trong database)
- Password: password (hoặc password trong database)

## Chức Năng

✅ **Dashboard**: Xem thống kê tổng quan
✅ **Quản Lý Nhân Viên**: Thêm, sửa, xóa, xem chi tiết
✅ **Danh Mục**: Tạo danh mục nhân viên
✅ **Hồ Sơ Admin**: Xem và chỉnh sửa thông tin admin
✅ **Đăng Xuất**: Logout với xác nhận

## Database Schema

### admin
- id
- email
- password

### employee
- id
- name
- email
- password
- salary
- address
- image
- category_id

### category
- id
- name

## Công Nghệ

- **Frontend**: React, React Router, Axios, Bootstrap
- **Backend**: Express.js, MySQL, Bcrypt, Multer
- **Database**: MySQL

## API Endpoints

### Admin
- POST /auth/adminlogin - Đăng nhập
- GET /auth/admin_details - Lấy thông tin admin
- GET /auth/admin/:id - Lấy chi tiết admin
- PUT /auth/edit_admin/:id - Cập nhật admin
- DELETE /auth/delete_admin/:id - Xóa admin
- GET /auth/admin_records - Danh sách admin
- GET /auth/admin_count - Đếm admin

### Employee
- GET /auth/employee - Danh sách nhân viên
- GET /auth/employee/:id - Chi tiết nhân viên
- POST /auth/add_employee - Thêm nhân viên
- PUT /auth/edit_employee/:id - Cập nhật nhân viên
- DELETE /auth/delete_employee/:id - Xóa nhân viên
- GET /auth/employee_count - Đếm nhân viên
- GET /auth/salary_count - Tổng lương

### Category
- GET /auth/category - Danh sách danh mục
- POST /auth/add_category - Thêm danh mục

## Lưu Ý

1. Đảm bảo MySQL đang chạy
2. Database `employeems` đã tạo với các bảng đầy đủ
3. Cổng 3000 (Backend) và 5173 (Frontend) khả dụng
4. Thư mục `Public/Images/` có quyền ghi để lưu ảnh nhân viên

## Troubleshooting

**Lỗi: Cannot find module**
- Kiểm tra lại imports trong các file
- Chạy `npm install` lại

**Lỗi: Database connection failed**
- Kiểm tra MySQL service chạy
- Kiểm tra credentials trong `Server/src/infrastructure/database/db.js`

**Lỗi: Port already in use**
- Backend: Kiểm tra port 3000
- Frontend: Kiểm tra port 5173

---

**Dự án đã sẵn sàng để chạy! 🚀**
