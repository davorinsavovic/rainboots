import { useState, useRef, useEffect } from 'react';
import { API_BASE } from '../config';
import './WebsiteAudit.css';

const LOADING_MESSAGES = [
  'Launching browser to analyze website...',
  'Extracting content and structure...',
  'Analyzing conversion opportunities...',
  'Identifying quick wins...',
  'Generating outreach message...',
  'Almost ready...',
];

const SERVICE_CATEGORIES = [
  { value: 'all', label: 'All Websites' },
  { value: 'local-business', label: 'Local Business' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'saas', label: 'SaaS' },
  { value: 'nonprofit', label: 'Nonprofit' },
];

const SOCIAL_ICONS = {
  facebook: '👥',
  instagram: '📸',
  twitter: '🐦',
  linkedin: '💼',
  youtube: '▶️',
  tiktok: '🎵',
  yelp: '⭐',
};

export default function WebsiteAudit() {
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error, setError] = useState('');
  const [auditResult, setAuditResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [copyStatus, setCopyStatus] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    issues: true,
    opportunities: true,
    quickWins: true,
    social: true,
  });

  const outputRef = useRef(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/audit/history`);
        const data = await res.json();
        if (data.success) setHistory(data.audits);
      } catch (err) {
        console.error('Failed to load audit history:', err);
      }
    };
    loadHistory();
  }, []);

  const startLoadingMessages = () => {
    let i = 0;
    setLoadingMsg(LOADING_MESSAGES[0]);
    const interval = setInterval(() => {
      i = (i + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[i]);
    }, 2500);
    return () => clearInterval(interval);
  };

  const runAudit = async () => {
    if (!url.trim()) {
      setError('Please enter a website URL');
      return;
    }

    let formattedUrl = url.trim();
    if (
      !formattedUrl.startsWith('http://') &&
      !formattedUrl.startsWith('https://')
    ) {
      formattedUrl = 'https://' + formattedUrl;
      setUrl(formattedUrl);
    }

    setError('');
    setLoading(true);
    setAuditResult(null);

    const stopMessages = startLoadingMessages();

    try {
      const response = await fetch(`${API_BASE}/api/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formattedUrl }),
      });

      if (!response.ok) {
        const text = await response.text();
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.error || `API error: ${response.status}`);
        } catch (e) {
          throw new Error(
            `API error: ${response.status} - ${text.substring(0, 100)}`,
          );
        }
      }

      const data = await response.json();

      if (data.success) {
        const result = {
          ...data.data,
          category,
          timestamp: new Date().toISOString(),
          id: Date.now(),
        };

        setAuditResult(result);

        try {
          await fetch(`${API_BASE}/api/audit/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(result),
          });
          const histRes = await fetch(`${API_BASE}/api/audit/history`);
          const histData = await histRes.json();
          if (histData.success) setHistory(histData.audits);
        } catch (err) {
          console.error('Failed to save audit to DB:', err);
          setHistory((prev) => [result, ...prev].slice(0, 20));
        }

        setTimeout(() => {
          outputRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 100);
      } else {
        throw new Error(data.error || 'Audit failed');
      }
    } catch (err) {
      console.error('Audit error:', err);
      setError(`Failed to run audit: ${err.message}`);
    } finally {
      stopMessages();
      setLoading(false);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus(label);
      setTimeout(() => setCopyStatus(''), 2000);
    });
  };

  const copyOutreachMessage = () => {
    if (auditResult?.analysis?.outreachMessage) {
      copyToClipboard(auditResult.analysis.outreachMessage, 'outreach');
    }
  };

  const copyFullReport = () => {
    if (auditResult) {
      const socialSection = auditResult.socialLinks
        ? `\nSOCIAL MEDIA\nFound: ${Object.keys(auditResult.socialLinks).join(', ') || 'none'}\nMissing: ${auditResult.analysis.socialAnalysis?.missingPlatforms?.join(', ') || 'none'}`
        : '';

      const report = `
Website Audit Report
====================
URL: ${auditResult.url}
Title: ${auditResult.title}
Date: ${new Date(auditResult.timestamp).toLocaleString()}

SUMMARY
${auditResult.analysis.summary}

TOP ISSUES
${auditResult.analysis.issues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}

OPPORTUNITIES
${auditResult.analysis.opportunities.map((opp, i) => `${i + 1}. ${opp}`).join('\n')}

QUICK WINS
${auditResult.analysis.quickWins.map((win, i) => `${i + 1}. ${win}`).join('\n')}
${socialSection}

OUTREACH MESSAGE
${auditResult.analysis.outreachMessage}
      `;
      copyToClipboard(report, 'report');
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) runAudit();
  };

  const getSocialEntries = () => {
    if (!auditResult?.socialLinks) return [];
    if (auditResult.socialLinks instanceof Map) {
      return Array.from(auditResult.socialLinks.entries());
    }
    return Object.entries(auditResult.socialLinks);
  };

  return (
    <div className='audit-page' data-header-theme='dark'>
      <div className='audit-rain-container'>
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className='audit-rain-drop'
            style={{
              left: `${Math.random() * 100}%`,
              height: `${Math.random() * 60 + 30}px`,
              animation: `fall ${Math.random() * 1.5 + 0.7}s linear ${Math.random() * 3}s infinite`,
              opacity: Math.random() * 0.3 + 0.05,
            }}
          />
        ))}
      </div>

      <div className='audit-app'>
        <header className='audit-header'>
          <div className='audit-logo-section'>
            <div className='audit-logo-mark'>🔍</div>
            <div>
              <div className='audit-header-title'>Website Audit Engine</div>
              <div className='audit-header-sub'>
                AI-powered lead generation & website analysis
              </div>
            </div>
          </div>
        </header>

        <div className='audit-panel'>
          <div className='audit-section-label'>Analyze Any Website</div>
          <div className='audit-input-group'>
            <input
              type='text'
              className='audit-url-input'
              placeholder='Enter website URL (e.g., example.com or https://example.com)'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <select
              className='audit-category-select'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
            >
              {SERVICE_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <button className='audit-btn' onClick={runAudit} disabled={loading}>
              {loading ? 'Analyzing...' : 'Run Audit →'}
            </button>
          </div>
          {error && <div className='audit-error-msg'>{error}</div>}
        </div>

        {loading && (
          <div className='audit-loading-container'>
            <div className='audit-loading-bars'>
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className='audit-loading-bar'
                  style={{
                    animation: `bounce 0.8s ease-in-out ${i * 0.1}s infinite`,
                  }}
                />
              ))}
            </div>
            <p className='audit-loading-msg'>{loadingMsg}</p>
          </div>
        )}

        {auditResult && !loading && (
          <div ref={outputRef}>
            <div className='audit-result-header'>
              <div className='audit-url-badge'>
                <span className='audit-url-icon'>🌐</span>
                <span className='audit-url-text'>{auditResult.url}</span>
              </div>
              <div className='audit-title-badge'>
                <span className='audit-title-icon'>📄</span>
                <span className='audit-title-text'>{auditResult.title}</span>
              </div>
              <div className='audit-date-badge'>
                {new Date(auditResult.timestamp).toLocaleString()}
              </div>
            </div>

            <div className='audit-summary-card'>
              <div className='audit-summary-icon'>📊</div>
              <div className='audit-summary-content'>
                <h3 className='audit-summary-title'>Executive Summary</h3>
                <p className='audit-summary-text'>
                  {auditResult.analysis.summary}
                </p>
              </div>
            </div>

            {/* Issues */}
            <div className='audit-section-card'>
              <div
                className='audit-section-header'
                onClick={() => toggleSection('issues')}
              >
                <div className='audit-section-title-wrapper'>
                  <span className='audit-section-icon'>⚠️</span>
                  <h3 className='audit-section-title'>Critical Issues Found</h3>
                  <span className='audit-issue-count'>
                    ({auditResult.analysis.issues.length})
                  </span>
                </div>
                <span className='audit-expand-icon'>
                  {expandedSections.issues ? '▼' : '▶'}
                </span>
              </div>
              {expandedSections.issues && (
                <div className='audit-section-content'>
                  {auditResult.analysis.issues.map((issue, idx) => (
                    <div key={idx} className='audit-issue-item'>
                      <span className='audit-issue-number'>{idx + 1}.</span>
                      <span className='audit-issue-text'>{issue}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Opportunities */}
            <div className='audit-section-card'>
              <div
                className='audit-section-header'
                onClick={() => toggleSection('opportunities')}
              >
                <div className='audit-section-title-wrapper'>
                  <span className='audit-section-icon'>🚀</span>
                  <h3 className='audit-section-title'>Growth Opportunities</h3>
                  <span className='audit-opportunity-count'>
                    ({auditResult.analysis.opportunities.length})
                  </span>
                </div>
                <span className='audit-expand-icon'>
                  {expandedSections.opportunities ? '▼' : '▶'}
                </span>
              </div>
              {expandedSections.opportunities && (
                <div className='audit-section-content'>
                  {auditResult.analysis.opportunities.map((opp, idx) => (
                    <div key={idx} className='audit-opportunity-item'>
                      <span className='audit-opportunity-icon'>✨</span>
                      <span className='audit-opportunity-text'>{opp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Wins */}
            <div className='audit-section-card'>
              <div
                className='audit-section-header'
                onClick={() => toggleSection('quickWins')}
              >
                <div className='audit-section-title-wrapper'>
                  <span className='audit-section-icon'>⚡</span>
                  <h3 className='audit-section-title'>Quick Wins</h3>
                  <span className='audit-quickwin-count'>
                    ({auditResult.analysis.quickWins.length})
                  </span>
                </div>
                <span className='audit-expand-icon'>
                  {expandedSections.quickWins ? '▼' : '▶'}
                </span>
              </div>
              {expandedSections.quickWins && (
                <div className='audit-section-content'>
                  {auditResult.analysis.quickWins.map((win, idx) => (
                    <div key={idx} className='audit-quickwin-item'>
                      <span className='audit-quickwin-number'>{idx + 1}</span>
                      <span className='audit-quickwin-text'>{win}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Social Media */}
            <div className='audit-section-card'>
              <div
                className='audit-section-header'
                onClick={() => toggleSection('social')}
              >
                <div className='audit-section-title-wrapper'>
                  <span className='audit-section-icon'>📱</span>
                  <h3 className='audit-section-title'>Social Media Presence</h3>
                  <span className='audit-issue-count'>
                    ({getSocialEntries().length} found)
                  </span>
                </div>
                <span className='audit-expand-icon'>
                  {expandedSections.social ? '▼' : '▶'}
                </span>
              </div>

              {expandedSections.social && (
                <div className='audit-section-content'>
                  {/* Found Social Links */}
                  {getSocialEntries().length > 0 && (
                    <div className='social-found'>
                      {getSocialEntries().map(([platform, socialUrl]) => (
                        <a
                          key={platform}
                          href={socialUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='social-badge found'
                        >
                          {SOCIAL_ICONS[platform] || '🔗'} {platform}
                        </a>
                      ))}
                    </div>
                  )}

                  {/* No Social Found */}
                  {getSocialEntries().length === 0 && (
                    <p className='social-missing-label'>
                      No social media profiles found on this website.
                    </p>
                  )}

                  {/* Missing Platforms */}
                  {auditResult.analysis.socialAnalysis?.missingPlatforms
                    ?.length > 0 && (
                    <div className='social-missing'>
                      <p className='social-missing-label'>
                        ❌ Missing platforms:
                      </p>
                      <div className='social-missing-list'>
                        {auditResult.analysis.socialAnalysis.missingPlatforms.map(
                          (platform) => (
                            <span
                              key={platform}
                              className='social-badge missing'
                            >
                              {SOCIAL_ICONS[platform.toLowerCase()] || '🔗'}{' '}
                              {platform}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {auditResult.analysis.socialAnalysis?.recommendations
                    ?.length > 0 && (
                    <div className='social-recommendations'>
                      {auditResult.analysis.socialAnalysis.recommendations.map(
                        (rec, idx) => (
                          <div key={idx} className='audit-opportunity-item'>
                            <span className='audit-opportunity-icon'>💡</span>
                            <span className='audit-opportunity-text'>
                              {rec}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Email Reputation Section */}
            {auditResult.emailReputation && (
              <div className='audit-section-card'>
                <div
                  className='audit-section-header'
                  onClick={() => toggleSection('email')}
                >
                  <div className='audit-section-title-wrapper'>
                    <span className='audit-section-icon'>📧</span>
                    <h3 className='audit-section-title'>Email Reputation</h3>
                    <span className='audit-issue-count'>
                      Score: {auditResult.emailReputation.score}/100
                    </span>
                  </div>
                  <span className='audit-expand-icon'>
                    {expandedSections.email ? '▼' : '▶'}
                  </span>
                </div>
                {expandedSections.email && (
                  <div className='audit-section-content'>
                    <div className='email-checks'>
                      <div
                        className={`email-check ${auditResult.emailReputation.mx.exists ? 'pass' : 'fail'}`}
                      >
                        <span className='email-check-icon'>
                          {auditResult.emailReputation.mx.exists ? '✅' : '❌'}
                        </span>
                        <div className='email-check-info'>
                          <strong>MX Records</strong>
                          <span>
                            {auditResult.emailReputation.mx.exists
                              ? auditResult.emailReputation.mx.provider
                              : 'No email configured'}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`email-check ${auditResult.emailReputation.spf.exists ? 'pass' : 'fail'}`}
                      >
                        <span className='email-check-icon'>
                          {auditResult.emailReputation.spf.exists ? '✅' : '❌'}
                        </span>
                        <div className='email-check-info'>
                          <strong>SPF Record</strong>
                          <span>
                            {auditResult.emailReputation.spf.exists
                              ? auditResult.emailReputation.spf.strict
                                ? 'Strict policy (-all)'
                                : 'Soft policy (~all)'
                              : 'Missing — emails may be spoofed'}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`email-check ${auditResult.emailReputation.dkim.exists ? 'pass' : 'fail'}`}
                      >
                        <span className='email-check-icon'>
                          {auditResult.emailReputation.dkim.exists
                            ? '✅'
                            : '❌'}
                        </span>
                        <div className='email-check-info'>
                          <strong>DKIM</strong>
                          <span>
                            {auditResult.emailReputation.dkim.exists
                              ? `Configured (selector: ${auditResult.emailReputation.dkim.selector})`
                              : 'Missing — emails not cryptographically signed'}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`email-check ${auditResult.emailReputation.dmarc.exists ? 'pass' : 'fail'}`}
                      >
                        <span className='email-check-icon'>
                          {auditResult.emailReputation.dmarc.exists
                            ? '✅'
                            : '❌'}
                        </span>
                        <div className='email-check-info'>
                          <strong>DMARC Policy</strong>
                          <span>
                            {auditResult.emailReputation.dmarc.exists
                              ? `Policy: ${auditResult.emailReputation.dmarc.policy}`
                              : 'Missing — no email policy set'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {auditResult.analysis.emailAnalysis?.summary && (
                      <p className='email-summary'>
                        {auditResult.analysis.emailAnalysis.summary}
                      </p>
                    )}

                    {auditResult.analysis.emailAnalysis?.recommendations
                      ?.length > 0 && (
                      <div className='social-recommendations'>
                        {auditResult.analysis.emailAnalysis.recommendations.map(
                          (rec, idx) => (
                            <div key={idx} className='audit-opportunity-item'>
                              <span className='audit-opportunity-icon'>💡</span>
                              <span className='audit-opportunity-text'>
                                {rec}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Outreach */}
            <div className='audit-outreach-card'>
              <div className='audit-outreach-header'>
                <span className='audit-outreach-icon'>✉️</span>
                <h3 className='audit-outreach-title'>
                  Ready-to-Send Outreach Message
                </h3>
              </div>
              <div className='audit-outreach-message'>
                {auditResult.analysis.outreachMessage}
              </div>
              <div className='audit-outreach-actions'>
                <button
                  className='audit-copy-btn'
                  onClick={copyOutreachMessage}
                >
                  {copyStatus === 'outreach' ? '✅ Copied!' : '📋 Copy Message'}
                </button>
                <button
                  className='audit-copy-btn audit-report-btn'
                  onClick={copyFullReport}
                >
                  {copyStatus === 'report'
                    ? '✅ Copied!'
                    : '📄 Copy Full Report'}
                </button>
              </div>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className='audit-history-section'>
            <div className='audit-section-label'>Recent Audits</div>
            <div className='audit-history-list'>
              {history
                .filter((item) => item.url !== auditResult?.url)
                .map((item, idx) => (
                  <div
                    key={idx}
                    className='audit-history-item'
                    onClick={() => {
                      setAuditResult(item);
                      outputRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <div className='audit-history-url'>{item.url}</div>
                    <div className='audit-history-date'>
                      {new Date(item.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
