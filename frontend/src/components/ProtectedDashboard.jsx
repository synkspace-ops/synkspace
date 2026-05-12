import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { requireAuthenticatedUser } from '../lib/auth';

export default function ProtectedDashboard({ children, requiredRole }) {
  const location = useLocation();
  const [state, setState] = useState({ loading: true, allowed: false, forbidden: false });

  useEffect(() => {
    let alive = true;
    requireAuthenticatedUser().then((user) => {
      if (!alive) return;
      const hasRequiredRole = !requiredRole || String(user?.role || '').toUpperCase() === requiredRole;
      setState({ loading: false, allowed: Boolean(user) && hasRequiredRole, forbidden: Boolean(user) && !hasRequiredRole });
    });
    return () => {
      alive = false;
    };
  }, [requiredRole]);

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050B18] text-white font-semibold">
        Checking session...
      </div>
    );
  }

  if (!state.allowed) {
    if (state.forbidden) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#050B18] px-4 text-white font-semibold">
          This dashboard is available only to the SynkSpace site admin.
        </div>
      );
    }
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
