/**
 * Report Generator Service
 * Generates beautiful HTML reports from lead audit data
 */

const getScoreColor = (score) => {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  if (score >= 40) return '#f97316';
  return '#ef4444';
};

const getScoreLabel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Average';
  return 'Needs Improvement';
};

const generateReportHTML = (lead, options = {}) => {
  const {
    includeSocial = true,
    includeEmailReputation = true,
    includeOutreach = true,
    theme = 'dark',
  } = options;

  const logoUrl =
    'https://www.rainbootsmarketing.com/images/rainboots_logo.png';
  const fallbackLogo =
    'https://www.rainbootsmarketing.com/images/rainboots_logo.png';

  const bgColor = theme === 'dark' ? '#0d1b2a' : '#ffffff';
  const textColor = theme === 'dark' ? '#f5f0e8' : '#333333';
  const cardBg = theme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#f9fafb';
  const borderColor = theme === 'dark' ? 'rgba(14, 154, 167, 0.2)' : '#e5e7eb';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Website Audit Report - ${lead.businessName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      background: ${bgColor};
      color: ${textColor};
      padding: 40px 20px;
    }
    
    .report-container {
      max-width: 900px;
      margin: 0 auto;
      background: ${cardBg};
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid ${borderColor};
    }
    
    .report-header {
      background: linear-gradient(135deg, #0e9aa7 0%, #17c3d4 100%);
      padding: 40px;
      text-align: center;
      color: white;
    }
    
    .report-header h1 {
      font-size: 28px;
      margin-bottom: 10px;
      font-weight: 700;
    }
    
    .report-header .business-name {
      font-size: 20px;
      margin-bottom: 20px;
      opacity: 0.95;
    }
    
    .score-section {
      display: inline-block;
      background: rgba(255, 255, 255, 0.2);
      padding: 12px 24px;
      border-radius: 40px;
      margin-top: 10px;
    }
    
    .score-value {
      font-size: 32px;
      font-weight: 700;
      margin-right: 8px;
    }
    
    .score-label {
      font-size: 14px;
      opacity: 0.9;
    }
    
    .report-section {
      padding: 30px;
      border-bottom: 1px solid ${borderColor};
    }
    
    .report-section:last-child {
      border-bottom: none;
    }
    
    .section-title {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      color: #17c3d4;
    }
    
    .section-title .icon {
      font-size: 24px;
    }
    
    .summary-text {
      font-size: 16px;
      line-height: 1.7;
      color: ${textColor};
    }
    
    .issues-list, .opportunities-list, .quickwins-list {
      list-style: none;
      padding: 0;
    }
    
    .issue-item, .opportunity-item, .quickwin-item {
      padding: 12px 0;
      border-bottom: 1px solid ${borderColor};
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    
    .issue-item:last-child, .opportunity-item:last-child, .quickwin-item:last-child {
      border-bottom: none;
    }
    
    .issue-bullet {
      color: #ef4444;
      font-weight: 700;
      min-width: 24px;
    }
    
    .opportunity-bullet {
      color: #10b981;
      font-weight: 700;
      min-width: 24px;
    }
    
    .quickwin-badge {
      background: #f59e0b;
      color: #0d1b2a;
      padding: 2px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      min-width: 40px;
      text-align: center;
    }
    
    .social-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 15px;
    }
    
    .social-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: rgba(14, 154, 167, 0.15);
      border-radius: 30px;
      text-decoration: none;
      color: #17c3d4;
      font-size: 14px;
      transition: all 0.2s;
    }
    
    .social-link:hover {
      background: rgba(14, 154, 167, 0.25);
      transform: translateY(-2px);
    }
    
    .email-checks {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-top: 15px;
    }
    
    .email-check {
      padding: 12px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 12px;
      border-left: 3px solid;
    }
    
    .email-check.pass {
      border-left-color: #10b981;
    }
    
    .email-check.fail {
      border-left-color: #ef4444;
    }
    
    .email-check strong {
      display: block;
      margin-bottom: 4px;
      font-size: 13px;
    }
    
    .email-check span {
      font-size: 12px;
      opacity: 0.8;
    }
    
    .outreach-message {
      background: rgba(14, 154, 167, 0.1);
      padding: 20px;
      border-radius: 12px;
      font-style: italic;
      margin-top: 15px;
      border-left: 3px solid #0e9aa7;
    }
    
    .report-footer {
      padding: 30px;
      text-align: center;
      background: rgba(0, 0, 0, 0.2);
      font-size: 12px;
      opacity: 0.7;
    }
    
    @media (max-width: 600px) {
      .report-header {
        padding: 30px 20px;
      }
      
      .report-section {
        padding: 20px;
      }
      
      .section-title {
        font-size: 18px;
      }
      
      .email-checks {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="report-container">
    <div class="report-header">
  <div style="margin-bottom: 20px;">
    <img 
      src="${logoUrl}" 
      alt="Rainboots Marketing" 
      height="50" 
      style="display: block; margin: 0 auto; height: 50px;"
      onerror="this.onerror=null; this.src='${fallbackLogo}'; this.onerror=null; this.style.display='none'; this.parentElement.innerHTML='<h2 style=\\\'color:white;margin:0;font-family:Syne,sans-serif;\\\'>RAINBOOTS MARKETING</h2>';"
    />
  </div>
  <h1>📊 Website Audit Report</h1>
  <div class="business-name">${lead.businessName || 'Business'}</div>
  <div class="score-section">
    <span class="score-value">${lead.score || 0}</span>
    <span class="score-label">/ 100 - ${getScoreLabel(lead.score || 0)}</span>
  </div>
</div>
    
    <div class="report-section">
      <div class="section-title">
        <span class="icon">📋</span>
        <span>Executive Summary</span>
      </div>
      <div class="summary-text">
        ${lead.analysis?.summary || 'No summary available.'}
      </div>
    </div>
    
    ${
      lead.analysis?.issues?.length > 0
        ? `
    <div class="report-section">
      <div class="section-title">
        <span class="icon">⚠️</span>
        <span>Critical Issues Found (${lead.analysis.issues.length})</span>
      </div>
      <div class="issues-list">
        ${lead.analysis.issues
          .map(
            (issue, i) => `
          <div class="issue-item">
            <span class="issue-bullet">${i + 1}.</span>
            <span>${issue}</span>
          </div>
        `,
          )
          .join('')}
      </div>
    </div>
    `
        : ''
    }
    
    ${
      lead.analysis?.opportunities?.length > 0
        ? `
    <div class="report-section">
      <div class="section-title">
        <span class="icon">🚀</span>
        <span>Growth Opportunities (${lead.analysis.opportunities.length})</span>
      </div>
      <div class="opportunities-list">
        ${lead.analysis.opportunities
          .map(
            (opp, i) => `
          <div class="opportunity-item">
            <span class="opportunity-bullet">✨</span>
            <span>${opp}</span>
          </div>
        `,
          )
          .join('')}
      </div>
    </div>
    `
        : ''
    }
    
    ${
      lead.analysis?.quickWins?.length > 0
        ? `
    <div class="report-section">
      <div class="section-title">
        <span class="icon">⚡</span>
        <span>Quick Wins (${lead.analysis.quickWins.length})</span>
      </div>
      <div class="quickwins-list">
        ${lead.analysis.quickWins
          .map(
            (win, i) => `
          <div class="quickwin-item">
            <span class="quickwin-badge">#${i + 1}</span>
            <span>${win}</span>
          </div>
        `,
          )
          .join('')}
      </div>
    </div>
    `
        : ''
    }
    
    ${
      includeSocial &&
      lead.socialLinks &&
      Object.keys(lead.socialLinks).length > 0
        ? `
    <div class="report-section">
      <div class="section-title">
        <span class="icon">📱</span>
        <span>Social Media Presence</span>
      </div>
      <div class="social-grid">
        ${Object.entries(lead.socialLinks)
          .map(
            ([platform, url]) => `
          <a href="${url}" target="_blank" class="social-link">
            ${platform.charAt(0).toUpperCase() + platform.slice(1)}
          </a>
        `,
          )
          .join('')}
      </div>
      ${
        lead.analysis?.socialAnalysis?.recommendations?.length > 0
          ? `
        <div style="margin-top: 20px;">
          <strong>Recommendations:</strong>
          <ul style="margin-top: 10px; padding-left: 20px;">
            ${lead.analysis.socialAnalysis.recommendations.map((rec) => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
      `
          : ''
      }
    </div>
    `
        : ''
    }
    
    ${
      includeEmailReputation && lead.emailReputation
        ? `
    <div class="report-section">
      <div class="section-title">
        <span class="icon">📧</span>
        <span>Email Health (${lead.emailReputation.score || 0}/100)</span>
      </div>
      <div class="email-checks">
        <div class="email-check ${lead.emailReputation.mx?.exists ? 'pass' : 'fail'}">
          <strong>MX Records</strong>
          <span>${lead.emailReputation.mx?.exists ? lead.emailReputation.mx.provider || 'Configured' : 'Missing'}</span>
        </div>
        <div class="email-check ${lead.emailReputation.spf?.exists ? 'pass' : 'fail'}">
          <strong>SPF Record</strong>
          <span>${lead.emailReputation.spf?.exists ? (lead.emailReputation.spf.strict ? 'Strict policy' : 'Soft policy') : 'Missing'}</span>
        </div>
        <div class="email-check ${lead.emailReputation.dkim?.exists ? 'pass' : 'fail'}">
          <strong>DKIM</strong>
          <span>${lead.emailReputation.dkim?.exists ? `Configured (${lead.emailReputation.dkim.selector})` : 'Missing'}</span>
        </div>
        <div class="email-check ${lead.emailReputation.dmarc?.exists ? 'pass' : 'fail'}">
          <strong>DMARC</strong>
          <span>${lead.emailReputation.dmarc?.exists ? `Policy: ${lead.emailReputation.dmarc.policy}` : 'Missing'}</span>
        </div>
      </div>
      ${
        lead.analysis?.emailAnalysis?.summary
          ? `
        <div style="margin-top: 15px; padding: 12px; background: rgba(14, 154, 167, 0.05); border-radius: 8px;">
          ${lead.analysis.emailAnalysis.summary}
        </div>
      `
          : ''
      }
    </div>
    `
        : ''
    }
    
    ${
      includeOutreach && lead.analysis?.outreachMessage
        ? `
    <div class="report-section">
      <div class="section-title">
        <span class="icon">✉️</span>
        <span>Suggested Outreach Message</span>
      </div>
      <div class="outreach-message">
        ${lead.analysis.outreachMessage}
      </div>
    </div>
    `
        : ''
    }
    
    <div class="report-footer">
      <p>Report generated by Rainboots Marketing Intelligence</p>
      <p>© ${new Date().getFullYear()} Rainboots Marketing. All rights reserved.</p>
      <p style="margin-top: 10px;">
        <a href="https://rainbootsmarketing.com" style="color: #17c3d4; text-decoration: none;">rainbootsmarketing.com</a>
      </p>
    </div>
  </div>
</body>
</html>`;
};

module.exports = { generateReportHTML };
