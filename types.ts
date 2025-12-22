
export interface User {
  name: string;
  handle: string;
  avatarUrl: string;
  role: string;
  about?: string;
  location?: string;
  followers?: number;
  profileUrl?: string;
}

export interface DeveloperProfile extends User {
  following?: number;
  stars?: number;
  repositories?: number;
}

export interface Community {
  name: string;
  description: string;
  imageUrl: string;
  members: number;
  url?: string;
}

export interface Stat {
  value: string;
  label: string;
  color: 'blue' | 'green' | 'orange';
}

export interface ModerationUser extends User {
  status: 'Active' | 'Suspended';
  lastActivity: string;
}

export interface ActivityData {
  name: string;
  actions: number;
}
