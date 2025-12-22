import React, { useEffect, useState } from 'react'
import axios from 'axios'

const LeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchEmployee, setSearchEmployee] = useState('')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [action, setAction] = useState('')

  useEffect(() => {
    loadLeaveRequests()
  }, [])

  const loadLeaveRequests = async () => {
    setLoading(true)
    try {
      const result = await axios.get('http://localhost:3000/admin/all_leave_requests')
      if (result.data.Status) {
        console.log('Leave requests loaded:', result.data.Result)
        setLeaveRequests(result.data.Result)
      } else {
        alert(result.data.Error)
      }
    } catch (err) {
      console.log(err)
      alert('Error loading leave requests')
    } finally {
      setLoading(false)
    }
  }

  const filteredRequests = leaveRequests.filter((req) => {
    const statusMatch = filterStatus === 'all' || req.status === filterStatus
    const employeeName = (req.employee_name || '').toString().toLowerCase()
    const searchText = searchEmployee.toLowerCase()
    const employeeMatch = employeeName.includes(searchText)
    return statusMatch && employeeMatch
  })

  const handleApproveClick = (request) => {
    setSelectedRequest(request)
    setAction('approve')
    setShowModal(true)
  }

  const handleRejectClick = (request) => {
    setSelectedRequest(request)
    setAction('reject')
    setShowModal(true)
  }

  const handleSubmitAction = async () => {
    if (!selectedRequest) return

    try {
      const result = await axios.put(
        `http://localhost:3000/admin/leave_request/${selectedRequest.id}/status`,
        { status: action }
      )

      if (result.data.Status) {
        alert(`Leave request ${action}ed successfully`)
        setShowModal(false)
        setSelectedRequest(null)
        setAction('')
        loadLeaveRequests()
      } else {
        alert(result.data.Error)
      }
    } catch (err) {
      console.log(err)
      alert('Error updating leave request')
    }
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-success'
      case 'rejected':
        return 'bg-danger'
      case 'pending':
      default:
        return 'bg-warning'
    }
  }

  const getLeaveTypeIcon = (type) => {
    switch (type) {
      case 'sick':
        return 'bi-hospital'
      case 'personal':
        return 'bi-person'
      case 'vacation':
        return 'bi-airplane'
      case 'emergency':
        return 'bi-exclamation-triangle'
      default:
        return 'bi-calendar-x'
    }
  }

  return (
    <div className="px-5 mt-3">
      {/* Filter Section */}
      <div className="mb-4 mt-5">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <h4 className="mb-0">All Leave Requests</h4>

          <div style={{ minWidth: 320, maxWidth: 520, width: "100%" }}>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm theo tên nhân viên..."
                value={searchEmployee}
                onChange={(e) => setSearchEmployee(e.target.value)}
              />
              {searchEmployee && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setSearchEmployee("")}
                  title="Xoá tìm kiếm"
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>         
        </div>
          {/* <div className="col-md-6">
            <div className="d-flex align-items-center gap-2">
              <label className="form-label mb-0 me-2"> trạng thái:</label>
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ width: 'auto' }}
              >
                  <option value="all">All</option>
                  <option value="pending">pending</option>
                <option value="approved">approve</option>
                <option value="rejected">reject</option>
              </select>
            </div>
          </div> */}
        </div>
      </div>

      {/* Table Card */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead>
                <tr>
                  <th className="px-4 py-3" style={{ width: 80 }}>ID</th>
                  <th className="px-4 py-3">Employee Name</th>
                  <th className="px-4 py-3">Leave Type</th>
                  <th className="px-4 py-3">Start Date</th>
                  <th className="px-4 py-3">End Date</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3" style={{ width: 120 }}>Status</th>
                  <th className="px-4 py-3 text-center" style={{ width: 200 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr key={req.id}>
                    <td className="px-4 py-3 align-middle">{req.id}</td>
                    <td className="px-4 py-3 align-middle fw-semibold">{req.employee_name}</td>
                    <td className="px-4 py-3 align-middle">
                      <i className={`bi ${getLeaveTypeIcon(req.leave_type)} me-2`}></i>
                      <span className="text-capitalize">{req.leave_type}</span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <i className="bi bi-calendar me-1"></i>
                      {new Date(req.start_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <i className="bi bi-calendar me-1"></i>
                      {new Date(req.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <small className="text-muted">{req.reason.substring(0, 50)}...</small>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <span className={`badge ${getStatusBadgeColor(req.status)} text-capitalize`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-middle text-center" style={{ whiteSpace: 'nowrap' }}>
                      {req.status === 'pending' ? (
                        <>
                          <button
                            className="btn btn-sm btn-outline-success me-2"
                            onClick={() => handleApproveClick(req)}
                          >
                            <i className="bi bi-check-circle me-1"></i>
                            Approve
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleRejectClick(req)}
                          >
                            <i className="bi bi-x-circle me-1"></i>
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-muted">No action</span>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-5 text-muted">
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      <p className="mb-0">No leave requests found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && selectedRequest && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {action === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="mb-2">
                    <strong>Employee:</strong> {selectedRequest.employee_name}
                  </p>
                  <p className="mb-2">
                    <strong>Leave Type:</strong> {selectedRequest.leave_type}
                  </p>
                  <p className="mb-2">
                    <strong>Period:</strong> {new Date(selectedRequest.start_date).toLocaleDateString()} -{' '}
                    {new Date(selectedRequest.end_date).toLocaleDateString()}
                  </p>
                  <p className="mb-3">
                    <strong>Reason:</strong> {selectedRequest.reason}
                  </p>
                  <div
                    className={`alert ${action === 'approve' ? 'alert-success' : 'alert-danger'}`}
                    role="alert"
                  >
                    {action === 'approve'
                      ? 'Are you sure you want to approve this leave request?'
                      : 'Are you sure you want to reject this leave request?'}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`btn ${action === 'approve' ? 'btn-success' : 'btn-danger'}`}
                    onClick={handleSubmitAction}
                  >
                    {action === 'approve' ? 'Approve' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setShowModal(false)}></div>
        </>
      )}
    </div>
  )
}

export default LeaveRequests
