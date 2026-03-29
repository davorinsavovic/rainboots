import { useState, useEffect, useRef } from 'react';
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

// Main Blog Generator Component (no password gate - dashboard handles it)
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

            {/* Action bar */}
            <div
              style={{
                display: 'flex',
                gap: 10,
                marginTop: 18,
                flexWrap: 'wrap',
              }}
            >
              <button
                className='rb-wp-btn'
                style={s.wpBtn}
                onClick={copyForWordPress}
              >
                {copyStatus === 'wordpress'
                  ? '✅ Copied! Paste into WordPress →'
                  : '🟢 Copy for WordPress'}
              </button>

              <button
                className='rb-action-btn'
                style={s.actionBtn}
                onClick={copyMetaTags}
              >
                {copyStatus === 'meta' ? '✅ Copied!' : '📝 Copy Meta Tags'}
              </button>

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
