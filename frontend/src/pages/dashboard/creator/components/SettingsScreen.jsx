import { Bell, Globe, Mail, MapPin, Phone, Settings, User } from 'lucide-react';
import { useApp } from '../../shared/context/AppContext';

export function SettingsScreen() {
  const { currentUser, notifications = [] } = useApp() || {};
  const profile = currentUser?.profile || {};
  const displayName = currentUser?.name && currentUser.name.toLowerCase() !== 'pending'
    ? currentUser.name
    : currentUser?.email?.split('@')[0] || 'Creator';

  const rows = [
    ['Display Name', displayName, User],
    ['Email', currentUser?.email, Mail],
    ['Phone', [currentUser?.phoneCode, currentUser?.phone].filter(Boolean).join(' '), Phone],
    ['Location', currentUser?.location, MapPin],
    ['Niche', profile.niche, Settings],
    ['Social Handle', profile.socialHandle, Globe],
    ['Follower Range', profile.followerRange, User],
    ['Engagement Rate', profile.engagementRate != null ? `${profile.engagementRate}%` : '', Bell],
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/60 bg-white/60 p-8 shadow-xl backdrop-blur-xl">
        <div className="mb-8 flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-3xl font-bold text-white shadow-xl">
            {currentUser?.avatarUrl ? <img src={currentUser.avatarUrl} alt={displayName} className="h-full w-full object-cover" /> : displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{displayName}</h2>
            <p className="text-sm text-gray-600">{currentUser?.status || 'Profile status unavailable'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {rows.map(([label, value, Icon]) => (
            <div key={label} className="rounded-2xl border border-white/60 bg-white/60 p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                <Icon className="h-4 w-4" />
                {label}
              </div>
              <p className="font-semibold text-gray-900">{value || 'Not saved in database yet'}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/60 bg-white/60 p-8 shadow-xl backdrop-blur-xl">
        <h3 className="mb-5 text-lg font-bold text-gray-900">Database Notifications</h3>
        {notifications.length ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="rounded-2xl border border-white/60 bg-white/60 p-4">
                <p className="font-bold text-gray-900">{notification.title}</p>
                <p className="mt-1 text-sm text-gray-600">{notification.body}</p>
                <p className="mt-2 text-xs font-semibold text-gray-500">{notification.time}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/60 bg-white/50 p-6 text-center text-sm text-gray-600">
            No notification records exist for this creator yet.
          </div>
        )}
      </section>
    </div>
  );
}
