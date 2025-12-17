import React, { useEffect, useState } from "react";
import { CategoryService, DepartmentService } from "../../application/services"

const categoryService = new CategoryService();
const departmentService = new DepartmentService();

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [name, setName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [categoryEmployees, setCategoryEmployees] = useState({});

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
      } else {
        alert(result.Error);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const loadCategoryEmployees = async (categoryId) => {
    try {
      const result = await categoryService.getCategoryEmployees(categoryId);
      if (result.Status) {
        setCategoryEmployees(prev => ({
          ...prev,
          [categoryId]: result.Result
        }));
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleDepartmentFilter = (e) => {
    const deptId = e.target.value;
    setSelectedDepartment(deptId);
    loadCategories(deptId || null);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let result;
      if (editMode) {
        result = await categoryService.updateCategory(editId, name, departmentId);
      } else {
        result = await categoryService.createCategory(name, departmentId);
      }
      
      if (result.Status) {
        alert(editMode ? "Category updated successfully" : "Category added successfully");
        setName("");
        setDepartmentId("");
        setEditMode(false);
        setEditId(null);
        loadCategories(selectedDepartment || null);
      } else {
        alert(result.Error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (cat) => {
    setName(cat.name);
    setDepartmentId(cat.department_id);
    setEditMode(true);
    setEditId(cat.id);
  }

  const handleCancelEdit = () => {
    setName("");
    setDepartmentId("");
    setEditMode(false);
    setEditId(null);
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chức vụ này không?')) {
      try {
        const result = await categoryService.deleteCategory(id);
        if (result.Status) {
          alert("Category deleted successfully");
          loadCategories(selectedDepartment || null);
        } else {
          alert(result.Error);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  const toggleEmployeeList = (categoryId) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
      if (!categoryEmployees[categoryId]) {
        loadCategoryEmployees(categoryId);
      }
    }
  }

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Position Management</h3>
      </div>

      {/* Filter by Department */}
      <div className="mb-4">
        <label htmlFor="departmentFilter" className="form-label">
          Filter by Department:
        </label>
        <select
          id="departmentFilter"
          className="form-select w-50"
          value={selectedDepartment}
          onChange={handleDepartmentFilter}
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      <div className="row">
        <div className="col-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="department" className="form-label">
                Department
              </label>
              <select
                id="department"
                className="form-select"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Position Name
              </label>
              <input
                type="text"
                id="name"
                className="form-control"
                placeholder="Enter position name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary me-2">
              {editMode ? 'Update Position' : 'Add Position'}
            </button>
            {editMode && (
              <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                Cancel
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="mt-4">
        <h4>Position List</h4>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Position Name</th>
              <th>Department</th>
              <th>Employee Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <React.Fragment key={cat.id}>
                <tr>
                  <td>{cat.id}</td>
                  <td>
                    <button 
                      className="btn btn-link p-0"
                      onClick={() => toggleEmployeeList(cat.id)}
                    >
                      {cat.name} {expandedCategory === cat.id ? '▼' : '▶'}
                    </button>
                  </td>
                  <td>{cat.department_name}</td>
                  <td>{cat.employee_count}</td>
                  <td>
                    <button 
                      className="btn btn-info btn-sm me-2"
                      onClick={() => handleEdit(cat)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-warning btn-sm"
                      onClick={() => handleDelete(cat.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                {expandedCategory === cat.id && categoryEmployees[cat.id] && (
                  <tr>
                    <td colSpan="5" className="bg-light">
                      <div className="p-3">
                        <strong>Employees in this position:</strong>
                        <ul className="mt-2">
                          {categoryEmployees[cat.id].length > 0 ? (
                            categoryEmployees[cat.id].map((emp) => (
                              <li key={emp.id}>{emp.name}</li>
                            ))
                          ) : (
                            <li>No employees in this position</li>
                          )}
                        </ul>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Category;