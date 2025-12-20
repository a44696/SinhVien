import React from 'react'
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom'
import "bootstrap-icons/font/bootstrap-icons.css"

const EmployeeDashboard = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      localStorage.removeItem('valid')
      navigate('/')
    }
  }

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-info">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <Link
              to={`/employee_dashboard/${id}`}
              className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none"
            >
              <span className="fs-5 fw-bolder d-none d-sm-inline">
                Employee
              </span>
            </Link>
            <ul
              className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
              id="menu"
            >
              <li className="w-100">
                <Link
                  to={`/employee_dashboard/${id}/profile`}
                  className="nav-link text-white px-0 align-middle"
                >
                  <i className="fs-4 bi-person-circle ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Profile</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to={`/employee_dashboard/${id}/leave`}
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-calendar-x ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Register Leave</span>
                </Link>
              </li>
              <li className="w-100">
                <button
                  className="nav-link px-0 align-middle text-white border-0 bg-transparent w-100 text-start"
                  onClick={handleLogout}
                >
                  <i className="fs-4 bi-power ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="col p-0 m-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default EmployeeDashboard
