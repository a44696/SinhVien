import apiClient from '../../infrastructure/api/apiClient';

export class DepartmentService {
  async getAllDepartments() {
    const response = await apiClient.get('/admin/department');
    return response.data;
  }

  async createDepartment(name, description) {
    const response = await apiClient.post('/admin/add_department', { name, description });
    return response.data;
  }

  async updateDepartment(id, name, description) {
    const response = await apiClient.put(`/admin/edit_department/${id}`, { name, description });
    return response.data;
  }

  async deleteDepartment(id) {
    const response = await apiClient.delete(`/admin/delete_department/${id}`);
    return response.data;
  }
}