import React, { useEffect, useState } from "react";
import { DepartmentService } from "../../application/services";

const departmentService = new DepartmentService();

const Department = () => {
  const [departments, setDepartments] = useState([]);

  // form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // modal state
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const result = await departmentService.getAllDepartments();
      if (result.Status) setDepartments(result.Result);
      else alert(result.Error);
    } catch (err) {
      console.log(err);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditMode(false);
    setEditId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (dept) => {
    setName(dept.name ?? "");
    setDescription(dept.description ?? "");
    setEditMode(true);
    setEditId(dept.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Department Name is required");
      return;
    }

    try {
      let result;
      if (editMode) {
        result = await departmentService.updateDepartment(editId, name, description);
      } else {
        result = await departmentService.createDepartment(name, description);
      }

      if (result.Status) {
        alert(editMode ? "Department updated successfully" : "Department added successfully");
        closeModal();
        loadDepartments();
      } else {
        alert(result.Error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phòng ban này không?")) {
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
  };

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Department Management</h3>
      </div>

      {/* Action bar */}
      <div className="d-flex justify-content-end mt-3">
        <button className="btn btn-primary" onClick={openAddModal}>
          + Add Department
        </button>
      </div>

      {/* List */}
      <div className="mt-4">
        <h4>Department List</h4>
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 80 }}>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th style={{ width: 150 }}>Employee Count</th>
              <th style={{ width: 180 }}>Actions</th>
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
                    onClick={() => openEditModal(dept)}
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

            {departments.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted py-4">
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editMode ? "Update Department" : "Add Department"}
                  </h5>
                  <button type="button" className="btn-close" onClick={closeModal} />
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor="deptName" className="form-label">
                        Department Name
                      </label>
                      <input
                        type="text"
                        id="deptName"
                        className="form-control"
                        placeholder="Enter department name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="deptDesc" className="form-label">
                        Description
                      </label>
                      <textarea
                        id="deptDesc"
                        className="form-control"
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
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

export default Department;
