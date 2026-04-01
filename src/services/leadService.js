import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/leads`;

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

export const leadService = {
  async getAll(params) {
    const { data } = await axios.get(API_URL, {
      ...getAuthHeaders(),
      params,
    });
    return data;
  },

  async getById(id) {
    const { data } = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return data.data;
  },

  async create(lead) {
    const { data } = await axios.post(API_URL, lead, getAuthHeaders());
    return data.data;
  },

  async update(id, lead) {
    const { data } = await axios.put(
      `${API_URL}/${id}`,
      lead,
      getAuthHeaders(),
    );
    return data.data;
  },

  async delete(id) {
    await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  },

  async bulkDelete(ids) {
    await axios.delete(API_URL, {
      ...getAuthHeaders(),
      data: { ids },
    });
  },

  async scrapeEmail(domain) {
    const { data } = await axios.post(
      `${API_URL}/scrape-email`,
      { domain },
      getAuthHeaders(),
    );
    return data.success ? data.data : null;
  },

  async scrapeBulk(domains) {
    const { data } = await axios.post(
      `${API_URL}/scrape-bulk`,
      { domains },
      getAuthHeaders(),
    );
    return data.data;
  },

  async importCSV(file) {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await axios.post(`${API_URL}/import-csv`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return data.data;
  },

  async getAllTags() {
    const { data } = await axios.get(`${API_URL}/tags/all`, getAuthHeaders());
    return data.data;
  },
};

export const emailService = {
  async sendCampaign(templateId, leadIds) {
    const { data } = await axios.post(
      `${API_BASE_URL}/email/send-campaign`,
      { templateId, leadIds },
      getAuthHeaders(),
    );
    return data;
  },

  async sendManual(templateId, emails) {
    const { data } = await axios.post(
      `${API_BASE_URL}/email/send-manual`,
      { templateId, emails },
      getAuthHeaders(),
    );
    return data;
  },

  async preview(templateId) {
    const { data } = await axios.post(
      `${API_BASE_URL}/email/preview`,
      { templateId },
      getAuthHeaders(),
    );
    return data.data;
  },
};
