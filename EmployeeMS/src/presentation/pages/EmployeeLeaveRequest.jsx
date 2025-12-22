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
  const [editingId, setEditingId] = useState(null)
  const [editFormData, setEditFormData] = useState({
    leave_type: 'sick',
    start_date: '',
    end_date: '',
    reason: ''
  })
  const [viewingRequest, setViewingRequest] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditFormData({
      ...editFormData,
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

    // Validate dates
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const startDate = new Date(formData.start_date)
    const endDate = new Date(formData.end_date)

    if (startDate < today) {
      setError('Không thể đăng ký nghỉ cho ngày trong quá khứ')
      setLoading(false)
      return
    }

    if (endDate < startDate) {
      setError('Ngày kết thúc không được nhỏ hơn ngày bắt đầu')
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

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    if (!editFormData.start_date || !editFormData.end_date || !editFormData.reason) {
      setError('Vui lòng điền tất cả các trường bắt buộc')
      setLoading(false)
      return
    }

    // Validate dates
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const startDate = new Date(editFormData.start_date)
    const endDate = new Date(editFormData.end_date)

    if (startDate < today) {
      setError('Không thể đăng ký nghỉ cho ngày trong quá khứ')
      setLoading(false)
      return
    }

    if (endDate < startDate) {
      setError('Ngày kết thúc không được nhỏ hơn ngày bắt đầu')
      setLoading(false)
      return
    }

    try {
      const result = await axios.put(`http://localhost:3000/employee/leave_request/${editingId}`, editFormData)
      if (result.data.Status) {
        setSuccess('Đơn xin nghỉ đã được cập nhật')
        setEditingId(null)
        loadRequests()
      } else {
        setError(result.data.Error || 'Có lỗi xảy ra')
      }
    } catch (err) {
      console.log(err)
      setError('Lỗi khi cập nhật đơn xin nghỉ')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (requestId) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá đơn xin nghỉ này?')) {
      setLoading(true)
      setError(null)
      setSuccess(null)

      try {
        const result = await axios.delete(`http://localhost:3000/employee/leave_request/${requestId}`)
        if (result.data.Status) {
          setSuccess('Đơn xin nghỉ đã được xoá')
          loadRequests()
        } else {
          setError(result.data.Error || 'Có lỗi xảy ra')
        }
      } catch (err) {
        console.log(err)
        setError('Lỗi khi xoá đơn xin nghỉ')
      } finally {
        setLoading(false)
      }
    }
  }

  const startEdit = (request) => {
    setEditingId(request.id)
    setEditFormData({
      leave_type: request.leave_type,
      start_date: request.start_date.split('T')[0],
      end_date: request.end_date.split('T')[0],
      reason: request.reason
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditFormData({
      leave_type: 'sick',
      start_date: '',
      end_date: '',
      reason: ''
    })
  }

  const startView = (request) => {
    setViewingRequest(request)
  }

  const closeView = () => {
    setViewingRequest(null)
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
                    min={new Date().toISOString().split('T')[0]}
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
                    min={formData.start_date || new Date().toISOString().split('T')[0]}
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
                      {editingId === req.id ? (
                        // Edit Form
                        <div className="p-3">
                          <h6 className="mb-3">Sửa Đơn Xin Nghỉ</h6>
                          <div className="mb-2">
                            <label className="form-label small">
                              <strong>Loại Nghỉ</strong>
                            </label>
                            <select
                              name="leave_type"
                              className="form-select form-select-sm"
                              value={editFormData.leave_type}
                              onChange={handleEditChange}
                            >
                              <option value="sick">Sick Leave</option>
                              <option value="personal">Personal Leave</option>
                              <option value="vacation">Vacation</option>
                              <option value="emergency">Emergency Leave</option>
                            </select>
                          </div>

                          <div className="mb-2">
                            <label className="form-label small">
                              <strong>Ngày Bắt Đầu</strong>
                            </label>
                            <input
                              type="date"
                              name="start_date"
                              className="form-control form-control-sm"
                              value={editFormData.start_date}
                              onChange={handleEditChange}
                              min={new Date().toISOString().split('T')[0]}
                              required
                            />
                          </div>

                          <div className="mb-2">
                            <label className="form-label small">
                              <strong>Ngày Kết Thúc</strong>
                            </label>
                            <input
                              type="date"
                              name="end_date"
                              className="form-control form-control-sm"
                              value={editFormData.end_date}
                              onChange={handleEditChange}
                              min={editFormData.start_date || new Date().toISOString().split('T')[0]}
                              required
                            />
                          </div>

                          <div className="mb-3">
                            <label className="form-label small">
                              <strong>Lý Do</strong>
                            </label>
                            <textarea
                              name="reason"
                              className="form-control form-control-sm"
                              rows="2"
                              value={editFormData.reason}
                              onChange={handleEditChange}
                              required
                            ></textarea>
                          </div>

                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={handleEditSubmit}
                              disabled={loading}
                            >
                              <i className="bi bi-check me-1"></i>
                              Lưu
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={cancelEdit}
                              disabled={loading}
                            >
                              <i className="bi bi-x me-1"></i>
                              Hủy
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <>
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <h6 className="mb-1">
                                <span className="badge bg-info me-2">{req.leave_type}</span>
                              </h6>
                              <p className="mb-1 text-muted small">
                                <i className="bi bi-calendar me-1"></i>
                                {new Date(req.start_date).toLocaleDateString()} - {new Date(req.end_date).toLocaleDateString()}
                              </p>
                              <p className="mb-0 small">{req.reason}</p>
                            </div>
                            <div className="d-flex flex-column align-items-end">
                              <span
                                className={`badge bg-${
                                  req.status === 'approved'
                                    ? 'success'
                                    : req.status === 'rejected'
                                    ? 'danger'
                                    : 'warning'
                                } mb-2`}
                              >
                                {req.status}
                              </span>
                              <div className="d-flex gap-1">
                                <button
                                  className="btn btn-sm btn-outline-info"
                                  onClick={() => startView(req)}
                                  disabled={loading}
                                  title="Xem Chi Tiết"
                                >
                                  <i className="bi bi-eye"></i>
                                </button>
                                {req.status === 'pending' && (
                                  <>
                                    <button
                                      className="btn btn-sm btn-outline-primary"
                                      onClick={() => startEdit(req)}
                                      disabled={loading}
                                      title="Sửa"
                                    >
                                      <i className="bi bi-pencil"></i>
                                    </button>
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => handleDelete(req.id)}
                                      disabled={loading}
                                      title="Xoá"
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {viewingRequest && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chi Tiết Đơn Xin Nghỉ</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeView}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <h6 className="text-muted">Loại Nghỉ</h6>
                    <p className="mb-0">
                      <span className="badge bg-info">{viewingRequest.leave_type}</span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted">Trạng Thái</h6>
                    <p className="mb-0">
                      <span
                        className={`badge bg-${
                          viewingRequest.status === 'approved'
                            ? 'success'
                            : viewingRequest.status === 'rejected'
                            ? 'danger'
                            : 'warning'
                        }`}
                      >
                        {viewingRequest.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <h6 className="text-muted">Ngày Bắt Đầu</h6>
                    <p className="mb-0">
                      <strong>{new Date(viewingRequest.start_date).toLocaleDateString('vi-VN')}</strong>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted">Ngày Kết Thúc</h6>
                    <p className="mb-0">
                      <strong>{new Date(viewingRequest.end_date).toLocaleDateString('vi-VN')}</strong>
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <h6 className="text-muted">Lý Do</h6>
                  <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                    {viewingRequest.reason}
                  </p>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <h6 className="text-muted">Ngày Tạo</h6>
                    <p className="mb-0 small">
                      {new Date(viewingRequest.created_at).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted">Tổng Ngày Nghỉ</h6>
                    <p className="mb-0">
                      <strong>
                        {Math.ceil(
                          (new Date(viewingRequest.end_date) - new Date(viewingRequest.start_date)) / (1000 * 60 * 60 * 24) + 1
                        )}{' '}
                        ngày
                      </strong>
                    </p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeView}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployeeLeaveRequest
