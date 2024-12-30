export const formService = {
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
      const response = await fetch('/api/forms');
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch forms');
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('API error:', error);
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
      const response = await fetch(`/api/forms/shared/${shareableLink}`);
      
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

  submitForm: async (formId: string, formData: any) => {
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId,
          data: formData
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit form');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },

  getFormSubmissions: async (formId: string) => {
    try {
      const response = await fetch(`/api/submissions/form/${formId}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch submissions');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  }
}; 