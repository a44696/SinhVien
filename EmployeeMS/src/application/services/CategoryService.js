import apiClient from '../../infrastructure/api/apiClient';

export class CategoryService {
  async getAllCategories() {
    const response = await apiClient.get('/category');
    return response.data;
  }

  async createCategory(categoryName) {
    const response = await apiClient.post('/add_category', { category: categoryName });
    return response.data;
  }
}
