import { apiFetch } from './client';

export async function getCommunities(page = 1, limit = 20) {
  return apiFetch(`communities?page=${page}&limit=${limit}`);
}

export async function getCommunity(slug: string) {
  return apiFetch(`communities/${slug}`);
}

export async function joinCommunity(slug: string) {
  return apiFetch(`communities/${slug}/join`, { method: 'POST' });
}

export async function createCommunity(dto: any) {
  return apiFetch('communities', { method: 'POST', body: JSON.stringify(dto) });
}
