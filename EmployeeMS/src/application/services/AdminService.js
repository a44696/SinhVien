import apiClient from '../../infrastructure/api/apiClient';

export class AdminService {
  async login(email, password) {
    const response = await apiClient.post('/admin/adminlogin', { email, password });
    return response.data;
  }

  async getAdminDetails() {
    const response = await apiClient.get('/admin/admin_details');
    return response.data;
  }

  async getAdminById(id) {
    const response = await apiClient.get(`/admin/admin/${id}`);
    return response.data;
  }

  async updateAdmin(id, email, password = '') {
    const response = await apiClient.put(`/admin/edit_admin/${id}`, { email, password });
    return response.data;
  }

  async deleteAdmin(id) {
    const response = await apiClient.delete(`/admin/delete_admin/${id}`);
    return response.data;
  }

  async getAllAdmins() {
    const response = await apiClient.get('/admin/admin_records');
    return response.data;
  }

  async getAdminCount() {
    const response = await apiClient.get('/admin/admin_count');
    return response.data;
  }
}
