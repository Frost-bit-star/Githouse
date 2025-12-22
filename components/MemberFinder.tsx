
import React, { useEffect, useMemo, useState } from 'react';
import type { User } from '../types';
import { DEFAULT_MEMBER_QUERY, MEMBER_DATA } from '../constants';
import { searchGitHubUsers } from '../services/github';
import { useHubStore } from '../store/useHubStore';

const MemberCard: React.FC<{ user: User; isFollowing: boolean; onToggleFollow: () => void }> = ({ user, isFollowing, onToggleFollow }) => (
    <div className="bg-brand-gray-light rounded-lg overflow-hidden group text-center p-4">
        <img src={user.avatarUrl} alt={user.name} className="h-16 w-16 rounded-full mx-auto mb-3 ring-2 ring-brand-gray"/>
        <h4 className="text-sm font-bold text-white truncate">{user.name}</h4>
        <p className="text-xs text-gray-400 truncate mt-1">{user.role}</p>
        {typeof user.followers === 'number' && (
            <p className="text-[11px] text-gray-500 mt-1">{user.followers.toLocaleString()} followers</p>
        )}
        <button
            onClick={onToggleFollow}
            className={`mt-4 w-full text-xs font-semibold py-1.5 px-3 rounded-full transition-colors ${
                isFollowing ? 'bg-brand-green/30 text-brand-green hover:bg-brand-green/40' : 'bg-brand-green/20 text-brand-green hover:bg-brand-green/40'
            }`}
        >
            {isFollowing ? 'Following' : 'Follow'}
        </button>
    </div>
);

const MemberFinder: React.FC = () => {
    const memberQuery = useHubStore((state) => state.memberQuery);
    const setMemberQuery = useHubStore((state) => state.setMemberQuery);
    const memberSort = useHubStore((state) => state.memberSort);
    const setMemberSort = useHubStore((state) => state.setMemberSort);
    const followedHandles = useHubStore((state) => state.followedHandles);
    const toggleFollow = useHubStore((state) => state.toggleFollow);

    const [members, setMembers] = useState<User[]>(MEMBER_DATA);
    const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

    useEffect(() => {
        let mounted = true;
        const run = setTimeout(async () => {
            if (!memberQuery.trim()) return;
            try {
                setStatus('loading');
                const users = await searchGitHubUsers(memberQuery.trim());
                if (!mounted) return;
                if (users.length) {
                    setMembers(users);
                }
                setStatus('idle');
            } catch (error) {
                console.error(error);
                if (!mounted) return;
                setStatus('error');
                setMembers(MEMBER_DATA);
            }
        }, 400);

        return () => {
            mounted = false;
            clearTimeout(run);
        };
    }, [memberQuery]);

    const helperText = useMemo(() => {
        if (status === 'loading') return 'Searching GitHub talent...';
        if (status === 'error') return 'Showing featured members while GitHub is offline.';
        return 'Ritavi per piamed as regies';
    }, [status]);

    const displayedMembers = useMemo(() => {
        const dataset = memberQuery.trim() ? members : MEMBER_DATA;
        const filtered = dataset.filter((user) =>
            user.name.toLowerCase().includes(memberQuery.toLowerCase()) ||
            user.role.toLowerCase().includes(memberQuery.toLowerCase())
        );

        return filtered.sort((a, b) => {
            if (memberSort === 'followers') {
                return (b.followers ?? 0) - (a.followers ?? 0);
            }
            return a.name.localeCompare(b.name);
        });
    }, [memberQuery, memberSort, members]);

    return (
        <div className="bg-brand-gray p-6 rounded-lg border border-brand-gray-light">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Project & Filter Members</h3>
                 <div className="flex items-center space-x-2">
                    <input
                        className="bg-brand-gray-dark border border-brand-gray-light rounded-full px-4 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-blue"
                        placeholder="Search GitHub roles (e.g. Next.js)"
                        value={memberQuery}
                        onChange={(event) => setMemberQuery(event.target.value)}
                    />
                    <select
                        className="bg-brand-gray-dark border border-brand-gray-light rounded-full px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-blue"
                        value={memberSort}
                        onChange={(event) => setMemberSort(event.target.value as 'followers' | 'alphabetical')}
                    >
                        <option value="followers">Sort: Followers</option>
                        <option value="alphabetical">Sort: A-Z</option>
                    </select>
                    <button
                        onClick={() => setMemberQuery('nextjs maintainer')}
                        className="bg-brand-blue/20 text-brand-blue text-sm font-semibold py-1 px-3 rounded-full"
                    >
                        Quick: Next.js
                    </button>
                </div>
            </div>
            <p className="text-sm text-gray-400 mb-6">{helperText}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {displayedMembers.map(user => (
                    <div key={user.handle} className="relative">
                        <MemberCard
                            user={user}
                            isFollowing={Boolean(followedHandles[user.handle])}
                            onToggleFollow={() => toggleFollow(user.handle)}
                        />
                        {user.profileUrl && (
                            <a
                                href={user.profileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="absolute inset-0"
                                aria-label={`Open ${user.name} on GitHub`}
                            ></a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MemberFinder;
