import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readControlsFromUrl, writeControlsToUrl } from '../js/state.js';

describe('State Management', () => {
  beforeEach(() => {
    // Reset URL mock
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost:3000',
        searchParams: new URLSearchParams(),
      },
      writable: true,
    });
    
    vi.mocked(window.history.replaceState).mockClear();
  });

  describe('readControlsFromUrl', () => {
    it('should read default values from empty URL', () => {
      const result = readControlsFromUrl();
      
      expect(result).toEqual({
        q: '',
        sort: 'updated',
        forks: false,
      });
    });

    it('should read search query', () => {
      Object.defineProperty(window, 'location', {
        value: {
          href: 'http://localhost:3000?q=test-query',
          searchParams: new URLSearchParams('q=test-query'),
        },
        writable: true,
      });

      const result = readControlsFromUrl();
      
      expect(result.q).toBe('test-query');
      expect(result.sort).toBe('updated');
      expect(result.forks).toBe(false);
    });

    it('should read sort parameter', () => {
      Object.defineProperty(window, 'location', {
        value: {
          href: 'http://localhost:3000?sort=stars',
          searchParams: new URLSearchParams('sort=stars'),
        },
        writable: true,
      });

      const result = readControlsFromUrl();
      
      expect(result.q).toBe('');
      expect(result.sort).toBe('stars');
      expect(result.forks).toBe(false);
    });

    it('should read forks parameter', () => {
      Object.defineProperty(window, 'location', {
        value: {
          href: 'http://localhost:3000?forks=1',
          searchParams: new URLSearchParams('forks=1'),
        },
        writable: true,
      });

      const result = readControlsFromUrl();
      
      expect(result.q).toBe('');
      expect(result.sort).toBe('updated');
      expect(result.forks).toBe(true);
    });

    it('should handle multiple parameters', () => {
      Object.defineProperty(window, 'location', {
        value: {
          href: 'http://localhost:3000?q=typescript&sort=name&forks=1',
          searchParams: new URLSearchParams('q=typescript&sort=name&forks=1'),
        },
        writable: true,
      });

      const result = readControlsFromUrl();
      
      expect(result.q).toBe('typescript');
      expect(result.sort).toBe('name');
      expect(result.forks).toBe(true);
    });

    it('should handle invalid sort value', () => {
      Object.defineProperty(window, 'location', {
        value: {
          href: 'http://localhost:3000?sort=invalid',
          searchParams: new URLSearchParams('sort=invalid'),
        },
        writable: true,
      });

      const result = readControlsFromUrl();
      
      expect(result.sort).toBe('invalid');
    });
  });

  describe('writeControlsToUrl', () => {
    it('should write default state to URL', () => {
      const state = { q: '', sort: 'updated' as const, forks: false };
      
      writeControlsToUrl(state);
      
      expect(window.history.replaceState).toHaveBeenCalledWith(
        null,
        '',
        'http://localhost:3000/'
      );
    });

    it('should write search query', () => {
      const state = { q: 'test-query', sort: 'updated' as const, forks: false };
      
      writeControlsToUrl(state);
      
      expect(window.history.replaceState).toHaveBeenCalledWith(
        null,
        '',
        'http://localhost:3000/?q=test-query'
      );
    });

    it('should write sort parameter', () => {
      const state = { q: '', sort: 'stars' as const, forks: false };
      
      writeControlsToUrl(state);
      
      expect(window.history.replaceState).toHaveBeenCalledWith(
        null,
        '',
        'http://localhost:3000/?sort=stars'
      );
    });

    it('should write forks parameter', () => {
      const state = { q: '', sort: 'updated' as const, forks: true };
      
      writeControlsToUrl(state);
      
      expect(window.history.replaceState).toHaveBeenCalledWith(
        null,
        '',
        'http://localhost:3000/?forks=1'
      );
    });

    it('should write multiple parameters', () => {
      const state = { q: 'typescript', sort: 'name' as const, forks: true };
      
      writeControlsToUrl(state);
      
      expect(window.history.replaceState).toHaveBeenCalledWith(
        null,
        '',
        expect.stringContaining('q=typescript')
      );
      
      expect(window.history.replaceState).toHaveBeenCalledWith(
        null,
        '',
        expect.stringContaining('sort=name')
      );
      
      expect(window.history.replaceState).toHaveBeenCalledWith(
        null,
        '',
        expect.stringContaining('forks=1')
      );
    });

    it('should not include default sort in URL', () => {
      const state = { q: '', sort: 'updated' as const, forks: false };
      
      writeControlsToUrl(state);
      
      expect(window.history.replaceState).toHaveBeenCalledWith(
        null,
        '',
        'http://localhost:3000/'
      );
    });

    it('should not include empty query in URL', () => {
      const state = { q: '', sort: 'stars' as const, forks: false };
      
      writeControlsToUrl(state);
      
      expect(window.history.replaceState).toHaveBeenCalledWith(
        null,
        '',
        'http://localhost:3000/?sort=stars'
      );
    });

    it('should not include false forks in URL', () => {
      const state = { q: '', sort: 'stars' as const, forks: false };
      
      writeControlsToUrl(state);
      
      expect(window.history.replaceState).toHaveBeenCalledWith(
        null,
        '',
        'http://localhost:3000/?sort=stars'
      );
    });
  });
});
