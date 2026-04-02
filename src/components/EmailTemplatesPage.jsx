import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import './EmailTemplatesPage.css';

export default function EmailTemplatesPage() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [activeTemplates, setActiveTemplates] = useState([]);
  const [inactiveTemplates, setInactiveTemplates] = useState([]);
  const [newTemplate, setNewTemplate] = useState({
    title: '',
    subject: '',
    content: '',
    status: true,
    category: 'outreach',
    tags: [],
    includeSignature: false,
    signatureConfig: {
      organizationName: 'Rainboots Marketing',
      title: '',
      fullName: '',
      phone: '',
      email: '',
      website: 'https://rainbootsmarketing.com',
      additionalInfo: '',
    },
    attachments: [],
  });
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('active');

  // Available variables for email personalization
  const AVAILABLE_VARIABLES = [
    { label: "Lead's Business Name", value: '[lead.businessName]' },
    { label: "Lead's Contact Name", value: '[lead.contactName]' },
    { label: "Lead's Contact Email", value: '[lead.contactEmail]' },
    { label: "Lead's Website", value: '[lead.website]' },
    { label: "Lead's Category", value: '[lead.category]' },
    { label: "Lead's Location", value: '[lead.location]' },
    { label: 'Opportunity Score', value: '[lead.score]' },
    { label: 'AI Outreach Message', value: '[lead.outreachMessage]' },
  ];

  // R2 Logo URL
  const R2_LOGO_URL =
    'https://www.rainbootsmarketing.com/images/rainboots_logo.png';

  // Apply email-friendly styles to HTML content
  const addEmailStyles = (html) => {
    if (!html) return '';
    let styledHtml = html;
    styledHtml = styledHtml.replace(
      /<p(\s[^>]*)?>/g,
      '<p style="margin: 0 0 16px; padding: 0; line-height: 1.6; color: #333;"$1>',
    );
    styledHtml = styledHtml.replace(
      /<h1(\s[^>]*)?>/g,
      '<h1 style="font-size: 28px; font-weight: bold; margin: 0 0 20px; color: #222; line-height: 1.3;"$1>',
    );
    styledHtml = styledHtml.replace(
      /<h2(\s[^>]*)?>/g,
      '<h2 style="font-size: 24px; font-weight: bold; margin: 0 0 18px; color: #222; line-height: 1.3;"$1>',
    );
    styledHtml = styledHtml.replace(
      /<h3(\s[^>]*)?>/g,
      '<h3 style="font-size: 20px; font-weight: 600; margin: 0 0 16px; color: #222; line-height: 1.3;"$1>',
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

  // Generate email signature HTML
  const generateSignatureHTML = (signatureConfig) => {
    if (!signatureConfig) return '';
    const {
      organizationName = '',
      title = '',
      fullName = '',
      phone = '',
      email = '',
      website = '',
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

  // Generate attachments HTML for preview
  const generateAttachmentsHTML = (attachments) => {
    if (!attachments || attachments.length === 0) return '';
    const getFileIcon = (mimeType) => {
      if (mimeType?.startsWith('image/')) return '🖼️';
      if (mimeType === 'application/pdf') return '📄';
      if (mimeType?.includes('word')) return '📝';
      if (mimeType?.includes('excel')) return '📊';
      return '📎';
    };
    const formatFileSize = (bytes) => {
      if (!bytes) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    const attachmentItems = attachments
      .map(
        (att) => `
      <div style="margin: 12px 0; padding: 12px; background: #f8f9fa; border-radius: 6px; border-left: 4px solid #212d51;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="font-size: 24px;">${getFileIcon(att.mimeType)}</div>
          <div style="flex: 1;">
            <div style="font-weight: 600; color: #333;">${att.filename}</div>
            <div style="font-size: 12px; color: #666;">${formatFileSize(att.size)}</div>
          </div>
        </div>
      </div>
    `,
      )
      .join('');
    return `
      <div style="margin-top: 30px; padding-top: 25px; border-top: 2px solid #eaeaea;">
        <h3 style="color: #333; font-size: 18px;">📎 Attachments (${attachments.length})</h3>
        ${attachmentItems}
      </div>
    `;
  };

  // Get complete email HTML with wrapper
  const getCompleteEmailHTML = (
    content,
    includeSignature,
    signatureConfig,
    attachments = [],
  ) => {
    let styledContent = addEmailStyles(content);
    if (attachments && attachments.length > 0) {
      styledContent += generateAttachmentsHTML(attachments);
    }
    if (includeSignature && signatureConfig) {
      styledContent += generateSignatureHTML(signatureConfig);
    }
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
  </style>
</head>
<body style="margin: 0; padding: 0; background: #f6f6f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: #f6f6f6; padding: 40px 0;">
    <tr><td align="center">
      <div class="container" style="max-width: 600px; margin: 0 auto;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow: hidden;">
          <tr><td style="padding: 30px 30px 0;">
             <div style="border-bottom: 1px solid #eaeaea; padding-bottom: 20px; text-align: center;">
              <img src="${R2_LOGO_URL}" alt="Rainboots Marketing" height="80" style="display: block; margin: 0 auto; height: 80px;" />
            </div>
             </td>
           </tr>
           <tr>
            <td class="email-body" style="padding: 30px;">
              <div style="max-width: 100%;">${styledContent}</div>
             </td>
           </tr>
           <tr>
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
           <tr>
            <td align="center" style="padding: 20px 0;">
              <p style="margin: 0; font-size: 12px; color: #999;">&copy; ${new Date().getFullYear()} Rainboots Marketing. All rights reserved.</p>
             </td>
           </tr>
         </table>
      </div>
     </td>
   </tr>
</table>
</body>
</html>`;
  };

  // Insert variable into textarea
  const insertVariable = (variable, isEditModal = false) => {
    const textarea = isEditModal
      ? document.getElementById('edit-content-textarea')
      : document.getElementById('new-content-textarea');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const newText = text.substring(0, start) + variable + text.substring(end);
      if (isEditModal && editingTemplate) {
        setEditingTemplate({ ...editingTemplate, content: newText });
      } else {
        setNewTemplate({ ...newTemplate, content: newText });
      }
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + variable.length,
          start + variable.length,
        );
      }, 0);
    }
  };

  // Refresh templates list
  const refreshTemplates = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/email-templates`);
      const templatesData = Array.isArray(response.data?.data)
        ? response.data.data
        : [];
      setTemplates(templatesData);
    } catch (err) {
      console.error('Error refreshing templates:', err);
      setError('Failed to refresh templates');
    }
  };

  // Load templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/email-templates`);
        const templatesData = Array.isArray(response.data?.data)
          ? response.data.data
          : [];
        setTemplates(templatesData);
      } catch (err) {
        console.error('Error loading templates:', err);
        setError(err.message || 'Failed to load templates');
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  // Separate templates into active and inactive
  useEffect(() => {
    const active = templates.filter((template) => template.status === true);
    const inactive = templates.filter((template) => template.status === false);
    setActiveTemplates(active);
    setInactiveTemplates(inactive);
  }, [templates]);

  // Handle input changes for new template
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const checked = e.target.checked;
    setNewTemplate((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle signature changes for new template
  const handleSignatureChange = (e) => {
    const { name, value } = e.target;
    setNewTemplate((prev) => ({
      ...prev,
      signatureConfig: {
        ...prev.signatureConfig,
        [name]: value,
      },
    }));
  };

  // Handle tags change for new template
  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map((tag) => tag.trim());
    setNewTemplate((prev) => ({ ...prev, tags }));
  };

  // Handle content change for new template
  const handleContentChange = (e) => {
    setNewTemplate((prev) => ({ ...prev, content: e.target.value }));
  };

  // Handle edit content change
  const handleEditContentChange = (e) => {
    if (editingTemplate) {
      setEditingTemplate({ ...editingTemplate, content: e.target.value });
    }
  };

  // Handle edit input changes
  const handleEditInputChange = (e) => {
    const { name, value, type } = e.target;
    const checked = e.target.checked;
    if (editingTemplate) {
      setEditingTemplate({
        ...editingTemplate,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  // Handle edit signature changes
  const handleEditSignatureChange = (e) => {
    const { name, value } = e.target;
    if (editingTemplate) {
      setEditingTemplate({
        ...editingTemplate,
        signatureConfig: {
          ...editingTemplate.signatureConfig,
          [name]: value,
        },
      });
    }
  };

  // Handle edit tags change
  const handleEditTagsChange = (e) => {
    const tags = e.target.value.split(',').map((tag) => tag.trim());
    if (editingTemplate) {
      setEditingTemplate({ ...editingTemplate, tags });
    }
  };

  // Add template
  const addTemplate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        title: newTemplate.title.trim(),
        subject: newTemplate.subject.trim(),
        content: newTemplate.content,
        status: newTemplate.status,
        category: newTemplate.category,
        tags: newTemplate.tags.filter((tag) => tag.trim() !== ''),
        includeSignature: newTemplate.includeSignature,
        signatureConfig: newTemplate.signatureConfig,
      };

      await axios.post(`${API_BASE_URL}/api/email-templates`, payload);
      await refreshTemplates();
      setShowAddModal(false);
      setSuccessMessage('Template created successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      resetNewTemplate();
    } catch (err) {
      console.error('Error creating template:', err);
      setError(
        err.response?.data?.error || err.message || 'Failed to create template',
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Save edited template
  const saveEditedTemplate = async (e) => {
    e.preventDefault();
    if (!editingTemplate) return;
    setIsSaving(true);
    try {
      const payload = {
        title: editingTemplate.title.trim(),
        subject: editingTemplate.subject.trim(),
        content: editingTemplate.content,
        status: editingTemplate.status,
        category: editingTemplate.category,
        tags: editingTemplate.tags.filter((tag) => tag.trim() !== ''),
        includeSignature: editingTemplate.includeSignature,
        signatureConfig: editingTemplate.signatureConfig,
      };

      await axios.put(
        `${API_BASE_URL}/api/email-templates/${editingTemplate._id}`,
        payload,
      );
      await refreshTemplates();
      setShowEditModal(false);
      setEditingTemplate(null);
      setSuccessMessage('Template updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error updating template:', err);
      setError(
        err.response?.data?.error || err.message || 'Failed to update template',
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Delete template
  const confirmDelete = async () => {
    if (!templateToDelete) return;
    try {
      await axios.delete(
        `${API_BASE_URL}/api/email-templates/${templateToDelete}`,
      );
      await refreshTemplates();
      setShowDeleteModal(false);
      setTemplateToDelete(null);
      setSuccessMessage('Template deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting template:', err);
      setError(
        err.response?.data?.error || err.message || 'Failed to delete template',
      );
    }
  };

  // Reset new template form
  const resetNewTemplate = () => {
    setNewTemplate({
      title: '',
      subject: '',
      content: '',
      status: true,
      category: 'outreach',
      tags: [],
      includeSignature: false,
      signatureConfig: {
        organizationName: 'Rainboots Marketing',
        title: '',
        fullName: '',
        phone: '',
        email: '',
        website: 'https://rainbootsmarketing.com',
        additionalInfo: '',
      },
      attachments: [],
    });
  };

  // Start editing template
  const startEditingTemplate = (template) => {
    setEditingTemplate({
      _id: template._id,
      title: template.title,
      subject: template.subject,
      content: template.content,
      status: template.status,
      category: template.category,
      tags: template.tags || [],
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
      attachments: template.attachments || [],
    });
    setShowEditModal(true);
  };

  // Email Preview Component
  const EmailPreview = ({
    content,
    includeSignature = false,
    signatureConfig = null,
    attachments = [],
  }) => {
    const completeEmail = getCompleteEmailHTML(
      content,
      includeSignature,
      signatureConfig,
      attachments,
    );
    return (
      <div className='email-preview-container'>
        <div className='email-preview-frame'>
          <iframe
            title='Email Preview'
            srcDoc={completeEmail}
            className='preview-iframe'
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className='email-templates-loading'>
        <div className='loading-spinner'>Loading templates...</div>
      </div>
    );
  }

  return (
    <div className='email-templates-page'>
      {error && (
        <div className='alert-error'>
          {error}
          <button onClick={() => setError(null)} className='close-btn'>
            ×
          </button>
        </div>
      )}
      {successMessage && (
        <div className='alert-success'>
          {successMessage}
          <button onClick={() => setSuccessMessage(null)} className='close-btn'>
            ×
          </button>
        </div>
      )}

      <div className='templates-container'>
        <div className='tabs-header'>
          <button
            className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active Templates ({activeTemplates.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'inactive' ? 'active' : ''}`}
            onClick={() => setActiveTab('inactive')}
          >
            Inactive Templates ({inactiveTemplates.length})
          </button>
          <button
            className='add-template-btn'
            onClick={() => setShowAddModal(true)}
          >
            <i className='ti ti-plus'></i> New Template
          </button>
        </div>

        <div className='templates-grid'>
          {(activeTab === 'active' ? activeTemplates : inactiveTemplates).map(
            (template) => (
              <div key={template._id} className='template-card'>
                <div className='template-header'>
                  <h3 className='template-title'>{template.title}</h3>
                  {!template.status && (
                    <span className='status-badge inactive'>Inactive</span>
                  )}
                </div>
                <div className='template-subject'>
                  <strong>Subject:</strong> {template.subject}
                </div>
                <div className='template-meta'>
                  <span className='meta-badge'>{template.category}</span>
                  {template.tags?.map((tag, i) => (
                    <span key={i} className='meta-badge tag'>
                      {tag}
                    </span>
                  ))}
                  {template.includeSignature && (
                    <span className='meta-badge signature'>Signature</span>
                  )}
                  {template.attachments?.length > 0 && (
                    <span className='meta-badge attachments'>
                      <i className='ti ti-paperclip'></i>{' '}
                      {template.attachments.length}
                    </span>
                  )}
                </div>
                <div className='template-actions'>
                  <button
                    className='action-btn edit'
                    onClick={() => startEditingTemplate(template)}
                  >
                    <i className='ti ti-edit'></i> Edit
                  </button>
                  <button
                    className='action-btn delete'
                    onClick={() => {
                      setTemplateToDelete(template._id);
                      setShowDeleteModal(true);
                    }}
                  >
                    <i className='ti ti-trash'></i> Delete
                  </button>
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Add Template Modal */}
      {showAddModal && (
        <div className='modal-overlay' onClick={() => setShowAddModal(false)}>
          <div
            className='modal-container large'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='modal-header'>
              <h2>Create New Template</h2>
              <button
                className='modal-close'
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            <div className='modal-body'>
              <form onSubmit={addTemplate}>
                <div className='form-group'>
                  <label>Title *</label>
                  <input
                    type='text'
                    name='title'
                    value={newTemplate.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className='form-group'>
                  <label>Subject *</label>
                  <input
                    type='text'
                    name='subject'
                    value={newTemplate.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className='form-group'>
                  <label>Category</label>
                  <select
                    name='category'
                    value={newTemplate.category}
                    onChange={handleInputChange}
                  >
                    <option value='outreach'>Outreach</option>
                    <option value='follow-up'>Follow-up</option>
                    <option value='proposal'>Proposal</option>
                    <option value='newsletter'>Newsletter</option>
                    <option value='other'>Other</option>
                  </select>
                </div>

                <div className='form-group'>
                  <label>Tags (comma separated)</label>
                  <input
                    type='text'
                    value={newTemplate.tags.join(', ')}
                    onChange={handleTagsChange}
                    placeholder='tag1, tag2, tag3'
                  />
                </div>

                <div className='form-group'>
                  <label>Available Variables</label>
                  <div className='variables-list'>
                    {AVAILABLE_VARIABLES.map((variable, index) => (
                      <button
                        key={index}
                        type='button'
                        className='variable-badge'
                        onClick={() => insertVariable(variable.value, false)}
                      >
                        {variable.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className='form-group'>
                  <label>Template Content *</label>
                  <textarea
                    id='new-content-textarea'
                    rows='12'
                    value={newTemplate.content}
                    onChange={handleContentChange}
                    placeholder='Write your email template content here... You can use HTML tags for formatting.'
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <div className='signature-section'>
                  <div className='signature-toggle'>
                    <div>
                      <h5>Email Signature</h5>
                      <p>Include a professional email signature</p>
                    </div>
                    <label className='switch'>
                      <input
                        type='checkbox'
                        name='includeSignature'
                        checked={newTemplate.includeSignature}
                        onChange={handleInputChange}
                      />
                      <span className='slider'></span>
                    </label>
                  </div>

                  {newTemplate.includeSignature && (
                    <div className='signature-fields'>
                      <div className='form-row'>
                        <div className='form-group'>
                          <label>Organization Name</label>
                          <input
                            type='text'
                            name='organizationName'
                            value={newTemplate.signatureConfig.organizationName}
                            onChange={handleSignatureChange}
                          />
                        </div>
                        <div className='form-group'>
                          <label>Full Name</label>
                          <input
                            type='text'
                            name='fullName'
                            value={newTemplate.signatureConfig.fullName}
                            onChange={handleSignatureChange}
                          />
                        </div>
                      </div>
                      <div className='form-row'>
                        <div className='form-group'>
                          <label>Title/Position</label>
                          <input
                            type='text'
                            name='title'
                            value={newTemplate.signatureConfig.title}
                            onChange={handleSignatureChange}
                          />
                        </div>
                        <div className='form-group'>
                          <label>Phone Number</label>
                          <input
                            type='text'
                            name='phone'
                            value={newTemplate.signatureConfig.phone}
                            onChange={handleSignatureChange}
                          />
                        </div>
                      </div>
                      <div className='form-row'>
                        <div className='form-group'>
                          <label>Email Address</label>
                          <input
                            type='email'
                            name='email'
                            value={newTemplate.signatureConfig.email}
                            onChange={handleSignatureChange}
                          />
                        </div>
                        <div className='form-group'>
                          <label>Website</label>
                          <input
                            type='text'
                            name='website'
                            value={newTemplate.signatureConfig.website}
                            onChange={handleSignatureChange}
                          />
                        </div>
                      </div>
                      <div className='form-group'>
                        <label>Additional Information</label>
                        <textarea
                          name='additionalInfo'
                          rows='2'
                          value={newTemplate.signatureConfig.additionalInfo}
                          onChange={handleSignatureChange}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {newTemplate.content && (
                  <div className='preview-section'>
                    <label>Preview</label>
                    <EmailPreview
                      content={newTemplate.content}
                      includeSignature={newTemplate.includeSignature}
                      signatureConfig={newTemplate.signatureConfig}
                      attachments={newTemplate.attachments}
                    />
                  </div>
                )}

                <div className='status-toggle'>
                  <div>
                    <h5>Template Status</h5>
                    <p>Enable or disable this template</p>
                  </div>
                  <label className='switch'>
                    <input
                      type='checkbox'
                      name='status'
                      checked={newTemplate.status}
                      onChange={handleInputChange}
                    />
                    <span className='slider'></span>
                  </label>
                </div>

                <div className='modal-actions'>
                  <button
                    type='button'
                    className='btn-secondary'
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='btn-primary'
                    disabled={isSaving}
                  >
                    {isSaving ? 'Creating...' : 'Create Template'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Template Modal */}
      {showEditModal && editingTemplate && (
        <div className='modal-overlay' onClick={() => setShowEditModal(false)}>
          <div
            className='modal-container large'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='modal-header'>
              <h2>Edit Template</h2>
              <button
                className='modal-close'
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            <div className='modal-body'>
              <form onSubmit={saveEditedTemplate}>
                <div className='form-group'>
                  <label>Title *</label>
                  <input
                    type='text'
                    name='title'
                    value={editingTemplate.title}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>

                <div className='form-group'>
                  <label>Subject *</label>
                  <input
                    type='text'
                    name='subject'
                    value={editingTemplate.subject}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>

                <div className='form-group'>
                  <label>Category</label>
                  <select
                    name='category'
                    value={editingTemplate.category}
                    onChange={handleEditInputChange}
                  >
                    <option value='outreach'>Outreach</option>
                    <option value='follow-up'>Follow-up</option>
                    <option value='proposal'>Proposal</option>
                    <option value='newsletter'>Newsletter</option>
                    <option value='other'>Other</option>
                  </select>
                </div>

                <div className='form-group'>
                  <label>Tags (comma separated)</label>
                  <input
                    type='text'
                    value={(editingTemplate.tags || []).join(', ')}
                    onChange={handleEditTagsChange}
                    placeholder='tag1, tag2, tag3'
                  />
                </div>

                <div className='form-group'>
                  <label>Available Variables</label>
                  <div className='variables-list'>
                    {AVAILABLE_VARIABLES.map((variable, index) => (
                      <button
                        key={index}
                        type='button'
                        className='variable-badge'
                        onClick={() => insertVariable(variable.value, true)}
                      >
                        {variable.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className='form-group'>
                  <label>Template Content *</label>
                  <textarea
                    id='edit-content-textarea'
                    rows='12'
                    value={editingTemplate.content}
                    onChange={handleEditContentChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <div className='signature-section'>
                  <div className='signature-toggle'>
                    <div>
                      <h5>Email Signature</h5>
                      <p>Include a professional email signature</p>
                    </div>
                    <label className='switch'>
                      <input
                        type='checkbox'
                        name='includeSignature'
                        checked={editingTemplate.includeSignature}
                        onChange={handleEditInputChange}
                      />
                      <span className='slider'></span>
                    </label>
                  </div>

                  {editingTemplate.includeSignature && (
                    <div className='signature-fields'>
                      <div className='form-row'>
                        <div className='form-group'>
                          <label>Organization Name</label>
                          <input
                            type='text'
                            name='organizationName'
                            value={
                              editingTemplate.signatureConfig
                                ?.organizationName || ''
                            }
                            onChange={handleEditSignatureChange}
                          />
                        </div>
                        <div className='form-group'>
                          <label>Full Name</label>
                          <input
                            type='text'
                            name='fullName'
                            value={
                              editingTemplate.signatureConfig?.fullName || ''
                            }
                            onChange={handleEditSignatureChange}
                          />
                        </div>
                      </div>
                      <div className='form-row'>
                        <div className='form-group'>
                          <label>Title/Position</label>
                          <input
                            type='text'
                            name='title'
                            value={editingTemplate.signatureConfig?.title || ''}
                            onChange={handleEditSignatureChange}
                          />
                        </div>
                        <div className='form-group'>
                          <label>Phone Number</label>
                          <input
                            type='text'
                            name='phone'
                            value={editingTemplate.signatureConfig?.phone || ''}
                            onChange={handleEditSignatureChange}
                          />
                        </div>
                      </div>
                      <div className='form-row'>
                        <div className='form-group'>
                          <label>Email Address</label>
                          <input
                            type='email'
                            name='email'
                            value={editingTemplate.signatureConfig?.email || ''}
                            onChange={handleEditSignatureChange}
                          />
                        </div>
                        <div className='form-group'>
                          <label>Website</label>
                          <input
                            type='text'
                            name='website'
                            value={
                              editingTemplate.signatureConfig?.website || ''
                            }
                            onChange={handleEditSignatureChange}
                          />
                        </div>
                      </div>
                      <div className='form-group'>
                        <label>Additional Information</label>
                        <textarea
                          name='additionalInfo'
                          rows='2'
                          value={
                            editingTemplate.signatureConfig?.additionalInfo ||
                            ''
                          }
                          onChange={handleEditSignatureChange}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {editingTemplate.content && (
                  <div className='preview-section'>
                    <label>Preview</label>
                    <EmailPreview
                      content={editingTemplate.content}
                      includeSignature={editingTemplate.includeSignature}
                      signatureConfig={editingTemplate.signatureConfig}
                      attachments={editingTemplate.attachments}
                    />
                  </div>
                )}

                <div className='status-toggle'>
                  <div>
                    <h5>Template Status</h5>
                    <p>Enable or disable this template</p>
                  </div>
                  <label className='switch'>
                    <input
                      type='checkbox'
                      name='status'
                      checked={editingTemplate.status}
                      onChange={handleEditInputChange}
                    />
                    <span className='slider'></span>
                  </label>
                </div>

                <div className='modal-actions'>
                  <button
                    type='button'
                    className='btn-secondary'
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='btn-primary'
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className='modal-overlay'
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className='modal-container small'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='modal-header'>
              <h2>Confirm Deletion</h2>
              <button
                className='modal-close'
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>
            <div className='modal-body'>
              <p>
                Are you sure you want to delete this template? This action
                cannot be undone.
              </p>
            </div>
            <div
              className='modal-actions'
              style={{
                marginBottom: '20px',
              }}
            >
              <button
                type='button'
                className='btn-secondary'
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type='button'
                className='btn-danger'
                onClick={confirmDelete}
                style={{
                  marginRight: '20px',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
