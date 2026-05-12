import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { apiPost } from '../lib/api';

const roleDashboardPath = {
  CREATOR: '/creator/dashboard',
  BRAND: '/brand/dashboard',
  ORGANISER: '/event/dashboard',
  ADMIN: '/admin/dashboard',
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [setupMode, setSetupMode] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const finishAuth = (response) => {
    const token = response?.data?.accessToken;
    const user = response?.data?.user;
    if (!token || !user) throw new Error('Invalid login response');
    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    const requestedPath = location.state?.from;
    const role = String(user.role || '').toUpperCase();
    navigate(requestedPath || roleDashboardPath[role] || '/dashboard', { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (setupMode && form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const response = setupMode
        ? await apiPost('/api/auth/complete-invite', { email: form.email, password: form.password })
        : await apiPost('/api/auth/login', { email: form.email, password: form.password });
      finishAuth(response);
    } catch (loginError) {
      if (loginError?.code === 'AUTH_PASSWORD_SETUP_REQUIRED') {
        setSetupMode(true);
        setForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
        setError('Create a password to accept your team invitation.');
      } else {
        setError(setupMode ? 'Could not create password. Please try again.' : 'Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 font-['Inter',sans-serif]">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white border border-slate-100 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-extrabold text-[#050B18] mb-2">{setupMode ? 'Create password' : 'Log in'}</h1>
        <p className="text-slate-500 mb-8">
          {setupMode ? 'Finish your team invitation and enter your dashboard.' : 'Access your SynkSpace dashboard.'}
        </p>

        <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          className="w-full h-12 border border-slate-200 rounded-xl px-4 mb-5 focus:outline-none focus:border-blue-500"
          required
        />

        <label className="block text-sm font-bold text-slate-700 mb-2">{setupMode ? 'New Password' : 'Password'}</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          className="w-full h-12 border border-slate-200 rounded-xl px-4 mb-5 focus:outline-none focus:border-blue-500"
          required
        />

        {setupMode && (
          <>
            <label className="block text-sm font-bold text-slate-700 mb-2">Confirm Password</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full h-12 border border-slate-200 rounded-xl px-4 mb-5 focus:outline-none focus:border-blue-500"
              required
            />
          </>
        )}

        {error && <p className="text-sm font-semibold text-red-500 mb-5">{error}</p>}

        <button disabled={loading} className="w-full h-12 bg-[#050B18] text-white rounded-xl font-bold disabled:opacity-60">
          {loading ? (setupMode ? 'Creating password...' : 'Logging in...') : (setupMode ? 'Create password and log in' : 'Log in')}
        </button>

        {setupMode ? (
          <button
            type="button"
            onClick={() => {
              setSetupMode(false);
              setError('');
              setForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
            }}
            className="mt-6 w-full text-center text-sm font-bold text-[#050B18] hover:underline"
          >
            Back to login
          </button>
        ) : (
          <p className="text-center text-sm text-slate-500 mt-6">
            New here?{' '}
            <Link to="/select-role" className="font-bold text-[#050B18] hover:underline">
              Create an account
            </Link>
          </p>
        )}
      </form>
    </div>
  );
}
