import { Building2, Users, CreditCard, Bell, Shield, Upload, CreditCard as CardIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function SettingsPage() {
  const { currentUser } = useApp();
  const displayName = currentUser?.companyName || currentUser?.name || 'Company';
  const displayInitial = displayName.charAt(0).toUpperCase();
  const displayWebsite = currentUser?.website || '';
  const avatarUrl = currentUser?.avatarUrl || '';

  return (
    <div className="min-h-screen p-4 sm:p-6 font-sans text-slate-800 flex flex-col gap-4 sm:gap-6 w-full">
      {/* Header */}
      <header className="mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide mb-1">Settings</h1>
        <p className="text-white/80 text-sm">Manage your company profile and preferences</p>
      </header>

      {/* Company Profile */}
      <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-[#6f8e97]/20 border border-[#6f8e97]/30 rounded-2xl">
            <Building2 className="w-6 h-6 text-[#4c7569]" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Company Profile</h2>
        </div>
        
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-white/40">
            <div className="w-24 h-24 bg-[#6f8e97] rounded-[24px] flex items-center justify-center text-white text-3xl font-bold shadow-md shadow-[#6f8e97]/20 border border-white/30">
              {avatarUrl ? (
                <img src={avatarUrl} alt={`${displayName} logo`} className="w-full h-full object-cover rounded-[24px]" />
              ) : (
                displayInitial
              )}
            </div>
            <button className="px-6 py-3.5 bg-white/60 border border-white/60 text-slate-700 rounded-2xl hover:bg-white hover:text-[#6f8e97] transition-all flex items-center gap-2 font-bold shadow-sm">
              <Upload className="w-5 h-5" />
              Upload Logo
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-slate-700 font-medium mb-2 text-sm">Company Name</label>
              <input
                type="text"
                defaultValue={displayName}
                className="w-full bg-white/50 border border-white/50 rounded-2xl px-5 py-3.5 text-slate-800 focus:border-[#6f8e97] focus:outline-none focus:ring-2 focus:ring-[#6f8e97]/20 transition-all font-medium shadow-sm"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2 text-sm">Website</label>
              <input
                type="text"
                defaultValue={displayWebsite}
                className="w-full bg-white/50 border border-white/50 rounded-2xl px-5 py-3.5 text-slate-800 focus:border-[#6f8e97] focus:outline-none focus:ring-2 focus:ring-[#6f8e97]/20 transition-all font-medium shadow-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-slate-700 font-medium mb-2 text-sm">Industry</label>
              <select className="w-full bg-white/50 border border-white/50 rounded-2xl px-5 py-3.5 text-slate-800 focus:border-[#6f8e97] focus:outline-none focus:ring-2 focus:ring-[#6f8e97]/20 transition-all font-medium shadow-sm appearance-none">
                <option>Technology</option>
                <option>Fashion</option>
                <option>Beauty</option>
                <option>Food & Beverage</option>
                <option>Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-slate-700 font-medium mb-2 text-sm">Company Description</label>
              <textarea
                rows={4}
                defaultValue="A leading technology company focused on innovative solutions..."
                className="w-full bg-white/50 border border-white/50 rounded-2xl px-5 py-3.5 text-slate-800 focus:border-[#6f8e97] focus:outline-none focus:ring-2 focus:ring-[#6f8e97]/20 resize-none transition-all font-medium shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Team Access */}
      <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-[#91c0cf]/20 border border-[#91c0cf]/30 rounded-2xl">
            <Users className="w-6 h-6 text-[#4f8396]" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Team Members</h2>
        </div>
        
        <div className="space-y-4 mb-6">
          {[
            { name: 'John Doe', email: 'john@synkspace.com', role: 'Admin', color: 'bg-[#a3e4c7] text-[#4c7569]' },
            { name: 'Jane Smith', email: 'jane@synkspace.com', role: 'Manager', color: 'bg-[#f4a298] text-[#b5735c]' },
            { name: 'Bob Wilson', email: 'bob@synkspace.com', role: 'Manager', color: 'bg-[#91c0cf] text-[#4f8396]' },
          ].map((member, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white/40 border border-white/50 rounded-2xl shadow-sm gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center font-bold text-lg shadow-sm border border-white/50 ${member.color}`}>
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{member.name}</p>
                  <p className="text-sm font-medium text-slate-500">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <select className="flex-1 sm:w-auto bg-white/60 border border-white/60 rounded-xl px-4 py-2.5 text-slate-700 focus:border-[#6f8e97] focus:outline-none font-semibold shadow-sm text-sm">
                  <option selected={member.role === 'Admin'}>Admin</option>
                  <option selected={member.role === 'Manager'}>Manager</option>
                </select>
                <button className="text-[#f4a298] hover:text-[#b5735c] font-bold text-sm px-3 py-2 transition-colors">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="px-6 py-3.5 bg-[#6f8e97] text-white rounded-2xl hover:bg-[#5A7684] transition-all font-bold shadow-md shadow-[#6f8e97]/20">
          Invite Team Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Settings */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 flex flex-col">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-[#a3e4c7]/20 border border-[#a3e4c7]/30 rounded-2xl">
              <CardIcon className="w-6 h-6 text-[#345b4c]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Payment Settings</h2>
          </div>
          <div className="space-y-4 mb-6 flex-1">
            <div className="p-5 bg-white/40 border border-white/50 rounded-2xl shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between z-10 relative">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CardIcon className="w-5 h-5 text-slate-600" />
                    <p className="font-bold text-slate-800">•••• 4242</p>
                  </div>
                  <p className="text-sm font-medium text-slate-500">Expires 12/2027</p>
                </div>
                <span className="px-3 py-1 bg-[#a3e4c7]/30 text-[#345b4c] border border-[#a3e4c7]/40 rounded-full text-xs font-bold tracking-wide uppercase">Default</span>
              </div>
            </div>
          </div>
          <button className="w-full px-6 py-3.5 bg-white/60 border border-white/60 text-slate-700 rounded-2xl hover:bg-white transition-all font-bold shadow-sm">
            Add Payment Method
          </button>
        </div>

        {/* Notifications */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 flex flex-col">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-[#f0ad9f]/20 border border-[#f0ad9f]/30 rounded-2xl">
              <Bell className="w-6 h-6 text-[#b5735c]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Notifications</h2>
          </div>
          <div className="space-y-3 flex-1">
            {[
              { label: 'New Applications', description: 'Get notified when creators apply', active: true },
              { label: 'Campaign Updates', description: 'Receive updates about campaigns', active: true },
              { label: 'Messages', description: 'Get notified when you receive messages', active: true },
              { label: 'Payment Alerts', description: 'Receive alerts about payments', active: false },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/40 border border-white/50 rounded-2xl shadow-sm gap-4">
                <div>
                  <p className="font-bold text-slate-800 mb-0.5 text-sm">{item.label}</p>
                  <p className="text-xs font-medium text-slate-500">{item.description}</p>
                </div>
                <button className={`w-12 h-6 rounded-full relative transition-all duration-300 shrink-0 ${item.active ? 'bg-[#6f8e97]' : 'bg-slate-300'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300 shadow-sm ${item.active ? 'right-0.5' : 'left-0.5'}`}></div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-4 mb-6">
        <button className="px-8 py-4 bg-[#6f8e97] text-white rounded-2xl hover:bg-[#5A7684] transition-all font-bold shadow-lg shadow-[#6f8e97]/30">
          Save Changes
        </button>
      </div>
    </div>
  );
}


