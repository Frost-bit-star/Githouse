import React, { useState } from 'react';
import { useHubStore } from '../store/useHubStore';

const Login: React.FC = () => {
  const login = useHubStore((state) => state.login);
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!formState.email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    if (!formState.password) {
      setError('Please enter your password.');
      return;
    }

    try {
      setLoading(true);
      await login({ email: formState.email.trim(), password: formState.password });
      setLoading(false);
      // Optionally redirect or show success
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-brand-gray-light/40 border border-brand-yellow/40 rounded-2xl shadow-[0_15px_45px_rgba(0,0,0,0.45)] backdrop-blur-lg p-8 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brand-yellow">Salamander Tech Hub</p>
          <h1 className="text-2xl font-bold text-white mt-2">Sign in to your account</h1>
          <p className="text-sm text-gray-400 mt-1">Enter your email and password to continue.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-300 mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={formState.email}
              onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
              placeholder="you@example.com"
              className="w-full bg-brand-ink border border-brand-gray-light rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={formState.password}
              onChange={(e) => setFormState(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Your password"
              className="w-full bg-brand-ink border border-brand-gray-light rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>

          {error && <p className="text-xs text-brand-red">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-yellow text-brand-ink font-semibold py-2 rounded-lg transition-transform hover:-translate-y-0.5"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-xs text-center text-gray-500">
          Need an account? Register in the signup page.
        </p>
      </div>
    </div>
  );
};

export default Login;
