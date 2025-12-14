import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminService } from '../../application/services'

const adminService = new AdminService();

const EditAdmin = () => {
  const { id } = useParams()
  const [admin, setAdmin] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate()

  useEffect(() => {
    loadAdmin();
  }, [])

  const loadAdmin = async () => {
    try {
      const result = await adminService.getAdminById(id);
      if (result.Status) {
        setAdmin({
          email: result.Result[0].email,
          password: ""
        })
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!admin.email) {
      alert('Please fill email field')
      return;
    }

    try {
      const result = await adminService.updateAdmin(id, admin.email, admin.password);
      if (result.Status) {
        alert('Admin updated successfully')
        navigate('/dashboard')
      } else {
        alert(result.Error)
      }
    } catch (err) {
      console.log(err)
      alert('Error updating admin')
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Edit Admin</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputEmail" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control rounded-0"
              id="inputEmail"
              placeholder="Enter Email"
              autoComplete="off"
              value={admin.email}
              onChange={(e) =>
                setAdmin({ ...admin, email: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputPassword" className="form-label">
              Password (Leave empty to keep current password)
            </label>
            <input
              type="password"
              className="form-control rounded-0"
              id="inputPassword"
              placeholder="Enter New Password (Optional)"
              onChange={(e) =>
                setAdmin({ ...admin, password: e.target.value })
              }
            />
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Edit Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditAdmin
