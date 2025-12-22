
import React, { useEffect, useMemo, useState } from 'react';
import type { Community } from '../types';
import { COMMUNITY_DATA, DEFAULT_GITHUB_USERNAME } from '../constants';
import { fetchGitHubRepos } from '../services/github';
import { useHubStore } from '../store/useHubStore';

const CommunityCard: React.FC<{ community: Community }> = ({ community }) => (
    <div className="bg-brand-gray-light rounded-lg overflow-hidden group">
        <img src={community.imageUrl} alt={community.name} className="h-24 w-full object-cover"/>
        <div className="p-4">
            <h4 className="text-sm font-bold text-white truncate">{community.name}</h4>
            <p className="text-xs text-gray-400 truncate mt-1">{community.description}</p>
            <div className="flex items-center justify-between mt-4">
                <div className="flex -space-x-2">
                    <img className="inline-block h-6 w-6 rounded-full ring-2 ring-brand-gray-light" src="https://i.pravatar.cc/150?img=20" alt=""/>
                    <img className="inline-block h-6 w-6 rounded-full ring-2 ring-brand-gray-light" src="https://i.pravatar.cc/150?img=21" alt=""/>
                    <img className="inline-block h-6 w-6 rounded-full ring-2 ring-brand-gray-light" src="https://i.pravatar.cc/150?img=22" alt=""/>
                </div>
                <button className="bg-brand-blue text-white text-xs font-semibold py-1 px-3 rounded-full hover:bg-blue-600 transition-colors">Join</button>
            </div>
        </div>
    </div>
);

const quickFilters = [
    { label: 'Rust', value: 'rust' },
    { label: 'Python', value: 'python' },
    { label: 'Design', value: 'design' },
];

const CommunityFinder: React.FC = () => {
    const communityQuery = useHubStore((state) => state.communityQuery);
    const setCommunityQuery = useHubStore((state) => state.setCommunityQuery);
    const communitySort = useHubStore((state) => state.communitySort);
    const setCommunitySort = useHubStore((state) => state.setCommunitySort);

    const [communities, setCommunities] = useState<Community[]>(COMMUNITY_DATA);
    const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setStatus('loading');
                const repos = await fetchGitHubRepos(DEFAULT_GITHUB_USERNAME);
                if (!mounted) return;
                if (repos.length) {
                    setCommunities(repos);
                }
                setStatus('idle');
            } catch (error) {
                console.error(error);
                if (!mounted) return;
                setStatus('error');
                setCommunities(COMMUNITY_DATA);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    const helperText = useMemo(() => {
        if (status === 'loading') return 'Syncing live repos from GitHub...';
        if (status === 'error') return 'Using fallback communities while GitHub is unavailable.';
        return 'Coles timq OnBlue! & chares.predies';
    }, [status]);

    const filteredCommunities = useMemo(() => {
        const dataset = communities.filter((community) =>
            community.name.toLowerCase().includes(communityQuery.toLowerCase()) ||
            community.description.toLowerCase().includes(communityQuery.toLowerCase())
        );

        if (communitySort === 'alphabetical') {
            return [...dataset].sort((a, b) => a.name.localeCompare(b.name));
        }

        return [...dataset].sort((a, b) => b.members - a.members);
    }, [communities, communityQuery, communitySort]);

    return (
        <div className="bg-brand-gray p-6 rounded-lg border border-brand-gray-light">
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                <h3 className="text-xl font-bold text-white">Find Your Crew?</h3>
                <div className="flex items-center space-x-2">
                    <input
                        className="bg-brand-gray-dark border border-brand-gray-light rounded-full px-4 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-blue"
                        placeholder="Search by stack or topic"
                        value={communityQuery}
                        onChange={(event) => setCommunityQuery(event.target.value)}
                    />
                    <select
                        className="bg-brand-gray-dark border border-brand-gray-light rounded-full px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-blue"
                        value={communitySort}
                        onChange={(event) => setCommunitySort(event.target.value as 'trending' | 'alphabetical')}
                    >
                        <option value="trending">Sort: Trending</option>
                        <option value="alphabetical">Sort: A-Z</option>
                    </select>
                </div>
            </div>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
                {quickFilters.map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => setCommunityQuery(filter.value)}
                        className={`text-xs font-semibold py-1 px-3 rounded-full border transition-colors ${
                            communityQuery.toLowerCase() === filter.value
                                ? 'bg-brand-blue/20 text-brand-blue border-brand-blue'
                                : 'border-brand-gray-light text-gray-300'
                        }`}
                    >
                        {filter.label}
                    </button>
                ))}
                <button
                    onClick={() => setCommunityQuery('')}
                    className="text-xs text-gray-400 hover:text-white"
                >
                    Clear filters
                </button>
            </div>
            <p className="text-sm text-gray-400 mb-6">{helperText}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredCommunities.map(community => (
                    <div key={community.name} className="relative">
                        <CommunityCard community={community} />
                        {community.url && (
                            <a
                                href={community.url}
                                target="_blank"
                                rel="noreferrer"
                                className="absolute inset-0"
                                aria-label={`Open ${community.name} on GitHub`}
                            ></a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommunityFinder;
