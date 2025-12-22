import React, { useState } from 'react';
import { useHubStore } from '../store/useHubStore';

const providers = [
  {
    label: 'Use GitHub Starter (Octocat)',
    demo: { displayName: 'Monalisa Octocat', username: 'octocat', email: 'octocat@example.com' },
  },
  {
    label: 'Use Gmail Starter (Next Dev)',
    demo: { displayName: 'Next Dev', username: 'next-dev', email: 'dev@gmail.com' },
  },
];

const Login: React.FC = () => {
  const login = useHubStore((state) => state.login);
  const [formState, setFormState] = useState({ displayName: '', username: '', email: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formState.displayName.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!formState.username.trim()) {
      setError('Please enter your GitHub username.');
      return;
    }
    if (!formState.email.includes('@')) {
      setError('Please enter a valid email (e.g., your Gmail).');
      return;
    }

    login({
      displayName: formState.displayName.trim(),
      username: formState.username.trim(),
      email: formState.email.trim(),
    });
  };

  const handleProvider = (displayName: string, username: string, email: string) => {
    login({ displayName, username, email });
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-brand-gray-light/40 border border-brand-yellow/40 rounded-2xl shadow-[0_15px_45px_rgba(0,0,0,0.45)] backdrop-blur-lg p-8 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brand-yellow">Salamander Tech Hub</p>
          <h1 className="text-2xl font-bold text-white mt-2">Create your Salamander identity</h1>
          <p className="text-sm text-gray-400 mt-1">Name + GitHub username + Gmail = your personalized hub.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1" htmlFor="displayName">Full name</label>
              <input
                id="displayName"
                value={formState.displayName}
                onChange={(event) => setFormState((prev) => ({ ...prev, displayName: event.target.value }))}
                placeholder="e.g. Jane Doe"
                className="w-full bg-brand-ink border border-brand-gray-light rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1" htmlFor="username">GitHub username</label>
              <input
                id="username"
                value={formState.username}
                onChange={(event) => setFormState((prev) => ({ ...prev, username: event.target.value }))}
                placeholder="e.g. vercel"
                className="w-full bg-brand-ink border border-brand-gray-light rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1" htmlFor="email">Email (Gmail preferred)</label>
            <input
              id="email"
              type="email"
              value={formState.email}
              onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="you@gmail.com"
              className="w-full bg-brand-ink border border-brand-gray-light rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>

          {error && <p className="text-xs text-brand-red">{error}</p>}

          <button
            type="submit"
            className="w-full bg-brand-yellow text-brand-ink font-semibold py-2 rounded-lg transition-transform hover:-translate-y-0.5"
          >
            Sign in
          </button>
        </form>

        <div className="space-y-2">
          {providers.map((provider) => (
            <button
              key={provider.label}
              onClick={() => handleProvider(provider.demo.displayName, provider.demo.username, provider.demo.email)}
              className="w-full bg-brand-ink border border-brand-gray-light text-gray-200 text-sm font-medium py-2 rounded-lg hover:bg-brand-gray-light transition-colors"
            >
              {provider.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-center text-gray-500">
          This is a demo experience.
        </p>
      </div>
    </div>
  );
};

export default Login;
