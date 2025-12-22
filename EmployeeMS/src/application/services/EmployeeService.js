import apiClient from '../../infrastructure/api/apiClient';

export class EmployeeService {
  async getAllEmployees() {
    const response = await apiClient.get('/admin/employee');
    return response.data;
  }

  async getEmployeeById(id) {
    const response = await apiClient.get(`/admin/employee/${id}`);
    return response.data;
  }

  async createEmployee(employeeData) {
    const response = await apiClient.post('/admin/add_employee', employeeData);
    return response.data;
  }

  async updateEmployee(id, employeeData) {
    const response = await apiClient.put(`/admin/edit_employee/${id}`, employeeData);
    return response.data;
  }

  async deleteEmployee(id) {
    const response = await apiClient.delete(`/admin/delete_employee/${id}`);
    return response.data;
  }

  async getEmployeeCount() {
    const response = await apiClient.get('/admin/employee_count');
    return response.data;
  }

  async getTotalSalary() {
    const response = await apiClient.get('/admin/salary_sum');
    return response.data;
  }

  async submitLeaveRequest(leaveData) {
    const response = await apiClient.post('/employee/leave_request', leaveData);
    return response.data;
  }

  async getLeaveRequests(employeeId) {
    const response = await apiClient.get(`/employee/leave_requests/${employeeId}`);
    return response.data;
  }

  async updateLeaveRequest(id, leaveData) {
    const response = await apiClient.put(`/employee/leave_request/${id}`, leaveData);
    return response.data;
  }

  async deleteLeaveRequest(id) {
    const response = await apiClient.delete(`/employee/leave_request/${id}`);
    return response.data;
  }
}
