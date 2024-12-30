const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface FormService {
  createForm: (formData: any) => Promise<any>;
  getForms: () => Promise<any>;
  getForm: (id: string) => Promise<any>;
  getFormByShareableLink: (shareableLink: string) => Promise<any>;
}

export const formService: FormService = {
  createForm: async (formData: any) => {
    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save form');
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },

  getForms: async () => {
    try {
      console.log('API Service: Starting fetch');
      const response = await fetch('/api/forms');
      console.log('API Service: Response status:', response.status);
      
      if (!response.ok) {
        const error = await response.json();
        console.error('API Service: Server error:', error);
        throw new Error(error.message || 'Failed to fetch forms');
      }

      const data = await response.json();
      console.log('API Service: Raw data:', data);
      return data.data || data;
    } catch (error) {
      console.error('API Service: Error:', error);
      throw error;
    }
  },

  getForm: async (id: string) => {
    try {
      const response = await fetch(`/api/forms/${id}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch form');
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },

  getFormByShareableLink: async (shareableLink: string) => {
    try {
      console.log('API Service: Fetching form by shareable link:', shareableLink);
      const response = await fetch(`/api/forms/shared/${shareableLink}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch form');
      }

      const data = await response.json();
      console.log('API Service: Form data:', data);
      return data.data || data;
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  }
}; 