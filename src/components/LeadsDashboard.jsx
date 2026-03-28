import { useState, useEffect, useRef } from 'react';
import './LeadsDashboard.css';

// Loading messages for better UX
const LOADING_MESSAGES = [
  'Loading leads from database...',
  'Ranking opportunities...',
  'Preparing outreach messages...',
  'Almost ready...',
];

// Status options for filtering
const STATUS_FILTERS = [
  { value: 'all', label: 'All Leads' },
  { value: 'new', label: 'New' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'closed', label: 'Closed' },
];

const API_BASE = 'http://localhost:5001';

export default function LeadsDashboard() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [copyStatus, setCopyStatus] = useState('');

  const outputRef = useRef(null);

  // Handle loading messages rotation
  const startLoadingMessages = () => {
    let i = 0;
    setLoadingMsg(LOADING_MESSAGES[0]);
    const interval = setInterval(() => {
      i = (i + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[i]);
    }, 2500);
    return () => clearInterval(interval);
  };

  // Fetch leads from API
  const fetchLeads = async () => {
    try {
      let url = `${API_BASE}/api/leads`;
      if (statusFilter !== 'all') {
        url = `${API_BASE}/api/leads?status=${statusFilter}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError('Failed to load leads. Make sure backend is running.');
    }
  };

  // Fetch stats
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

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const stopMessages = startLoadingMessages();
      await Promise.all([fetchLeads(), fetchStats()]);
      stopMessages();
      setLoading(false);
    };
    loadData();
  }, [statusFilter]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedLead) {
        setSelectedLead(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedLead]);

  // Update lead status
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

  // Trigger manual lead collection
  const triggerCollection = async () => {
    try {
      setError('');
      const res = await fetch(`${API_BASE}/api/leads/collect`, {
        method: 'POST',
      });
      if (res.ok) {
        alert('Lead collection started! Check back in a few minutes.');
        setTimeout(() => {
          fetchLeads();
          fetchStats();
        }, 5000);
      } else {
        const error = await res.text();
        alert(`Error: ${error}`);
      }
    } catch (err) {
      console.error('Error triggering collection:', err);
      alert('Failed to start collection. Is backend running?');
    }
  };

  // Copy to clipboard
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

  // Get score color
  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#ef4444';
    return '#6b7280';
  };

  // Get status badge class
  const getStatusClass = (status) => {
    return `status-badge status-${status}`;
  };

  return (
    <div className='leads-page'>
      {/* Rain animation effect */}
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
        {/* Header */}
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

        {/* Stats Panel */}
        {stats && (
          <div className='leads-stats-grid'>
            <div className='stats-card'>
              <div className='stats-icon'>📋</div>
              <div className='stats-info'>
                <h3>{stats.total || 0}</h3>
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

        {/* Control Panel */}
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
          </div>
          <button className='collect-btn' onClick={triggerCollection}>
            🔄 Collect New Leads
          </button>
        </div>

        {/* Loading State */}
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

        {/* Error Message */}
        {error && !loading && <div className='leads-error-msg'>{error}</div>}

        {/* Leads Table */}
        {!loading && leads.length === 0 && !error && (
          <div className='leads-empty-state'>
            <div className='empty-icon'>📭</div>
            <h3>No leads yet</h3>
            <p>Click "Collect New Leads" to start building your pipeline.</p>
          </div>
        )}

        {!loading && leads.length > 0 && (
          <div className='leads-table-container'>
            <table className='leads-table'>
              <thead>
                <tr>
                  <th>Score</th>
                  <th>Business</th>
                  <th>Category</th>
                  <th>Location</th>
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
                    <td>
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatus(lead._id, e.target.value)}
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
        )}
      </div>

      {/* Lead Detail Modal */}
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

            <div className='modal-section'>
              <h3>📊 Summary</h3>
              <p>{selectedLead.analysis?.summary || 'No summary available'}</p>
            </div>

            <div className='modal-section'>
              <h3>⚠️ Critical Issues</h3>
              <ul>
                {selectedLead.analysis?.issues?.map((issue, i) => (
                  <li key={i}>{issue}</li>
                )) || <li>No issues identified</li>}
              </ul>
            </div>

            <div className='modal-section'>
              <h3>⚡ Quick Wins</h3>
              <ul>
                {selectedLead.analysis?.quickWins?.map((win, i) => (
                  <li key={i}>{win}</li>
                )) || <li>No quick wins identified</li>}
              </ul>
            </div>

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
                href={`https://${selectedLead.website}`}
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
