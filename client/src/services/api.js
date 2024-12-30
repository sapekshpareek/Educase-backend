import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const formService = {
  // Get all forms
  getForms: () => api.get('/forms'),

  // Get a specific form
  getForm: (id) => api.get(`/forms/${id}`),

  // Create a new form
  createForm: (formData) => api.post('/forms', formData),

  // Update a form
  updateForm: (id, formData) => api.put(`/forms/${id}`, formData),

  // Delete a form
  deleteForm: (id) => api.delete(`/forms/${id}`)
};

export const submissionService = {
  // Submit a form response
  submitForm: (formId, data) => api.post('/submissions', { formId, data }),

  // Get submissions for a form
  getSubmissions: (formId) => api.get(`/submissions/${formId}`),

  // Export submissions as CSV
  exportSubmissions: (formId) => api.get(`/submissions/${formId}/export`, {
    responseType: 'blob'
  })
};

export default api; 