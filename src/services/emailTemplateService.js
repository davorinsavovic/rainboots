import axios from 'axios';
import { API_BASE_URL } from '../config';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to log requests in development (optional)
if (import.meta.env.DEV) {
  apiClient.interceptors.request.use(
    (config) => {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
      );
      return config;
    },
    (error) => Promise.reject(error),
  );
}

export const emailTemplateService = {
  async getAll() {
    try {
      const { data } = await apiClient.get('/api/email-templates');
      return data.data;
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { data } = await apiClient.get(`/api/email-templates/${id}`);
      return data.data;
    } catch (error) {
      console.error('Error fetching template:', error);
      throw error;
    }
  },

  async create(template) {
    try {
      const payload = {
        title: template.title?.trim(),
        subject: template.subject?.trim(),
        content: template.content,
        category: template.category || 'outreach',
        status: template.status !== undefined ? template.status : true,
        includeSignature: template.includeSignature || false,
        signatureConfig: template.signatureConfig || {
          organizationName: 'Rainboots Marketing',
          title: '',
          fullName: '',
          phone: '',
          email: '',
          website: 'https://rainbootsmarketing.com',
          additionalInfo: '',
        },
        variables: template.variables || [],
        tags: template.tags || [],
      };

      const { data } = await apiClient.post('/api/email-templates', payload);
      return data.data;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  },

  async update(id, template) {
    try {
      const payload = {
        title: template.title?.trim(),
        subject: template.subject?.trim(),
        content: template.content,
        category: template.category,
        status: template.status,
        includeSignature: template.includeSignature,
        signatureConfig: template.signatureConfig,
        variables: template.variables || [],
        tags: template.tags || [],
      };

      const { data } = await apiClient.put(
        `/api/email-templates/${id}`,
        payload,
      );
      return data.data;
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await apiClient.delete(`/api/email-templates/${id}`);
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  },

  async uploadAttachment(id, file) {
    try {
      const formData = new FormData();
      formData.append('attachment', file);

      const { data } = await apiClient.post(
        `/api/email-templates/${id}/upload-attachment`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return data.data;
    } catch (error) {
      console.error('Error uploading attachment:', error);
      throw error;
    }
  },

  async deleteAttachment(templateId, attachmentId) {
    try {
      const { data } = await apiClient.delete(
        `/api/email-templates/${templateId}/attachments/${attachmentId}`,
      );
      return data.data;
    } catch (error) {
      console.error('Error deleting attachment:', error);
      throw error;
    }
  },

  async generatePreview(id) {
    try {
      const { data } = await apiClient.get(
        `/api/email-templates/${id}/generate-html`,
      );
      return data.data.html;
    } catch (error) {
      console.error('Error generating preview:', error);
      throw error;
    }
  },
};
