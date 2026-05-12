import {
  Bell,
  Camera,
  Check,
  DollarSign,
  Globe,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Save,
  Shield,
  User,
  Video,
  Wallet,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuthSession } from '../../../../lib/auth';
import { useApp } from '../../shared/context/AppContext';

const emptyForm = {
  displayName: '',
  email: '',
  phone: '',
  city: '',
  state: '',
  country: '',
  bio: '',
  niche: '',
  socialHandle: '',
  youtube: '',
  linkedin: '',
  website: '',
  followerRange: '',
  engagementRate: '',
  rateReel: '',
  rateStory: '',
  rateEvent: '',
  avatarUrl: '',
};

const MAX_AVATAR_DATA_URL_LENGTH = 900_000;
const AVATAR_EXPORTS = [
  { maxSize: 512, quality: 0.78, type: 'image/webp' },
  { maxSize: 384, quality: 0.72, type: 'image/webp' },
  { maxSize: 320, quality: 0.66, type: 'image/webp' },
  { maxSize: 256, quality: 0.62, type: 'image/webp' },
  { maxSize: 256, quality: 0.7, type: 'image/jpeg' },
];

const sections = [
  ['profile', 'Profile', User],
  ['social', 'Social Accounts', Globe],
  ['rates', 'Pricing & Rates', DollarSign],
  ['notifications', 'Notifications', Bell],
  ['account', 'Account', Shield],
];

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Unable to read image.'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Unable to load image.'));
    image.src = src;
  });
}

async function compressImage(file) {
  const source = await readImageFile(file);
  const image = await loadImage(source);

  for (const option of AVATAR_EXPORTS) {
    const scale = Math.min(1, option.maxSize / Math.max(image.width, image.height));
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Unable to prepare image.');
    ctx.drawImage(image, 0, 0, width, height);
    const dataUrl = canvas.toDataURL(option.type, option.quality);
    if (dataUrl.length <= MAX_AVATAR_DATA_URL_LENGTH) return dataUrl;
  }

  throw new Error('Profile picture is too large. Please upload a smaller image.');
}

function buildForm(currentUser) {
  const profile = currentUser?.profile || {};
  return {
    ...emptyForm,
    displayName: currentUser?.name && currentUser.name.toLowerCase() !== 'pending' ? currentUser.name : '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || profile.phone || '',
    city: profile.city || '',
    state: profile.state || '',
    country: profile.country || '',
    bio: profile.bio || '',
    niche: profile.niche || '',
    socialHandle: profile.socialHandle || '',
    youtube: profile.youtube || '',
    linkedin: profile.linkedin || '',
    website: profile.website || '',
    followerRange: profile.followerRange || '',
    engagementRate: profile.engagementRate ?? '',
    rateReel: profile.rateReel || '',
    rateStory: profile.rateStory || '',
    rateEvent: profile.rateEvent || '',
    avatarUrl: currentUser?.avatarUrl || profile.avatarUrl || '',
  };
}

export function SettingsScreen() {
  const app = useApp() || {};
  const navigate = useNavigate();
  const { currentUser, notifications = [], updateProfile } = app;
  const [activeSection, setActiveSection] = useState('profile');
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [savingImage, setSavingImage] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(buildForm(currentUser));
  }, [currentUser]);

  const displayName = form.displayName || currentUser?.email?.split('@')[0] || 'Creator';
  const initials = displayName
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const completion = useMemo(() => {
    const fields = [
      form.displayName,
      form.phone,
      form.city || form.state || form.country,
      form.avatarUrl,
      form.bio,
      form.niche,
      form.socialHandle,
      form.followerRange,
      form.engagementRate,
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [form]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
    setSaveMessage('');
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Profile picture must be 5MB or smaller.');
      return;
    }

    setError('');
    setSaveMessage('');
    setSavingImage(true);
    const previousAvatar = form.avatarUrl;
    try {
      const avatarUrl = await compressImage(file);
      setForm((prev) => ({ ...prev, avatarUrl }));
      await updateProfile({ avatarUrl });
      setSaveMessage('Profile picture updated.');
    } catch (uploadError) {
      setForm((prev) => ({ ...prev, avatarUrl: previousAvatar }));
      setError(uploadError?.message || 'Could not save this image. Try another file.');
    } finally {
      setSavingImage(false);
      event.target.value = '';
    }
  };

  const handleSave = async () => {
    if (!form.displayName.trim()) {
      setError('Display name is required.');
      return;
    }

    setSaving(true);
    setError('');
    setSaveMessage('');
    try {
      await updateProfile({
        displayName: form.displayName.trim(),
        phone: form.phone.trim() || null,
        city: form.city.trim() || null,
        state: form.state.trim(),
        country: form.country.trim() || null,
        bio: form.bio.trim() || null,
        niche: form.niche.trim(),
        socialHandle: form.socialHandle.trim(),
        youtube: form.youtube.trim() || null,
        linkedin: form.linkedin.trim() || null,
        website: form.website.trim() || null,
        followerRange: form.followerRange || undefined,
        engagementRate: form.engagementRate === '' ? null : Number(form.engagementRate),
        rateReel: form.rateReel.trim() || null,
        rateStory: form.rateStory.trim() || null,
        rateEvent: form.rateEvent.trim() || null,
        avatarUrl: form.avatarUrl || null,
      });
      setSaveMessage('Profile saved.');
    } catch (saveError) {
      setError(saveError?.message || 'Could not save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login', { replace: true });
  };

  return (
    <div className="space-y-6">
      {saveMessage && (
        <div className="fixed right-8 top-24 z-50 flex items-center gap-3 rounded-2xl border border-white/60 bg-emerald-500/90 px-5 py-4 text-white shadow-2xl backdrop-blur-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
            <Check className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="font-bold">Changes saved</p>
            <p className="text-sm text-white/90">{saveMessage}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <aside className="xl:col-span-3 rounded-3xl border border-white/50 bg-white/60 p-5 shadow-xl backdrop-blur-xl">
          <div className="mb-5 flex items-center gap-4 rounded-2xl bg-white/60 p-4 shadow-sm">
            <Avatar avatarUrl={form.avatarUrl} initials={initials} size="h-16 w-16" />
            <div className="min-w-0">
              <p className="truncate font-black text-gray-950">{displayName}</p>
              <p className="truncate text-xs font-semibold text-gray-500">{form.email}</p>
              <p className="mt-1 text-xs font-bold text-purple-700">{completion}% complete</p>
            </div>
          </div>

          <div className="space-y-2">
            {sections.map(([id, label, Icon]) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-semibold transition ${
                  activeSection === id
                    ? 'border border-white/70 bg-white/80 text-gray-950 shadow-lg'
                    : 'text-gray-600 hover:bg-white/50 hover:text-gray-950'
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            ))}
          </div>
        </aside>

        <main className="xl:col-span-9 space-y-6">
          {activeSection === 'profile' && (
            <GlassPanel>
              <div className="mb-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-gray-950">Profile Information</h2>
                  <p className="mt-1 text-sm text-gray-600">Edit the details that brands see on your creator profile.</p>
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving || savingImage}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 px-5 py-3 font-bold text-white shadow-xl transition hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Changes
                </button>
              </div>

              <div className="mb-7 flex flex-col gap-5 rounded-3xl border border-white/60 bg-white/50 p-5 shadow-sm md:flex-row md:items-center">
                <Avatar avatarUrl={form.avatarUrl} initials={initials} size="h-24 w-24" />
                <div className="flex-1">
                  <p className="font-bold text-gray-950">Profile picture</p>
                  <p className="mt-1 text-sm text-gray-600">Upload JPG, PNG, or WebP. The image is compressed and saved to your creator profile.</p>
                  <label className={`mt-4 inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/60 bg-white/80 px-5 py-3 text-sm font-bold text-gray-800 shadow-lg transition hover:scale-105 ${savingImage ? 'pointer-events-none opacity-70' : ''}`}>
                    {savingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                    {savingImage ? 'Uploading...' : 'Change Photo'}
                    <input type="file" accept="image/*" disabled={savingImage} className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Full Name" value={form.displayName} onChange={(value) => updateField('displayName', value)} icon={User} />
                <Field label="Email" value={form.email} icon={Mail} disabled />
                <Field label="Phone" value={form.phone} onChange={(value) => updateField('phone', value)} icon={Phone} />
                <Field label="Niche" value={form.niche} onChange={(value) => updateField('niche', value)} icon={Globe} />
                <Field label="City" value={form.city} onChange={(value) => updateField('city', value)} icon={MapPin} />
                <Field label="State" value={form.state} onChange={(value) => updateField('state', value)} icon={MapPin} />
                <Field label="Country" value={form.country} onChange={(value) => updateField('country', value)} icon={MapPin} />
                <label>
                  <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-600">Follower Range</span>
                  <select
                    value={form.followerRange}
                    onChange={(event) => updateField('followerRange', event.target.value)}
                    className="w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 font-semibold text-gray-950 shadow-md outline-none focus:ring-2 focus:ring-purple-300"
                  >
                    <option value="">Select range</option>
                    <option value="1k-10k">1k-10k</option>
                    <option value="10k-50k">10k-50k</option>
                    <option value="50k-200k">50k-200k</option>
                    <option value="200k-1m">200k-1m</option>
                    <option value="1m+">1m+</option>
                  </select>
                </label>
                <Field label="Engagement Rate (%)" type="number" value={form.engagementRate} onChange={(value) => updateField('engagementRate', value)} icon={Bell} />
                <label className="md:col-span-2">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-600">Bio</span>
                  <textarea
                    rows={5}
                    value={form.bio}
                    onChange={(event) => updateField('bio', event.target.value)}
                    className="w-full resize-none rounded-xl border border-white/60 bg-white/80 px-4 py-3 font-medium text-gray-950 shadow-md outline-none focus:ring-2 focus:ring-purple-300"
                    placeholder="Tell brands what you create, who your audience is, and what makes your content work."
                  />
                </label>
              </div>
            </GlassPanel>
          )}

          {activeSection === 'social' && (
            <GlassPanel>
              <h2 className="text-2xl font-black text-gray-950">Social Accounts</h2>
              <p className="mt-1 text-sm text-gray-600">Keep your discovery and campaign details current.</p>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Instagram Handle" value={form.socialHandle} onChange={(value) => updateField('socialHandle', value)} icon={Camera} placeholder="@yourhandle" />
                <Field label="YouTube" value={form.youtube} onChange={(value) => updateField('youtube', value)} icon={Video} placeholder="https://youtube.com/..." />
                <Field label="LinkedIn" value={form.linkedin} onChange={(value) => updateField('linkedin', value)} icon={Globe} placeholder="https://linkedin.com/in/..." />
                <Field label="Website" value={form.website} onChange={(value) => updateField('website', value)} icon={Globe} placeholder="https://..." />
              </div>
              <SaveRow saving={saving || savingImage} onSave={handleSave} />
            </GlassPanel>
          )}

          {activeSection === 'rates' && (
            <GlassPanel>
              <h2 className="text-2xl font-black text-gray-950">Pricing & Rates</h2>
              <p className="mt-1 text-sm text-gray-600">These rates are stored with your profile and can guide campaign discussions.</p>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <Field label="Instagram Reel" value={form.rateReel} onChange={(value) => updateField('rateReel', value)} icon={Wallet} placeholder="25000" />
                <Field label="Story" value={form.rateStory} onChange={(value) => updateField('rateStory', value)} icon={Wallet} placeholder="8000" />
                <Field label="Event Appearance" value={form.rateEvent} onChange={(value) => updateField('rateEvent', value)} icon={Wallet} placeholder="75000" />
              </div>
              <SaveRow saving={saving || savingImage} onSave={handleSave} />
            </GlassPanel>
          )}

          {activeSection === 'notifications' && (
            <GlassPanel>
              <h2 className="text-2xl font-black text-gray-950">Database Notifications</h2>
              <p className="mt-1 text-sm text-gray-600">Only notifications stored in the database are shown here.</p>
              <div className="mt-6 space-y-3">
                {notifications.length ? notifications.map((notification) => (
                  <div key={notification.id} className="rounded-2xl border border-white/60 bg-white/60 p-4 shadow-sm">
                    <p className="font-bold text-gray-950">{notification.title}</p>
                    <p className="mt-1 text-sm text-gray-600">{notification.body}</p>
                    <p className="mt-2 text-xs font-semibold text-gray-500">{notification.time}</p>
                  </div>
                )) : (
                  <div className="rounded-2xl border border-white/60 bg-white/50 p-6 text-center text-sm font-semibold text-gray-600">
                    No notification records exist for this creator yet.
                  </div>
                )}
              </div>
            </GlassPanel>
          )}

          {activeSection === 'account' && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <GlassPanel>
                <h2 className="text-xl font-black text-gray-950">Account Security</h2>
                <p className="mt-2 text-sm text-gray-600">Password changes and two-factor controls can be added here when auth settings are expanded.</p>
                <div className="mt-5 rounded-2xl border border-white/60 bg-white/60 p-4">
                  <p className="font-bold text-gray-950">{form.email}</p>
                  <p className="mt-1 text-sm text-gray-600">Signed in creator account</p>
                </div>
              </GlassPanel>
              <GlassPanel>
                <h2 className="text-xl font-black text-gray-950">Session</h2>
                <p className="mt-2 text-sm text-gray-600">Use this when you want to leave the dashboard on this device.</p>
                <button
                  onClick={handleLogout}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-5 py-3 font-bold text-red-600 shadow-sm transition hover:bg-red-100"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </GlassPanel>
            </div>
          )}

          {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}
        </main>
      </div>
    </div>
  );
}

function Avatar({ avatarUrl, initials, size }) {
  return (
    <div className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-2xl font-black text-white shadow-xl`}>
      {avatarUrl ? <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" /> : initials}
    </div>
  );
}

function GlassPanel({ children }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/60 p-6 shadow-xl backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/35 via-transparent to-transparent" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-purple-200/25 blur-3xl" />
      <div className="relative">{children}</div>
    </section>
  );
}

function Field({ label, value, onChange, icon: Icon, type = 'text', placeholder = '', disabled = false }) {
  return (
    <label>
      <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-600">{label}</span>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type={type}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-white/60 bg-white/80 py-3 pl-11 pr-4 font-semibold text-gray-950 shadow-md outline-none focus:ring-2 focus:ring-purple-300 disabled:text-gray-500"
        />
      </div>
    </label>
  );
}

function SaveRow({ saving, onSave }) {
  return (
    <div className="mt-6 flex justify-end">
      <button
        onClick={onSave}
        disabled={saving}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 px-5 py-3 font-bold text-white shadow-xl transition hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save Changes
      </button>
    </div>
  );
}
