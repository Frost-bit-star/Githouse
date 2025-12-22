import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_GITHUB_USERNAME, DEFAULT_MEMBER_QUERY, FALLBACK_PROFILE_DETAILS } from '../constants';

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
  login: (params: { username: string; displayName: string; email: string }) => void;
  logout: () => void;
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
          if (next[handle]) {
            delete next[handle];
          } else {
            next[handle] = true;
          }
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
      login: ({ username, displayName, email }) => {
        const normalizedUsername = username || DEFAULT_GITHUB_USERNAME;
        set({
          isAuthenticated: true,
          username: normalizedUsername,
          displayName: displayName || 'Developer',
          userEmail: email,
          avatarUrl: `https://avatars.githubusercontent.com/${normalizedUsername}`,
        });
      },
      logout: () =>
        set({
          isAuthenticated: false,
          userEmail: '',
          followedHandles: {},
          displayName: 'Developer',
          avatarUrl: '',
        }),
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
