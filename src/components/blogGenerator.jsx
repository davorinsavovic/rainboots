import { useState, useEffect, useRef } from 'react';
import { API_BASE } from '../config';
import './BlogGenerator.css';

const SERVICES = [
  { value: 'email marketing', label: 'Email Marketing' },
  { value: 'lifecycle marketing', label: 'Lifecycle Marketing' },
  { value: 'email deliverability', label: 'Deliverability' },
  { value: 'SMS and push notifications', label: 'SMS + Push Notifications' },
  { value: 'marketing automation', label: 'Marketing Automation' },
  { value: 'retention and reengagement', label: 'Retention & Reengagement' },
  { value: 'acquisition marketing', label: 'Acquisition' },
  { value: 'branding', label: 'Branding' },
  { value: 'website design and development', label: 'Website Design & Dev' },
];

const LENGTHS = [
  { value: 'short (600-800 words)', label: 'Short (600–800 words)' },
  { value: 'medium (900-1200 words)', label: 'Medium (900–1200 words)' },
  { value: 'long (1500-2000 words)', label: 'Long (1500–2000 words)' },
];

const TONES = [
  { value: 'authoritative and expert', label: 'Expert' },
  { value: 'friendly and approachable', label: 'Friendly' },
  { value: 'educational and step-by-step', label: 'Educational' },
  { value: 'conversational and direct', label: 'Conversational' },
  { value: 'data-driven and analytical', label: 'Data-Driven' },
  { value: 'bold and opinionated', label: 'Bold' },
];

const LOADING_MESSAGES = [
  'Researching your topic...',
  'Crafting SEO-optimized headings...',
  'Weaving in Rainboots links...',
  'Polishing your article...',
  'Almost ready...',
];

// Generates the full WordPress-ready HTML block
function buildWordPressHTML(article) {
  return `<!-- PASTE INTO: Posts > Add New > Code Editor (top-right ⋮ menu) -->
<!-- SEO Title: ${article.seoTitle} -->
<!-- Meta Description: ${article.metaDesc} -->
<!-- Focus Keywords: ${article.keywords} -->
<!-- Category: ${article.category} -->

${article.html}`;
}

// Main Blog Generator Component
export default function BlogGenerator() {
  return <GeneratorApp />;
}

function GeneratorApp() {
  const [topic, setTopic] = useState('');
  const [service, setService] = useState('email marketing');
  const [length, setLength] = useState('medium (900-1200 words)');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('authoritative and expert');
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error, setError] = useState('');
  const [article, setArticle] = useState(null);
  const [history, setHistory] = useState([]);
  const [copyStatus, setCopyStatus] = useState('');
  const outputRef = useRef(null);

  useEffect(() => {
    if (!loading) return;
    let i = 0;
    setLoadingMsg(LOADING_MESSAGES[0]);
    const interval = setInterval(() => {
      i = (i + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[i]);
    }, 2500);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (article && outputRef.current)
      outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [article]);

  const getMeta = (text, key) => {
    const match = text.match(new RegExp(key + ':\\s*(.+)'));
    return match ? match[1].trim() : '';
  };

  const generateArticle = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic or title.');
      return;
    }
    setError('');
    setLoading(true);
    setArticle(null);

    const prompt = `You are an expert SEO content writer for Rainboots Marketing, a digital marketing agency based in Seattle (rainbootsmarketing.com).

Write a complete, SEO-optimized blog article with these requirements:

TOPIC: ${topic}
SERVICE FOCUS: ${service}
LENGTH: ${length}
TONE: ${tone}
KEYWORDS TO TARGET: ${keywords || 'use relevant industry keywords naturally'}

CRITICAL REQUIREMENTS:
1. Naturally link to https://rainbootsmarketing.com at least 3 times using descriptive anchor text. Example: <a href="https://rainbootsmarketing.com">our ${service} team at Rainboots</a>
2. Write in HTML using only: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <blockquote>, <a> tags
3. End with: <div class="cta-box"><p>Ready to level up your ${service}?</p><a href="https://rainbootsmarketing.com">Work With Rainboots →</a></div>
4. Hook the reader in the first paragraph
5. Use keywords naturally — never stuffed
6. Structure for featured snippets (clear questions + direct answers)
7. Include at least one blockquote with a key insight or stat

ALSO PROVIDE (before the article HTML, separated by |||):
- SEO_TITLE: (under 60 chars, compelling)
- META_DESC: (under 155 chars, includes a CTA)
- KEYWORDS: (5-7 comma-separated target keywords)
- CATEGORY: (one of: Email Marketing / Deliverability / Lifecycle / SMS & Push / Automation / Retention / Acquisition / Branding / Strategy)

FORMAT:
SEO_TITLE: [title]
META_DESC: [desc]
KEYWORDS: [kw1, kw2, kw3]
CATEGORY: [category]
|||
[full article HTML]`;

    try {
      const response = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 2000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      const raw = data.content?.[0]?.text || '';
      const parts = raw.split('|||');
      if (parts.length < 2)
        throw new Error('Unexpected response format. Please try again.');

      const metaPart = parts[0].trim();
      const articleHTML = parts.slice(1).join('|||').trim();
      const wordCount = articleHTML
        .replace(/<[^>]+>/g, ' ')
        .split(/\s+/)
        .filter(Boolean).length;

      const newArticle = {
        topic,
        service,
        seoTitle: getMeta(metaPart, 'SEO_TITLE') || topic,
        metaDesc: getMeta(metaPart, 'META_DESC'),
        keywords: getMeta(metaPart, 'KEYWORDS'),
        category: getMeta(metaPart, 'CATEGORY') || service,
        html: articleHTML,
        wordCount,
        readTime: Math.max(1, Math.round(wordCount / 200)),
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };

      setArticle(newArticle);
      setHistory((prev) => [newArticle, ...prev]);
    } catch (err) {
      setError('Something went wrong: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copy = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus(label);
      setTimeout(() => setCopyStatus(''), 2500);
    });
  };

  const copyForWordPress = () => {
    if (!article) return;
    copy(buildWordPressHTML(article), 'wordpress');
  };

  const copyMetaTags = () => {
    if (!article) return;
    const slug = article.seoTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    copy(
      `<title>${article.seoTitle}</title>\n<meta name="description" content="${article.metaDesc}">\n<meta name="keywords" content="${article.keywords}">\n<link rel="canonical" href="https://rainbootsmarketing.com/blog/${slug}">`,
      'meta',
    );
  };

  return (
    <div className='blog-page' data-header-theme='dark'>
      {/* Rain animation effect */}
      <div className='blog-rain-container'>
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className='blog-rain-drop'
            style={{
              left: `${Math.random() * 100}%`,
              height: `${Math.random() * 60 + 30}px`,
              animation: `fall ${Math.random() * 1.5 + 0.7}s linear ${Math.random() * 3}s infinite`,
              opacity: Math.random() * 0.3 + 0.05,
            }}
          />
        ))}
      </div>

      <div className='blog-app'>
        {/* Header */}
        <header className='blog-header'>
          <div className='blog-logo-section'>
            <div className='blog-logo-mark'>🌧️</div>
            <div>
              <div className='blog-header-title'>
                Rainboots SEO Blog Generator
              </div>
              <div className='blog-header-sub'>
                Internal tool · rainbootsmarketing.com
              </div>
            </div>
          </div>
        </header>

        {/* Form Panel */}
        <div className='blog-panel'>
          <div className='blog-section-label'>Article Settings</div>

          <div className='blog-form-grid'>
            <div className='blog-field-full'>
              <label className='blog-label'>Topic / Title</label>
              <input
                type='text'
                className='blog-input'
                placeholder='e.g. How to improve email deliverability in 2026'
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && generateArticle()}
              />
            </div>

            <div className='blog-field'>
              <label className='blog-label'>Target Service</label>
              <select
                className='blog-select'
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                {SERVICES.map((sv) => (
                  <option key={sv.value} value={sv.value}>
                    {sv.label}
                  </option>
                ))}
              </select>
            </div>

            <div className='blog-field'>
              <label className='blog-label'>Article Length</label>
              <select
                className='blog-select'
                value={length}
                onChange={(e) => setLength(e.target.value)}
              >
                {LENGTHS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <div className='blog-field-full'>
              <label className='blog-label'>Focus Keywords (optional)</label>
              <input
                type='text'
                className='blog-input'
                placeholder='e.g. email open rates, inbox placement, sender reputation'
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>

            <div className='blog-field-full'>
              <label className='blog-label'>Tone</label>
              <div className='blog-tone-grid'>
                {TONES.map((t) => (
                  <button
                    key={t.value}
                    className={`blog-tone-btn ${tone === t.value ? 'active' : ''}`}
                    onClick={() => setTone(t.value)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            className='blog-generate-btn'
            onClick={generateArticle}
            disabled={loading}
          >
            {loading ? 'Generating...' : '⚡ Generate SEO Article'}
          </button>

          {error && <div className='blog-error-msg'>{error}</div>}
        </div>

        {/* Loading State */}
        {loading && (
          <div className='blog-loading-container'>
            <div className='blog-loading-bars'>
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className='blog-loading-bar'
                  style={{
                    animation: `bounce 0.8s ease-in-out ${i * 0.1}s infinite`,
                  }}
                />
              ))}
            </div>
            <p className='blog-loading-msg'>{loadingMsg}</p>
          </div>
        )}

        {/* Article Output */}
        {article && (
          <div ref={outputRef}>
            {/* Meta Information */}
            <div className='blog-meta-strip'>
              <div>
                <div className='blog-meta-label'>SEO Title Tag</div>
                <div className='blog-meta-value'>{article.seoTitle}</div>
              </div>
              <div>
                <div className='blog-meta-label'>Read Time</div>
                <div className='blog-meta-value'>
                  ~{article.readTime} min ({article.wordCount} words)
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div className='blog-meta-label'>Meta Description</div>
                <div className='blog-meta-value'>{article.metaDesc}</div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div className='blog-meta-label'>Target Keywords</div>
                <div className='blog-tags-wrapper'>
                  {article.keywords.split(',').map((kw, i) => (
                    <span key={i} className='blog-tag'>
                      {kw.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Article Preview */}
            <div className='blog-article-output'>
              <div className='blog-article-header'>
                <div className='blog-article-category'>{article.category}</div>
                <div className='blog-article-title'>{article.seoTitle}</div>
                <div className='blog-article-meta'>
                  <span>✍️ Rainboots Marketing Team</span>
                  <span>📅 {article.date}</span>
                  <span>🏷️ {article.service}</span>
                </div>
              </div>
              <div
                className='blog-article-body'
                dangerouslySetInnerHTML={{ __html: article.html }}
              />
            </div>

            {/* Action Buttons */}
            <div className='blog-actions'>
              <button className='blog-wp-btn' onClick={copyForWordPress}>
                {copyStatus === 'wordpress'
                  ? '✅ Copied! Paste into WordPress →'
                  : '🟢 Copy for WordPress'}
              </button>
              <button className='blog-action-btn' onClick={copyMetaTags}>
                {copyStatus === 'meta' ? '✅ Copied!' : '📝 Copy Meta Tags'}
              </button>
              <button
                className='blog-action-btn'
                onClick={() => {
                  setArticle(null);
                  setTopic('');
                  setKeywords('');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                ↺ New Article
              </button>
            </div>

            {/* WordPress Instructions */}
            <div className='blog-wp-instructions'>
              <div className='blog-wp-instructions-title'>
                📋 How to publish in WordPress
              </div>
              <ol className='blog-wp-instructions-list'>
                <li>
                  Click <strong>Copy for WordPress</strong> above
                </li>
                <li>
                  Go to <strong>wp-admin → Posts → Add New</strong>
                </li>
                <li>
                  Click the <strong>⋮ menu (top right) → Code editor</strong>
                </li>
                <li>Select all and paste — styles + content included</li>
                <li>
                  Set the post <strong>Title</strong> to:{' '}
                  <em>{article.seoTitle}</em>
                </li>
                <li>
                  In <strong>Yoast / RankMath</strong>: paste the meta
                  description and keywords
                </li>
                <li>
                  Add a <strong>featured image</strong>, assign a{' '}
                  <strong>category</strong>, then <strong>Publish</strong>
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* History Section */}
        {history.length > 1 && (
          <div className='blog-history-section'>
            <div className='blog-section-label'>Session History</div>
            <div className='blog-history-list'>
              {history.map((art, i) => (
                <div
                  key={i}
                  className='blog-history-card'
                  onClick={() => {
                    setArticle(art);
                    outputRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <div className='blog-history-title'>{art.seoTitle}</div>
                  <div className='blog-history-meta'>
                    {art.service} · {art.date}
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
