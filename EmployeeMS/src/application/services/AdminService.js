import apiClient from '../../infrastructure/api/apiClient';

export class AdminService {
  async login(email, password) {
    const response = await apiClient.post('/adminlogin', { email, password });
    return response.data;
  }

  async getAdminDetails() {
    const response = await apiClient.get('/admin_details');
    return response.data;
  }

  async getAdminById(id) {
    const response = await apiClient.get(`/admin/${id}`);
    return response.data;
  }

  async updateAdmin(id, email, password = '') {
    const response = await apiClient.put(`/edit_admin/${id}`, { email, password });
    return response.data;
  }

  async deleteAdmin(id) {
    const response = await apiClient.delete(`/delete_admin/${id}`);
    return response.data;
  }

  async getAllAdmins() {
    const response = await apiClient.get('/admin_records');
    return response.data;
  }

  async getAdminCount() {
    const response = await apiClient.get('/admin_count');
    return response.data;
  }
}
