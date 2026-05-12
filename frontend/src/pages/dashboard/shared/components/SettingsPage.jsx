import { Building2, Briefcase, Check, Loader2, Mail, Save, Trash2, Upload, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';

const emptyProfile = {
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  website: '',
  industry: '',
  location: '',
  description: '',
  avatarUrl: '',
};

const AVATAR_EXPORTS = [
  { maxSize: 512, quality: 0.78, type: 'image/webp' },
  { maxSize: 384, quality: 0.72, type: 'image/webp' },
  { maxSize: 256, quality: 0.7, type: 'image/webp' },
  { maxSize: 256, quality: 0.72, type: 'image/jpeg' },
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
    if (dataUrl.length <= 900_000) return dataUrl;
  }
  throw new Error('Logo is too large. Please upload a smaller image.');
}

function buildProfile(currentUser) {
  const profile = currentUser?.profile || {};
  const isOrganiser = String(currentUser?.role || '').toLowerCase() === 'organiser';
  return {
    ...emptyProfile,
    companyName: currentUser?.companyName || profile.companyName || profile.orgName || '',
    contactName: profile.founderName || profile.contactName || currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || profile.phone || '',
    website: currentUser?.website || profile.website || '',
    industry: currentUser?.industry || profile.industry || profile.eventType || '',
    location: currentUser?.location || profile.location || [profile.city, profile.state, profile.country].filter(Boolean).join(', '),
    description: currentUser?.description || profile.description || '',
    avatarUrl: currentUser?.avatarUrl || profile.avatarUrl || '',
    isOrganiser,
  };
}

function initials(name = 'S') {
  return name.charAt(0).toUpperCase();
}

export function SettingsPage() {
  const {
    currentUser,
    teamMembers = [],
    updateProfile,
    inviteTeamMember,
    removeTeamMember,
  } = useApp();
  const [profile, setProfile] = useState(emptyProfile);
  const [invite, setInvite] = useState({ name: '', designation: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [savingLogo, setSavingLogo] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [removingId, setRemovingId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setProfile(buildProfile(currentUser));
  }, [currentUser]);

  const displayName = profile.companyName || currentUser?.companyName || currentUser?.name || 'Company';
  const isTeamMember = Boolean(currentUser?.teamMember);
  const canSave = useMemo(() => !isTeamMember && profile.companyName.trim() && profile.contactName.trim(), [isTeamMember, profile]);

  const updateField = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setError('');
    setMessage('');
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Logo must be 5MB or smaller.');
      return;
    }

    const previousLogo = profile.avatarUrl;
    setSavingLogo(true);
    setError('');
    setMessage('');
    try {
      const avatarUrl = await compressImage(file);
      setProfile((prev) => ({ ...prev, avatarUrl }));
      await updateProfile({ avatarUrl });
      setMessage('Logo updated.');
    } catch (logoError) {
      setProfile((prev) => ({ ...prev, avatarUrl: previousLogo }));
      setError(logoError?.message || 'Could not save logo.');
    } finally {
      setSavingLogo(false);
      event.target.value = '';
    }
  };

  const handleSaveProfile = async () => {
    if (!canSave) {
      setError('Company name and contact name are required.');
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');
    try {
      const payload = profile.isOrganiser
        ? {
            orgName: profile.companyName.trim(),
            contactName: profile.contactName.trim(),
            phone: profile.phone.trim() || null,
            website: profile.website.trim() || null,
            description: profile.description.trim() || null,
            avatarUrl: profile.avatarUrl || null,
          }
        : {
            companyName: profile.companyName.trim(),
            founderName: profile.contactName.trim(),
            industry: profile.industry.trim() || undefined,
            phone: profile.phone.trim() || null,
            website: profile.website.trim() || null,
            location: profile.location.trim() || null,
            description: profile.description.trim() || null,
            avatarUrl: profile.avatarUrl || null,
          };
      await updateProfile(payload);
      setMessage('Company profile saved.');
    } catch (saveError) {
      setError(saveError?.message || 'Could not save company profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleInvite = async (event) => {
    event.preventDefault();
    setInviting(true);
    setError('');
    setMessage('');
    try {
      await inviteTeamMember({
        name: invite.name.trim(),
        designation: invite.designation.trim(),
        email: invite.email.trim(),
      });
      setInvite({ name: '', designation: '', email: '' });
      setMessage('Team member invited. They can log in with this email and create a password.');
    } catch (inviteError) {
      setError(inviteError?.message || 'Could not invite team member.');
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    setRemovingId(memberId);
    setError('');
    setMessage('');
    try {
      await removeTeamMember(memberId);
      setMessage('Team member removed.');
    } catch (removeError) {
      setError(removeError?.message || 'Could not remove team member.');
    } finally {
      setRemovingId('');
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 font-sans text-slate-800 flex flex-col gap-4 sm:gap-6 w-full">
      <header className="mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide mb-1">Settings</h1>
        <p className="text-white/80 text-sm">Manage your company profile and team access</p>
      </header>

      {(message || error) && (
        <div className={`rounded-2xl border px-5 py-4 text-sm font-bold shadow-sm ${
          error ? 'border-red-100 bg-red-50 text-red-700' : 'border-emerald-100 bg-emerald-50 text-emerald-700'
        }`}>
          {error || message}
        </div>
      )}

      <section className="bg-white/70 backdrop-blur-xl rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#6f8e97]/20 border border-[#6f8e97]/30 rounded-2xl">
              <Building2 className="w-6 h-6 text-[#4c7569]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Company Profile</h2>
          </div>
          <button
            onClick={handleSaveProfile}
            disabled={saving || savingLogo || !canSave}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-3 bg-[#6f8e97] text-white rounded-2xl hover:bg-[#5A7684] transition-all font-bold shadow-md disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-white/40">
            <div className="w-24 h-24 bg-[#6f8e97] rounded-[24px] flex items-center justify-center text-white text-3xl font-bold shadow-md shadow-[#6f8e97]/20 border border-white/30 overflow-hidden">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={`${displayName} logo`} className="w-full h-full object-cover" />
              ) : (
                initials(displayName)
              )}
            </div>
            <label className={`px-6 py-3.5 bg-white/60 border border-white/60 text-slate-700 rounded-2xl hover:bg-white hover:text-[#6f8e97] transition-all flex items-center gap-2 font-bold shadow-sm cursor-pointer ${(savingLogo || isTeamMember) ? 'pointer-events-none opacity-70' : ''}`}>
              {savingLogo ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              {savingLogo ? 'Uploading...' : 'Upload Logo'}
              <input type="file" accept="image/*" disabled={savingLogo || isTeamMember} onChange={handleLogoUpload} className="hidden" />
            </label>
            {isTeamMember && (
              <p className="text-sm font-semibold text-slate-500">Company profile edits are available to the owner account.</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label={profile.isOrganiser ? 'Organisation Name' : 'Company Name'} value={profile.companyName} onChange={(value) => updateField('companyName', value)} />
            <Field label="Contact Name" value={profile.contactName} onChange={(value) => updateField('contactName', value)} />
            <Field label="Email" value={profile.email} disabled />
            <Field label="Phone" value={profile.phone} onChange={(value) => updateField('phone', value)} />
            <Field label="Website" value={profile.website} onChange={(value) => updateField('website', value)} />
            <Field label={profile.isOrganiser ? 'Event Type' : 'Industry'} value={profile.industry} onChange={(value) => updateField('industry', value)} />
            {!profile.isOrganiser && <Field label="Location" value={profile.location} onChange={(value) => updateField('location', value)} className="md:col-span-2" />}
            <label className="md:col-span-2">
              <span className="block text-slate-700 font-medium mb-2 text-sm">Description</span>
              <textarea
                rows={4}
                value={profile.description}
                onChange={(event) => updateField('description', event.target.value)}
                placeholder="Add a short description for your brand or organisation."
                className="w-full bg-white/50 border border-white/50 rounded-2xl px-5 py-3.5 text-slate-800 focus:border-[#6f8e97] focus:outline-none focus:ring-2 focus:ring-[#6f8e97]/20 resize-none transition-all font-medium shadow-sm"
              />
            </label>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={saving || savingLogo || !canSave}
            className="sm:hidden w-full inline-flex justify-center items-center gap-2 px-5 py-3 bg-[#6f8e97] text-white rounded-2xl hover:bg-[#5A7684] transition-all font-bold shadow-md disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Profile
          </button>
        </div>
      </section>

      <section className="bg-white/70 backdrop-blur-xl rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-[#91c0cf]/20 border border-[#91c0cf]/30 rounded-2xl">
            <Users className="w-6 h-6 text-[#4f8396]" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Team Members</h2>
        </div>

        {!isTeamMember ? (
          <form onSubmit={handleInvite} className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_1.2fr_auto]">
            <Field label="Name" value={invite.name} onChange={(value) => setInvite((prev) => ({ ...prev, name: value }))} icon={Users} compact />
            <Field label="Designation" value={invite.designation} onChange={(value) => setInvite((prev) => ({ ...prev, designation: value }))} icon={Briefcase} compact />
            <Field label="Email" type="email" value={invite.email} onChange={(value) => setInvite((prev) => ({ ...prev, email: value }))} icon={Mail} compact />
            <button
              disabled={inviting || !invite.name.trim() || !invite.designation.trim() || !invite.email.trim()}
              className="self-end h-[50px] px-6 bg-[#6f8e97] text-white rounded-2xl hover:bg-[#5A7684] transition-all font-bold shadow-md shadow-[#6f8e97]/20 disabled:opacity-60"
            >
              {inviting ? 'Inviting...' : 'Invite'}
            </button>
          </form>
        ) : (
          <div className="mb-6 rounded-2xl border border-white/50 bg-white/40 p-4 text-sm font-semibold text-slate-500">
            Team invitations are managed by the owner account.
          </div>
        )}

        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white/40 border border-white/50 rounded-2xl shadow-sm gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-[16px] flex shrink-0 items-center justify-center font-bold text-lg shadow-sm border border-white/50 bg-[#a3e4c7] text-[#4c7569]">
                  {initials(member.name)}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-slate-800">{member.name}</p>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-black uppercase ${
                      member.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {member.status === 'ACTIVE' ? 'Active' : 'Invited'}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-500">{member.designation}</p>
                  <p className="text-sm font-medium text-slate-500">{member.email}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveMember(member.id)}
                disabled={isTeamMember || removingId === member.id}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-[#b5735c] transition-colors hover:bg-red-50 disabled:opacity-60"
              >
                {removingId === member.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Remove
              </button>
            </div>
          ))}

          {!teamMembers.length && (
            <div className="rounded-2xl border border-white/50 bg-white/40 p-6 text-center text-sm font-semibold text-slate-500">
              No team members have been invited yet.
            </div>
          )}
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#6f8e97]/20 bg-[#6f8e97]/10 p-4 text-sm font-semibold text-[#4c7569]">
          <Check className="mt-0.5 h-4 w-4 shrink-0" />
          Invited team members can use their email on the login page, then create their own password before entering the dashboard.
        </div>
      </section>
    </div>
  );
}

function Field({ label, value, onChange, icon: Icon, type = 'text', disabled = false, compact = false, className = '' }) {
  return (
    <label className={className}>
      <span className="block text-slate-700 font-medium mb-2 text-sm">{label}</span>
      <div className="relative">
        {Icon && <Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />}
        <input
          type={type}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange?.(event.target.value)}
          className={`w-full bg-white/50 border border-white/50 rounded-2xl ${Icon ? 'pl-11' : 'pl-5'} pr-5 ${compact ? 'py-3' : 'py-3.5'} text-slate-800 focus:border-[#6f8e97] focus:outline-none focus:ring-2 focus:ring-[#6f8e97]/20 transition-all font-medium shadow-sm disabled:text-slate-500`}
          required={!disabled && compact}
        />
      </div>
    </label>
  );
}
