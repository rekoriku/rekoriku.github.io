import { langColor, slugLang } from './lang.js';
import type { GitHubRepo } from './types.js';

export function fmtDate(iso: string | undefined | null): string {
  try {
    if (!iso) return '';
    return new Date(iso).toISOString().slice(0, 10);
  } catch {
    return '';
  }
}

export function escapeHtml(s: string | number | null | undefined): string {
  return String(s || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function repoRowHtml(r: GitHubRepo): string {
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
