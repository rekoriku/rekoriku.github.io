export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  created_at: string;
  pushed_at: string;
  size: number;
  default_branch: string;
  archived: boolean;
  fork: boolean;
  private: boolean;
  owner: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
  };
  topics: string[];
  license: {
    key: string;
    name: string;
    spdx_id: string;
  } | null;
  watchers_count: number;
  open_issues_count: number;
}

export interface FetchReposOptions {
  user: string;
  perPage: number;
  signal: AbortSignal;
}

export interface FetchReposResult {
  repos: GitHubRepo[];
  error: string;
}

export interface CacheData {
  ts: number;
  etag: string;
  data: GitHubRepo[];
}

export interface UrlState {
  q: string;
  sort: 'updated' | 'stars' | 'name';
  forks: boolean;
}

export interface LanguageColor {
  [key: string]: string;
}
