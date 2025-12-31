import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProfileSetup from './components/ProfileSetup';
import CommunityFinder from './components/CommunityFinder';
import MemberFinder from './components/MemberFinder';
import ModerationPanel from './components/ModerationPanel';
import ActivityChart from './components/ActivityChart';
import Register from './components/Register';
import Login from './components/Login';
import { ParticleTextEffect } from './components/ParticleTextEffect';
import { useHubStore } from './store/useHubStore';

const App: React.FC = () => {
  const isAuthenticated = useHubStore((state) => state.isAuthenticated);
  const fetchCurrentUser = useHubStore((state) => state.fetchCurrentUser);
  const [hydrated, setHydrated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Ensure Zustand persistence is loaded before rendering
  useEffect(() => {
    const load = async () => {
      await fetchCurrentUser(); // optional: fetch user from API if token exists
      setHydrated(true);
    };
    load();
  }, [fetchCurrentUser]);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // Show Login or Register if user is not authenticated
  if (!isAuthenticated) {
    return showRegister ? (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-dark p-4">
        <Register />
        <p className="text-xs text-center text-gray-500 mt-2">
          Already have an account?{' '}
          <button
            onClick={() => setShowRegister(false)}
            className="underline text-brand-yellow"
          >
            Login
          </button>
        </p>
      </div>
    ) : (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-dark p-4">
        <Login />
        <p className="text-xs text-center text-gray-500 mt-2">
          Need an account?{' '}
          <button
            onClick={() => setShowRegister(true)}
            className="underline text-brand-yellow"
          >
            Register
          </button>
        </p>
      </div>
    );
  }

  // Main authenticated dashboard UI
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
