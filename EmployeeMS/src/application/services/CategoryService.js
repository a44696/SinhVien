import apiClient from '../../infrastructure/api/apiClient';

export class CategoryService {
  async getAllCategories(departmentId = null) {
    const url = departmentId ? `/admin/category?department_id=${departmentId}` : '/admin/category';
    const response = await apiClient.get(url);
    return response.data;
  }

  async getCategoryEmployees(categoryId) {
    const response = await apiClient.get(`/admin/category/${categoryId}/employees`);
    return response.data;
  }

  async createCategory(name, departmentId) {
    const response = await apiClient.post('/admin/add_category', { name, department_id: departmentId });
    return response.data;
  }

  async updateCategory(id, name, departmentId) {
    const response = await apiClient.put(`/admin/edit_category/${id}`, { name, department_id: departmentId });
    return response.data;
  }

  async deleteCategory(id) {
    const response = await apiClient.delete(`/admin/delete_category/${id}`);
    return response.data;
  }
}