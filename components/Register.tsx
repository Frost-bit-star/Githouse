import React, { useState } from 'react';
import { useHubStore } from '../store/useHubStore';

const Register: React.FC = () => {
  const register = useHubStore((state) => state.register);
  const [formState, setFormState] = useState({
    displayName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Basic frontend validation
    if (!formState.displayName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formState.username.trim()) {
      setError('Please enter your GitHub username.');
      return;
    }
    if (!formState.email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    if (!formState.password) {
      setError('Please enter a password.');
      return;
    }
    if (formState.password !== formState.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await register({
        displayName: formState.displayName.trim(),
        username: formState.username.trim(),
        email: formState.email.trim(),
        password: formState.password,
        confirmPassword: formState.confirmPassword,
      });
      setError(null);
      setSuccess('Registration successful! You are now logged in.');
    } catch (err: any) {
      setError(err?.message || 'Registration failed.');
      setSuccess(null);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-brand-gray-light/40 border border-brand-yellow/40 rounded-2xl shadow-[0_15px_45px_rgba(0,0,0,0.45)] backdrop-blur-lg p-8 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brand-yellow">Salamander Tech Hub</p>
          <h1 className="text-2xl font-bold text-white mt-2">Create your Salamander identity</h1>
          <p className="text-sm text-gray-400 mt-1">Fill in your details to register and join the hub.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-300 mb-1" htmlFor="displayName">Full name</label>
            <input
              id="displayName"
              value={formState.displayName}
              onChange={(e) => setFormState((prev) => ({ ...prev, displayName: e.target.value }))}
              placeholder="e.g. Jane Doe"
              className="w-full bg-brand-ink border border-brand-gray-light rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1" htmlFor="username">GitHub username</label>
            <input
              id="username"
              value={formState.username}
              onChange={(e) => setFormState((prev) => ({ ...prev, username: e.target.value }))}
              placeholder="e.g. vercel"
              className="w-full bg-brand-ink border border-brand-gray-light rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={formState.email}
              onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="you@gmail.com"
              className="w-full bg-brand-ink border border-brand-gray-light rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={formState.password}
              onChange={(e) => setFormState((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="Password123!"
              className="w-full bg-brand-ink border border-brand-gray-light rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1" htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={formState.confirmPassword}
              onChange={(e) => setFormState((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Password123!"
              className="w-full bg-brand-ink border border-brand-gray-light rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>

          {error && <p className="text-xs text-brand-red">{error}</p>}
          {success && <p className="text-xs text-green-400">{success}</p>}

          <button
            type="submit"
            className="w-full bg-brand-yellow text-brand-ink font-semibold py-2 rounded-lg transition-transform hover:-translate-y-0.5"
          >
            Register
          </button>
        </form>

        <p className="text-xs text-center text-gray-500 mt-4">
          Already have an account? <a href="/login" className="text-brand-yellow">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
