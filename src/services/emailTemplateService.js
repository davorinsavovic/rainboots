import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://api.rainbootsmarketing.com';

export const emailTemplateService = {
  async getAll() {
    const { data } = await axios.get(`${API_BASE_URL}/api/email-templates`);
    return data.data;
  },

  async getById(id) {
    const { data } = await axios.get(
      `${API_BASE_URL}/api/email-templates/${id}`,
    );
    return data.data;
  },

  async create(template) {
    const { data } = await axios.post(
      `${API_BASE_URL}/api/email-templates`,
      template,
    );
    return data.data;
  },

  async update(id, template) {
    const payload = {
      name: template.name?.trim(),
      subject: template.subject?.trim(),
      content: template.content,
      variables: template.variables || [],
    };

    const { data } = await axios.put(
      `${API_BASE_URL}/api/email-templates/${id}`,
      payload,
    );

    return data.data;
  },

  async delete(id) {
    await axios.delete(`${API_BASE_URL}/api/email-templates/${id}`);
  },

  async uploadAttachment(id, file) {
    const formData = new FormData();
    formData.append('attachment', file);

    const { data } = await axios.post(
      `${API_BASE_URL}/api/email-templates/${id}/upload-attachment`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return data.data;
  },

  async deleteAttachment(templateId, attachmentId) {
    const { data } = await axios.delete(
      `${API_BASE_URL}/api/email-templates/${templateId}/attachments/${attachmentId}`,
    );
    return data.data;
  },

  async generatePreview(id) {
    const { data } = await axios.get(
      `${API_BASE_URL}/api/email-templates/${id}/generate-html`,
    );
    return data.data.html;
  },
};
