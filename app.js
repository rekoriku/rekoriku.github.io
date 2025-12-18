const USER = 'rekoriku';
const PER_PAGE = 100;

const elQ = document.getElementById('q');
const elSort = document.getElementById('sort');
const elForks = document.getElementById('forks');
const elStatus = document.getElementById('status');
const elList = document.getElementById('list');

let repos = [];
let lastError = '';

function fmtDate(iso) {
  try {
    return new Date(iso).toISOString().slice(0, 10);
  } catch {
    return '';
  }
}

function slugLang(lang) {
  const raw = String(lang || '').toLowerCase().trim();

  if (raw === 'c#') return 'csharp';
  if (raw === 'c++') return 'cpp';
  if (raw === 'f#') return 'fsharp';

  return raw
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/(^-|-$)/g, '');
}

const LANG_COLORS = {
  javascript: '#f1e05a',
  typescript: '#3178c6',
  python: '#3572a5',
  go: '#00add8',
  java: '#b07219',
  ruby: '#701516',
  php: '#4f5d95',
  rust: '#dea584',
  kotlin: '#a97bff',
  swift: '#f05138',
  html: '#e34c26',
  css: '#563d7c',
  shell: '#89e051',
  powershell: '#012456',
  elixir: '#6e4a7e',
  c: '#555555',
  cpp: '#f34b7d',
  csharp: '#178600',
  fsharp: '#b845fc',
  dart: '#00b4ab',
  lua: '#000080',
  vue: '#41b883',
  svelte: '#ff3e00',
  dockerfile: '#384d54',
  'jupyter-notebook': '#da5b0b',
};

function hashHue(s) {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h % 360;
}

function langColor(lang) {
  const slug = slugLang(lang);
  if (slug && LANG_COLORS[slug]) return LANG_COLORS[slug];
  const hue = hashHue(slug || String(lang || 'unknown'));
  return `hsl(${hue} 65% 52%)`;
}

function repoCard(r) {
  const stars = typeof r.stargazers_count === 'number' ? r.stargazers_count : 0;
  const forks = typeof r.forks_count === 'number' ? r.forks_count : 0;
  const lang = r.language || '';
  const updated = r.updated_at ? fmtDate(r.updated_at) : '';
  const desc = r.description || '';

  const langSlug = lang ? slugLang(lang) : '';
  const langClr = lang ? langColor(lang) : '';

  const metaLeft = `
          <div class="meta-grid">
            ${lang ? `<span class="meta-item lang lang-${langSlug}" style="--lang: ${langClr}">${escapeHtml(lang)}</span>` : ``}
            <span class="meta-item">★ ${stars}</span>
            <span class="meta-item">⑂ ${forks}</span>
            ${r.archived ? `<span class="meta-label">archived</span>` : ``}
            ${r.fork ? `<span class="meta-label">fork</span>` : ``}
          </div>
        `;

  const metaRight = updated ? `<div class="meta-right"><span class="updated">updated ${updated}</span></div>` : '';

  return `
          <article class="repo" role="listitem">
            <div class="repo-main">
              <h3><a href="${r.html_url}" target="_blank" rel="noreferrer">${escapeHtml(r.name)}</a></h3>
              ${desc ? `<p class="muted">${escapeHtml(desc)}</p>` : ''}
              <div class="repo-meta">
                ${metaLeft}
                ${metaRight}
              </div>
            </div>
          </article>
        `;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function applyFilterSort() {
  const q = (elQ.value || '').trim().toLowerCase();
  const includeForks = !!elForks.checked;
  const sort = elSort.value;

  let items = repos.slice();
  if (!includeForks) items = items.filter(r => !r.fork);

  if (q) {
    items = items.filter(r => {
      const hay = `${r.name || ''} ${r.description || ''} ${r.language || ''}`.toLowerCase();
      return hay.includes(q);
    });
  }

  items.sort((a, b) => {
    if (sort === 'stars') return (b.stargazers_count || 0) - (a.stargazers_count || 0);
    if (sort === 'name') return String(a.name || '').localeCompare(String(b.name || ''));
    return String(b.updated_at || '').localeCompare(String(a.updated_at || ''));
  });

  elList.innerHTML = items.map(repoCard).join('');

  const base = `${items.length} shown`;
  const err = lastError ? ` · ${lastError}` : '';
  elStatus.textContent = `${base} / ${repos.length} total${err}`;
}

async function fetchAllRepos() {
  let page = 1;
  const out = [];
  while (true) {
    const url = `https://api.github.com/users/${USER}/repos?per_page=${PER_PAGE}&page=${page}&type=public&sort=updated`;
    const res = await fetch(url, { headers: { 'Accept': 'application/vnd.github+json' } });
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`GitHub API ${res.status}${txt ? `: ${txt}` : ''}`);
    }
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    out.push(...batch);
    if (batch.length < PER_PAGE) break;
    page += 1;
    if (page > 10) break;
  }
  return out;
}

async function init() {
  try {
    repos = await fetchAllRepos();
    lastError = '';
  } catch (e) {
    repos = [];
    lastError = (e && e.message) ? e.message : 'Failed to load repos';
  }
  applyFilterSort();
}

elQ.addEventListener('input', applyFilterSort);
elSort.addEventListener('change', applyFilterSort);
elForks.addEventListener('change', applyFilterSort);

init();
