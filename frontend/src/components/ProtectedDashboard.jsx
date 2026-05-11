import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { requireAuthenticatedUser } from '../lib/auth';

export default function ProtectedDashboard({ children }) {
  const location = useLocation();
  const [state, setState] = useState({ loading: true, allowed: false });

  useEffect(() => {
    let alive = true;
    requireAuthenticatedUser().then((user) => {
      if (!alive) return;
      setState({ loading: false, allowed: Boolean(user) });
    });
    return () => {
      alive = false;
    };
  }, []);

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050B18] text-white font-semibold">
        Checking session...
      </div>
    );
  }

  if (!state.allowed) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return children;
}
