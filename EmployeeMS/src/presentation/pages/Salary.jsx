import React, { useEffect, useState } from "react";
import { SalaryService, EmployeeService } from "../../application/services"

const salaryService = new SalaryService();
const employeeService = new EmployeeService();

const Salary = () => {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [amount, setAmount] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadSalaries();
    loadEmployees();
  }, []);

  const loadSalaries = async () => {
    try {
      const result = await salaryService.getAllSalaries();
      if (result.Status) {
        setSalaries(result.Result);
      } else {
        alert(result.Error);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const loadEmployees = async () => {
    try {
      const result = await employeeService.getAllEmployees();
      if (result.Status) {
        setEmployees(result.Result);
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
        result = await salaryService.updateSalary(editId, employeeId, amount, effectiveDate);
      } else {
        result = await salaryService.createSalary(employeeId, amount, effectiveDate);
      }
      
      if (result.Status) {
        alert(editMode ? "Salary updated successfully" : "Salary added successfully");
        setEmployeeId("");
        setAmount("");
        setEffectiveDate("");
        setEditMode(false);
        setEditId(null);
        loadSalaries();
      } else {
        alert(result.Error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (sal) => {
    setEmployeeId(sal.employee_id);
    setAmount(sal.amount);
    setEffectiveDate(sal.effective_date.split('T')[0]);
    setEditMode(true);
    setEditId(sal.id);
  }

  const handleCancelEdit = () => {
    setEmployeeId("");
    setAmount("");
    setEffectiveDate("");
    setEditMode(false);
    setEditId(null);
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa salary này không?')) {
      try {
        const result = await salaryService.deleteSalary(id);
        if (result.Status) {
          alert("Salary deleted successfully");
          loadSalaries();
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
        <h3>Salary Management</h3>
      </div>
      <div className="row">
        <div className="col-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="employee" className="form-label">
                Employee
              </label>
              <select
                id="employee"
                className="form-select"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} - {emp.category_name} - {emp.department_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="amount" className="form-label">
                Salary Amount
              </label>
              <input
                type="number"
                id="amount"
                className="form-control"
                placeholder="Enter salary amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="effectiveDate" className="form-label">
                Effective Date
              </label>
              <input
                type="date"
                id="effectiveDate"
                className="form-control"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary me-2">
              {editMode ? 'Update Salary' : 'Add Salary'}
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
        <h4>Salary List</h4>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Effective Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map((sal) => (
              <tr key={sal.id}>
                <td>{sal.id}</td>
                <td>{sal.employee_name}</td>
                <td>{sal.category_name}</td>
                <td>{sal.department_name}</td>
                <td>${parseFloat(sal.amount).toFixed(2)}</td>
                <td>{new Date(sal.effective_date).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="btn btn-info btn-sm me-2"
                    onClick={() => handleEdit(sal)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-warning btn-sm"
                    onClick={() => handleDelete(sal.id)}
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

export default Salary;