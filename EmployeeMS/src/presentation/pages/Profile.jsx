import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminService } from '../../application/services'

const adminService = new AdminService();

const Profile = () => {
  const [admin, setAdmin] = useState({
    email: "",
  })
  const navigate = useNavigate()

  useEffect(() => {
    loadAdminProfile();
  }, [])

  const loadAdminProfile = async () => {
    try {
      const result = await adminService.getAdminDetails();
      if (result.Status) {
        setAdmin({
          email: result.Result[0].email
        })
      } else {
        alert(result.Error)
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Admin Profile</h3>
      </div>
      <div className="d-flex justify-content-center mt-5">
        <div className="p-5 border rounded w-50 shadow-sm">
          <div className="mb-4">
            <label className="form-label fw-bold">Email:</label>
            <p className="form-control rounded-0 bg-light">{admin.email}</p>
          </div>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-warning"
              onClick={() => navigate('/dashboard/edit_admin/1')}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
