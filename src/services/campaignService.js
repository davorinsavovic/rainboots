import { API_BASE_URL } from '../config';

export const campaignService = {
  /**
   * Send campaign with audit report
   * @param {string} templateId - Email template ID
   * @param {string[]} leadIds - Array of lead IDs
   * @param {Object} options - Options for report inclusion
   * @param {boolean} options.includeReport - Whether to include the audit report
   * @param {string} options.reportFormat - 'inline', 'attachment', or 'both'
   */
  async sendCampaignWithReport(templateId, leadIds, options = {}) {
    const { includeReport = true, reportFormat = 'inline' } = options;

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${API_BASE_URL}/api/email/send-campaign-with-report`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            templateId,
            leadIds,
            includeReport,
            reportFormat,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send campaign');
      }

      return await response.json();
    } catch (error) {
      console.error('Campaign send error:', error);
      throw error;
    }
  },
};
