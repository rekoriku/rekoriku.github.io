import { describe, it, expect } from 'vitest';
import { fmtDate, escapeHtml, repoRowHtml } from '../js/render.js';
import type { GitHubRepo } from '../js/types.js';

describe('Render Functions', () => {
  describe('fmtDate', () => {
    it('should format valid ISO date', () => {
      const result = fmtDate('2023-12-01T10:30:00Z');
      expect(result).toBe('2023-12-01');
    });

    it('should handle empty string', () => {
      const result = fmtDate('');
      expect(result).toBe('');
    });

    it('should handle null', () => {
      const result = fmtDate(null);
      expect(result).toBe('');
    });

    it('should handle undefined', () => {
      const result = fmtDate(undefined);
      expect(result).toBe('');
    });

    it('should handle invalid date', () => {
      const result = fmtDate('invalid-date');
      expect(result).toBe('');
    });
  });

  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      const result = escapeHtml('<script>alert("xss")</script>');
      expect(result).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
    });

    it('should handle null values', () => {
      const result = escapeHtml(null);
      expect(result).toBe('');
    });

    it('should handle undefined values', () => {
      const result = escapeHtml(undefined);
      expect(result).toBe('');
    });

    it('should handle numbers', () => {
      const result = escapeHtml(123);
      expect(result).toBe('123');
    });

    it('should handle empty strings', () => {
      const result = escapeHtml('');
      expect(result).toBe('');
    });
  });

  describe('repoRowHtml', () => {
    const mockRepo: GitHubRepo = {
      id: 1,
      name: 'test-repo',
      full_name: 'test/test-repo',
      description: 'Test repository with <script>alert("xss")</script>',
      html_url: 'https://github.com/test/test-repo',
      stargazers_count: 42,
      forks_count: 10,
      language: 'TypeScript',
      updated_at: '2023-12-01T10:30:00Z',
      created_at: '2023-01-01T00:00:00Z',
      pushed_at: '2023-12-01T00:00:00Z',
      size: 1000,
      default_branch: 'main',
      archived: false,
      fork: false,
      private: false,
      owner: {
        login: 'test',
        id: 1,
        avatar_url: 'https://github.com/test.png',
        html_url: 'https://github.com/test',
      },
      topics: [],
      license: null,
      watchers_count: 42,
      open_issues_count: 0,
    };

    it('should generate complete HTML for repo', () => {
      const result = repoRowHtml(mockRepo);
      
      expect(result).toContain('test-repo');
      expect(result).toContain('https://github.com/test/test-repo');
      expect(result).toContain('Test repository with &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
      expect(result).toContain('★ 42');
      expect(result).toContain('⑂ 10');
      expect(result).toContain('TypeScript');
      expect(result).toContain('updated 2023-12-01');
      expect(result).toContain('role="listitem"');
      expect(result).toContain('rel="noreferrer"');
    });

    it('should handle repo without description', () => {
      const repoWithoutDesc = { ...mockRepo, description: null };
      const result = repoRowHtml(repoWithoutDesc);
      
      expect(result).not.toContain('<p class="muted">');
    });

    it('should handle repo without language', () => {
      const repoWithoutLang = { ...mockRepo, language: null };
      const result = repoRowHtml(repoWithoutLang);
      
      expect(result).not.toContain('class="lang"');
    });

    it('should handle archived repo', () => {
      const archivedRepo = { ...mockRepo, archived: true };
      const result = repoRowHtml(archivedRepo);
      
      expect(result).toContain('<span class="meta-label">archived</span>');
    });

    it('should handle fork repo', () => {
      const forkRepo = { ...mockRepo, fork: true };
      const result = repoRowHtml(forkRepo);
      
      expect(result).toContain('<span class="meta-label">fork</span>');
    });

    it('should handle repo without updated_at', () => {
      const repoWithoutDate: GitHubRepo = { 
        ...mockRepo, 
        updated_at: '' 
      };
      const result = repoRowHtml(repoWithoutDate);
      
      expect(result).not.toContain('class="updated"');
    });

    it('should handle zero stars and forks', () => {
      const repoWithZeroCounts = { ...mockRepo, stargazers_count: 0, forks_count: 0 };
      const result = repoRowHtml(repoWithZeroCounts);
      
      expect(result).toContain('★ 0');
      expect(result).toContain('⑂ 0');
    });
  });
});
