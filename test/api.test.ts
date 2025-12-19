import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchAllRepos } from '../js/api.js';
import type { GitHubRepo } from '../js/types.js';

// Mock fetch
const mockFetch = vi.mocked(global.fetch);

describe('API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear localStorage
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    vi.mocked(localStorage.setItem).mockImplementation(() => {});
  });

  it('should fetch repos successfully', async () => {
    const mockRepos: GitHubRepo[] = [
      {
        id: 1,
        name: 'test-repo',
        full_name: 'test/test-repo',
        description: 'Test repository',
        html_url: 'https://github.com/test/test-repo',
        stargazers_count: 10,
        forks_count: 5,
        language: 'TypeScript',
        updated_at: '2023-12-01T00:00:00Z',
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
        watchers_count: 10,
        open_issues_count: 0,
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({
        'etag': '"test-etag"',
      }),
      json: async () => mockRepos,
      text: async () => '',
    } as Response);

    const result = await fetchAllRepos({
      user: 'test',
      perPage: 100,
      signal: new AbortController().signal,
    });

    expect(result.repos).toEqual(mockRepos);
    expect(result.error).toBe('');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.github.com/users/test/repos?per_page=100&page=1&type=public&sort=updated',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Accept': 'application/vnd.github+json',
        }),
      })
    );
  });

  it('should handle API errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      headers: new Headers(),
      text: async () => 'Not Found',
    } as Response);

    const result = await fetchAllRepos({
      user: 'nonexistent',
      perPage: 100,
      signal: new AbortController().signal,
    });

    expect(result.repos).toEqual([]);
    expect(result.error).toBe('GitHub API 404: Not Found');
  });

  it('should use cached data when fresh', async () => {
    const mockCachedData = {
      ts: Date.now(),
      etag: 'test-etag',
      data: [{ id: 1, name: 'cached-repo' } as GitHubRepo],
    };

    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(mockCachedData));

    const result = await fetchAllRepos({
      user: 'test',
      perPage: 100,
      signal: new AbortController().signal,
    });

    expect(result.repos).toEqual(mockCachedData.data);
    expect(result.error).toBe('');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should handle rate limiting', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      headers: new Headers({
        'x-ratelimit-remaining': '0',
        'x-ratelimit-reset': String(Math.floor(Date.now() / 1000) + 3600),
      }),
      text: async () => '',
    } as Response);

    const result = await fetchAllRepos({
      user: 'test',
      perPage: 100,
      signal: new AbortController().signal,
    });

    expect(result.repos).toEqual([]);
    expect(result.error).toMatch(/GitHub API rate limit reached/);
  });

  it('should handle abort signal', async () => {
    const controller = new AbortController();
    controller.abort();

    mockFetch.mockRejectedValueOnce(new DOMException('Aborted', 'AbortError'));

    const result = await fetchAllRepos({
      user: 'test',
      perPage: 100,
      signal: controller.signal,
    });

    expect(result.repos).toEqual([]);
    expect(result.error).toBe('');
  });
});
