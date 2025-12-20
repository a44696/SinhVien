import React, { useEffect, useMemo, useState } from "react";
import { SalaryService, EmployeeService } from "../../application/services";

const salaryService = new SalaryService();
const employeeService = new EmployeeService();

const Salary = () => {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);

  // form state
  const [employeeId, setEmployeeId] = useState("");
  const [amount, setAmount] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");

  // filter state
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // modal state
  const [showModal, setShowModal] = useState(false);

  // toast state
  const [toast, setToast] = useState({ show: false, message: "", type: "warning" });

  useEffect(() => {
    loadSalaries();
    loadEmployees();
  }, []);

  const showToast = (message, type = "warning") => {
    setToast({ show: true, message, type });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 2500);
  };

  const loadSalaries = async () => {
    try {
      const result = await salaryService.getAllSalaries();
      if (result.Status) setSalaries(result.Result);
      else alert(result.Error);
    } catch (err) {
      console.log(err);
    }
  };

  const loadEmployees = async () => {
    try {
      const result = await employeeService.getAllEmployees();
      if (result.Status) setEmployees(result.Result);
    } catch (err) {
      console.log(err);
    }
  };

  const resetForm = () => {
    setEmployeeId("");
    setAmount("");
    setEffectiveDate("");
    setEditMode(false);
    setEditId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (sal) => {
    setEmployeeId(String(sal.employee_id ?? ""));
    setAmount(String(sal.amount ?? ""));
    const iso = sal.effective_date ? String(sal.effective_date) : "";
    setEffectiveDate(iso.includes("T") ? iso.split("T")[0] : iso.slice(0, 10));
    setEditMode(true);
    setEditId(sal.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  // map nhanh: employeeId -> salary record (lấy cái mới nhất theo effective_date)
  const salaryByEmployeeId = useMemo(() => {
    const map = new Map();
    for (const s of salaries) {
      const key = String(s.employee_id);
      const cur = map.get(key);
      const curTime = cur?.effective_date ? new Date(cur.effective_date).getTime() : -1;
      const sTime = s?.effective_date ? new Date(s.effective_date).getTime() : -1;

      if (!cur || sTime > curTime) map.set(key, s);
    }
    return map;
  }, [salaries]);

  const selectedEmployeeInfo = useMemo(() => {
    return employees.find((e) => String(e.id) === String(employeeId));
  }, [employees, employeeId]);

  const existingSalary = useMemo(() => {
    if (!employeeId) return null;
    return salaryByEmployeeId.get(String(employeeId)) || null;
  }, [salaryByEmployeeId, employeeId]);

  // Filter salaries by salary range
  const filteredSalaries = useMemo(() => {
    return salaries.filter((sal) => {
      const salAmount = Number(sal.amount ?? 0);
      const min = minSalary ? Number(minSalary) : 0;
      const max = maxSalary ? Number(maxSalary) : Infinity;
      return salAmount >= min && salAmount <= max;
    });
  }, [salaries, minSalary, maxSalary]);

  const onEmployeeChange = (e) => {
    const id = e.target.value;
    setEmployeeId(id);

    if (!editMode && id) {
      const exist = salaryByEmployeeId.get(String(id));
      if (exist) {
        const emp = employees.find((x) => String(x.id) === String(id));
        showToast(
          `Nhân viên (id=${emp?.id ?? id}, name=${emp?.name ?? "N/A"}) đã có lương. Chỉ có thể Update thôi.`
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeId || !amount || !effectiveDate) {
      showToast("Nhập thiếu dữ liệu rồi bố ơi!", "warning");
      return;
    }

    try {
      let result;

      if (editMode) {
        result = await salaryService.updateSalary(editId, employeeId, amount, effectiveDate);
      } else {
        // ====== CHẶN ADD nếu đã có salary ======
        if (existingSalary) {
          showToast(
            `Nhân viên (id=${selectedEmployeeInfo?.id ?? employeeId}, name=${selectedEmployeeInfo?.name ?? "N/A"}) đã có lương. Không được Add, chỉ được Update.`,
            "warning"
          );
          return;
        }
        result = await salaryService.createSalary(employeeId, amount, effectiveDate);
      }

      if (result.Status) {
        showToast(editMode ? "Update salary thành công" : "Add salary thành công", "success");
        closeModal();
        loadSalaries();
      } else {
        showToast(result.Error || "Có lỗi xảy ra", "danger");
      }
    } catch (err) {
      console.log(err);
      showToast("Lỗi hệ thống khi lưu salary", "danger");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa salary này không?")) {
      try {
        const result = await salaryService.deleteSalary(id);
        if (result.Status) {
          showToast("Xóa salary thành công", "success");
          loadSalaries();
        } else {
          showToast(result.Error || "Xóa thất bại", "danger");
        }
      } catch (err) {
        console.log(err);
        showToast("Lỗi hệ thống khi xóa salary", "danger");
      }
    }
  };

  return (
    <div className="px-5 mt-3 position-relative">
      {/* Toast */}
      {toast.show && (
        <div
          className="toast-container position-fixed top-0 end-0 p-3"
          style={{ zIndex: 9999 }}
        >
          <div className={`toast show text-bg-${toast.type} border-0`} role="alert">
            <div className="d-flex">
              <div className="toast-body">{toast.message}</div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                aria-label="Close"
                onClick={() => setToast((p) => ({ ...p, show: false }))}
              />
            </div>
          </div>
        </div>
      )}

      {/* Header row: title + add button */}
      <div className="mt-5 d-flex align-items-center justify-content-between mb-4 ">
        <h4 className="m-0">Salary List</h4>
        <div className="d-flex align-items-center gap-2">
          <input
            type="number"
            className="form-control"
            placeholder="Min Salary"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
            style={{ width: 140 }}
          />
          <span className="text-muted">-</span>
          <input
            type="number"
            className="form-control"
            placeholder="Max Salary"
            value={maxSalary}
            onChange={(e) => setMaxSalary(e.target.value)}
            style={{ width: 140 }}
          />
          <button className="btn btn-primary" onClick={openAddModal}>
            <i className="bi bi-plus-circle me-1"></i>
            Add Salary
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead className="">
                <tr>
                  <th className="px-4 py-3" style={{ width: 80 }}>ID</th>
                  <th className="px-4 py-3">Employee Name</th>
                  <th className="px-4 py-3">Position</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3" style={{ width: 130 }}>Salary</th>
                  <th className="px-4 py-3" style={{ width: 160 }}>Effective Date</th>
                  <th className="px-4 py-3 text-center" style={{ width: 180 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSalaries.map((sal) => (
                  <tr key={sal.id}>
                    <td className="px-4 py-3 align-middle">{sal.id}</td>
                    <td className="px-4 py-3 align-middle fw-semibold">{sal.employee_name}</td>
                    <td className="px-4 py-3 align-middle">
                      <span className="badge bg-info text-dark">{sal.category_name}</span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <span className="badge bg-secondary">{sal.department_name}</span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <strong className="text-success">
                        <i className="bi bi-cash-coin me-1"></i>
                        ${Number(sal.amount ?? 0).toLocaleString()}
                      </strong>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <i className="bi bi-calendar me-2"></i>
                      {sal.effective_date ? new Date(sal.effective_date).toLocaleDateString() : ""}
                    </td>
                    <td className="px-4 py-3 align-middle text-center" style={{ whiteSpace: 'nowrap' }}>
                      <button className="btn btn-sm btn-outline-info me-2" onClick={() => openEditModal(sal)}>
                        <i className="bi bi-pencil-square me-1"></i>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(sal.id)}>
                        <i className="bi bi-trash-fill me-1"></i>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredSalaries.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
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
                  <h5 className="modal-title">{editMode ? "Update Salary" : "Add Salary"}</h5>
                  <button type="button" className="btn-close" onClick={closeModal} />
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor="employee" className="form-label">
                        Employee
                      </label>
                      <select
                        id="employee"
                        className="form-select"
                        value={employeeId}
                        onChange={onEmployeeChange}
                        required
                      >
                        <option value="">Select Employee</option>
                        {employees.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name} - {emp.category_name} - {emp.department_name}
                          </option>
                        ))}
                      </select>

                      {/* Hint nhỏ cho bố: nếu add mode mà đã có lương */}
                      {!editMode && employeeId && existingSalary && (
                        <div className="text-danger mt-2" style={{ fontSize: 13 }}>
                          Nhân viên này đã có lương. Không được Add, hãy bấm Edit ở bảng để Update.
                        </div>
                      )}
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
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                      Cancel
                    </button>

                    {/* nếu add mode và đã có salary => disable nút Add luôn cho chắc */}
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={!editMode && !!existingSalary}
                      title={!editMode && existingSalary ? "Nhân viên đã có lương, chỉ được Update" : ""}
                    >
                      {editMode ? "Update" : "Add"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show" onClick={closeModal} />
        </>
      )}
    </div>
  );
};

export default Salary;
