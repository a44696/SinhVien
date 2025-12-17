import apiClient from '../../infrastructure/api/apiClient';

export class DepartmentService {
  async getAllDepartments() {
    const response = await apiClient.get('/department');
    return response.data;
  }

  async createDepartment(name, description) {
    const response = await apiClient.post('/add_department', { name, description });
    return response.data;
  }

  async updateDepartment(id, name, description) {
    const response = await apiClient.put(`/edit_department/${id}`, { name, description });
    return response.data;
  }

  async deleteDepartment(id) {
    const response = await apiClient.delete(`/delete_department/${id}`);
    return response.data;
  }
}