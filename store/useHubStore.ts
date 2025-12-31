import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_GITHUB_USERNAME, DEFAULT_MEMBER_QUERY, FALLBACK_PROFILE_DETAILS } from '../constants';
import { api } from '../src/api/client';

export type CommunitySort = 'trending' | 'alphabetical';
export type MemberSort = 'followers' | 'alphabetical';

interface HubState {
  username: string;
  displayName: string;
  about: string;
  location: string;
  avatarUrl: string;
  followedHandles: Record<string, boolean>;
  communityQuery: string;
  communitySort: CommunitySort;
  memberQuery: string;
  memberSort: MemberSort;
  isAuthenticated: boolean;
  userEmail: string;
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
  login: (params: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
}

export const useHubStore = create<HubState>()(
  persist(
    (set, get) => ({
      username: DEFAULT_GITHUB_USERNAME,
      displayName: 'Developer',
      about: FALLBACK_PROFILE_DETAILS.about,
      location: FALLBACK_PROFILE_DETAILS.location,
      avatarUrl: '',
      followedHandles: {},
      communityQuery: '',
      communitySort: 'trending',
      memberQuery: DEFAULT_MEMBER_QUERY,
      memberSort: 'followers',
      isAuthenticated: false,
      userEmail: '',
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
      setCommunityQuery: (communityQuery) => set({ communityQuery }),
      setCommunitySort: (communitySort) => set({ communitySort }),
      setMemberQuery: (memberQuery) => set({ memberQuery }),
      setMemberSort: (memberSort) => set({ memberSort }),
      resetProfile: () =>
        set({
          username: DEFAULT_GITHUB_USERNAME,
          about: FALLBACK_PROFILE_DETAILS.about,
          location: FALLBACK_PROFILE_DETAILS.location,
        }),

      // Login with backend
      login: async ({ username, password }) => {
        try {
          const data = await api('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
          });

          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);

          set({
            isAuthenticated: true,
            username: data.user.username,
            displayName: data.user.displayName,
            userEmail: data.user.email,
            avatarUrl: data.user.avatarUrl || `https://avatars.githubusercontent.com/${data.user.username}`,
          });
        } catch (err) {
          console.error('Login failed:', err);
          throw err;
        }
      },

      // Logout and clear state
      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({
          isAuthenticated: false,
          userEmail: '',
          followedHandles: {},
          displayName: 'Developer',
          avatarUrl: '',
        });
      },

      // Fetch current user from backend
      fetchCurrentUser: async () => {
        try {
          const data = await api('/auth/me');
          set({
            isAuthenticated: true,
            username: data.username,
            displayName: data.displayName,
            userEmail: data.email,
            avatarUrl: data.avatarUrl || `https://avatars.githubusercontent.com/${data.username}`,
          });
        } catch (err) {
          console.warn('Failed to fetch current user:', err);
          set({ isAuthenticated: false });
        }
      },
    }),
    {
      name: 'devhub-state',
      partialize: (state) => ({
        username: state.username,
        about: state.about,
        location: state.location,
        followedHandles: state.followedHandles,
        communityQuery: state.communityQuery,
        communitySort: state.communitySort,
        memberQuery: state.memberQuery,
        memberSort: state.memberSort,
        isAuthenticated: state.isAuthenticated,
        userEmail: state.userEmail,
        displayName: state.displayName,
        avatarUrl: state.avatarUrl,
      }),
    }
  )
);
