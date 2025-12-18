import { fetchAllRepos } from './api.js';
import { repoRowHtml } from './render.js';
import { readControlsFromUrl, writeControlsToUrl } from './state.js';

const USER = 'rekoriku';
const PER_PAGE = 100;

const elQ = document.getElementById('q');
const elSort = document.getElementById('sort');
const elForks = document.getElementById('forks');
const elStatus = document.getElementById('status');
const elList = document.getElementById('list');

let repos = [];
let lastError = '';
let controller = null;
let suppressUrlWrite = false;

function withViewTransition(updateDom) {
  const anyDoc = /** @type {any} */ (document);
  if (typeof anyDoc.startViewTransition === 'function') {
    anyDoc.startViewTransition(() => {
      updateDom();
    });
    return;
  }
  updateDom();
}

function debounce(fn, ms) {
  let t = 0;
  return (...args) => {
    window.clearTimeout(t);
    t = window.setTimeout(() => fn(...args), ms);
  };
}

function renderList(items) {
  withViewTransition(() => {
    elList.innerHTML = items.map(repoRowHtml).join('');
  });
}

function applyFilterSort() {
  const q = (elQ.value || '').trim().toLowerCase();
  const includeForks = !!elForks.checked;
  const sort = elSort.value;

  if (!suppressUrlWrite) {
    writeControlsToUrl({ q: elQ.value || '', sort, forks: includeForks });
  }

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

  renderList(items);

  const base = `${items.length} shown`;
  const err = lastError ? ` · ${lastError}` : '';
  elStatus.textContent = `${base} / ${repos.length} total${err}`;
}

const applyFilterSortDebounced = debounce(applyFilterSort, 150);

async function init() {
  const state = readControlsFromUrl();
  elQ.value = state.q;
  elSort.value = state.sort;
  elForks.checked = !!state.forks;

  elStatus.textContent = 'Loading…';

  controller?.abort();
  controller = new AbortController();

  const { repos: loaded, error } = await fetchAllRepos({
    user: USER,
    perPage: PER_PAGE,
    signal: controller.signal,
  }).catch(e => {
    if (e && e.name === 'AbortError') return { repos: [], error: '' };
    return { repos: [], error: (e && e.message) ? e.message : 'Failed to load repos' };
  });

  repos = loaded;
  lastError = error || '';
  applyFilterSort();
}

window.addEventListener('popstate', () => {
  const state = readControlsFromUrl();
  suppressUrlWrite = true;
  elQ.value = state.q;
  elSort.value = state.sort;
  elForks.checked = !!state.forks;
  suppressUrlWrite = false;
  applyFilterSort();
});

elQ.addEventListener('input', applyFilterSortDebounced);
elSort.addEventListener('change', applyFilterSort);
elForks.addEventListener('change', applyFilterSort);

init();
