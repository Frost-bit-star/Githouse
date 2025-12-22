import type { Community, DeveloperProfile, User } from '../types';

const GITHUB_API_BASE = 'https://api.github.com';

const buildHeaders = () => {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function safeFetch<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    headers: buildHeaders(),
  });

  if (!response.ok) {
    throw new Error(`GitHub request failed: ${response.status}`);
  }

  return response.json();
}

interface GitHubUserResponse {
  name: string | null;
  login: string;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  followers: number;
  following: number;
  public_gists: number;
  public_repos: number;
  html_url: string;
  company?: string | null;
}

interface GitHubRepoResponse {
  name: string;
  description: string | null;
  stargazers_count: number;
  html_url: string;
}

interface GitHubSearchResponse {
  items: GitHubUserResponse[];
}

export async function fetchGitHubUser(username: string): Promise<DeveloperProfile | null> {
  try {
    const data = await safeFetch<GitHubUserResponse>(`/users/${username}`);
    return {
      name: data.name || data.login,
      handle: data.login,
      avatarUrl: data.avatar_url,
      about: data.bio || undefined,
      location: data.location || undefined,
      followers: data.followers,
      following: data.following,
      stars: data.public_gists ?? 0,
      repositories: data.public_repos,
      profileUrl: data.html_url,
      role: data.company || 'Open Source Developer',
    };
  } catch (error) {
    console.error('[GitHub] Failed to fetch user profile', error);
    return null;
  }
}

export async function fetchGitHubRepos(username: string, limit = 4): Promise<Community[]> {
  try {
    const repos = await safeFetch<GitHubRepoResponse[]>(`/users/${username}/repos?sort=updated&per_page=${limit}`);

    return repos.map((repo: any) => ({
      name: repo.name,
      description: repo.description ?? 'No description provided',
      imageUrl: `https://opengraph.githubassets.com/1/${username}/${repo.name}`,
      members: repo.stargazers_count,
      url: repo.html_url,
    }));
  } catch (error) {
    console.error('[GitHub] Failed to fetch repositories', error);
    return [];
  }
}

export async function searchGitHubUsers(query: string, limit = 4): Promise<User[]> {
  try {
    const search = await safeFetch<GitHubSearchResponse>(`/search/users?q=${encodeURIComponent(query)}&per_page=${limit}`);
    const results = search.items ?? [];

    const profiles = await Promise.all(
      results.map((user) => safeFetch<GitHubUserResponse>(`/users/${user.login}`))
    );

    return profiles.map((profile) => ({
      name: profile.name || profile.login,
      handle: profile.login,
      avatarUrl: profile.avatar_url,
      role: profile.company || profile.bio || 'Software Engineer',
      followers: profile.followers,
      location: profile.location || undefined,
      profileUrl: profile.html_url,
    }));
  } catch (error) {
    console.error('[GitHub] Failed to search users', error);
    return [];
  }
}
