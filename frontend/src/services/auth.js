import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const authService = {
  register: async (email, username, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        email,
        username,
        password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Registration failed';
    }
  },

  login: async (username, password) => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, formData);
      
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('username', username);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Login failed';
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  getUsername: () => {
    return localStorage.getItem('username');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getCurrentUser: async () => {
    const token = authService.getToken();
    if (!token) return null;
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      authService.logout();
      return null;
    }
  },

  getMyFiles: async () => {
    const token = authService.getToken();
    if (!token) throw new Error('Not authenticated');
    
    const response = await axios.get(`${API_BASE_URL}/api/files/my-files`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  getOperationHistory: async (limit = 50) => {
    const token = authService.getToken();
    if (!token) throw new Error('Not authenticated');
    
    const response = await axios.get(`${API_BASE_URL}/api/operations/history?limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  deleteFile: async (fileId) => {
    const token = authService.getToken();
    if (!token) throw new Error('Not authenticated');
    
    const response = await axios.delete(`${API_BASE_URL}/api/files/${fileId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
};