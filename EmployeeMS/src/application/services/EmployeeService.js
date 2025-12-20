import apiClient from '../../infrastructure/api/apiClient';

export class EmployeeService {
  async getAllEmployees() {
    const response = await apiClient.get('/employee');
    return response.data;
  }

  async getEmployeeById(id) {
    const response = await apiClient.get(`/employee/${id}`);
    return response.data;
  }

  async createEmployee(employeeData) {
    const response = await apiClient.post('/add_employee', employeeData);
    return response.data;
  }

  async updateEmployee(id, employeeData) {
    const response = await apiClient.put(`/edit_employee/${id}`, employeeData);
    return response.data;
  }

  async deleteEmployee(id) {
    const response = await apiClient.delete(`/delete_employee/${id}`);
    return response.data;
  }

  async getEmployeeCount() {
    const response = await apiClient.get('/employee_count');
    return response.data;
  }

  async getTotalSalary() {
    const response = await apiClient.get('/salary_sum');
    return response.data;
  }
}
