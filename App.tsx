
import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProfileSetup from './components/ProfileSetup';
import CommunityFinder from './components/CommunityFinder';
import MemberFinder from './components/MemberFinder';
import ModerationPanel from './components/ModerationPanel';
import ActivityChart from './components/ActivityChart';
import Login from './components/Login';
import { ParticleTextEffect } from './components/ParticleTextEffect';
import { useHubStore } from './store/useHubStore';

const App: React.FC = () => {
  const isAuthenticated = useHubStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="relative flex h-screen bg-brand-dark font-sans overflow-hidden">
      <ParticleTextEffect className="opacity-80" />
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-y-auto relative z-10">
        <Header />
        <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <ProfileSetup />
          </div>
          <CommunityFinder />
          <MemberFinder />
          <ModerationPanel />
          <ActivityChart />
        </div>
      </main>
    </div>
  );
};

export default App;
