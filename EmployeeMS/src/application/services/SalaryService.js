import apiClient from '../../infrastructure/api/apiClient';

export class SalaryService {
  async getAllSalaries() {
    const response = await apiClient.get('/salary');
    return response.data;
  }

  async createSalary(employeeId, amount, effectiveDate) {
    const response = await apiClient.post('/add_salary', { 
      employee_id: employeeId, 
      amount, 
      effective_date: effectiveDate 
    });
    return response.data;
  }

  async updateSalary(id, employeeId, amount, effectiveDate) {
    const response = await apiClient.put(`/edit_salary/${id}`, { 
      employee_id: employeeId, 
      amount, 
      effective_date: effectiveDate 
    });
    return response.data;
  }

  async deleteSalary(id) {
    const response = await apiClient.delete(`/delete_salary/${id}`);
    return response.data;
  }
}