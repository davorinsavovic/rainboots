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

// All styles needed for the article when pasted into WordPress
const WP_ARTICLE_STYLES = `
<style>
.rb-wp-article { font-family: 'DM Sans', 'Helvetica Neue', sans-serif; font-size: 16px; line-height: 1.8; color: #2a2a3a; max-width: 780px; margin: 0 auto; }
.rb-wp-article h2 { font-family: Georgia, 'Times New Roman', serif; font-size: 26px; color: #0d1b2a; margin: 40px 0 14px; line-height: 1.3; font-weight: 700; border-left: 4px solid #0e9aa7; padding-left: 16px; }
.rb-wp-article h3 { font-family: 'Helvetica Neue', sans-serif; font-size: 18px; font-weight: 700; color: #1a3a5c; margin: 28px 0 10px; letter-spacing: 0.01em; }
.rb-wp-article p { margin-bottom: 20px; }
.rb-wp-article ul, .rb-wp-article ol { padding-left: 28px; margin-bottom: 20px; }
.rb-wp-article li { margin-bottom: 8px; line-height: 1.7; }
.rb-wp-article a { color: #0e7a85; text-decoration: underline; text-underline-offset: 3px; font-weight: 600; }
.rb-wp-article a:hover { color: #0d1b2a; }
.rb-wp-article blockquote { border-left: 5px solid #0e9aa7; margin: 28px 0; padding: 18px 24px; background: #f0fafa; border-radius: 0 10px 10px 0; font-style: italic; color: #1a3a5c; font-size: 17px; }
.rb-wp-article strong { color: #0d1b2a; font-weight: 700; }
.rb-wp-article .rb-category-tag { display: inline-block; background: #0d1b2a; color: #17c3d4; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; padding: 5px 14px; border-radius: 20px; margin-bottom: 20px; font-family: 'Helvetica Neue', sans-serif; }
.rb-wp-article .rb-article-meta { display: flex; gap: 20px; flex-wrap: wrap; font-size: 13px; color: #8a96a3; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #e8edf2; font-family: 'Helvetica Neue', sans-serif; }
.rb-wp-article .rb-article-meta span { display: flex; align-items: center; gap: 5px; }
.rb-wp-article .cta-box { background: linear-gradient(135deg, #0d1b2a 0%, #1a3a5c 100%); border-radius: 16px; padding: 36px 40px; margin-top: 48px; text-align: center; }
.rb-wp-article .cta-box p { font-family: Georgia, serif; font-size: 22px; color: #f5f0e8; margin-bottom: 16px; font-style: normal; line-height: 1.3; }
.rb-wp-article .cta-box a { display: inline-block; background: #0e9aa7; color: #ffffff !important; text-decoration: none !important; font-family: 'Helvetica Neue', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; padding: 14px 32px; border-radius: 8px; transition: background 0.2s; }
.rb-wp-article .rb-divider { border: none; border-top: 1px solid #e8edf2; margin: 40px 0; }
</style>
`;

// Generates the full WordPress-ready HTML block
function buildWordPressHTML(article) {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return `<!-- Paste this entire block into WordPress Code Editor (Posts > Add New > ⋮ > Code editor) -->
<!-- SEO FIELDS — paste into Yoast/RankMath: -->
<!-- Title: ${article.seoTitle} -->
<!-- Meta Description: ${article.metaDesc} -->
<!-- Focus Keywords: ${article.keywords} -->

${WP_ARTICLE_STYLES}

<div class="rb-wp-article">

  <span class="rb-category-tag">${article.category}</span>

  <div class="rb-article-meta">
    <span>✍️ Rainboots Marketing Team</span>
    <span>📅 ${date}</span>
    <span>🏷️ ${article.service}</span>
    <span>⏱️ ~${article.readTime} min read</span>
  </div>

  ${article.html}

</div>`;
}

// ─── Password Gate ────────────────────────────────────────────────────────────
function PasswordGate({ onUnlock }) {
  const [input, setInput] = useState('');
  const [shake, setShake] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const correct = process.env.REACT_APP_BLOG_PASSWORD;
    if (!correct) {
      onUnlock();
      return;
    }
    if (input === correct) {
      sessionStorage.setItem('rb_blog_auth', 'true');
      onUnlock();
    } else {
      setError('Incorrect password.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setInput('');
    }
  };

  return (
    <div style={gateStyles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fall { to { transform: translateY(110vh); } }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .rb-gate-card { animation: fadeUp 0.5s ease both; }
        .rb-gate-card.shake { animation: shake 0.4s ease; }
        .rb-gate-input:focus { border-color: #0e9aa7 !important; outline: none; }
        .rb-gate-btn:hover { background: #17c3d4 !important; }
      `}</style>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 1,
              top: -80,
              height: `${Math.random() * 60 + 30}px`,
              left: `${Math.random() * 100}%`,
              background:
                'linear-gradient(to bottom, transparent, rgba(14,154,167,0.3))',
              animation: `fall ${Math.random() * 1.5 + 0.7}s linear ${Math.random() * 3}s infinite`,
              opacity: Math.random() * 0.3 + 0.05,
            }}
          />
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className={`rb-gate-card${shake ? ' shake' : ''}`}
        style={gateStyles.card}
      >
        <div style={gateStyles.logo}>🌧️</div>
        <h1 style={gateStyles.title}>Rainboots Blog Generator</h1>
        <p style={gateStyles.sub}>Internal tool — team access only</p>
        <input
          className='rb-gate-input'
          type='password'
          placeholder='Enter access password'
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError('');
          }}
          style={gateStyles.input}
          autoFocus
        />
        {error && <p style={gateStyles.error}>{error}</p>}
        <button type='submit' className='rb-gate-btn' style={gateStyles.btn}>
          Unlock →
        </button>
        <p style={gateStyles.hint}>Contact your team admin for the password.</p>
      </form>
    </div>
  );
}

const gateStyles = {
  page: {
    background: '#0d1b2a',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'DM Sans', sans-serif",
    padding: 24,
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(14,154,167,0.25)',
    borderRadius: 20,
    padding: '48px 40px',
    width: '100%',
    maxWidth: 400,
    textAlign: 'center',
    backdropFilter: 'blur(12px)',
    position: 'relative',
    zIndex: 1,
  },
  logo: { fontSize: 40, marginBottom: 16 },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 20,
    fontWeight: 700,
    color: '#f5f0e8',
    marginBottom: 8,
  },
  sub: { fontSize: 13, color: '#5a6b7a', marginBottom: 32 },
  input: {
    width: '100%',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 10,
    color: '#f5f0e8',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 15,
    padding: '13px 16px',
    textAlign: 'center',
    letterSpacing: '0.1em',
    boxSizing: 'border-box',
    marginBottom: 12,
  },
  error: { color: '#ff8080', fontSize: 13, marginBottom: 10 },
  btn: {
    width: '100%',
    background: '#0e9aa7',
    border: 'none',
    borderRadius: 10,
    color: '#fff',
    cursor: 'pointer',
    fontFamily: "'Syne', sans-serif",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: 14,
    transition: 'background 0.2s',
  },
  hint: { fontSize: 12, color: '#3a4a56', marginTop: 20 },
};

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function BlogGenerator() {
  const [unlocked, setUnlocked] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem('rb_blog_auth') === 'true') setUnlocked(true);
  }, []);
  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  return <GeneratorApp />;
}

// ─── Generator App ────────────────────────────────────────────────────────────
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
      const response = await fetch('/api/generate', {
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

  // ★ The main new feature — single button WordPress export
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

  const logout = () => {
    sessionStorage.removeItem('rb_blog_auth');
    window.location.reload();
  };

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fall { to { transform: translateY(110vh); } }
        @keyframes bounce { 0%,100%{transform:scaleY(0.4);opacity:0.4} 50%{transform:scaleY(1);opacity:1} }
        .rb-body h2{font-family:'DM Serif Display',serif;font-size:22px;color:#0d1b2a;margin:32px 0 12px;line-height:1.3}
        .rb-body h3{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:#1a3a5c;margin:20px 0 8px}
        .rb-body p{margin-bottom:16px;line-height:1.8}
        .rb-body ul,.rb-body ol{padding-left:22px;margin-bottom:16px}
        .rb-body li{margin-bottom:6px;line-height:1.7}
        .rb-body a{color:#0e7a85;text-decoration:underline;text-underline-offset:3px;font-weight:500}
        .rb-body blockquote{border-left:4px solid #0e9aa7;margin:20px 0;padding:14px 20px;background:rgba(14,154,167,0.07);border-radius:0 8px 8px 0;font-style:italic;color:#1a3a5c}
        .rb-body .cta-box{background:#0d1b2a;border-radius:12px;padding:24px 28px;margin-top:32px;text-align:center}
        .rb-body .cta-box p{font-family:'DM Serif Display',serif;font-size:18px;color:#f5f0e8;margin-bottom:12px;font-style:normal}
        .rb-body .cta-box a{display:inline-block;background:#0e9aa7;color:#fff!important;text-decoration:none!important;font-family:'Syne',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:11px 24px;border-radius:7px}
        .rb-tone-btn:hover{border-color:#0e9aa7!important;color:#17c3d4!important}
        .rb-action-btn:hover{background:rgba(14,154,167,0.15)!important;border-color:#0e9aa7!important;color:#17c3d4!important}
        .rb-history-card:hover{border-color:#0e9aa7!important;background:rgba(14,154,167,0.08)!important}
        .rb-logout:hover{border-color:rgba(255,255,255,0.25)!important;color:#f5f0e8!important}
        .rb-wp-btn:hover{background:#16a34a!important}
      `}</style>

      {/* Rain */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 1,
              top: -100,
              height: `${Math.random() * 60 + 30}px`,
              left: `${Math.random() * 100}%`,
              background:
                'linear-gradient(to bottom, transparent, rgba(14,154,167,0.3))',
              animation: `fall ${Math.random() * 1.5 + 0.7}s linear ${Math.random() * 3}s infinite`,
              opacity: Math.random() * 0.3 + 0.05,
            }}
          />
        ))}
      </div>

      <div style={s.app}>
        {/* Header */}
        <header style={s.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={s.logoMark}>🌧️</div>
            <div>
              <div style={s.headerTitle}>Rainboots SEO Blog Generator</div>
              <div style={s.headerSub}>
                Internal tool · rainbootsmarketing.com
              </div>
            </div>
          </div>
          <button className='rb-logout' onClick={logout} style={s.logoutBtn}>
            Sign out
          </button>
        </header>

        {/* Form */}
        <div style={s.panel}>
          <div style={s.sectionLabel}>Article Settings</div>
          <div style={s.formGrid}>
            <div style={{ ...s.field, gridColumn: '1 / -1' }}>
              <label style={s.label}>Topic / Title</label>
              <input
                style={s.input}
                type='text'
                placeholder='e.g. How to improve email deliverability in 2026'
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && generateArticle()}
              />
            </div>
            <div style={s.field}>
              <label style={s.label}>Target Service</label>
              <select
                style={s.input}
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
            <div style={s.field}>
              <label style={s.label}>Article Length</label>
              <select
                style={s.input}
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
            <div style={{ ...s.field, gridColumn: '1 / -1' }}>
              <label style={s.label}>Focus Keywords (optional)</label>
              <input
                style={s.input}
                type='text'
                placeholder='e.g. email open rates, inbox placement, sender reputation'
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>
            <div style={{ ...s.field, gridColumn: '1 / -1' }}>
              <label style={s.label}>Tone</label>
              <div style={s.toneGrid}>
                {TONES.map((t) => (
                  <button
                    key={t.value}
                    className='rb-tone-btn'
                    style={{
                      ...s.toneBtn,
                      ...(tone === t.value ? s.toneBtnActive : {}),
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
              ...s.generateBtn,
              ...(loading ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
            }}
            onClick={generateArticle}
            disabled={loading}
          >
            ⚡ Generate SEO Article
          </button>
          {error && <div style={s.errorMsg}>{error}</div>}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>
            <div
              style={{
                display: 'flex',
                gap: 6,
                justifyContent: 'center',
                marginBottom: 18,
              }}
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  style={{
                    width: 3,
                    height: 28,
                    background: '#0e9aa7',
                    borderRadius: 2,
                    display: 'inline-block',
                    animation: `bounce 0.8s ease-in-out ${i * 0.1}s infinite`,
                  }}
                />
              ))}
            </div>
            <p
              style={{
                fontFamily: "'Syne',sans-serif",
                fontSize: 13,
                color: '#5a6b7a',
                letterSpacing: '0.05em',
              }}
            >
              {loadingMsg}
            </p>
          </div>
        )}

        {/* Output */}
        {article && (
          <div ref={outputRef}>
            {/* Meta strip */}
            <div style={s.metaStrip}>
              <div>
                <div style={s.metaLabel}>SEO Title Tag</div>
                <div style={s.metaValue}>{article.seoTitle}</div>
              </div>
              <div>
                <div style={s.metaLabel}>Read Time</div>
                <div style={s.metaValue}>
                  ~{article.readTime} min ({article.wordCount} words)
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={s.metaLabel}>Meta Description</div>
                <div style={s.metaValue}>{article.metaDesc}</div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={s.metaLabel}>Target Keywords</div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 6,
                    marginTop: 4,
                  }}
                >
                  {article.keywords.split(',').map((kw, i) => (
                    <span key={i} style={s.tag}>
                      {kw.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Article preview */}
            <div style={s.articleOutput}>
              <div style={s.articleHeader}>
                <div style={s.articleCategory}>{article.category}</div>
                <div style={s.articleTitle}>{article.seoTitle}</div>
                <div
                  style={{
                    display: 'flex',
                    gap: 18,
                    flexWrap: 'wrap',
                    fontFamily: "'Syne',sans-serif",
                    fontSize: 12,
                    color: '#5a6b7a',
                  }}
                >
                  <span>✍️ Rainboots Marketing Team</span>
                  <span>📅 {article.date}</span>
                  <span>🏷️ {article.service}</span>
                </div>
              </div>
              <div
                className='rb-body'
                style={s.articleBody}
                dangerouslySetInnerHTML={{ __html: article.html }}
              />
            </div>

            {/* ★ Action bar with WordPress button */}
            <div
              style={{
                display: 'flex',
                gap: 10,
                marginTop: 18,
                flexWrap: 'wrap',
              }}
            >
              {/* PRIMARY: WordPress one-click export */}
              <button
                className='rb-wp-btn'
                style={s.wpBtn}
                onClick={copyForWordPress}
              >
                {copyStatus === 'wordpress'
                  ? '✅ Copied! Paste into WordPress →'
                  : '🟢 Copy for WordPress'}
              </button>

              {/* SECONDARY: just meta tags */}
              <button
                className='rb-action-btn'
                style={s.actionBtn}
                onClick={copyMetaTags}
              >
                {copyStatus === 'meta' ? '✅ Copied!' : '📝 Copy Meta Tags'}
              </button>

              {/* Reset */}
              <button
                className='rb-action-btn'
                style={s.actionBtn}
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

            {/* WordPress instructions */}
            <div style={s.wpInstructions}>
              <div style={s.wpInstructionsTitle}>
                📋 How to publish in WordPress
              </div>
              <ol style={s.wpInstructionsList}>
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
                  description and keywords (use Copy Meta Tags button)
                </li>
                <li>
                  Add a <strong>featured image</strong>, assign a{' '}
                  <strong>category</strong>, then <strong>Publish</strong>
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 1 && (
          <div style={{ marginTop: 48 }}>
            <div style={s.sectionLabel}>Session History</div>
            <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
              {history.map((art, i) => (
                <div
                  key={i}
                  className='rb-history-card'
                  style={s.historyCard}
                  onClick={() => {
                    setArticle(art);
                    outputRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'DM Serif Display',serif",
                      fontSize: 15,
                      color: '#f5f0e8',
                      flex: 1,
                    }}
                  >
                    {art.seoTitle}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Syne',sans-serif",
                      fontSize: 11,
                      color: '#5a6b7a',
                      whiteSpace: 'nowrap',
                    }}
                  >
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

const s = {
  page: {
    background: '#0d1b2a',
    minHeight: '100vh',
    position: 'relative',
    overflowX: 'hidden',
    fontFamily: "'DM Sans', sans-serif",
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
    justifyContent: 'space-between',
    marginBottom: 48,
    paddingBottom: 28,
    borderBottom: '1px solid rgba(14,154,167,0.2)',
  },
  logoMark: {
    width: 44,
    height: 44,
    background: '#0e9aa7',
    borderRadius: 11,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    flexShrink: 0,
  },
  headerTitle: {
    fontFamily: "'Syne',sans-serif",
    fontSize: 13,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: '#17c3d4',
  },
  headerSub: { fontSize: 12, color: '#5a6b7a', marginTop: 2 },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 7,
    color: '#5a6b7a',
    cursor: 'pointer',
    fontFamily: "'Syne',sans-serif",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: '7px 14px',
    transition: 'all 0.15s',
  },
  panel: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(14,154,167,0.2)',
    borderRadius: 20,
    padding: 30,
    marginBottom: 28,
  },
  sectionLabel: {
    fontFamily: "'Syne',sans-serif",
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: '#0e9aa7',
    marginBottom: 18,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 14,
    marginBottom: 4,
  },
  field: { display: 'flex', flexDirection: 'column', gap: 7 },
  label: {
    fontFamily: "'Syne',sans-serif",
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
    fontFamily: "'DM Sans',sans-serif",
    fontSize: 14,
    padding: '11px 14px',
    outline: 'none',
    width: '100%',
  },
  toneGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 },
  toneBtn: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    color: '#5a6b7a',
    cursor: 'pointer',
    fontFamily: "'Syne',sans-serif",
    fontSize: 12,
    fontWeight: 600,
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
    fontFamily: "'Syne',sans-serif",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: 15,
    transition: 'background 0.2s',
  },
  errorMsg: {
    background: 'rgba(220,50,50,0.1)',
    border: '1px solid rgba(220,50,50,0.3)',
    borderRadius: 10,
    color: '#ff8080',
    fontSize: 13,
    padding: '13px 16px',
    marginTop: 14,
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
  metaLabel: {
    fontFamily: "'Syne',sans-serif",
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
    fontFamily: "'Syne',sans-serif",
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
    fontFamily: "'Syne',sans-serif",
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: '#17c3d4',
    marginBottom: 10,
  },
  articleTitle: {
    fontFamily: "'DM Serif Display',serif",
    fontSize: 28,
    color: '#f5f0e8',
    lineHeight: 1.2,
    marginBottom: 14,
  },
  articleBody: {
    padding: '36px 40px',
    fontSize: 15,
    lineHeight: 1.8,
    color: '#2a2a3a',
  },
  // ★ WordPress button — green to stand out
  wpBtn: {
    background: '#16a34a',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    cursor: 'pointer',
    fontFamily: "'Syne',sans-serif",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    padding: '11px 20px',
    transition: 'background 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 8,
    color: '#f5f0e8',
    cursor: 'pointer',
    fontFamily: "'Syne',sans-serif",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    padding: '10px 16px',
    transition: 'all 0.15s',
  },
  // ★ WordPress instructions panel
  wpInstructions: {
    background: 'rgba(22,163,74,0.08)',
    border: '1px solid rgba(22,163,74,0.25)',
    borderRadius: 12,
    padding: '20px 24px',
    marginTop: 14,
  },
  wpInstructionsTitle: {
    fontFamily: "'Syne',sans-serif",
    fontSize: 12,
    fontWeight: 700,
    color: '#4ade80',
    marginBottom: 12,
    letterSpacing: '0.05em',
  },
  wpInstructionsList: {
    margin: 0,
    paddingLeft: 20,
    color: '#a0b0a8',
    fontSize: 13,
    lineHeight: 2,
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
    transition: 'all 0.15s',
  },
};
