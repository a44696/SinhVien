import React, { useEffect, useState } from "react";
import { CategoryService, DepartmentService } from "../../application/services";

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

  // Modal state
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadDepartments();
    loadCategories();
  }, []);

  const loadDepartments = async () => {
    try {
      const result = await departmentService.getAllDepartments();
      if (result.Status) setDepartments(result.Result);
    } catch (err) {
      console.log(err);
    }
  };

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
  };

  const loadCategoryEmployees = async (categoryId) => {
    try {
      const result = await categoryService.getCategoryEmployees(categoryId);
      if (result.Status) {
        setCategoryEmployees((prev) => ({
          ...prev,
          [categoryId]: result.Result,
        }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDepartmentFilter = (e) => {
    const deptId = e.target.value;
    setSelectedDepartment(deptId);
    loadCategories(deptId || null);
  };

  const resetForm = () => {
    setName("");
    setDepartmentId("");
    setEditMode(false);
    setEditId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setName(cat.name);
    setDepartmentId(String(cat.department_id ?? "")); // đảm bảo string cho select
    setEditMode(true);
    setEditId(cat.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    // muốn đóng modal mà vẫn giữ data để sửa lại thì bỏ resetForm()
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!departmentId || !name.trim()) {
      alert("Vui lòng chọn Department và nhập Position Name");
      return;
    }

    try {
      let result;
      if (editMode) {
        result = await categoryService.updateCategory(editId, name, departmentId);
      } else {
        result = await categoryService.createCategory(name, departmentId);
      }

      if (result.Status) {
        alert(editMode ? "Category updated successfully" : "Category added successfully");
        closeModal();
        loadCategories(selectedDepartment || null);
      } else {
        alert(result.Error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa chức vụ này không?")) {
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
  };

  const toggleEmployeeList = (categoryId) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
      if (!categoryEmployees[categoryId]) {
        loadCategoryEmployees(categoryId);
      }
    }
  };

  return (
    <div className="px-5 mt-3">

      {/* Filter + Action bar */}
      <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
        <h4 className="mb-0">Position List</h4>
        <div className="d-flex align-items-center gap-3">
          <div style={{ minWidth: 320 }}>
            <select
              id="departmentFilter"
              className="form-select"
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
          <button className="btn btn-primary" onClick={openAddModal}>
            <i className="bi bi-plus-circle me-1"></i>
            Add Position
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="mt-4 card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead className="">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Position Name</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Employee Count</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <React.Fragment key={cat.id}>
                    <tr>
                      <td className="px-4 py-3 align-middle">{cat.id}</td>
                      <td className="px-4 py-3 align-middle">
                        <button
                          className="btn btn-link p-0 text-decoration-none"
                          onClick={() => toggleEmployeeList(cat.id)}
                        >
                          <i className={`bi ${expandedCategory === cat.id ? "bi-chevron-down" : "bi-chevron-right"} me-2`}></i>
                          {cat.name}
                        </button>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <span className="badge bg-secondary">{cat.department_name}</span>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <span className="badge bg-success">{cat.employee_count}</span>
                      </td>
                      <td className="px-4 py-3 align-middle text-center">
                        <button
                          className="btn btn-sm btn-outline-info me-2"
                          onClick={() => openEditModal(cat)}
                        >
                          <i className="bi bi-pencil-square me-1"></i>
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(cat.id)}
                        >
                          <i className="bi bi-trash-fill me-1"></i>
                          Delete
                        </button>
                      </td>
                    </tr>

                    {expandedCategory === cat.id && categoryEmployees[cat.id] && (
                      <tr>
                        <td colSpan="5" className="bg-light">
                          <div className="p-3">
                            <strong>
                              <i className="bi bi-people me-2 text-primary"></i>
                              Employees in this position:
                            </strong>
                            <ul className="mt-2 mb-0">
                              {categoryEmployees[cat.id].length > 0 ? (
                                categoryEmployees[cat.id].map((emp) => (
                                  <li key={emp.id}>{emp.name}</li>
                                ))
                              ) : (
                                <li className="text-muted">No employees in this position</li>
                              )}
                            </ul>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      <p className="mb-0">No data</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editMode ? "Update Position" : "Add Position"}
                  </h5>
                  <button type="button" className="btn-close" onClick={closeModal} />
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
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
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editMode ? "Update" : "Add"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Backdrop */}
          <div className="modal-backdrop fade show" onClick={closeModal} />
        </>
      )}
    </div>
  );
};

export default Category;
