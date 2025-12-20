import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const EmployeeDetail = () => {
    const [employee, setEmployee] = useState({})
    const {id} = useParams()
    const navigate = useNavigate()
    
    useEffect(() => {
        axios.get('http://localhost:3000/employee/detail/'+id)
        .then(result => {
            setEmployee(result.data[0])
        })
        .catch(err => console.log(err))
    }, [id])
    
    const handleLogout = () => {
        axios.get('http://localhost:3000/employee/logout')
        .then(result => {
          if(result.data.Status) {
            localStorage.removeItem("valid")
            navigate('/')
          }
        }).catch(err => console.log(err))
    }

    return (
        <div className="min-vh-100" style={{backgroundColor: '#f5f7fa'}}>
            {/* Header */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
                <div className="container-fluid px-4">
                    <span className="navbar-brand mb-0 h1">
                        <i className="bi bi-building me-2"></i>
                        Employee Management System
                    </span>
                    <button className="btn btn-outline-light" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-8">
                        {/* Profile Card */}
                        <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
                            {/* Cover Background */}
                            <div className="bg-gradient" style={{
                                height: '150px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            }}></div>

                            <div className="card-body text-center position-relative" style={{marginTop: '-75px'}}>
                                {/* Profile Image */}
                                <div className="mb-3">
                                    <img 
                                        src={`http://localhost:3000/Images/${employee.image}`}
                                        alt={employee.name}
                                        className="rounded-circle border border-5 border-white shadow"
                                        style={{
                                            width: '150px',
                                            height: '150px',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </div>

                                {/* Employee Name */}
                                <h2 className="fw-bold mb-1">{employee.name}</h2>
                                <p className="text-muted mb-4">
                                    <i className="bi bi-briefcase-fill me-2"></i>
                                    {employee.category_name || 'Employee'}
                                </p>

                                <hr className="my-4" />

                                {/* Employee Details Grid */}
                                <div className="row g-4 text-start">
                                    {/* Email */}
                                    <div className="col-md-6">
                                        <div className="d-flex align-items-start">
                                            <div className="bg-primary bg-opacity-10 rounded-3 p-3 me-3">
                                                <i className="bi bi-envelope-fill text-primary fs-4"></i>
                                            </div>
                                            <div>
                                                <p className="text-muted mb-1 small">Email Address</p>
                                                <p className="fw-semibold mb-0">{employee.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Department */}
                                    <div className="col-md-6">
                                        <div className="d-flex align-items-start">
                                            <div className="bg-success bg-opacity-10 rounded-3 p-3 me-3">
                                                <i className="bi bi-building text-success fs-4"></i>
                                            </div>
                                            <div>
                                                <p className="text-muted mb-1 small">Department</p>
                                                <p className="fw-semibold mb-0">{employee.department_name || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Position */}
                                    <div className="col-md-6">
                                        <div className="d-flex align-items-start">
                                            <div className="bg-info bg-opacity-10 rounded-3 p-3 me-3">
                                                <i className="bi bi-person-badge text-info fs-4"></i>
                                            </div>
                                            <div>
                                                <p className="text-muted mb-1 small">Position</p>
                                                <p className="fw-semibold mb-0">{employee.category_name || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Salary */}
                                    <div className="col-md-6">
                                        <div className="d-flex align-items-start">
                                            <div className="bg-warning bg-opacity-10 rounded-3 p-3 me-3">
                                                <i className="bi bi-cash-coin text-warning fs-4"></i>
                                            </div>
                                            <div>
                                                <p className="text-muted mb-1 small">Salary</p>
                                                <p className="fw-semibold mb-0 text-success">
                                                    ${employee.salary ? parseFloat(employee.salary).toLocaleString() : '0'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="col-12">
                                        <div className="d-flex align-items-start">
                                            <div className="bg-danger bg-opacity-10 rounded-3 p-3 me-3">
                                                <i className="bi bi-geo-alt-fill text-danger fs-4"></i>
                                            </div>
                                            <div>
                                                <p className="text-muted mb-1 small">Address</p>
                                                <p className="fw-semibold mb-0">{employee.address || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-4" />

                                {/* Action Buttons */}
                                <div className="d-flex gap-3 justify-content-center">
                                    <button className="btn btn-primary px-4 py-2">
                                        <i className="bi bi-pencil-square me-2"></i>
                                        Edit Profile
                                    </button>
                                    <button className="btn btn-outline-secondary px-4 py-2">
                                        <i className="bi bi-clock-history me-2"></i>
                                        View History
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info Cards */}
                        <div className="row mt-4 g-3">
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm text-center py-4">
                                    <i className="bi bi-calendar-check text-primary fs-1 mb-2"></i>
                                    <h6 className="text-muted mb-0">Attendance</h6>
                                    <h4 className="fw-bold mt-1">95%</h4>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm text-center py-4">
                                    <i className="bi bi-graph-up text-success fs-1 mb-2"></i>
                                    <h6 className="text-muted mb-0">Performance</h6>
                                    <h4 className="fw-bold mt-1">Excellent</h4>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm text-center py-4">
                                    <i className="bi bi-trophy text-warning fs-1 mb-2"></i>
                                    <h6 className="text-muted mb-0">Projects</h6>
                                    <h4 className="fw-bold mt-1">12</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeeDetail   