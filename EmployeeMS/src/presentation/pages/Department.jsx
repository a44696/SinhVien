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
        if (result.Error && result.Error.includes('Duplicate entry')) {
        alert("Department name already exists! Please use a different name.");
      } else {
        alert(result.Error || "An error occurred");
      }
      }
    } catch (err) {
      console.log(err);
      if (err.response?.data?.Error?.includes('Duplicate entry')) {
        alert("Department name already exists! Please use a different name.");
      } else {
        alert("An error occurred while saving department");
      }
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
      {/* Header + Action bar */}
      <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
        <h4 className="mb-0">Department List</h4>
        <button className="btn btn-primary" onClick={openAddModal}>
          <i className="bi bi-plus-circle me-1"></i>
          Add Department
        </button>
      </div>

      {/* Table Card */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead className="">
                <tr>
                  <th className="px-4 py-3" style={{ width: 80 }}>ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 text-center" style={{ width: 200 }}>Employee Count</th>
                  <th className="px-4 py-3 text-center" style={{ width: 180 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr key={dept.id}>
                    <td className="px-4 py-3 align-middle">{dept.id}</td>
                    <td className="px-4 py-3 align-middle fw-semibold">{dept.name}</td>
                    <td className="px-4 py-3 align-middle text-muted">{dept.description}</td>
                    <td className="px-4 py-3 align-middle text-center">
                      <span className="badge bg-success">{dept.employee_count}</span>
                    </td>
                    <td className="px-4 py-3 align-middle text-center" style={{ whiteSpace: 'nowrap' }}>
                      <button
                        className="btn btn-sm btn-outline-info me-2"
                        onClick={() => openEditModal(dept)}
                      >
                        <i className="bi bi-pencil-square me-1"></i>
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(dept.id)}
                      >
                        <i className="bi bi-trash-fill me-1"></i>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {departments.length === 0 && (
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
