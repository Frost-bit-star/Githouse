
import { User, Community, Stat, ModerationUser, ActivityData } from './types';

export const DEFAULT_GITHUB_USERNAME = 'vercel';

export const STATS_DATA: Stat[] = [
  { value: '500', label: 'Followers', color: 'blue' },
  { value: '500', label: 'Stars', color: 'green' },
  { value: '500', label: 'Following', color: 'orange' },
];

export const FALLBACK_PROFILE_DETAILS = {
  about: 'Software Engineer specializing in React... ',
  location: 'Remote',
};

export const DEFAULT_MEMBER_QUERY = 'react maintainer';

export const RECOMMENDED_USERS: User[] = [
  { name: 'Andrew Kim', handle: 'Andi', avatarUrl: 'https://i.pravatar.cc/150?img=1', role: 'Project Author' },
  { name: 'Charles Mbugua ', handle: 'Charles', avatarUrl: 'https://i.pravatar.cc/150?img=2', role: 'Maintainer' },
];

export const COMMUNITY_DATA: Community[] = [
  { name: 'Andi - "NauraNat"', description: 'Technical Lead at Salamander', imageUrl: 'https://picsum.photos/seed/community1/400/200', members: 1289 },
  { name: 'Trendi: New Quantum..', description: 'Exploring the future of computing', imageUrl: 'https://picsum.photos/seed/community2/400/200', members: 4289 },
  { name: 'Pytho X', description: 'Python for AI and Data Science', imageUrl: 'https://picsum.photos/seed/community3/400/200', members: 815 },
  { name: 'BlueStack X', description: 'Next-gen cloud infrastructure', imageUrl: 'https://picsum.photos/seed/community4/400/200', members: 2300 },
];

export const MEMBER_DATA: User[] = [
  { name: 'Festus Pro', handle: 'festuspro', avatarUrl: 'https://i.pravatar.cc/150?img=5', role: 'DevOps Engineer' },
  { name: 'BlockChainVault', handle: 'bcvault', avatarUrl: 'https://i.pravatar.cc/150?img=6', role: 'Solidity Dev' },
  { name: 'Visite Adidas', handle: 'visiteadidas', avatarUrl: 'https://i.pravatar.cc/150?img=7', role: 'AI Researcher' },
  { name: 'BlockChain Yao X', handle: 'yaox', avatarUrl: 'https://i.pravatar.cc/150?img=8', role: 'Rust Developer' },
];

export const MODERATION_USERS_DATA: ModerationUser[] = [
  { name: 'Sharon Murugi', handle: 'sharonmurugi', avatarUrl: 'https://i.pravatar.cc/150?img=9', role: 'Project Author', status: 'Active', lastActivity: '2 hours ago' },
  { name: 'Sidney Baraka', handle: 'mathncode', avatarUrl: 'https://i.pravatar.cc/150?img=1', role: 'Community Manager', status: 'Active', lastActivity: '5 minutes ago' },
  { name: 'Steve Kingoro', handle: 'stevo', avatarUrl: 'https://i.pravatar.cc/150?img=10', role: 'User', status: 'Suspended', lastActivity: '1 day ago' },
  { name: 'Randy Lutta', handle: 'randy', avatarUrl: 'https://i.pravatar.cc/150?img=11', role: 'User', status: 'Active', lastActivity: '30 minutes ago' },
];

export const ACTIVITY_CHART_DATA: ActivityData[] = [
  { name: 'Mon', actions: 120 },
  { name: 'Tue', actions: 200 },
  { name: 'Wed', actions: 150 },
  { name: 'Thu', actions: 280 },
  { name: 'Fri', actions: 180 },
  { name: 'Sat', actions: 230 },
  { name: 'Sun', actions: 300 },
];
