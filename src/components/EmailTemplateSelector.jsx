import React, { useState, useEffect, useCallback } from 'react';
import { emailTemplateService } from '../services/emailTemplateService';
import { API_BASE_URL } from '../config';
import './EmailTemplateSelector.css';

export const EmailTemplateSelector = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [leads, setLeads] = useState([]);
  const [selectedLeadsMap, setSelectedLeadsMap] = useState({});
  const [loading, setLoading] = useState({
    templates: true,
    leads: false,
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [sendingStatus, setSendingStatus] = useState('idle');
  const [sendProgress, setSendProgress] = useState({
    total: 0,
    sent: 0,
    failed: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [minScore, setMinScore] = useState(0);
  const [leadsPagination, setLeadsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalLeads: 0,
  });
  const [includeReport, setIncludeReport] = useState(true);
  const [reportFormat, setReportFormat] = useState('inline');
  const [selectedLeadForPreview, setSelectedLeadForPreview] = useState(null);
  const [personalizedPreviewHtml, setPersonalizedPreviewHtml] = useState('');
  const [showPersonalizedPreview, setShowPersonalizedPreview] = useState(false);

  // Email styling function
  const addEmailStyles = (html) => {
    if (!html) return '';
    let styledHtml = html;
    styledHtml = styledHtml.replace(
      /<p(\s[^>]*)?>/g,
      '<p style="margin: 0 0 16px; padding: 0; line-height: 1.6; color: #333;"$1>',
    );
    styledHtml = styledHtml.replace(
      /<h1(\s[^>]*)?>/g,
      '<h1 style="font-size: 28px; font-weight: bold; margin: 0 0 20px; padding: 0; color: #222; line-height: 1.3;"$1>',
    );
    styledHtml = styledHtml.replace(
      /<h2(\s[^>]*)?>/g,
      '<h2 style="font-size: 24px; font-weight: bold; margin: 0 0 18px; padding: 0; color: #222; line-height: 1.3;"$1>',
    );
    styledHtml = styledHtml.replace(
      /<h3(\s[^>]*)?>/g,
      '<h3 style="font-size: 20px; font-weight: 600; margin: 0 0 16px; padding: 0; color: #222; line-height: 1.3;"$1>',
    );
    styledHtml = styledHtml.replace(
      /<ul(\s[^>]*)?>/g,
      '<ul style="margin: 0 0 16px 20px; padding: 0; color: #333; line-height: 1.6;"$1>',
    );
    styledHtml = styledHtml.replace(
      /<ol(\s[^>]*)?>/g,
      '<ol style="margin: 0 0 16px 20px; padding: 0; color: #333; line-height: 1.6;"$1>',
    );
    styledHtml = styledHtml.replace(
      /<li(\s[^>]*)?>/g,
      '<li style="margin: 0 0 8px; padding: 0;"$1>',
    );
    styledHtml = styledHtml.replace(
      /<a(\s[^>]*)?>/g,
      '<a style="color: #212d51; text-decoration: none; border-bottom: 1px solid #212d51; padding-bottom: 1px;"$1>',
    );
    return styledHtml;
  };

  const generateSignatureHTML = (signatureConfig) => {
    if (!signatureConfig) return '';
    const {
      organizationName = 'Rainboots Marketing',
      title = '',
      fullName = '',
      phone = '',
      email = '',
      website = 'https://rainbootsmarketing.com',
      additionalInfo = '',
    } = signatureConfig;
    return `
<div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eaeaea;">
  <strong style="color: #222; font-size: 16px; display: block; margin-bottom: 8px;">${organizationName}</strong>
  ${fullName ? `<div style="margin-bottom: 4px;"><strong>${fullName}</strong></div>` : ''}
  ${title ? `<div style="margin-bottom: 4px; color: #666; font-size: 14px;">${title}</div>` : ''}
  <div style="margin-top: 12px; font-size: 14px;">
    ${phone ? `<div style="margin-bottom: 4px;"><span style="color: #666;">Phone:</span> ${phone}</div>` : ''}
    ${email ? `<div style="margin-bottom: 4px;"><span style="color: #666;">Email:</span> <a href="mailto:${email}" style="color: #212d51;">${email}</a></div>` : ''}
    ${website ? `<div style="margin-bottom: 4px;"><span style="color: #666;">Website:</span> <a href="${website}" style="color: #212d51;">${website}</a></div>` : ''}
    ${additionalInfo ? `<div style="margin-top: 8px; color: #666; font-size: 13px;">${additionalInfo}</div>` : ''}
  </div>
</div>`;
  };

  const getCompleteEmailHTML = (content, includeSignature, signatureConfig) => {
    let styledContent = addEmailStyles(content);
    if (includeSignature && signatureConfig) {
      styledContent += generateSignatureHTML(signatureConfig);
    }
    const primaryLogo =
      'https://www.rainbootsmarketing.com/images/rainboots_logo.png';
    const fallbackLogo =
      'https://www.rainbootsmarketing.com/images/rainboots_logo.png';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 10px !important; }
      .email-body { padding: 20px !important; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .logo-container {
      text-align: center;
      border-bottom: 1px solid #eaeaea;
      padding-bottom: 20px;
    }
    .logo-img {
      display: block;
      margin: 0 auto;
      height: 80px;
      max-width: 100%;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background: #f6f6f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: #f6f6f6; padding: 40px 0;">
    <tr><td align="center">
      <div class="container" style="max-width: 600px; margin: 0 auto;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow: hidden;">
          <tr>
            <td style="padding: 30px 30px 0;">
              <div class="logo-container">
                <img src="${primaryLogo}" alt="Rainboots Marketing" class="logo-img" onerror="this.onerror=null; this.src='${fallbackLogo}';" />
              </div>
             </td>
           </tr>
            <td class="email-body" style="padding: 30px;">
              <div style="max-width: 100%;">${styledContent}</div>
            </td>
          </tr>
            <td style="padding: 0 30px;">
              <div style="text-align: center; font-size: 13px; color: #666; padding: 30px 0 20px; margin-top: 40px; border-top: 1px solid #eaeaea;">
                <p style="margin: 0 0 8px;">You're receiving this email from <strong style="color: #333;">Rainboots Marketing</strong>.</p>
                <p style="margin: 0;">
                  <a href="https://rainbootsmarketing.com/unsubscribe" style="color: #212d51;">Unsubscribe</a> &bull;
                  <a href="https://rainbootsmarketing.com/contact" style="color: #212d51;">Contact Us</a> &bull;
                  <a href="https://rainbootsmarketing.com" style="color: #212d51;">Website</a>
                </p>
              </div>
            </td>
          </tr>
        </table>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 20px;">
          <tr><td align="center" style="padding: 20px 0;">
            <p style="margin: 0; font-size: 12px; color: #999;">&copy; ${new Date().getFullYear()} Rainboots Marketing. All rights reserved.</p>
          </td></tr>
        </table>
      </div>
    </td>
  </tr>
</body>
</html>`;
  };

  // Load templates
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const data = await emailTemplateService.getAll();
        const activeTemplates = Array.isArray(data)
          ? data.filter((template) => template.status !== false)
          : [];
        setTemplates(activeTemplates);
      } catch (err) {
        setError('Failed to load email templates');
      } finally {
        setLoading((prev) => ({ ...prev, templates: false }));
      }
    };
    loadTemplates();
  }, []);

  // Load leads with pagination and filters
  const loadLeads = useCallback(async () => {
    setLoading((prev) => ({ ...prev, leads: true }));
    try {
      const token = localStorage.getItem('token');
      let url = `${API_BASE_URL}/api/leads?page=${leadsPagination.currentPage}&limit=20&sort=-score`;
      if (statusFilter !== 'all') url += `&status=${statusFilter}`;
      if (minScore > 0) url += `&minScore=${minScore}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to load leads');
      const data = await response.json();
      setLeads(data.leads || []);
      setLeadsPagination(
        data.pagination || { currentPage: 1, totalPages: 1, totalLeads: 0 },
      );
    } catch (err) {
      console.error('Error loading leads:', err);
      setError('Failed to load leads');
    } finally {
      setLoading((prev) => ({ ...prev, leads: false }));
    }
  }, [leadsPagination.currentPage, statusFilter, minScore, searchTerm]);

  useEffect(() => {
    if (selectedTemplate) loadLeads();
  }, [
    selectedTemplate,
    loadLeads,
    leadsPagination.currentPage,
    statusFilter,
    minScore,
    searchTerm,
  ]);

  const handleTemplateSelect = (templateId) => {
    const template = templates.find((t) => t._id === templateId) || null;
    setSelectedTemplate(template);
    setShowPreview(false);
    setSelectedLeadsMap({});
    setSelectedLeadForPreview(null);
    setPersonalizedPreviewHtml('');
  };

  // Complete personalization function - replaces ALL variables
  const personalizeContent = (content, lead) => {
    if (!lead) return content;

    let personalized = content;

    // Basic fields
    personalized = personalized.replace(
      /\[lead\.businessName\]/g,
      lead.businessName || '',
    );
    personalized = personalized.replace(
      /\[lead\.contactName\]/g,
      lead.contactName || '',
    );
    personalized = personalized.replace(
      /\[lead\.contactEmail\]/g,
      lead.contactEmail || '',
    );
    personalized = personalized.replace(
      /\[lead\.website\]/g,
      lead.website || '',
    );
    personalized = personalized.replace(/\[lead\.domain\]/g, lead.domain || '');
    personalized = personalized.replace(
      /\[lead\.category\]/g,
      lead.category || '',
    );
    personalized = personalized.replace(
      /\[lead\.location\]/g,
      lead.location || '',
    );
    personalized = personalized.replace(/\[lead\.score\]/g, lead.score || '0');
    personalized = personalized.replace(
      /\[lead\.outreachMessage\]/g,
      lead.analysis?.outreachMessage || '',
    );
    personalized = personalized.replace(
      /\[lead\.analysis\.summary\]/g,
      lead.analysis?.summary || '',
    );

    // Issues array - [lead.analysis.issues.0], [lead.analysis.issues.1], etc.
    const issues = lead.analysis?.issues || [];
    issues.forEach((issue, index) => {
      personalized = personalized.replace(
        new RegExp(`\\[lead\\.analysis\\.issues\\.${index}\\]`, 'g'),
        issue,
      );
    });

    // Quick Wins array - [lead.analysis.quickWins.0], etc.
    const quickWins = lead.analysis?.quickWins || [];
    quickWins.forEach((win, index) => {
      personalized = personalized.replace(
        new RegExp(`\\[lead\\.analysis\\.quickWins\\.${index}\\]`, 'g'),
        win,
      );
    });

    // Opportunities array - [lead.analysis.opportunities.0], etc.
    const opportunities = lead.analysis?.opportunities || [];
    opportunities.forEach((opp, index) => {
      personalized = personalized.replace(
        new RegExp(`\\[lead\\.analysis\\.opportunities\\.${index}\\]`, 'g'),
        opp,
      );
    });

    // List versions
    personalized = personalized.replace(
      /\[lead\.issues\.list\]/g,
      issues.map((i) => `<li style="margin-bottom: 8px;">${i}</li>`).join('') ||
        '<li>No issues identified</li>',
    );
    personalized = personalized.replace(
      /\[lead\.quickWins\.list\]/g,
      quickWins
        .map((w) => `<li style="margin-bottom: 8px;">${w}</li>`)
        .join('') || '<li>No quick wins identified</li>',
    );
    personalized = personalized.replace(
      /\[lead\.opportunities\.list\]/g,
      opportunities
        .map((o) => `<li style="margin-bottom: 8px;">${o}</li>`)
        .join('') || '<li>No opportunities identified</li>',
    );

    // Clean up any remaining unfilled variables
    personalized = personalized.replace(/\[lead\.[^\]]+\]/g, '');

    return personalized;
  };

  // Toggle single lead selection
  const toggleLeadSelection = (leadId) => {
    setSelectedLeadsMap((prev) => {
      const newMap = { ...prev };
      if (newMap[leadId]) delete newMap[leadId];
      else newMap[leadId] = true;
      return newMap;
    });
  };

  // Select all leads on current page
  const selectAllOnCurrentPage = () => {
    setSelectedLeadsMap((prev) => {
      const newMap = { ...prev };
      leads.forEach((lead) => {
        newMap[lead._id] = true;
      });
      return newMap;
    });
  };

  // Select all leads with email across all pages
  const selectAllWithEmailAcrossAllPages = async () => {
    setLoading((prev) => ({ ...prev, leads: true }));
    try {
      const token = localStorage.getItem('token');
      let url = `${API_BASE_URL}/api/leads?limit=10000&sort=-score`;
      if (statusFilter !== 'all') url += `&status=${statusFilter}`;
      if (minScore > 0) url += `&minScore=${minScore}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      const allLeads = data.leads || [];
      const newMap = {};
      allLeads.forEach((lead) => {
        if (lead.contactEmail) newMap[lead._id] = true;
      });
      setSelectedLeadsMap(newMap);
    } catch (err) {
      console.error('Error selecting all leads:', err);
      setError('Failed to select all leads');
    } finally {
      setLoading((prev) => ({ ...prev, leads: false }));
    }
  };

  // Select high score leads (70+)
  const selectHighScoreLeadsAcrossAllPages = async () => {
    setLoading((prev) => ({ ...prev, leads: true }));
    try {
      const token = localStorage.getItem('token');
      let url = `${API_BASE_URL}/api/leads?limit=10000&sort=-score&minScore=70`;
      if (statusFilter !== 'all') url += `&status=${statusFilter}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      const allLeads = data.leads || [];
      const newMap = {};
      allLeads.forEach((lead) => {
        newMap[lead._id] = true;
      });
      setSelectedLeadsMap(newMap);
    } catch (err) {
      console.error('Error selecting high score leads:', err);
      setError('Failed to select high score leads');
    } finally {
      setLoading((prev) => ({ ...prev, leads: false }));
    }
  };

  // Select leads by custom score threshold
  const selectLeadsByScoreAcrossAllPages = async (threshold) => {
    setLoading((prev) => ({ ...prev, leads: true }));
    try {
      const token = localStorage.getItem('token');
      let url = `${API_BASE_URL}/api/leads?limit=10000&sort=-score&minScore=${threshold}`;
      if (statusFilter !== 'all') url += `&status=${statusFilter}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      const allLeads = data.leads || [];
      const newMap = {};
      allLeads.forEach((lead) => {
        newMap[lead._id] = true;
      });
      setSelectedLeadsMap(newMap);
    } catch (err) {
      console.error('Error selecting leads by score:', err);
      setError('Failed to select leads by score');
    } finally {
      setLoading((prev) => ({ ...prev, leads: false }));
    }
  };

  const clearAllSelections = () => setSelectedLeadsMap({});

  const invertCurrentPageSelection = () => {
    setSelectedLeadsMap((prev) => {
      const newMap = { ...prev };
      leads.forEach((lead) => {
        if (newMap[lead._id]) delete newMap[lead._id];
        else newMap[lead._id] = true;
      });
      return newMap;
    });
  };

  const getSelectedCount = () => Object.keys(selectedLeadsMap).length;

  const getSelectedWithEmailCount = () => {
    let count = 0;
    leads.forEach((lead) => {
      if (selectedLeadsMap[lead._id] && lead.contactEmail) count++;
    });
    return count;
  };

  const getAllSelectedLeadIds = () => Object.keys(selectedLeadsMap);

  const handleSendCampaignWithReport = async () => {
    if (!selectedTemplate) {
      alert('Please select an email template');
      return;
    }
    const selectedIds = getAllSelectedLeadIds();
    if (selectedIds.length === 0) {
      alert('Please select at least one lead to send the campaign to');
      return;
    }
    setSendingStatus('sending');
    setSendProgress({ total: selectedIds.length, sent: 0, failed: 0 });
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
            templateId: selectedTemplate._id,
            leadIds: selectedIds,
            includeReport,
            reportFormat,
          }),
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send campaign');
      }
      const result = await response.json();
      setSendingStatus('success');
      setSendProgress({
        total: result.totalLeads,
        sent: result.sent,
        failed: result.failed,
      });
      setSuccessMessage(
        `Campaign sent! ${result.sent} emails delivered, ${result.failed} failed. Report format: ${reportFormat}`,
      );
      setTimeout(() => {
        setSelectedLeadsMap({});
        setSuccessMessage(null);
        setSendingStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Campaign send error:', error);
      setSendingStatus('error');
      setError(`Failed to send campaign: ${error.message}`);
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleSendTest = async () => {
    if (!selectedTemplate) {
      alert('Please select an email template');
      return;
    }
    const testEmail = prompt('Enter test email address:', 'test@example.com');
    if (!testEmail) return;
    setSendingStatus('sending');
    setSendProgress({ total: 1, sent: 0, failed: 0 });
    try {
      const token = localStorage.getItem('token');
      const completeHtml = getCompleteEmailHTML(
        selectedTemplate.content,
        selectedTemplate.includeSignature,
        selectedTemplate.signatureConfig,
      );
      const response = await fetch(`${API_BASE_URL}/api/email/send-manual`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          templateId: selectedTemplate._id,
          emails: [testEmail],
          htmlContent: completeHtml,
        }),
      });
      if (!response.ok) throw new Error('Failed to send test email');
      setSendingStatus('success');
      setSendProgress({ total: 1, sent: 1, failed: 0 });
      setSuccessMessage(`Test email sent to ${testEmail}!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Test email send error:', error);
      setSendingStatus('error');
      setError('Failed to send test email');
      setTimeout(() => setError(null), 3000);
    } finally {
      setTimeout(() => setSendingStatus('idle'), 3000);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      new: 'status-new',
      reviewed: 'status-reviewed',
      contacted: 'status-contacted',
      replied: 'status-replied',
      qualified: 'status-qualified',
      closed: 'status-closed',
      unsubscribed: 'status-unsubscribed',
    };
    return classes[status] || 'status-new';
  };

  const isLoading = loading.templates;
  if (isLoading) {
    return (
      <div className='email-selector-loading'>
        <div className='loading-spinner'>Loading templates...</div>
      </div>
    );
  }

  return (
    <div className='email-selector-container'>
      {successMessage && (
        <div className='alert-success'>
          {successMessage}
          <button onClick={() => setSuccessMessage(null)} className='close-btn'>
            ×
          </button>
        </div>
      )}
      {error && (
        <div className='alert-error'>
          {error}
          <button onClick={() => setError(null)} className='close-btn'>
            ×
          </button>
        </div>
      )}

      <div className='email-selector-card'>
        <div className='card-header'>
          <h3>Send Email Campaign</h3>
          <p className='card-description'>
            Select a template, choose leads, and send your campaign
          </p>
        </div>

        <div className='card-body'>
          {/* Template Selection */}
          <div className='template-select-wrapper'>
            <label className='form-label' style={{ marginBottom: '10px' }}>
              Email Template
            </label>
            <select
              value={selectedTemplate?._id || ''}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              className='template-select'
            >
              <option value=''>Choose a template...</option>
              {templates.map((template) => (
                <option key={template._id} value={template._id}>
                  {template.title} ({template.category})
                </option>
              ))}
            </select>
          </div>

          {selectedTemplate && (
            <>
              {/* Template Preview Section */}
              <div className='template-preview-section'>
                <div className='preview-header'>
                  <h5>Preview</h5>
                  <button
                    className='toggle-preview-btn'
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </button>
                </div>

                {showPreview && (
                  <div className='preview-container'>
                    {/* Lead Selector for Personalized Preview */}
                    <div
                      className='preview-lead-selector'
                      style={{ marginBottom: '15px' }}
                    >
                      <label style={{ marginRight: '10px', color: '#9aa8b8' }}>
                        Preview for lead:
                      </label>
                      <select
                        value={selectedLeadForPreview?._id || ''}
                        onChange={(e) => {
                          const lead = leads.find(
                            (l) => l._id === e.target.value,
                          );
                          if (lead) {
                            setSelectedLeadForPreview(lead);
                            const personalizedContent = personalizeContent(
                              selectedTemplate.content,
                              lead,
                            );
                            setPersonalizedPreviewHtml(
                              getCompleteEmailHTML(
                                personalizedContent,
                                selectedTemplate.includeSignature,
                                selectedTemplate.signatureConfig,
                              ),
                            );
                          }
                        }}
                        className='lead-preview-select'
                        style={{
                          padding: '6px 12px',
                          background: '#1e2a3a',
                          border: '1px solid #0e9aa7',
                          borderRadius: '6px',
                          color: '#f5f0e8',
                        }}
                      >
                        <option value=''>-- Select a lead to preview --</option>
                        {leads.map((lead) => (
                          <option key={lead._id} value={lead._id}>
                            {lead.businessName}{' '}
                            {lead.contactName ? `(${lead.contactName})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className='email-preview'>
                      <iframe
                        title='Email Preview'
                        srcDoc={
                          personalizedPreviewHtml ||
                          getCompleteEmailHTML(
                            selectedTemplate.content,
                            selectedTemplate.includeSignature,
                            selectedTemplate.signatureConfig,
                          )
                        }
                        className='preview-iframe'
                      />
                    </div>
                    <div className='preview-note'>
                      <span className='info-icon'>ℹ️</span>
                      Select a lead above to see a personalized preview with
                      their data.
                    </div>
                  </div>
                )}

                {!showPreview && (
                  <div className='content-preview'>
                    <div
                      className='preview-content'
                      dangerouslySetInnerHTML={{
                        __html: selectedTemplate.content,
                      }}
                    />
                    {selectedTemplate.includeSignature && (
                      <div className='signature-note'>
                        <span className='signature-icon'>✍️</span> Includes
                        email signature
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Filters Section */}
              <div className='filters-section'>
                <div className='filters-header'>
                  <h4>Filter Leads</h4>
                </div>
                <div className='filters-grid'>
                  <div className='filter-group'>
                    <label className='form-label'>
                      <i className='filter-icon'>🏷️</i> Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className='filter-select'
                    >
                      <option value='all'>All Status</option>
                      <option value='new'>New</option>
                      <option value='reviewed'>Reviewed</option>
                      <option value='contacted'>Contacted</option>
                      <option value='qualified'>Qualified</option>
                    </select>
                  </div>
                  <div className='filter-group'>
                    <label className='form-label'>
                      <i className='filter-icon'>⭐</i> Min Score
                    </label>
                    <div className='score-input-wrapper'>
                      <input
                        type='range'
                        value={minScore}
                        onChange={(e) => setMinScore(Number(e.target.value))}
                        min='0'
                        max='100'
                        step='10'
                        className='score-slider'
                      />
                      <div className='score-value'>
                        <input
                          type='number'
                          value={minScore}
                          onChange={(e) => setMinScore(Number(e.target.value))}
                          min='0'
                          max='100'
                          className='score-number'
                        />
                        <span className='score-unit'>+</span>
                      </div>
                    </div>
                    <div className='score-labels'>
                      <span>Any</span>
                      <span>Low</span>
                      <span>Medium</span>
                      <span>High</span>
                      <span>Top</span>
                    </div>
                  </div>
                  <div className='filter-group'>
                    <label className='form-label'>
                      <i className='filter-icon'>🔍</i> Search
                    </label>
                    <div className='search-wrapper'>
                      <input
                        type='text'
                        placeholder='Search by business name, website, or contact...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='filter-input search-input'
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className='clear-search'
                          title='Clear search'
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {(statusFilter !== 'all' || minScore > 0 || searchTerm) && (
                  <div className='active-filters'>
                    <span className='active-filters-label'>
                      Active filters:
                    </span>
                    {statusFilter !== 'all' && (
                      <span className='filter-tag'>
                        Status: {statusFilter}
                        <button
                          onClick={() => setStatusFilter('all')}
                          className='remove-filter'
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {minScore > 0 && (
                      <span className='filter-tag'>
                        Score ≥ {minScore}
                        <button
                          onClick={() => setMinScore(0)}
                          className='remove-filter'
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {searchTerm && (
                      <span className='filter-tag'>
                        Search: {searchTerm}
                        <button
                          onClick={() => setSearchTerm('')}
                          className='remove-filter'
                        >
                          ×
                        </button>
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setStatusFilter('all');
                        setMinScore(0);
                        setSearchTerm('');
                      }}
                      className='clear-all-filters'
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>

              {/* Lead Selection */}
              <div className='leads-section'>
                <div className='leads-header'>
                  <h4>
                    Select Leads ({leadsPagination.totalLeads} total in
                    database)
                  </h4>
                  <div className='selection-actions'>
                    <button
                      onClick={selectAllOnCurrentPage}
                      className='btn-sm btn-secondary'
                      title='Select all leads on current page'
                    >
                      Select Current Page
                    </button>
                    <button
                      onClick={selectAllWithEmailAcrossAllPages}
                      className='btn-sm btn-secondary'
                      title='Select ALL leads with email addresses'
                    >
                      All with Email
                    </button>
                    <button
                      onClick={selectHighScoreLeadsAcrossAllPages}
                      className='btn-sm btn-secondary'
                      title='Select leads with score 70+'
                    >
                      High Score (70+)
                    </button>
                    <button
                      onClick={() => selectLeadsByScoreAcrossAllPages(50)}
                      className='btn-sm btn-secondary'
                      title='Select leads with score 50+'
                    >
                      Medium Score (50+)
                    </button>
                    <button
                      onClick={invertCurrentPageSelection}
                      className='btn-sm btn-secondary'
                      title='Invert selection on current page'
                    >
                      Invert Page
                    </button>
                    <button
                      onClick={clearAllSelections}
                      className='btn-sm btn-secondary'
                      title='Clear all selections'
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {loading.leads ? (
                  <div className='loading-leads'>Loading leads...</div>
                ) : (
                  <>
                    <div className='leads-list'>
                      {leads.length === 0 ? (
                        <div className='no-leads'>
                          No leads found. Try adjusting filters.
                        </div>
                      ) : (
                        leads.map((lead) => (
                          <div key={lead._id} className='lead-item'>
                            <div className='lead-checkbox'>
                              <input
                                type='checkbox'
                                checked={!!selectedLeadsMap[lead._id]}
                                onChange={() => toggleLeadSelection(lead._id)}
                                disabled={!lead.contactEmail}
                                id={`lead-${lead._id}`}
                              />
                            </div>
                            <div className='lead-info'>
                              <div className='lead-name'>
                                <label
                                  htmlFor={`lead-${lead._id}`}
                                  style={{ cursor: 'pointer' }}
                                >
                                  {lead.businessName || 'Unnamed Business'}
                                </label>
                                {lead.contactName && (
                                  <span className='lead-contact'>
                                    {' '}
                                    ({lead.contactName})
                                  </span>
                                )}
                              </div>
                              <div className='lead-details'>
                                {lead.website && (
                                  <span className='lead-website'>
                                    {lead.website}
                                  </span>
                                )}
                                {lead.location && (
                                  <span className='lead-location'>
                                    {lead.location}
                                  </span>
                                )}
                                {lead.contactEmail ? (
                                  <span className='lead-email'>
                                    {lead.contactEmail}
                                  </span>
                                ) : (
                                  <span className='lead-email-missing'>
                                    No email available
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className='lead-meta'>
                              <div
                                className='lead-score'
                                style={{ color: getScoreColor(lead.score) }}
                              >
                                Score: {lead.score || 0}
                              </div>
                              <div
                                className={`status-badge ${getStatusBadgeClass(lead.status)}`}
                              >
                                {lead.status}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Pagination */}
                    {leadsPagination.totalPages > 1 && (
                      <div className='pagination'>
                        <button
                          onClick={() =>
                            setLeadsPagination((prev) => ({
                              ...prev,
                              currentPage: prev.currentPage - 1,
                            }))
                          }
                          disabled={leadsPagination.currentPage === 1}
                          className='pagination-btn'
                        >
                          Previous
                        </button>
                        <div className='pagination-pages'>
                          {[
                            ...Array(Math.min(5, leadsPagination.totalPages)),
                          ].map((_, i) => {
                            let pageNum;
                            if (leadsPagination.totalPages <= 5)
                              pageNum = i + 1;
                            else if (leadsPagination.currentPage <= 3)
                              pageNum = i + 1;
                            else if (
                              leadsPagination.currentPage >=
                              leadsPagination.totalPages - 2
                            )
                              pageNum = leadsPagination.totalPages - 4 + i;
                            else pageNum = leadsPagination.currentPage - 2 + i;
                            return (
                              <button
                                key={pageNum}
                                onClick={() =>
                                  setLeadsPagination((prev) => ({
                                    ...prev,
                                    currentPage: pageNum,
                                  }))
                                }
                                className={`pagination-page ${leadsPagination.currentPage === pageNum ? 'active' : ''}`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>
                        <button
                          onClick={() =>
                            setLeadsPagination((prev) => ({
                              ...prev,
                              currentPage: prev.currentPage + 1,
                            }))
                          }
                          disabled={
                            leadsPagination.currentPage ===
                            leadsPagination.totalPages
                          }
                          className='pagination-btn'
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Selected Leads Summary */}
              {getSelectedCount() > 0 && (
                <div className='selected-summary'>
                  <strong>{getSelectedCount()} leads selected total</strong>
                  <span className='email-count'>
                    ✓ {getSelectedWithEmailCount()} on current page ready to
                    send
                  </span>
                </div>
              )}

              {/* Report Options */}
              <div className='report-options-section'>
                <div className='report-toggle'>
                  <label
                    className='form-label'
                    style={{ marginBottom: '10px' }}
                  >
                    <i className='filter-icon'>📊</i> Include Audit Report
                  </label>
                  <div className='toggle-switch'>
                    <button
                      type='button'
                      className={`toggle-btn ${includeReport ? 'active' : ''}`}
                      onClick={() => setIncludeReport(true)}
                    >
                      Yes
                    </button>
                    <button
                      type='button'
                      className={`toggle-btn ${!includeReport ? 'active' : ''}`}
                      onClick={() => setIncludeReport(false)}
                    >
                      No
                    </button>
                  </div>
                </div>
                {includeReport && (
                  <div className='report-format-section'>
                    <label
                      className='form-label'
                      style={{ marginBottom: '10px' }}
                    >
                      <i className='filter-icon'>📎</i> Report Format
                    </label>
                    <div className='format-options'>
                      <label className='format-option'>
                        <input
                          type='radio'
                          name='reportFormat'
                          value='inline'
                          checked={reportFormat === 'inline'}
                          onChange={(e) => setReportFormat(e.target.value)}
                        />
                        <span>
                          <strong>📧 Inline</strong>
                          <small>Report embedded in email (collapsible)</small>
                        </span>
                      </label>
                      <label className='format-option'>
                        <input
                          type='radio'
                          name='reportFormat'
                          value='attachment'
                          checked={reportFormat === 'attachment'}
                          onChange={(e) => setReportFormat(e.target.value)}
                        />
                        <span>
                          <strong>📎 Attachment</strong>
                          <small>Report as separate HTML file</small>
                        </span>
                      </label>
                      <label className='format-option'>
                        <input
                          type='radio'
                          name='reportFormat'
                          value='both'
                          checked={reportFormat === 'both'}
                          onChange={(e) => setReportFormat(e.target.value)}
                        />
                        <span>
                          <strong>📧 + 📎 Both</strong>
                          <small>Inline and attachment</small>
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className='action-buttons'>
                <button
                  onClick={handleSendTest}
                  disabled={sendingStatus === 'sending'}
                  className='send-test-btn'
                >
                  {sendingStatus === 'sending'
                    ? 'Sending...'
                    : 'Send Test Email'}
                </button>
                <button
                  onClick={handleSendCampaignWithReport}
                  disabled={
                    sendingStatus === 'sending' || getSelectedCount() === 0
                  }
                  className='send-campaign-btn'
                >
                  {sendingStatus === 'sending'
                    ? 'Sending Campaign...'
                    : `Send to ${getSelectedCount()} Lead${getSelectedCount() !== 1 ? 's' : ''}${includeReport ? ' with Report' : ''}`}
                </button>
              </div>

              {/* Progress Bar */}
              {sendingStatus === 'sending' && (
                <div className='progress-section'>
                  <div className='progress-bar-wrapper'>
                    <div
                      className='progress-bar-fill'
                      style={{
                        width:
                          sendProgress.total > 0
                            ? `${(sendProgress.sent / sendProgress.total) * 100}%`
                            : '0%',
                      }}
                    />
                  </div>
                  <div className='progress-stats'>
                    <span>Sent: {sendProgress.sent}</span>
                    <span>Failed: {sendProgress.failed}</span>
                    <span>Total: {sendProgress.total}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
