import { User, Bell, CreditCard, Lock, Globe, DollarSign, MapPin, Calendar, LogOut, Trash2, Shield, Mail, Smartphone, CheckCircle, Check } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../../shared/context/AppContext';

export function SettingsScreen() {
  const { currentUser } = useApp() || {};
  const storedName = currentUser?.name?.trim();
  const displayName = storedName && storedName.toLowerCase() !== 'pending' ? storedName : currentUser?.companyName || 'Creator';
  const displayEmail = currentUser?.email || '';
  const displayPhone = currentUser?.phone || '';
  const displayLocation = currentUser?.location || '';
  const displayInitial = displayName.charAt(0).toUpperCase();
  const [activeSection, setActiveSection] = useState('profile');
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSaveChanges = () => {
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 3000);
  };

  const handleLogout = () => {
    alert('Logging out...');
    setShowLogoutModal(false);
  };

  const handleDeleteAccount = () => {
    alert('Account deletion initiated. This action cannot be undone.');
    setShowDeleteModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Success Notification */}
      {showSaveNotification && (
        <div className="fixed top-24 right-6 z-50 bg-emerald-500/90 backdrop-blur-xl text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/60 flex items-center gap-3 animate-slide-in">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="font-bold">Changes Saved!</div>
            <div className="text-sm text-white/90">Your settings have been updated successfully.</div>
          </div>
        </div>
      )}

      {/* Settings Navigation */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar - Settings Menu */}
        <div className="col-span-3 bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl"></div>

          <div className="relative space-y-2">
            <button
              onClick={() => setActiveSection('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                activeSection === 'profile'
                  ? 'bg-white/80 backdrop-blur-md text-gray-900 shadow-lg border border-white/70'
                  : 'hover:bg-white/40 text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>
            <button
              onClick={() => setActiveSection('social')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                activeSection === 'social'
                  ? 'bg-white/80 backdrop-blur-md text-gray-900 shadow-lg border border-white/70'
                  : 'hover:bg-white/40 text-gray-600 hover:text-gray-900'
              }`}
            >
              <Globe className="w-5 h-5" />
              <span>Social Accounts</span>
            </button>
            <button
              onClick={() => setActiveSection('pricing')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                activeSection === 'pricing'
                  ? 'bg-white/80 backdrop-blur-md text-gray-900 shadow-lg border border-white/70'
                  : 'hover:bg-white/40 text-gray-600 hover:text-gray-900'
              }`}
            >
              <DollarSign className="w-5 h-5" />
              <span>Pricing & Rates</span>
            </button>
            <button
              onClick={() => setActiveSection('payment')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                activeSection === 'payment'
                  ? 'bg-white/80 backdrop-blur-md text-gray-900 shadow-lg border border-white/70'
                  : 'hover:bg-white/40 text-gray-600 hover:text-gray-900'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span>Payment Methods</span>
            </button>
            <button
              onClick={() => setActiveSection('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                activeSection === 'notifications'
                  ? 'bg-white/80 backdrop-blur-md text-gray-900 shadow-lg border border-white/70'
                  : 'hover:bg-white/40 text-gray-600 hover:text-gray-900'
              }`}
            >
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </button>
            <button
              onClick={() => setActiveSection('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                activeSection === 'security'
                  ? 'bg-white/80 backdrop-blur-md text-gray-900 shadow-lg border border-white/70'
                  : 'hover:bg-white/40 text-gray-600 hover:text-gray-900'
              }`}
            >
              <Lock className="w-5 h-5" />
              <span>Security</span>
            </button>
          </div>
        </div>

        {/* Right Content - Dynamic Based on Active Section */}
        <div className="col-span-9 space-y-6">
          {/* Profile Information */}
          {activeSection === 'profile' && (
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>

            <div className="relative">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Profile Information</h3>

              {/* Profile Picture */}
              <div className="flex items-center gap-6 mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent"></div>
                  <span className="relative">{displayInitial}</span>
                </div>
                <div>
                  <button className="px-6 py-2 bg-white/80 backdrop-blur-md border border-white/60 text-gray-700 rounded-xl hover:shadow-lg transition-all hover:scale-105 font-semibold text-sm mb-2">
                    Change Photo
                  </button>
                  <p className="text-xs text-gray-600">JPG, PNG or GIF. Max size 5MB</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-2 block">Full Name</label>
                  <input
                    type="text"
                    defaultValue={displayName}
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-md border border-white/60 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-md"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-2 block">Email</label>
                  <input
                    type="email"
                    defaultValue={displayEmail}
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-md border border-white/60 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-md"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-2 block">Phone</label>
                  <input
                    type="tel"
                    defaultValue={displayPhone}
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-md border border-white/60 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-md"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-2 block">Location</label>
                  <input
                    type="text"
                    defaultValue={displayLocation}
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-md border border-white/60 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-md"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-700 mb-2 block">Bio</label>
                  <textarea
                    rows={4}
                    defaultValue="Fashion & lifestyle creator passionate about wellness and sustainable living. Partnered with 50+ brands."
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-md border border-white/60 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-md resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button className="px-6 py-3 bg-white/80 backdrop-blur-md border border-white/60 text-gray-700 rounded-xl hover:shadow-lg transition-all hover:scale-105 font-semibold">
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
          )}

          {/* Connected Social Accounts */}
          {activeSection === 'social' && (
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-200/30 rounded-full blur-3xl"></div>

            <div className="relative">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Connected Social Accounts</h3>

              <div className="space-y-4">
                {/* Instagram */}
                <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">Instagram</h4>
                      <p className="text-xs text-gray-600">@alexjohnson • 124.5K followers</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <button className="px-4 py-2 bg-white/60 backdrop-blur-md border border-white/60 text-gray-700 rounded-lg hover:shadow-lg transition-all text-sm font-semibold">
                      Remove
                    </button>
                  </div>
                </div>

                {/* YouTube */}
                <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">YouTube</h4>
                      <p className="text-xs text-gray-600">{displayName} • 89.2K subscribers</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <button className="px-4 py-2 bg-white/60 backdrop-blur-md border border-white/60 text-gray-700 rounded-lg hover:shadow-lg transition-all text-sm font-semibold">
                      Remove
                    </button>
                  </div>
                </div>

                {/* Add More */}
                <button className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-4 text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-all text-sm font-semibold">
                  + Connect Another Platform
                </button>
              </div>
            </div>
          </div>
          )}

          {/* Pricing & Rates */}
          {activeSection === 'pricing' && (
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-emerald-200/30 rounded-full blur-3xl"></div>

            <div className="relative">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Your Pricing & Rates</h3>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-2 block">Instagram Reel</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      defaultValue="500"
                      className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-md border border-white/60 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-md font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-2 block">Instagram Post</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      defaultValue="300"
                      className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-md border border-white/60 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-md font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-2 block">Instagram Story</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      defaultValue="150"
                      className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-md border border-white/60 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-md font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-2 block">YouTube Video</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      defaultValue="1200"
                      className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-md border border-white/60 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-md font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-2 block">YouTube Short</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      defaultValue="400"
                      className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-md border border-white/60 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-md font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSaveChanges}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105"
                >
                  Update Rates
                </button>
              </div>
            </div>
          </div>
          )}

          {/* Payment Methods Section */}
          {activeSection === 'payment' && (
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-200/30 rounded-full blur-3xl"></div>

            <div className="relative">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Payment Methods</h3>

              <div className="space-y-4">
                {/* Bank Account */}
                <div className="bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-white/60 shadow-lg hover:scale-102 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Bank Account</h4>
                        <p className="text-sm text-gray-600">Chase Bank ••••1234</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <button className="px-4 py-2 bg-white/60 backdrop-blur-md border border-white/60 text-gray-700 rounded-lg hover:shadow-lg transition-all text-sm font-semibold">
                        Edit
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Account Holder:</span>
                      <div className="font-semibold text-gray-900">{displayName}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Account Type:</span>
                      <div className="font-semibold text-gray-900">Checking</div>
                    </div>
                  </div>
                </div>

                {/* UPI */}
                <div className="bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-white/60 shadow-lg hover:scale-102 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Smartphone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">UPI</h4>
                        <p className="text-sm text-gray-600">alex@upi</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <button className="px-4 py-2 bg-white/60 backdrop-blur-md border border-white/60 text-gray-700 rounded-lg hover:shadow-lg transition-all text-sm font-semibold">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add New Payment Method */}
                <button className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-6 text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-all text-sm font-semibold hover:bg-white/40">
                  + Add New Payment Method
                </button>
              </div>
            </div>
          </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-orange-200/30 rounded-full blur-3xl"></div>

            <div className="relative">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Notification Preferences</h3>

              <div className="space-y-6">
                {/* Email Notifications */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-4">Email Notifications</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'New Campaign Opportunities', checked: true },
                      { label: 'Application Status Updates', checked: true },
                      { label: 'New Messages from Brands', checked: true },
                      { label: 'Payment Received', checked: true },
                      { label: 'Weekly Performance Summary', checked: false },
                      { label: 'Marketing & Promotions', checked: false }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white/40 backdrop-blur-md rounded-xl border border-white/60 hover:bg-white/60 transition-all">
                        <span className="text-gray-900 font-medium">{item.label}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-blue-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Push Notifications */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-4">Push Notifications</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'New Messages', checked: true },
                      { label: 'Campaign Deadlines', checked: true },
                      { label: 'Payment Updates', checked: true }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white/40 backdrop-blur-md rounded-xl border border-white/60 hover:bg-white/60 transition-all">
                        <span className="text-gray-900 font-medium">{item.label}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-blue-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSaveChanges}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105"
                >
                  Save Notification Preferences
                </button>
              </div>
            </div>
          </div>
          )}

          {/* Security & Account */}
          {activeSection === 'security' && (
          <div className="grid grid-cols-2 gap-6">
            {/* Security */}
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-200/30 rounded-full blur-3xl"></div>

              <div className="relative">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Security</h3>

                <div className="space-y-4">
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full flex items-center justify-between p-4 bg-white/60 backdrop-blur-md rounded-xl border border-white/60 hover:shadow-lg transition-all hover:scale-102"
                  >
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-gray-600" />
                      <span className="font-semibold text-gray-900">Change Password</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setShow2FAModal(true)}
                    className="w-full flex items-center justify-between p-4 bg-white/60 backdrop-blur-md rounded-xl border border-white/60 hover:shadow-lg transition-all hover:scale-102"
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-gray-600" />
                      <span className="font-semibold text-gray-900">Two-Factor Authentication</span>
                    </div>
                    <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-semibold">Enabled</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-red-200/30 rounded-full blur-3xl"></div>

              <div className="relative">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Account</h3>

                <div className="space-y-4">
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full flex items-center justify-between p-4 bg-white/60 backdrop-blur-md rounded-xl border border-white/60 hover:shadow-lg transition-all hover:scale-102"
                  >
                    <div className="flex items-center gap-3">
                      <LogOut className="w-5 h-5 text-gray-600" />
                      <span className="font-semibold text-gray-900">Logout</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full flex items-center justify-between p-4 bg-red-50/80 backdrop-blur-md rounded-xl border border-red-200 hover:shadow-lg transition-all hover:scale-102"
                  >
                    <div className="flex items-center gap-3">
                      <Trash2 className="w-5 h-5 text-red-600" />
                      <span className="font-semibold text-red-600">Delete Account</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm" onClick={() => setShowPasswordModal(false)}>
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 relative overflow-hidden max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent pointer-events-none"></div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl"></div>

            <div className="relative p-8">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
              >
                <span className="text-gray-700 text-xl">×</span>
              </button>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-md border border-white/60 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-md"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-md border border-white/60 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-md"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-md border border-white/60 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-md"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-6 py-3 bg-white/80 backdrop-blur-md border border-white/60 text-gray-700 rounded-xl hover:shadow-lg transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleSaveChanges();
                    setShowPasswordModal(false);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm" onClick={() => setShow2FAModal(false)}>
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 relative overflow-hidden max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent pointer-events-none"></div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl"></div>

            <div className="relative p-8">
              <button
                onClick={() => setShow2FAModal(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
              >
                <span className="text-gray-700 text-xl">×</span>
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Two-Factor Authentication</h2>
                  <p className="text-sm text-emerald-600 font-semibold">Currently Enabled</p>
                </div>
              </div>

              <div className="bg-emerald-100/80 backdrop-blur-md rounded-2xl p-4 mb-6 border border-emerald-200">
                <p className="text-sm text-emerald-900">
                  Your account is protected with two-factor authentication. You'll need to enter a code from your authenticator app when logging in.
                </p>
              </div>

              <div className="space-y-3">
                <button className="w-full px-6 py-3 bg-white/80 backdrop-blur-md border border-white/60 text-gray-700 rounded-xl hover:shadow-lg transition-all font-semibold text-left flex items-center justify-between">
                  <span>View Recovery Codes</span>
                  <span className="text-xs text-gray-500">→</span>
                </button>
                <button className="w-full px-6 py-3 bg-white/80 backdrop-blur-md border border-white/60 text-gray-700 rounded-xl hover:shadow-lg transition-all font-semibold text-left flex items-center justify-between">
                  <span>Change Authenticator App</span>
                  <span className="text-xs text-gray-500">→</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to disable 2FA? This will make your account less secure.')) {
                      handleSaveChanges();
                      setShow2FAModal(false);
                    }
                  }}
                  className="w-full px-6 py-3 bg-red-50/80 backdrop-blur-md border border-red-200 text-red-600 rounded-xl hover:shadow-lg transition-all font-semibold"
                >
                  Disable Two-Factor Authentication
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)}>
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 relative overflow-hidden max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent pointer-events-none"></div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl"></div>

            <div className="relative p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <LogOut className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Logout</h2>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to logout? You'll need to sign in again to access your account.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-6 py-3 bg-white/80 backdrop-blur-md border border-white/60 text-gray-700 rounded-xl hover:shadow-lg transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 relative overflow-hidden max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent pointer-events-none"></div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-200/30 rounded-full blur-3xl"></div>

            <div className="relative p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Trash2 className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Delete Account</h2>
              <p className="text-gray-600 text-center mb-4">
                This action is permanent and cannot be undone. All your data, campaigns, and earnings history will be deleted.
              </p>

              <div className="bg-red-100/80 backdrop-blur-md rounded-2xl p-4 mb-6 border border-red-200">
                <p className="text-sm text-red-900 font-semibold mb-2">Before deleting your account:</p>
                <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
                  <li>Withdraw all available earnings</li>
                  <li>Complete active campaigns</li>
                  <li>Download any important data</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3 bg-white/80 backdrop-blur-md border border-white/60 text-gray-700 rounded-xl hover:shadow-lg transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (confirm('Type "DELETE" to confirm account deletion')) {
                      handleDeleteAccount();
                    }
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105"
                >
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
