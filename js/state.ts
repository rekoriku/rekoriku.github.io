import type { UrlState } from './types.js';

export function readControlsFromUrl(): UrlState {
  const url = new URL(window.location.href);
  const q = url.searchParams.get('q') || '';
  const sort = url.searchParams.get('sort') || 'updated';
  const forks = url.searchParams.get('forks') === '1';

  return { q, sort: sort as UrlState['sort'], forks };
}

export function writeControlsToUrl({ q, sort, forks }: UrlState): void {
  const url = new URL(window.location.href);

  if (q) url.searchParams.set('q', q);
  else url.searchParams.delete('q');

  if (sort && sort !== 'updated') url.searchParams.set('sort', sort);
  else url.searchParams.delete('sort');

  if (forks) url.searchParams.set('forks', '1');
  else url.searchParams.delete('forks');

  window.history.replaceState(null, '', url.href);
}
