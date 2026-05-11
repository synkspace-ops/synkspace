import { Home, PlusCircle, Search, FileText, Megaphone, MessageCircle, BarChart3, CreditCard, Settings, ChevronDown, CalendarDays, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';


export function Sidebar({ currentPage, onNavigate }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser } = useApp();
  
  const storedName = currentUser?.name?.trim();
  const displayName = storedName && storedName.toLowerCase() !== 'pending' ? storedName : currentUser?.companyName || 'User';
  const displayEmail = currentUser?.email || '';
  const avatarUrl = currentUser?.avatarUrl || '';

  const menuGroup = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'create-campaign', label: 'Create Campaign', icon: PlusCircle },
    { id: 'discover', label: 'Discover Creators', icon: Search },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    { id: 'events', label: 'Events', icon: CalendarDays },
  ];

  const otherGroup = [
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavigate = (id) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  const NavItems = ({ items, label }) => (
    <div>
      <h2 className="text-white/60 text-xs uppercase tracking-wider mb-3 px-3 font-semibold">{label}</h2>
      <nav className="space-y-1.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[14px] transition-all text-sm font-medium ${
                isActive
                  ? 'bg-white/20 text-white backdrop-blur-md shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* ===== Mobile Top Bar ===== */}
      <div className="lg:hidden flex items-center justify-between px-5 py-4 sticky top-0 z-40 bg-[#5A7684]/60 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.686 2 6 4.686 6 8c0 3.314 2.686 6 6 6s6-2.686 6-6c0-3.314-2.686-6-6-6zm0 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white tracking-wide">synkspace</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* ===== Mobile Drawer Overlay ===== */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          onClick={() => setMobileOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Drawer */}
          <aside
            className="relative w-[280px] max-w-[85vw] h-full flex flex-col bg-gradient-to-br from-[#5A7684] via-[#729297] to-[#8fa5ac] shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <div className="flex items-center justify-between pt-6 pb-4 px-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.686 2 6 4.686 6 8c0 3.314 2.686 6 6 6s6-2.686 6-6c0-3.314-2.686-6-6-6zm0 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-white tracking-wide">synkspace</h1>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 px-4 py-2 flex flex-col gap-6">
              <NavItems items={menuGroup} label="Menu" />
              <NavItems items={otherGroup} label="Other" />
            </div>

            {/* Profile */}
            <div className="p-4 mb-2">
              <button className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all border border-white/10 group">
                <div className="flex items-center gap-3">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-9 h-9 rounded-full object-cover border border-white/20"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-white/20 border border-white/20 flex items-center justify-center text-white font-bold">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white leading-tight">{displayName}</p>
                    <p className="text-[11px] text-white/60">{displayEmail}</p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-white/50" />
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ===== Desktop Sidebar ===== */}
      <aside className="hidden lg:flex w-[240px] flex-col h-screen sticky top-0 font-sans z-20">
        {/* Logo */}
        <div className="pt-8 pb-6 px-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.686 2 6 4.686 6 8c0 3.314 2.686 6 6 6s6-2.686 6-6c0-3.314-2.686-6-6-6zm0 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">synkspace</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-6">
          <NavItems items={menuGroup} label="Menu" />
          <NavItems items={otherGroup} label="Other" />
        </div>

        {/* Profile Section */}
        <div className="p-4 mt-auto mb-4">
          <button className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all border border-white/10 group">
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-9 h-9 rounded-full object-cover border border-white/20"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-white/20 border border-white/20 flex items-center justify-center text-white font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="text-left">
                <p className="text-sm font-semibold text-white leading-tight group-hover:text-white">{displayName}</p>
                <p className="text-[11px] text-white/60">{displayEmail}</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-white/50" />
          </button>
        </div>
      </aside>
    </>
  );
}
