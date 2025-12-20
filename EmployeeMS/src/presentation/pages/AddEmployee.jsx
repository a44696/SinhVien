import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { EmployeeService, CategoryService, DepartmentService } from "../../application/services"
 
const employeeService = new EmployeeService();
const categoryService = new CategoryService();
const departmentService = new DepartmentService();
 
const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    category_id: "",
    department_id: "",
    image: "",
  });
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate()
 
  useEffect(() => {
    loadDepartments();
    loadCategories();
  }, []);
 
  const loadDepartments = async () => {
    try {
      const result = await departmentService.getAllDepartments();
      if (result.Status) {
        setDepartments(result.Result);
      }
    } catch (err) {
      console.log(err);
    }
  }
 
  const loadCategories = async (deptId = null) => {
    try {
      const result = await categoryService.getAllCategories(deptId);
      if (result.Status) {
        setCategories(result.Result);
      }
    } catch (err) {
      console.log(err);
    }
  }
 
  const handleDepartmentChange = (deptId) => {
    setEmployee({ ...employee, department_id: deptId, category_id: "" });
    loadCategories(deptId);
  }
 
  const handleSubmit = async (e) => {
    e.preventDefault()
 
    if (!employee.name || !employee.email || !employee.password || !employee.address ||
        !employee.category_id || !employee.department_id || !employee.image) {
      alert('Please fill all fields')
      return;
    }
 
    const formData = new FormData();
    formData.append('name', employee.name);
    formData.append('email', employee.email);
    formData.append('password', employee.password);
    formData.append('address', employee.address);
    formData.append('image', employee.image);
    formData.append('category_id', employee.category_id);
    formData.append('department_id', employee.department_id);
 
    try {
      const result = await employeeService.createEmployee(formData);
      if (result.Status) {
        alert('Employee added successfully')
        navigate('/dashboard/employee')
      } else {
        if (result.Error && result.Error.includes('Duplicate entry')) {
          alert("Email already exists! Please use a different email.");
        } else {
          alert(result.Error || "An error occurred");
        }
      }
    } catch (err) {
      console.log(err)
      if (err.response?.data?.Error?.includes('Duplicate entry')) {
      alert("Email already exists! Please use a different email.");
    } else {
      alert("An error occurred while saving employee");
    }
    }
  }
 
  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add Employee</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">Name</label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputName"
              placeholder="Enter Name"
              onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputEmail4" className="form-label">Email</label>
            <input
              type="email"
              className="form-control rounded-0"
              id="inputEmail4"
              placeholder="Enter Email"
              autoComplete="off"
              onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputPassword4" className="form-label">Password</label>
            <input
              type="password"
              className="form-control rounded-0"
              id="inputPassword4"
              placeholder="Enter Password"
              onChange={(e) => setEmployee({ ...employee, password: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputAddress" className="form-label">Address</label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputAddress"
              placeholder="1234 Main St"
              autoComplete="off"
              onChange={(e) => setEmployee({ ...employee, address: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="department" className="form-label">Department</label>
            <select
              id="department"
              className="form-select"
              onChange={(e) => handleDepartmentChange(e.target.value)}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label htmlFor="category" className="form-label">Position</label>
            <select
              id="category"
              className="form-select"
              onChange={(e) => setEmployee({ ...employee, category_id: e.target.value })}
              disabled={!employee.department_id}
            >
              <option value="">Select Position</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="col-12 mb-3">
            <label className="form-label" htmlFor="inputGroupFile01">Select Image</label>
            <input
              type="file"
              className="form-control rounded-0"
              id="inputGroupFile01"
              name="image"
              onChange={(e) => setEmployee({ ...employee, image: e.target.files[0] })}
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">Add Employee</button>
          </div>
        </form>
      </div>
    </div>
  );
};
 
export default AddEmployee;
 