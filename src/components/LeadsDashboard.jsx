import { useState, useEffect, useRef } from 'react';
import CategorySelector from './CategorySelector';
import LocationSelector from './LocationSelector';
import { API_BASE } from '../config';
import './LeadsDashboard.css';

const LOADING_MESSAGES = [
  'Loading leads from database...',
  'Ranking opportunities...',
  'Preparing outreach messages...',
  'Almost ready...',
];

const STATUS_FILTERS = [
  { value: 'all', label: 'All Leads' },
  { value: 'new', label: 'New' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'closed', label: 'Closed' },
];

const TIME_RANGES = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
];

const SORT_OPTIONS = [
  { value: '-score', label: 'Score (High to Low)' },
  { value: 'score', label: 'Score (Low to High)' },
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt', label: 'Oldest First' },
];

export default function LeadsDashboard() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  const [sortBy, setSortBy] = useState('-score');
  const [selectedLead, setSelectedLead] = useState(null);
  const [copyStatus, setCopyStatus] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [collecting, setCollecting] = useState(false);
  const [progressLog, setProgressLog] = useState([]);
  const [progressStats, setProgressStats] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const itemsPerPage = 10;

  const outputRef = useRef(null);
  const eventSourceRef = useRef(null);
  const progressLogRef = useRef(null);

  const startLoadingMessages = () => {
    let i = 0;
    setLoadingMsg(LOADING_MESSAGES[0]);
    const interval = setInterval(() => {
      i = (i + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[i]);
    }, 2500);
    return () => clearInterval(interval);
  };

  const getDateFilter = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    switch (timeRange) {
      case 'today':
        return { $gte: today.toISOString() };
      case 'week': {
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        return { $gte: weekAgo.toISOString() };
      }
      case 'month': {
        const monthAgo = new Date(today);
        monthAgo.setMonth(today.getMonth() - 1);
        return { $gte: monthAgo.toISOString() };
      }
      case 'year': {
        const yearAgo = new Date(today);
        yearAgo.setFullYear(today.getFullYear() - 1);
        return { $gte: yearAgo.toISOString() };
      }
      default:
        return {};
    }
  };

  const fetchLeads = async () => {
    try {
      let url = `${API_BASE}/api/leads?limit=${itemsPerPage}&page=${currentPage}&sort=${sortBy}`;
      if (statusFilter !== 'all') url += `&status=${statusFilter}`;
      if (timeRange !== 'all') {
        const dateFilter = getDateFilter();
        if (dateFilter.$gte)
          url += `&createdAfter=${encodeURIComponent(dateFilter.$gte)}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.pagination) {
        setLeads(data.leads || []);
        setTotalPages(data.pagination.totalPages || 1);
        setTotalLeads(data.pagination.totalLeads || 0);
      } else {
        setLeads(data.leads || []);
        setTotalLeads(data.leads?.length || 0);
        setTotalPages(Math.ceil((data.leads?.length || 0) / itemsPerPage));
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError('Failed to load leads. Make sure backend is running.');
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/stats/leads`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setStats(data.stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const stopMessages = startLoadingMessages();
      await Promise.all([fetchLeads(), fetchStats()]);
      stopMessages();
      setLoading(false);
    };
    loadData();
  }, [statusFilter, timeRange, sortBy, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, timeRange, sortBy]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedLead) setSelectedLead(null);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedLead]);

  useEffect(() => {
    loadPreferences();
    loadLocationPreferences();
  }, []);

  // Auto-scroll progress log to bottom
  useEffect(() => {
    if (progressLogRef.current) {
      progressLogRef.current.scrollTop = progressLogRef.current.scrollHeight;
    }
  }, [progressLog]);

  // Cleanup SSE on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) eventSourceRef.current.close();
    };
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchLeads();
        fetchStats();
      }
    } catch (err) {
      console.error('Error updating lead:', err);
    }
  };

  const triggerCollection = async () => {
    try {
      setError('');
      setCollecting(true);
      setProgressLog([]);
      setProgressStats(null);

      // Open SSE connection for real-time progress
      const es = new EventSource(`${API_BASE}/api/leads/collect/progress`);
      eventSourceRef.current = es;

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          setProgressLog((prev) => [...prev.slice(-100), data]);

          if (data.total !== undefined) {
            setProgressStats({
              current: data.current || 0,
              total: data.total,
              saved: data.saved || 0,
              skipped: data.skipped || 0,
              failed: data.failed || 0,
              percent: data.percent || 0,
            });
          }

          if (data.type === 'complete' || data.type === 'error') {
            es.close();
            setCollecting(false);
            fetchLeads();
            fetchStats();
          }
        } catch (e) {
          console.error('SSE parse error:', e);
        }
      };

      es.onerror = () => {
        es.close();
        setCollecting(false);
      };

      // Trigger the collection after SSE is set up
      const res = await fetch(`${API_BASE}/api/leads/collect`, {
        method: 'POST',
      });
      if (!res.ok) {
        es.close();
        setCollecting(false);
        setError('Failed to start collection');
      }
    } catch (err) {
      setCollecting(false);
      setError('Failed to start collection.');
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus(label);
      setTimeout(() => setCopyStatus(''), 2000);
    });
  };

  const copyOutreachMessage = (lead) => {
    if (lead.analysis?.outreachMessage) {
      copyToClipboard(lead.analysis.outreachMessage, 'outreach');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#ef4444';
    return '#6b7280';
  };

  const getStatusClass = (status) => `status-badge status-${status}`;

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const loadPreferences = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/preferences/categories`);
      const data = await res.json();
      if (data.success && data.preferences) {
        setSelectedCategories(data.preferences.selectedCategories || []);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setPreferencesLoaded(true);
    }
  };

  const handleCategorySave = (categories) => setSelectedCategories(categories);

  const loadLocationPreferences = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/preferences/locations`);
      const data = await res.json();
      if (data.success && data.preferences) {
        setSelectedLocations(data.preferences.locations || []);
      }
    } catch (error) {
      console.error('Error loading location preferences:', error);
    }
  };

  const handleLocationSave = (locations) => setSelectedLocations(locations);

  return (
    <div className='leads-page' data-header-theme='dark'>
      <div className='leads-rain-container'>
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className='leads-rain-drop'
            style={{
              left: `${Math.random() * 100}%`,
              height: `${Math.random() * 60 + 30}px`,
              animation: `fall ${Math.random() * 1.5 + 0.7}s linear ${Math.random() * 3}s infinite`,
              opacity: Math.random() * 0.3 + 0.05,
            }}
          />
        ))}
      </div>

      <div className='leads-app'>
        <header className='leads-header'>
          <div className='leads-logo-section'>
            <div className='leads-logo-mark'>📊</div>
            <div>
              <div className='leads-header-title'>Daily Lead Intelligence</div>
              <div className='leads-header-sub'>
                AI-powered leads ranked by opportunity score
              </div>
            </div>
          </div>
        </header>

        {stats && (
          <div className='leads-stats-grid'>
            <div className='stats-card'>
              <div className='stats-icon'>📋</div>
              <div className='stats-info'>
                <h3>{totalLeads || stats.total || 0}</h3>
                <p>Total Leads</p>
              </div>
            </div>
            <div className='stats-card new'>
              <div className='stats-icon'>🆕</div>
              <div className='stats-info'>
                <h3>{stats.new || 0}</h3>
                <p>New</p>
              </div>
            </div>
            <div className='stats-card reviewed'>
              <div className='stats-icon'>👁️</div>
              <div className='stats-info'>
                <h3>{stats.reviewed || 0}</h3>
                <p>Reviewed</p>
              </div>
            </div>
            <div className='stats-card contacted'>
              <div className='stats-icon'>✉️</div>
              <div className='stats-info'>
                <h3>{stats.contacted || 0}</h3>
                <p>Contacted</p>
              </div>
            </div>
            <div className='stats-card score'>
              <div className='stats-icon'>🎯</div>
              <div className='stats-info'>
                <h3>{Math.round(stats.avgScore || 0)}</h3>
                <p>Avg Score</p>
              </div>
            </div>
          </div>
        )}

        <div className='leads-control-panel'>
          <div className='leads-filters'>
            <div className='filter-group'>
              <span className='filter-label'>Status</span>
              <div className='filter-buttons'>
                {STATUS_FILTERS.map((filter) => (
                  <button
                    key={filter.value}
                    className={`filter-btn ${statusFilter === filter.value ? 'active' : ''}`}
                    onClick={() => setStatusFilter(filter.value)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
            <div className='filter-group'>
              <span className='filter-label'>Time Range</span>
              <div className='filter-buttons'>
                {TIME_RANGES.map((range) => (
                  <button
                    key={range.value}
                    className={`filter-btn ${timeRange === range.value ? 'active' : ''}`}
                    onClick={() => setTimeRange(range.value)}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
            <div className='filter-group'>
              <span className='filter-label'>Sort By</span>
              <select
                className='sort-select'
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className='leads-actions'>
            <CategorySelector
              onSave={handleCategorySave}
              initialCategories={selectedCategories}
            />
            <LocationSelector
              onSave={handleLocationSave}
              initialLocations={selectedLocations}
            />
            <button
              className='collect-btn'
              onClick={triggerCollection}
              disabled={collecting}
            >
              {collecting ? '⏳ Collecting...' : '🔄 Collect New Leads'}
            </button>
          </div>
        </div>

        {/* Collection Progress Panel */}
        {collecting && (
          <div className='collection-progress-panel'>
            <div className='progress-header'>
              <div className='progress-title'>
                <span className='progress-spinner'>⚙️</span>
                <span>Collecting Leads...</span>
              </div>
              {progressStats && (
                <div className='progress-counts'>
                  <span className='prog-stat saved'>
                    ✅ {progressStats.saved} saved
                  </span>
                  <span className='prog-stat skipped'>
                    ⏭️ {progressStats.skipped} skipped
                  </span>
                  <span className='prog-stat failed'>
                    ❌ {progressStats.failed} failed
                  </span>
                </div>
              )}
            </div>

            {progressStats && (
              <div className='progress-bar-wrapper'>
                <div
                  className='progress-bar-fill'
                  style={{ width: `${progressStats.percent}%` }}
                />
                <span className='progress-bar-label'>
                  {progressStats.current} / {progressStats.total} (
                  {progressStats.percent}%)
                </span>
              </div>
            )}

            <div className='progress-log' ref={progressLogRef}>
              {progressLog.map((entry, idx) => (
                <div key={idx} className={`progress-log-entry ${entry.type}`}>
                  {entry.message}
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className='leads-loading-container'>
            <div className='leads-loading-bars'>
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className='leads-loading-bar'
                  style={{
                    animation: `bounce 0.8s ease-in-out ${i * 0.1}s infinite`,
                  }}
                />
              ))}
            </div>
            <p className='leads-loading-msg'>{loadingMsg}</p>
          </div>
        )}

        {error && !loading && <div className='leads-error-msg'>{error}</div>}

        {!loading && leads.length === 0 && !error && (
          <div className='leads-empty-state'>
            <div className='empty-icon'>📭</div>
            <h3>No leads yet</h3>
            <p>Click "Collect New Leads" to start building your pipeline.</p>
          </div>
        )}

        {!loading && leads.length > 0 && (
          <>
            <div className='leads-table-container'>
              <table className='leads-table'>
                <thead>
                  <tr>
                    <th>Score</th>
                    <th>Business</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Created</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead._id} className='lead-row'>
                      <td className='score-cell'>
                        <span
                          className='score-badge'
                          style={{ background: getScoreColor(lead.score) }}
                        >
                          {lead.score}
                        </span>
                      </td>
                      <td>
                        <div className='business-info'>
                          <strong>{lead.businessName}</strong>
                          <small>{lead.website}</small>
                        </div>
                      </td>
                      <td>{lead.category || '—'}</td>
                      <td>{lead.location || '—'}</td>
                      <td className='date-cell'>
                        {formatDate(lead.createdAt)}
                      </td>
                      <td>
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            updateStatus(lead._id, e.target.value)
                          }
                          className={getStatusClass(lead.status)}
                        >
                          <option value='new'>🆕 New</option>
                          <option value='reviewed'>👁️ Reviewed</option>
                          <option value='contacted'>✉️ Contacted</option>
                          <option value='closed'>✅ Closed</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className='view-btn'
                          onClick={() => setSelectedLead(lead)}
                        >
                          View Report →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className='pagination'>
                <button
                  className='pagination-btn'
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>
                <div className='pagination-pages'>
                  {currentPage > 3 && totalPages > 5 && (
                    <>
                      <button
                        className='pagination-page'
                        onClick={() => goToPage(1)}
                      >
                        1
                      </button>
                      {currentPage > 4 && (
                        <span className='pagination-dots'>...</span>
                      )}
                    </>
                  )}
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                  {currentPage < totalPages - 2 && totalPages > 5 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <span className='pagination-dots'>...</span>
                      )}
                      <button
                        className='pagination-page'
                        onClick={() => goToPage(totalPages)}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>
                <button
                  className='pagination-btn'
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedLead && (
        <div
          className='lead-modal-overlay'
          onClick={() => setSelectedLead(null)}
        >
          <div className='lead-modal' onClick={(e) => e.stopPropagation()}>
            <button
              className='modal-close'
              onClick={(e) => {
                e.stopPropagation();
                setSelectedLead(null);
              }}
            >
              ✕
            </button>

            <div className='modal-header'>
              <div className='modal-logo'>{selectedLead.logo || '🏢'}</div>
              <div>
                <h2>{selectedLead.businessName}</h2>
                <p className='modal-website'>{selectedLead.website}</p>
                <p className='modal-date'>
                  Created: {formatDate(selectedLead.createdAt)}
                </p>
              </div>
            </div>

            <div className='modal-score-section'>
              <span className='score-label'>Opportunity Score</span>
              <span
                className='modal-score-value'
                style={{ background: getScoreColor(selectedLead.score) }}
              >
                {selectedLead.score}/100
              </span>
            </div>

            {/* Summary */}
            <div className='modal-section'>
              <h3>📊 Summary</h3>
              <p>{selectedLead.analysis?.summary || 'No summary available'}</p>
            </div>

            {/* Issues */}
            <div className='modal-section'>
              <h3>⚠️ Critical Issues</h3>
              <ul>
                {selectedLead.analysis?.issues?.length > 0 ? (
                  selectedLead.analysis.issues.map((issue, i) => (
                    <li key={i}>{issue}</li>
                  ))
                ) : (
                  <li>No issues identified</li>
                )}
              </ul>
            </div>

            {/* Quick Wins */}
            <div className='modal-section'>
              <h3>⚡ Quick Wins</h3>
              <ul>
                {selectedLead.analysis?.quickWins?.length > 0 ? (
                  selectedLead.analysis.quickWins.map((win, i) => (
                    <li key={i}>{win}</li>
                  ))
                ) : (
                  <li>No quick wins identified</li>
                )}
              </ul>
            </div>

            {/* Social */}
            {selectedLead.socialLinks &&
              Object.keys(selectedLead.socialLinks).length > 0 && (
                <div className='modal-section'>
                  <h3>📱 Social Media</h3>
                  <div className='social-found'>
                    {Object.entries(selectedLead.socialLinks).map(
                      ([platform, socialUrl]) => (
                        <a
                          key={platform}
                          href={socialUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='social-badge found'
                          onClick={(e) => e.stopPropagation()}
                        >
                          {platform}
                        </a>
                      ),
                    )}
                  </div>
                </div>
              )}

            {/* Email Reputation */}
            {selectedLead.emailReputation && (
              <div className='modal-section'>
                <h3>
                  📧 Email Health — {selectedLead.emailReputation.score}/100
                </h3>

                <div className='email-checks'>
                  {['mx', 'spf', 'dkim', 'dmarc'].map((key) => {
                    const item = selectedLead.emailReputation[key];
                    return (
                      <div
                        key={key}
                        className={`email-check ${
                          item?.exists ? 'pass' : 'fail'
                        }`}
                      >
                        <span>{item?.exists ? '✅' : '❌'}</span>
                        <div className='email-check-info'>
                          <strong>{key.toUpperCase()}</strong>
                          <span>
                            {item?.exists
                              ? key === 'mx'
                                ? item.provider
                                : key === 'dkim'
                                  ? `Selector: ${item.selector}`
                                  : key === 'dmarc'
                                    ? `Policy: ${item.policy}`
                                    : 'Configured'
                              : 'Missing'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Outreach */}
            <div className='modal-section outreach-section'>
              <h3>✉️ Outreach Message</h3>
              <div className='outreach-message'>
                {selectedLead.analysis?.outreachMessage ||
                  'No outreach message generated'}
              </div>

              <button
                className='copy-btn'
                onClick={(e) => {
                  e.stopPropagation();
                  copyOutreachMessage(selectedLead);
                }}
              >
                {copyStatus === 'outreach' ? '✅ Copied!' : '📋 Copy Message'}
              </button>
            </div>

            {/* Actions */}
            <div className='modal-actions'>
              <button
                className='contact-btn'
                onClick={(e) => {
                  e.stopPropagation();
                  updateStatus(selectedLead._id, 'contacted');
                  setSelectedLead(null);
                }}
              >
                Mark Contacted
              </button>

              <a
                href={
                  selectedLead.website?.startsWith('http')
                    ? selectedLead.website
                    : `https://${selectedLead.website}`
                }
                target='_blank'
                rel='noopener noreferrer'
                className='visit-btn'
                onClick={(e) => e.stopPropagation()}
              >
                Visit Website →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
