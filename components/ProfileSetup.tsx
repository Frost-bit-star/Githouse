
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { DeveloperProfile, Stat, User } from '../types';
import { DEFAULT_GITHUB_USERNAME, FALLBACK_PROFILE_DETAILS, RECOMMENDED_USERS, STATS_DATA } from '../constants';
import { fetchGitHubUser } from '../services/github';
import { useHubStore } from '../store/useHubStore';

const StatCard: React.FC<{ stat: Stat }> = ({ stat }) => {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    orange: 'bg-orange-500/20 text-orange-400',
  };
  return (
    <div className={`p-4 rounded-lg ${colorClasses[stat.color]}`}>
      <p className="text-2xl font-bold text-white">{stat.value}</p>
      <p className="text-sm">{stat.label}</p>
    </div>
  );
};

const ProfileSetup: React.FC = () => {
  const username = useHubStore((state) => state.username);
  const setUsername = useHubStore((state) => state.setUsername);
  const about = useHubStore((state) => state.about);
  const setAbout = useHubStore((state) => state.setAbout);
  const location = useHubStore((state) => state.location);
  const setLocation = useHubStore((state) => state.setLocation);
  const followedHandles = useHubStore((state) => state.followedHandles);
  const toggleFollow = useHubStore((state) => state.toggleFollow);

  const [profile, setProfile] = useState<DeveloperProfile | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const synchronizedStats: Stat[] = useMemo(() => {
    if (!profile) return STATS_DATA;
    return [
      { value: (profile.followers ?? 0).toLocaleString(), label: 'Followers', color: 'blue' },
      { value: (profile.stars ?? 0).toLocaleString(), label: 'Stars', color: 'green' },
      { value: (profile.following ?? 0).toLocaleString(), label: 'Following', color: 'orange' },
    ];
  }, [profile]);

  const loadProfile = useCallback(async (targetUsername: string) => {
    if (!targetUsername) return;
    try {
      setStatus('loading');
      setErrorMessage(null);
      const data = await fetchGitHubUser(targetUsername.trim());
      setProfile(data);
      setAbout(data?.about ?? FALLBACK_PROFILE_DETAILS.about);
      setLocation(data?.location ?? FALLBACK_PROFILE_DETAILS.location);
      setStatus('idle');
    } catch (error) {
      console.error(error);
      setStatus('error');
      setErrorMessage('Unable to load GitHub profile. Showing defaults.');
      setProfile(null);
      setAbout(FALLBACK_PROFILE_DETAILS.about);
      setLocation(FALLBACK_PROFILE_DETAILS.location);
    }
  }, []);

  useEffect(() => {
    loadProfile(username || DEFAULT_GITHUB_USERNAME);
  }, [loadProfile, username]);

  const activeHandle = profile?.handle ?? username ?? DEFAULT_GITHUB_USERNAME;
  const isFollowingProfile = Boolean(activeHandle && followedHandles[activeHandle]);

  return (
    <div className="bg-brand-gray p-6 rounded-lg border border-brand-gray-light">
      <h2 className="text-xl font-bold text-white mb-1">Find Your Filter Profile</h2>
      <p className="text-sm text-gray-400 mb-6">Pull live stats from GitHub and fine-tune your story.</p>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="flex-1">
          <label className="text-xs text-gray-400">GitHub username</label>
          <input
            className="mt-1 w-full bg-brand-gray-dark border border-brand-gray-light rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="e.g. vercel"
          />
        </div>
        <button
          onClick={() => loadProfile(username ?? DEFAULT_GITHUB_USERNAME)}
          className="bg-brand-blue text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-60"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Syncing…' : 'Sync GitHub'}
        </button>
      </div>

      {errorMessage && (
        <p className="text-xs text-red-400 mb-4">{errorMessage}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Stats and About */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {synchronizedStats.map((stat) => <StatCard key={stat.label} stat={stat} />)}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-400">About Me</label>
            <textarea
              className="mt-1 w-full bg-brand-gray-dark border border-brand-gray-light rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
              rows={3}
              placeholder="Software Engineer specializing in React..."
              value={about}
              onChange={(event) => setAbout(event.target.value)}
            ></textarea>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-400">Location</label>
            <input
              type="text"
              className="mt-1 w-full bg-brand-gray-dark border border-brand-gray-light rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
              placeholder="Remote"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
          </div>
          <button className="w-full sm:w-auto bg-brand-blue text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors">
            Complete Profile
          </button>
        </div>

        {/* Right Side: Recommendations */}
        <div className="bg-brand-gray-dark p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-white">Recommended for You</h3>
                <div className="flex items-center gap-3">
                  {profile?.profileUrl && (
                    <a
                      href={profile.profileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-brand-blue hover:underline"
                    >
                      View GitHub
                    </a>
                  )}
                  <button
                    onClick={() => toggleFollow(activeHandle)}
                    className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${
                      isFollowingProfile
                        ? 'border-brand-green text-brand-green'
                        : 'border-brand-blue text-brand-blue'
                    }`}
                  >
                    {isFollowingProfile ? 'Following' : 'Follow'}
                  </button>
                </div>
            </div>
            <div className="space-y-1 text-sm text-gray-400 mb-4">
              <p>{(profile?.followers ?? 3200).toLocaleString()} Followers</p>
              <p>{(profile?.following ?? 1500).toLocaleString()} Following</p>
            </div>

            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Follow Their Crowds</h4>
            <div className="flex space-x-2">
                 {RECOMMENDED_USERS.map(user => (
                    <div key={user.handle} className="text-center">
                        <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full mx-auto" />
                        <span className="text-xs text-gray-400 block mt-1">{user.name}</span>
                    </div>
                ))}
                <div className="h-10 w-10 rounded-full bg-brand-gray-light flex items-center justify-center text-xs font-bold text-white">+8</div>
            </div>
            <button
              onClick={() => toggleFollow(activeHandle)}
              className={`mt-4 w-full font-semibold py-2 px-4 rounded-lg transition-colors text-sm ${
                isFollowingProfile
                  ? 'bg-brand-green/30 text-brand-green hover:bg-brand-green/40'
                  : 'bg-brand-gray-light text-white hover:bg-gray-600'
              }`}
            >
                {isFollowingProfile ? 'Following' : 'Follow'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
