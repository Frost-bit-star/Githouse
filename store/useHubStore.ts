import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiFetch } from '../src/api/client';

export type CommunitySort = 'trending' | 'alphabetical';
export type MemberSort = 'followers' | 'alphabetical';

interface HubState {
  // User info
  username: string;
  displayName: string;
  about: string | null;
  location: string | null;
  avatarUrl: string;
  userEmail: string;
  isAuthenticated: boolean;

  // Social
  followedHandles: Record<string, boolean>;

  // Filters
  communityQuery: string;
  communitySort: CommunitySort;
  memberQuery: string;
  memberSort: MemberSort;

  // Data
  communities: any[];
  projects: any[];
  posts: any[];
  moderationReports: any[];

  // Actions
  setUsername: (username: string) => void;
  setDisplayName: (displayName: string) => void;
  setAbout: (about: string) => void;
  setLocation: (location: string) => void;
  setAvatarUrl: (url: string) => void;
  toggleFollow: (handle: string) => void;
  setCommunityQuery: (query: string) => void;
  setCommunitySort: (sort: CommunitySort) => void;
  setMemberQuery: (query: string) => void;
  setMemberSort: (sort: MemberSort) => void;
  resetProfile: () => void;

  // Auth
  login: (params: { email: string; password: string }) => Promise<void>;
  register: (params: { username: string; email: string; password: string; confirmPassword: string }) => Promise<void>;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;

  // Backend APIs
  fetchCommunities: () => Promise<void>;
  fetchProjects: () => Promise<void>;
  fetchPosts: () => Promise<void>;
  createPost: (content: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
  fetchModerationReports: () => Promise<void>;
  suspendUser: (userId: string) => Promise<void>;
  unsuspendUser: (userId: string) => Promise<void>;
}

export const useHubStore = create<HubState>()(
  persist(
    (set, get) => ({
      username: '',
      displayName: '',
      about: null,
      location: null,
      avatarUrl: '',
      userEmail: '',
      isAuthenticated: false,
      followedHandles: {},
      communityQuery: '',
      communitySort: 'trending',
      memberQuery: '',
      memberSort: 'followers',
      communities: [],
      projects: [],
      posts: [],
      moderationReports: [],

      setUsername: (username) => set({ username }),
      setDisplayName: (displayName) => set({ displayName }),
      setAbout: (about) => set({ about }),
      setLocation: (location) => set({ location }),
      setAvatarUrl: (url) => set({ avatarUrl: url }),
      toggleFollow: (handle) =>
        set((state) => {
          const next = { ...state.followedHandles };
          if (next[handle]) delete next[handle];
          else next[handle] = true;
          return { followedHandles: next };
        }),
      setCommunityQuery: (query) => set({ communityQuery: query }),
      setCommunitySort: (sort) => set({ communitySort: sort }),
      setMemberQuery: (query) => set({ memberQuery: query }),
      setMemberSort: (sort) => set({ memberSort: sort }),
      resetProfile: () =>
        set({
          username: '',
          displayName: '',
          about: null,
          location: null,
          avatarUrl: '',
          followedHandles: {},
        }),

      // Auth
      login: async ({ email, password }) => {
        const res = await apiFetch('auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        if (!res.token) throw new Error('Login failed');
        localStorage.setItem('token', res.token);
        localStorage.setItem('refreshToken', res.refreshToken);
        set({
          isAuthenticated: true,
          username: res.user.username,
          displayName: res.user.fullName || res.user.username,
          userEmail: res.user.email,
          about: res.user.bio || null,
          location: res.user.location || null,
          avatarUrl: res.user.avatarUrl || '',
        });
      },

      register: async ({ username, email, password, confirmPassword }) => {
        const res = await apiFetch('auth/register', {
          method: 'POST',
          body: JSON.stringify({ username, email, password, confirmPassword }),
        });
        if (!res.token) throw new Error('Registration failed');
        localStorage.setItem('token', res.token);
        localStorage.setItem('refreshToken', res.refreshToken);
        set({
          isAuthenticated: true,
          username: res.user.username,
          displayName: res.user.fullName || res.user.username,
          userEmail: res.user.email,
          about: res.user.bio || null,
          location: res.user.location || null,
          avatarUrl: res.user.avatarUrl || '',
        });
      },

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        set({
          isAuthenticated: false,
          username: '',
          displayName: '',
          userEmail: '',
          about: null,
          location: null,
          avatarUrl: '',
          followedHandles: {},
        });
      },

      fetchCurrentUser: async () => {
        try {
          const res = await apiFetch('auth/me', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          set({
            isAuthenticated: true,
            username: res.user.username,
            displayName: res.user.fullName || res.user.username,
            userEmail: res.user.email,
            about: res.user.bio || null,
            location: res.user.location || null,
            avatarUrl: res.user.avatarUrl || '',
          });
        } catch {
          set({ isAuthenticated: false });
        }
      },

      // Backend API integration
      fetchCommunities: async () => {
        const res = await apiFetch('communities', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        set({ communities: res.communities || [] });
      },

      fetchProjects: async () => {
        const res = await apiFetch('projects', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        set({ projects: res.projects || [] });
      },

      fetchPosts: async () => {
        const res = await apiFetch('posts', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        set({ posts: res.posts || [] });
      },

      createPost: async (content) => {
        await apiFetch('posts', {
          method: 'POST',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify({ content }),
        });
        get().fetchPosts();
      },

      likePost: async (postId) => {
        await apiFetch(`posts/${postId}/like`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        get().fetchPosts();
      },

      unlikePost: async (postId) => {
        await apiFetch(`posts/${postId}/like`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        get().fetchPosts();
      },

      fetchModerationReports: async () => {
        const res = await apiFetch('moderation/reports', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        set({ moderationReports: res.reports || [] });
      },

      suspendUser: async (userId) => {
        await apiFetch(`moderation/users/${userId}/suspend`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        get().fetchModerationReports();
      },

      unsuspendUser: async (userId) => {
        await apiFetch(`moderation/users/${userId}/unsuspend`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        get().fetchModerationReports();
      },
    }),
    {
      name: 'hub-state',
      partialize: (state) => ({
        username: state.username,
        displayName: state.displayName,
        about: state.about,
        location: state.location,
        avatarUrl: state.avatarUrl,
        followedHandles: state.followedHandles,
        communityQuery: state.communityQuery,
        communitySort: state.communitySort,
        memberQuery: state.memberQuery,
        memberSort: state.memberSort,
        isAuthenticated: state.isAuthenticated,
        userEmail: state.userEmail,
      }),
    }
  )
);
