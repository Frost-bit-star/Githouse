import React, { useEffect, useMemo } from 'react';
import { useHubStore } from '../store/useHubStore';
import type { User } from '../types';

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
    const {
        members,
        fetchMembers,
        memberQuery,
        setMemberQuery,
        memberSort,
        setMemberSort,
        followedHandles,
        toggleFollow,
    } = useHubStore((state) => ({
        members: state.members,
        fetchMembers: state.fetchMembers,
        memberQuery: state.memberQuery,
        setMemberQuery: state.setMemberQuery,
        memberSort: state.memberSort,
        setMemberSort: state.setMemberSort,
        followedHandles: state.followedHandles,
        toggleFollow: state.toggleFollow,
    }));

    useEffect(() => {
        fetchMembers(memberQuery);
    }, [fetchMembers, memberQuery]);

    const displayedMembers = useMemo(() => {
        const dataset = memberQuery.trim() ? members : members; // backend already has all members
        const filtered = dataset.filter(
            (user) =>
                user.name.toLowerCase().includes(memberQuery.toLowerCase()) ||
                user.role.toLowerCase().includes(memberQuery.toLowerCase())
        );

        return filtered.sort((a, b) => {
            if (memberSort === 'followers') {
                return (b.followers ?? 0) - (a.followers ?? 0);
            }
            return a.name.localeCompare(b.name);
        });
    }, [members, memberQuery, memberSort]);

    const helperText = useMemo(() => {
        if (!members.length) return 'Loading members...';
        return 'Browse members & filter by role';
    }, [members]);

    return (
        <div className="bg-brand-gray p-6 rounded-lg border border-brand-gray-light">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Project & Filter Members</h3>
                <div className="flex items-center space-x-2">
                    <input
                        className="bg-brand-gray-dark border border-brand-gray-light rounded-full px-4 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-blue"
                        placeholder="Search roles (e.g. Next.js)"
                        value={memberQuery}
                        onChange={(e) => setMemberQuery(e.target.value)}
                    />
                    <select
                        className="bg-brand-gray-dark border border-brand-gray-light rounded-full px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-blue"
                        value={memberSort}
                        onChange={(e) => setMemberSort(e.target.value as 'followers' | 'alphabetical')}
                    >
                        <option value="followers">Sort: Followers</option>
                        <option value="alphabetical">Sort: A-Z</option>
                    </select>
                    <button
                        onClick={() => setMemberQuery('nextjs')}
                        className="bg-brand-blue/20 text-brand-blue text-sm font-semibold py-1 px-3 rounded-full"
                    >
                        Quick: Next.js
                    </button>
                </div>
            </div>
            <p className="text-sm text-gray-400 mb-6">{helperText}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {displayedMembers.map((user) => (
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
                                aria-label={`Open ${user.name} profile`}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MemberFinder;
