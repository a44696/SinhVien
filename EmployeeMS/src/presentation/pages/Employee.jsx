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
    <div className="px-5 mt-5">
      {/* Action bar */}
      <div className="d-flex align-items-center justify-content-between mt-3">
        <h3>Employee List</h3>
        {/* Search */}
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search employee by name..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Link to="/dashboard/add_employee" className="btn btn-success">
          + Add Employee
        </Link>
      </div>

      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Email</th>
              <th>Address</th>
              <th>Department</th>
              <th style={{ width: 200 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((e) => (
              <tr key={e.id}>
                <td>{e.name}</td>
                <td>
                  <img
                    src={`http://localhost:3000/Images/${e.image}`}
                    className="employee_image"
                    alt={e.name}
                    style={{ width: 50, height: 50, objectFit: "cover" }}
                  />
                </td>
                <td>{e.email}</td>
                <td>{e.address}</td>
                <td>{e.department_name}</td>
                <td>
                  <Link
                    to={`/dashboard/view_employee/${e.id}`}
                    className="btn btn-primary btn-sm me-2"
                  >
                    View
                  </Link>
                  <Link
                    to={`/dashboard/edit_employee/${e.id}`}
                    className="btn btn-info btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleDelete(e.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted py-4">
                  Không tìm thấy nhân viên phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employee;
