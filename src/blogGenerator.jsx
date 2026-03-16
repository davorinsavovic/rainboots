import { useState, useEffect, useRef } from 'react';

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

export default function BlogGenerator() {
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
  const loadingRef = useRef(null);
  const outputRef = useRef(null);

  // Rotating loading messages
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

  // Scroll to output when article is ready
  useEffect(() => {
    if (article && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [article]);

  const getMeta = (text, key) => {
    const match = text.match(new RegExp(key + ':\\s*(.+)'));
    return match ? match[1].trim() : '';
  };

  const generateArticle = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic or title for your article.');
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
1. Naturally link to https://rainbootsmarketing.com at least 3 times using descriptive anchor text. Example: <a href="https://rainbootsmarketing.com/${service.replace(/\s+/g, '-').toLowerCase()}">our ${service} services</a>
2. Write in HTML using only: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <blockquote>, <a> tags
3. End with this exact CTA block: <div class="cta-box"><p>Ready to level up your ${service}?</p><a href="https://rainbootsmarketing.com">Work With Rainboots →</a></div>
4. Include a compelling intro paragraph that hooks the reader
5. Use keywords naturally — never stuffed
6. Structure for featured snippets (clear questions + direct answers)
7. Include at least one blockquote with a key insight or stat

ALSO PROVIDE (before the article HTML, separated by |||):
- SEO_TITLE: (under 60 chars, compelling)
- META_DESC: (under 155 chars, includes a CTA)
- KEYWORDS: (5-7 comma-separated target keywords)
- CATEGORY: (one of: Email Marketing / Deliverability / Lifecycle / SMS & Push / Automation / Retention / Acquisition / Branding / Strategy)

FORMAT YOUR RESPONSE EXACTLY LIKE:
SEO_TITLE: [title here]
META_DESC: [description here]
KEYWORDS: [kw1, kw2, kw3]
CATEGORY: [category]
|||
[full article HTML here]`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
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
      const readTime = Math.max(1, Math.round(wordCount / 200));

      const newArticle = {
        topic,
        service,
        seoTitle: getMeta(metaPart, 'SEO_TITLE') || topic,
        metaDesc: getMeta(metaPart, 'META_DESC'),
        keywords: getMeta(metaPart, 'KEYWORDS'),
        category: getMeta(metaPart, 'CATEGORY') || service,
        html: articleHTML,
        wordCount,
        readTime,
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

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus(label);
      setTimeout(() => setCopyStatus(''), 2000);
    });
  };

  const copyArticleHTML = () => {
    if (!article) return;
    const full = `<!-- SEO Title: ${article.seoTitle} -->\n<!-- Meta Description: ${article.metaDesc} -->\n<!-- Keywords: ${article.keywords} -->\n\n${article.html}`;
    copyToClipboard(full, 'article');
  };

  const copyMetaTags = () => {
    if (!article) return;
    const slug = article.seoTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const meta = `<title>${article.seoTitle}</title>\n<meta name="description" content="${article.metaDesc}">\n<meta name="keywords" content="${article.keywords}">\n<link rel="canonical" href="https://rainbootsmarketing.com/blog/${slug}">`;
    copyToClipboard(meta, 'meta');
  };

  return (
    <div style={styles.page}>
      {/* Rain drops */}
      <div style={styles.rainBg} aria-hidden='true'>
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.raindrop,
              left: `${Math.random() * 100}%`,
              height: `${Math.random() * 60 + 30}px`,
              animationDuration: `${Math.random() * 1.5 + 0.7}s`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.35 + 0.05,
            }}
          />
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fall { to { transform: translateY(110vh); } }
        @keyframes bounce { 0%,100%{transform:scaleY(0.4);opacity:0.4} 50%{transform:scaleY(1);opacity:1} }
        .rb-article-body h2 { font-family: 'DM Serif Display', serif; font-size: 22px; color: #0d1b2a; margin: 32px 0 12px; line-height: 1.3; }
        .rb-article-body h3 { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #1a3a5c; margin: 20px 0 8px; }
        .rb-article-body p { margin-bottom: 16px; line-height: 1.8; }
        .rb-article-body ul, .rb-article-body ol { padding-left: 22px; margin-bottom: 16px; }
        .rb-article-body li { margin-bottom: 6px; line-height: 1.7; }
        .rb-article-body a { color: #0e7a85; text-decoration: underline; text-underline-offset: 3px; font-weight: 500; }
        .rb-article-body blockquote { border-left: 4px solid #0e9aa7; margin: 20px 0; padding: 14px 20px; background: rgba(14,154,167,0.07); border-radius: 0 8px 8px 0; font-style: italic; color: #1a3a5c; }
        .rb-article-body .cta-box { background: #0d1b2a; border-radius: 12px; padding: 24px 28px; margin-top: 32px; text-align: center; }
        .rb-article-body .cta-box p { font-family: 'DM Serif Display', serif; font-size: 18px; color: #f5f0e8; margin-bottom: 12px; font-style: normal; }
        .rb-article-body .cta-box a { display: inline-block; background: #0e9aa7; color: #fff !important; text-decoration: none !important; font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 11px 24px; border-radius: 7px; }
      `}</style>

      <div style={styles.app}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.logoMark}>🌧️</div>
          <div>
            <div style={styles.headerTitle}>Rainboots SEO Blog Generator</div>
            <div style={styles.headerSub}>
              AI-powered articles for rainbootsmarketing.com
            </div>
          </div>
        </header>

        {/* Generator Panel */}
        <div style={styles.panel}>
          <div style={styles.sectionLabel}>Article Settings</div>

          <div style={styles.formGrid}>
            {/* Topic */}
            <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
              <label style={styles.label}>Topic / Title</label>
              <input
                style={styles.input}
                type='text'
                placeholder='e.g. How to improve email deliverability in 2026'
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && generateArticle()}
                onFocus={(e) => (e.target.style.borderColor = '#0e9aa7')}
                onBlur={(e) =>
                  (e.target.style.borderColor = 'rgba(255,255,255,0.1)')
                }
              />
            </div>

            {/* Service */}
            <div style={styles.field}>
              <label style={styles.label}>Target Service</label>
              <select
                style={styles.input}
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                {SERVICES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Length */}
            <div style={styles.field}>
              <label style={styles.label}>Article Length</label>
              <select
                style={styles.input}
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

            {/* Keywords */}
            <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
              <label style={styles.label}>Focus Keywords (optional)</label>
              <input
                style={styles.input}
                type='text'
                placeholder='e.g. email open rates, inbox placement, sender reputation'
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = '#0e9aa7')}
                onBlur={(e) =>
                  (e.target.style.borderColor = 'rgba(255,255,255,0.1)')
                }
              />
            </div>

            {/* Tone */}
            <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
              <label style={styles.label}>Tone</label>
              <div style={styles.toneGrid}>
                {TONES.map((t) => (
                  <button
                    key={t.value}
                    style={{
                      ...styles.toneBtn,
                      ...(tone === t.value ? styles.toneBtnActive : {}),
                    }}
                    onClick={() => setTone(t.value)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            style={{
              ...styles.generateBtn,
              ...(loading ? styles.generateBtnDisabled : {}),
            }}
            onClick={generateArticle}
            disabled={loading}
          >
            ⚡ Generate SEO Article
          </button>

          {error && <div style={styles.errorMsg}>{error}</div>}
        </div>

        {/* Loading */}
        {loading && (
          <div style={styles.loadingBox}>
            <div style={styles.loader}>
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  style={{ ...styles.loaderBar, animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <p style={styles.loadingText}>{loadingMsg}</p>
          </div>
        )}

        {/* Output */}
        {article && (
          <div ref={outputRef}>
            {/* Meta strip */}
            <div style={styles.metaStrip}>
              <div style={styles.metaItem}>
                <div style={styles.metaLabel}>SEO Title Tag</div>
                <div style={styles.metaValue}>{article.seoTitle}</div>
              </div>
              <div style={styles.metaItem}>
                <div style={styles.metaLabel}>Estimated Read Time</div>
                <div style={styles.metaValue}>
                  ~{article.readTime} min ({article.wordCount} words)
                </div>
              </div>
              <div style={{ ...styles.metaItem, gridColumn: '1 / -1' }}>
                <div style={styles.metaLabel}>Meta Description</div>
                <div style={styles.metaValue}>{article.metaDesc}</div>
              </div>
              <div style={{ ...styles.metaItem, gridColumn: '1 / -1' }}>
                <div style={styles.metaLabel}>Target Keywords</div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 6,
                    marginTop: 4,
                  }}
                >
                  {article.keywords.split(',').map((kw, i) => (
                    <span key={i} style={styles.tag}>
                      {kw.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Article */}
            <div style={styles.articleOutput}>
              <div style={styles.articleHeader}>
                <div style={styles.articleCategory}>{article.category}</div>
                <div style={styles.articleTitle}>{article.seoTitle}</div>
                <div style={styles.articleMeta}>
                  <span>✍️ Rainboots Marketing Team</span>
                  <span>📅 {article.date}</span>
                  <span>🏷️ {article.service}</span>
                </div>
              </div>
              <div
                className='rb-article-body'
                style={styles.articleBody}
                dangerouslySetInnerHTML={{ __html: article.html }}
              />
            </div>

            {/* Actions */}
            <div style={styles.actionBar}>
              <button style={styles.actionBtnPrimary} onClick={copyArticleHTML}>
                {copyStatus === 'article'
                  ? '✅ Copied!'
                  : '📋 Copy Article HTML'}
              </button>
              <button style={styles.actionBtn} onClick={copyMetaTags}>
                {copyStatus === 'meta' ? '✅ Copied!' : '📝 Copy Meta Tags'}
              </button>
              <button
                style={styles.actionBtn}
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
          </div>
        )}

        {/* History */}
        {history.length > 1 && (
          <div style={{ marginTop: 48 }}>
            <div style={styles.sectionLabel}>Generated Articles</div>
            <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
              {history.map((art, i) => (
                <div
                  key={i}
                  style={styles.historyCard}
                  onClick={() => setArticle(art)}
                >
                  <div style={styles.historyTitle}>{art.seoTitle}</div>
                  <div style={styles.historyMeta}>
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

const styles = {
  page: {
    background: '#0d1b2a',
    minHeight: '100vh',
    position: 'relative',
    overflowX: 'hidden',
    fontFamily: "'DM Sans', sans-serif",
  },
  rainBg: {
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 0,
    overflow: 'hidden',
  },
  raindrop: {
    position: 'absolute',
    width: 1,
    background: 'linear-gradient(to bottom, transparent, rgba(14,154,167,0.3))',
    animation: 'fall linear infinite',
    top: -100,
  },
  app: {
    position: 'relative',
    zIndex: 1,
    maxWidth: 860,
    margin: '0 auto',
    padding: '40px 24px 80px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 48,
    paddingBottom: 28,
    borderBottom: '1px solid rgba(14,154,167,0.2)',
  },
  logoMark: {
    width: 48,
    height: 48,
    background: '#0e9aa7',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
    flexShrink: 0,
  },
  headerTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 13,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: '#17c3d4',
  },
  headerSub: { fontSize: 13, color: '#5a6b7a', marginTop: 2 },
  panel: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(14,154,167,0.2)',
    borderRadius: 20,
    padding: 32,
    marginBottom: 28,
    backdropFilter: 'blur(10px)',
  },
  sectionLabel: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: '#0e9aa7',
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 14,
    marginBottom: 4,
  },
  field: { display: 'flex', flexDirection: 'column', gap: 7 },
  label: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#5a6b7a',
  },
  input: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    color: '#f5f0e8',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    padding: '11px 14px',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.2s',
  },
  toneGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 },
  toneBtn: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    color: '#5a6b7a',
    cursor: 'pointer',
    fontFamily: "'Syne', sans-serif",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.05em',
    padding: '9px 6px',
    transition: 'all 0.15s',
  },
  toneBtnActive: {
    background: 'rgba(14,154,167,0.18)',
    borderColor: '#0e9aa7',
    color: '#17c3d4',
  },
  generateBtn: {
    width: '100%',
    marginTop: 22,
    background: '#0e9aa7',
    border: 'none',
    borderRadius: 12,
    color: '#fff',
    cursor: 'pointer',
    fontFamily: "'Syne', sans-serif",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: '15px 28px',
    transition: 'background 0.2s',
  },
  generateBtnDisabled: { opacity: 0.5, cursor: 'not-allowed' },
  errorMsg: {
    background: 'rgba(220,50,50,0.1)',
    border: '1px solid rgba(220,50,50,0.3)',
    borderRadius: 10,
    color: '#ff8080',
    fontSize: 13,
    padding: '13px 16px',
    marginTop: 14,
  },
  loadingBox: { textAlign: 'center', padding: '50px 20px' },
  loader: {
    display: 'flex',
    gap: 6,
    justifyContent: 'center',
    marginBottom: 18,
  },
  loaderBar: {
    width: 3,
    height: 28,
    background: '#0e9aa7',
    borderRadius: 2,
    display: 'inline-block',
    animation: 'bounce 0.8s ease-in-out infinite',
  },
  loadingText: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 13,
    color: '#5a6b7a',
    letterSpacing: '0.05em',
  },
  metaStrip: {
    background: 'rgba(14,154,167,0.08)',
    border: '1px solid rgba(14,154,167,0.2)',
    borderRadius: 16,
    padding: '22px 26px',
    marginBottom: 20,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 14,
  },
  metaItem: {},
  metaLabel: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: '#0e9aa7',
    marginBottom: 4,
  },
  metaValue: { fontSize: 13, color: '#f5f0e8', lineHeight: 1.5 },
  tag: {
    background: 'rgba(14,154,167,0.2)',
    border: '1px solid #0e9aa7',
    borderRadius: 20,
    color: '#17c3d4',
    fontFamily: "'Syne', sans-serif",
    fontSize: 11,
    fontWeight: 600,
    padding: '3px 10px',
  },
  articleOutput: {
    background: '#f5f0e8',
    borderRadius: 20,
    overflow: 'hidden',
  },
  articleHeader: {
    background: '#0d1b2a',
    padding: '28px 36px',
    borderBottom: '3px solid #0e9aa7',
  },
  articleCategory: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: '#17c3d4',
    marginBottom: 10,
  },
  articleTitle: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: 30,
    color: '#f5f0e8',
    lineHeight: 1.2,
    marginBottom: 14,
  },
  articleMeta: {
    display: 'flex',
    gap: 18,
    flexWrap: 'wrap',
    fontFamily: "'Syne', sans-serif",
    fontSize: 12,
    color: '#5a6b7a',
  },
  articleBody: {
    padding: '36px 40px',
    fontSize: 15,
    lineHeight: 1.8,
    color: '#2a2a3a',
  },
  actionBar: { display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' },
  actionBtn: {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 8,
    color: '#f5f0e8',
    cursor: 'pointer',
    fontFamily: "'Syne', sans-serif",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    padding: '10px 16px',
    transition: 'all 0.15s',
  },
  actionBtnPrimary: {
    background: '#0e9aa7',
    border: '1px solid #0e9aa7',
    borderRadius: 8,
    color: '#fff',
    cursor: 'pointer',
    fontFamily: "'Syne', sans-serif",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    padding: '10px 16px',
    transition: 'all 0.15s',
  },
  historyCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(14,154,167,0.2)',
    borderRadius: 12,
    padding: '14px 18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  historyTitle: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: 15,
    color: '#f5f0e8',
    flex: 1,
  },
  historyMeta: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 11,
    color: '#5a6b7a',
    whiteSpace: 'nowrap',
  },
};
