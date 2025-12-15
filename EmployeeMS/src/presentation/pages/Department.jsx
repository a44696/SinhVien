import React, { useEffect, useState } from "react";
import { DepartmentService } from "../../application/services"

const departmentService = new DepartmentService();

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const result = await departmentService.getAllDepartments();
      if (result.Status) {
        setDepartments(result.Result);
      } else {
        alert(result.Error);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let result;
      if (editMode) {
        result = await departmentService.updateDepartment(editId, name, description);
      } else {
        result = await departmentService.createDepartment(name, description);
      }
      
      if (result.Status) {
        alert(editMode ? "Department updated successfully" : "Department added successfully");
        setName("");
        setDescription("");
        setEditMode(false);
        setEditId(null);
        loadDepartments();
      } else {
        alert(result.Error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (dept) => {
    setName(dept.name);
    setDescription(dept.description || "");
    setEditMode(true);
    setEditId(dept.id);
  }

  const handleCancelEdit = () => {
    setName("");
    setDescription("");
    setEditMode(false);
    setEditId(null);
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phòng ban này không?')) {
      try {
        const result = await departmentService.deleteDepartment(id);
        if (result.Status) {
          alert("Department deleted successfully");
          loadDepartments();
        } else {
          alert(result.Error);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Department Management</h3>
      </div>
      <div className="row">
        <div className="col-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Department Name
              </label>
              <input
                type="text"
                id="name"
                className="form-control"
                placeholder="Enter department name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                className="form-control"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
              />
            </div>
            <button type="submit" className="btn btn-primary me-2">
              {editMode ? 'Update Department' : 'Add Department'}
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
        <h4>Department List</h4>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Employee Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id}>
                <td>{dept.id}</td>
                <td>{dept.name}</td>
                <td>{dept.description}</td>
                <td>{dept.employee_count}</td>
                <td>
                  <button 
                    className="btn btn-info btn-sm me-2"
                    onClick={() => handleEdit(dept)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-warning btn-sm"
                    onClick={() => handleDelete(dept.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Department;