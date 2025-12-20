import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { EmployeeService } from '../../application/services'

const employeeService = new EmployeeService();

const ViewEmployee = () => {
  const { id } = useParams()
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    department_id: "",
    department_name: "",
    category_id: "",
    category_name: "",
    address: "",
    image: "",
  });
  const navigate = useNavigate()

  useEffect(() => {
    loadEmployee();
  }, [])

  const loadEmployee = async () => {
    try {
      const result = await employeeService.getEmployeeById(id);
      if (result.Status) {
        setEmployee({
          name: result.Result[0].name,
          email: result.Result[0].email,
          address: result.Result[0].address,
          department_id: result.Result[0].department_id,
          department_name: result.Result[0].department_name,
          category_id: result.Result[0].category_id,
          category_name: result.Result[0].category_name,
          image: result.Result[0].image,
        })
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleDelete = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này không?')) {
      employeeService.deleteEmployee(id)
        .then(result => {
          if (result.Status) {
            navigate('/dashboard/employee')
          } else {
            alert(result.Error)
          }
        })
        .catch(err => {
          console.log(err)
          alert('Error deleting employee')
        })
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center mb-4">Employee Details</h3>
        <div className="row mb-3">
          <div className="col-12 d-flex justify-content-center mb-3">
            <img
              src={`http://localhost:3000/Images/` + employee.image}
              className="rounded"
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
          </div>
          <div className="col-12">
            <label className="form-label fw-bold">Name:</label>
            <p className="form-control rounded-0 bg-light">{employee.name}</p>
          </div>
          <div className="col-12">
            <label className="form-label fw-bold">Email:</label>
            <p className="form-control rounded-0 bg-light">{employee.email}</p>
          </div>
          <div className="col-12">
            <label className="form-label fw-bold">Department:</label>
            <p className="form-control rounded-0 bg-light">{employee.department_name}</p>
          </div>
          <div className="col-12">
            <label className="form-label fw-bold">Position:</label>
            <p className="form-control rounded-0 bg-light">{employee.category_name}</p>
          </div>
          <div className="col-12">
            <label className="form-label fw-bold">Address:</label>
            <p className="form-control rounded-0 bg-light">{employee.address}</p>
          </div>
        </div>

        <div className="col-12 d-flex gap-2">
          <button
            className="btn btn-info btn-sm w-50"
            onClick={() => navigate(`/dashboard/edit_employee/${id}`)}
          >
            Edit
          </button>
          <button
            className="btn btn-warning btn-sm w-50"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
        <div className="col-12 mt-2">
          <button
            className="btn btn-secondary w-100"
            onClick={() => navigate('/dashboard/employee')}
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewEmployee
