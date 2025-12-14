import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminService, EmployeeService } from '../../application/services'

const adminService = new AdminService();
const employeeService = new EmployeeService();

const Home = () => {
  const [adminTotal, setAdminTotal] = useState(0)
  const [employeeTotal, setemployeeTotal] = useState(0)
  const [salaryTotal, setSalaryTotal] = useState(0)
  const [admins, setAdmins] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    loadDashboardData();
  }, [])

  const loadDashboardData = async () => {
    try {
      const adminCountResult = await adminService.getAdminCount();
      if (adminCountResult.Status) {
        setAdminTotal(adminCountResult.Result[0].admin);
      }

      const employeeCountResult = await employeeService.getEmployeeCount();
      if (employeeCountResult.Status) {
        setemployeeTotal(employeeCountResult.Result[0].employee);
      }

      const salaryResult = await employeeService.getTotalSalary();
      if (salaryResult.Status) {
        setSalaryTotal(salaryResult.Result[0].salaryOFEmp);
      }

      const adminsResult = await adminService.getAllAdmins();
      if (adminsResult.Status) {
        setAdmins(adminsResult.Result);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleEditAdmin = (id) => {
    navigate('/dashboard/edit_admin/' + id)
  }

  const handleDeleteAdmin = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa admin này không?')) {
      adminService.deleteAdmin(id)
        .then(result => {
          if (result.Status) {
            window.location.reload()
          } else {
            alert(result.Error)
          }
        })
        .catch(err => {
          console.log(err)
          alert('Error deleting admin')
        })
    }
  }

  return (
    <div>
      <div className='p-3 d-flex justify-content-around mt-3'>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Admin</h4>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
            <h5>{adminTotal}</h5>
          </div>
        </div>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Employee</h4>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
            <h5>{employeeTotal}</h5>
          </div>
        </div>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Salary</h4>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
            <h5>${salaryTotal}</h5>
          </div>
        </div>
      </div>
      <div className='mt-4 px-5 pt-3'>
        <h3>List of Admins</h3>
        <table className='table'>
          <thead>
            <tr>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              admins.map(a => (
                <tr key={a.id}>
                  <td>{a.email}</td>
                  <td>
                    <button
                      className="btn btn-info btn-sm me-2"
                      onClick={() => handleEditAdmin(a.id)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleDeleteAdmin(a.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Home
