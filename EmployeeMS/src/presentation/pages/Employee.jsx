import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { EmployeeService } from "../../application/services";

const employeeService = new EmployeeService();

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const result = await employeeService.getAllEmployees();
      if (result.Status) {
        setEmployees(result.Result);
      } else {
        alert(result.Error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này không?")) {
      employeeService
        .deleteEmployee(id)
        .then((result) => {
          if (result.Status) {
            // xóa local, không reload trang
            setEmployees((prev) => prev.filter((e) => e.id !== id));
          } else {
            alert(result.Error);
          }
        })
        .catch((err) => {
          console.log(err);
          alert("Error deleting employee");
        });
    }
  };

  // ===== FILTER THEO TÊN =====
  const filteredEmployees = useMemo(() => {
    if (!searchText.trim()) return employees;

    const keyword = searchText.toLowerCase();
    return employees.filter((e) =>
      e.name?.toLowerCase().includes(keyword)
    );
  }, [employees, searchText]);

  return (
    <div className="px-5 mt-3">

      {/* Search + Add Button */}
      <div className="d-flex justify-content-between gap-3 mb-4 mt-5">
        <h3 className="mb-0">Employee List</h3>
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search employee by name..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Link to="/dashboard/add_employee" className="btn btn-primary">
          <i className="bi bi-plus-circle me-1"></i>
          Add Employee
        </Link>
      </div>

      {/* Table Card */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead className="">
                <tr>
                  <th className="px-4 py-3">No.</th>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((e, index) => (
                  <tr key={e.id}>
                    <td className="px-4 py-3 align-middle">{index + 1}</td>
                    <td className="px-4 py-3 align-middle">
                      <img
                        src={`http://localhost:3000/Images/${e.image}`}
                        className="rounded-circle"
                        alt={e.name}
                        style={{ width: 40, height: 40, objectFit: "cover" }}
                      />
                    </td>
                    <td className="px-4 py-3 align-middle fw-semibold">{e.name}</td>
                    <td className="px-4 py-3 align-middle">
                      <i className="bi bi-envelope-fill me-2 text-primary"></i>
                      {e.email}
                    </td>
                    <td className="px-4 py-3 align-middle">{e.address}</td>
                    <td className="px-4 py-3 align-middle">
                      <span className="badge bg-info text-dark">{e.department_name}</span>
                    </td>
                    <td className="px-4 py-3 align-middle text-center">
                      <Link
                        to={`/dashboard/view_employee/${e.id}`}
                        className="btn btn-sm btn-outline-primary me-2"
                      >
                        <i className="bi bi-eye me-1"></i>
                        View
                      </Link>
                      <Link
                        to={`/dashboard/edit_employee/${e.id}`}
                        className="btn btn-sm btn-outline-info me-2"
                      >
                        <i className="bi bi-pencil-square me-1"></i>
                        Edit
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(e.id)}
                      >
                        <i className="bi bi-trash-fill me-1"></i>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      <p className="mb-0">No employees found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employee;
