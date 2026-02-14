import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const pdfService = {
  extractText: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/api/pdf/extract-text', formData);
    return response.data;
  },

  getPdfPagesWithTextLocations: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/api/pdf/get-pages-with-text-locations', formData);
    return response.data;
  },

  editPdfComplete: async (file, edits, images = []) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('edits', JSON.stringify(edits));
    
    images.forEach(img => {
      formData.append('images', img);
    });
    
    const response = await apiClient.post('/api/pdf/edit-complete', formData, {
      responseType: 'blob',
    });
    return response.data;
  },

  extractTables: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/api/pdf/extract-tables', formData);
    return response.data;
  },

  mergePDFs: async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    const response = await apiClient.post('/api/pdf/merge', formData, {
      responseType: 'blob',
    });
    return response.data;
  },

  splitPDF: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/api/pdf/split', formData);
    return response.data;
  },

  rotatePDF: async (file, angle, pages = 'all') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('angle', angle);
    formData.append('pages', pages);
    const response = await apiClient.post('/api/pdf/rotate', formData, {
      responseType: 'blob',
    });
    return response.data;
  },

  addWatermark: async (file, watermarkText) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('watermark_text', watermarkText);
    const response = await apiClient.post('/api/pdf/add-watermark', formData, {
      responseType: 'blob',
    });
    return response.data;
  },

  encryptPDF: async (file, password) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);
    const response = await apiClient.post('/api/pdf/encrypt', formData, {
      responseType: 'blob',
    });
    return response.data;
  },

  convertToPDF: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/api/convert/to-pdf', formData, {
      responseType: 'blob',
    });
    return response.data;
  },

  downloadFile: async (filename) => {
    const response = await apiClient.get(`/api/pdf/download/${filename}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export default apiClient;