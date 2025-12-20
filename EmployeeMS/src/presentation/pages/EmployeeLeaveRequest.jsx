import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const EmployeeLeaveRequest = () => {
  const { id } = useParams()
  const [formData, setFormData] = useState({
    employee_id: id,
    leave_type: 'sick',
    start_date: '',
    end_date: '',
    reason: ''
  })
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    if (!formData.start_date || !formData.end_date || !formData.reason) {
      setError('Vui lòng điền tất cả các trường bắt buộc')
      setLoading(false)
      return
    }

    try {
      const result = await axios.post('http://localhost:3000/employee/leave_request', formData)
      if (result.data.Status) {
        setSuccess('Đơn xin nghỉ đã được gửi thành công')
        setFormData({
          employee_id: id,
          leave_type: 'sick',
          start_date: '',
          end_date: '',
          reason: ''
        })
        // Load updated requests
        loadRequests()
      } else {
        setError(result.data.Error || 'Có lỗi xảy ra')
      }
    } catch (err) {
      console.log(err)
      setError('Lỗi khi gửi đơn xin nghỉ')
    } finally {
      setLoading(false)
    }
  }

  const loadRequests = async () => {
    try {
      const result = await axios.get(`http://localhost:3000/employee/leave_requests/${id}`)
      if (result.data.Status) {
        setRequests(result.data.Result)
      }
    } catch (err) {
      console.log(err)
    }
  }

  React.useEffect(() => {
    loadRequests()
  }, [id])

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Leave Request</h3>
      </div>

      <div className="row mt-4">
        {/* Form Section */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">
                <i className="bi bi-calendar-x me-2"></i>
                Submit Leave Request
              </h5>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {error}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setError(null)}
                  ></button>
                </div>
              )}
              {success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  {success}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSuccess(null)}
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">
                    <strong>Leave Type</strong>
                  </label>
                  <select
                    name="leave_type"
                    className="form-select"
                    value={formData.leave_type}
                    onChange={handleChange}
                  >
                    <option value="sick">Sick Leave</option>
                    <option value="personal">Personal Leave</option>
                    <option value="vacation">Vacation</option>
                    <option value="emergency">Emergency Leave</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <strong>Start Date</strong>
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    className="form-control"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <strong>End Date</strong>
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    className="form-control"
                    value={formData.end_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <strong>Reason</strong>
                  </label>
                  <textarea
                    name="reason"
                    className="form-control"
                    rows="4"
                    placeholder="Enter reason for leave"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send me-2"></i>
                      Submit Request
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Requests History Section */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">
                <i className="bi bi-clock-history me-2"></i>
                My Leave Requests
              </h5>
            </div>
            <div className="card-body p-0">
              {requests.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                  <p className="mb-0">No leave requests yet</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {requests.map((req) => (
                    <div key={req.id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">
                            <span className="badge bg-info me-2">{req.leave_type}</span>
                          </h6>
                          <p className="mb-1 text-muted small">
                            <i className="bi bi-calendar me-1"></i>
                            {new Date(req.start_date).toLocaleDateString()} - {new Date(req.end_date).toLocaleDateString()}
                          </p>
                          <p className="mb-0 small">{req.reason}</p>
                        </div>
                        <span
                          className={`badge bg-${
                            req.status === 'approved'
                              ? 'success'
                              : req.status === 'rejected'
                              ? 'danger'
                              : 'warning'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeLeaveRequest
