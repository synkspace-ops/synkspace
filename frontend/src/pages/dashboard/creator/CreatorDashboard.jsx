import { useState } from 'react';
import { Grid3x3, MessageSquare, Settings, Mail, Bell, ChevronDown, TrendingUp, DollarSign, Eye, MessageCircle, MoreHorizontal, AlertTriangle, Users, BarChart3, FileText, Target, FileCheck, Search, Filter, SlidersHorizontal, Bookmark, Star, MapPin, Calendar, Sparkles, Zap, Globe, Clock, CheckCircle2, Share2, Wallet } from 'lucide-react';
const logo = "https://via.placeholder.com/150";
import { OpportunitiesScreen } from './components/OpportunitiesScreen';
import { MessagesScreen } from './components/MessagesScreen';
import { AnalyticsScreen } from './components/AnalyticsScreen';
import { EarningsScreen } from './components/EarningsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { MyApplicationsScreen } from './components/MyApplicationsScreen';

import { AppProvider, useApp } from '../shared/context/AppContext';

function CreatorDashboardContent() {
  const app = useApp() || {};
  const currentUser = app.currentUser;
  const storedName = currentUser?.name?.trim();
  const displayName = storedName && storedName.toLowerCase() !== 'pending' ? storedName : currentUser?.companyName;
  const firstName = displayName ? displayName.split(' ')[0] : 'there';
  const initial = firstName.charAt(0).toUpperCase();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);

 const [chatsData, setChatsData] = useState([
    {
      id: 1,
      name: 'Nike Marketing',
      brand: 'Nike',
      avatar: 'N',
      lastMessage: 'Great! Looking forward to the collaboration.',
      time: '2m ago',
      unread: 3,
      online: true,
      messages: [
        { id: 1, sender: 'them', text: 'Hi Alex! We loved your proposal for the Summer Launch campaign.', time: '10:30 AM', read: true },
        { id: 2, sender: 'me', text: 'Thank you! I\'m really excited about this opportunity.', time: '10:32 AM', read: true },
        { id: 3, sender: 'them', text: 'We\'d like to discuss the content calendar. Are you available for a call tomorrow?', time: '10:35 AM', read: true },
        { id: 4, sender: 'me', text: 'Absolutely! What time works best for you?', time: '10:36 AM', read: true },
        { id: 5, sender: 'them', text: 'How about 2 PM EST? We can go over the deliverables and timeline.', time: '10:38 AM', read: true },
        { id: 6, sender: 'me', text: 'Perfect! I\'ll be ready. Should I prepare anything specific?', time: '10:40 AM', read: true },
        { id: 7, sender: 'them', text: 'Great! Looking forward to the collaboration.', time: '10:42 AM', read: false }
      ]
    },
    {
      id: 2,
      name: 'Lumina Gaming Team',
      brand: 'Lumina Gaming',
      avatar: 'LG',
      lastMessage: 'The headset samples will arrive next week.',
      time: '1h ago',
      unread: 0,
      online: false,
      messages: [
        { id: 1, sender: 'them', text: 'Hey! We\'re sending you the headset samples for the review.', time: 'Yesterday', read: true },
        { id: 2, sender: 'me', text: 'Awesome! When should I expect them?', time: 'Yesterday', read: true },
        { id: 3, sender: 'them', text: 'The headset samples will arrive next week.', time: '1h ago', read: true }
      ]
    },
    {
      id: 3,
      name: 'Aura Wellness',
      brand: 'Aura Wellness',
      avatar: 'AW',
      lastMessage: 'Can you share your Instagram insights?',
      time: '3h ago',
      unread: 1,
      online: true,
      messages: [
        { id: 1, sender: 'them', text: 'Hi Alex! We need some analytics before we finalize.', time: '3h ago', read: true },
        { id: 2, sender: 'them', text: 'Can you share your Instagram insights?', time: '3h ago', read: false }
      ]
    },
    {
      id: 4,
      name: 'TechStyle Brand',
      brand: 'TechStyle',
      avatar: 'TS',
      lastMessage: 'Thanks for applying!',
      time: '2 days ago',
      unread: 0,
      online: false,
      messages: [
        { id: 1, sender: 'them', text: 'Thanks for applying!', time: '2 days ago', read: true }
      ]
    }
  ]);

  const totalUnread = (app.conversations || []).reduce((sum, chat) => sum + (chat.unread || 0), 0);

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100 p-6">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Sidebar - Floating */}
      <div className="w-24 bg-white/50 backdrop-blur-2xl flex flex-col items-center py-8 gap-8 rounded-3xl shadow-2xl relative z-10 mr-6 border border-white/60">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent pointer-events-none rounded-3xl"></div>
        <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] rounded-3xl pointer-events-none"></div>
        
        {/* Logo */}
        <div 
          className="w-14 h-14 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform relative"
          onClick={() => setActiveTab('dashboard')}
        >
          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
        </div>

        {/* Navigation Icons */}
        <div className="flex-1 flex flex-col items-center gap-5 relative">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all relative overflow-hidden group ${
              activeTab === 'dashboard' ? 'bg-white/60 backdrop-blur-md shadow-lg border border-white/70 text-purple-600 scale-110' : 'text-gray-500 hover:bg-white/40 hover:backdrop-blur-md hover:scale-105'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
            <Grid3x3 className="w-6 h-6 relative drop-shadow-md" />
          </button>
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all relative overflow-hidden group ${
              activeTab === 'opportunities' ? 'bg-white/60 backdrop-blur-md shadow-lg border border-white/70 text-purple-600 scale-110' : 'text-gray-500 hover:bg-white/40 hover:backdrop-blur-md hover:scale-105'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
            <Target className="w-6 h-6 relative drop-shadow-md" />
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all relative overflow-hidden group ${
              activeTab === 'applications' ? 'bg-white/60 backdrop-blur-md shadow-lg border border-white/70 text-purple-600 scale-110' : 'text-gray-500 hover:bg-white/40 hover:backdrop-blur-md hover:scale-105'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
            <FileCheck className="w-6 h-6 relative drop-shadow-md" />
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all relative overflow-hidden group ${
              activeTab === 'messages' ? 'bg-white/60 backdrop-blur-md shadow-lg border border-white/70 text-purple-600 scale-110' : 'text-gray-500 hover:bg-white/40 hover:backdrop-blur-md hover:scale-105'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
            <MessageSquare className="w-6 h-6 relative drop-shadow-md" />
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-lg text-white text-[10px] font-bold flex items-center justify-center">{totalUnread}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all relative overflow-hidden group ${
              activeTab === 'analytics' ? 'bg-white/60 backdrop-blur-md shadow-lg border border-white/70 text-purple-600 scale-110' : 'text-gray-500 hover:bg-white/40 hover:backdrop-blur-md hover:scale-105'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
            <BarChart3 className="w-6 h-6 relative drop-shadow-md" />
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all relative overflow-hidden group ${
              activeTab === 'earnings' ? 'bg-white/60 backdrop-blur-md shadow-lg border border-white/70 text-purple-600 scale-110' : 'text-gray-500 hover:bg-white/40 hover:backdrop-blur-md hover:scale-105'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
            <Wallet className="w-6 h-6 relative drop-shadow-md" />
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all relative overflow-hidden group ${
              activeTab === 'settings' ? 'bg-white/60 backdrop-blur-md shadow-lg border border-white/70 text-purple-600 scale-110' : 'text-gray-500 hover:bg-white/40 hover:backdrop-blur-md hover:scale-105'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
            <Settings className="w-6 h-6 relative drop-shadow-md" />
          </button>
        </div>

        {/* User Avatar */}
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-base font-semibold cursor-pointer shadow-xl hover:scale-110 transition-transform relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none"></div>
          <span className="relative drop-shadow-lg">{initial}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto relative max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <div className="bg-white/40 backdrop-blur-xl border-b border-white/50 px-10 py-8 flex items-center justify-between sticky top-0 z-10 shadow-lg rounded-3xl mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/30 pointer-events-none"></div>
          <div className="relative">
            <h2 className="text-2xl font-bold text-gray-900 drop-shadow-sm">
              {activeTab === 'dashboard' && `Good morning, ${firstName}.`}
              {activeTab === 'opportunities' && 'Opportunities'}
              {activeTab === 'applications' && 'My Applications'}
              {activeTab === 'messages' && 'Messages'}
              {activeTab === 'analytics' && 'Analytics'}
              {activeTab === 'earnings' && 'Earnings'}
              {activeTab === 'settings' && 'Settings'}
            </h2>
            <p className="text-gray-700 drop-shadow-sm">
              {activeTab === 'dashboard' && "Here's what's happening today."}
              {activeTab === 'opportunities' && 'Discover and apply to exciting campaigns'}
              {activeTab === 'applications' && 'Track your campaign applications'}
              {activeTab === 'messages' && 'Communicate with brands'}
              {activeTab === 'analytics' && 'View your performance insights'}
              {activeTab === 'earnings' && 'Manage your income and payouts'}
              {activeTab === 'settings' && 'Manage your account settings'}
            </p>
          </div>
          <div className="flex items-center gap-4 relative">
            <button 
              onClick={() => setActiveTab('messages')}
              className="p-2 hover:bg-white/60 rounded-xl transition-all relative backdrop-blur-md hover:scale-110 hover:shadow-lg border border-transparent hover:border-white/50"
            >
              <Mail className="w-5 h-5 text-gray-700 drop-shadow-sm" />
              {totalUnread > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-lg text-white text-[10px] font-bold flex items-center justify-center">{totalUnread}</span>
              )}
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-white/60 rounded-xl transition-all relative backdrop-blur-md hover:scale-110 hover:shadow-lg border border-transparent hover:border-white/50"
              >
                <Bell className="w-5 h-5 text-gray-700 drop-shadow-sm" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-lg"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 overflow-hidden z-50">
                  <div className="p-4 border-b border-white/50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">Notifications</h3>
                    <span className="text-xs text-purple-600 font-semibold cursor-pointer">Mark all read</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    <div className="p-4 border-b border-white/30 hover:bg-white/50 transition-all cursor-pointer flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-800"><span className="font-bold">Nike Marketing</span> sent you a new message regarding the Summer Launch.</p>
                        <p className="text-xs text-gray-500 mt-1">2m ago</p>
                      </div>
                    </div>
                    <div className="p-4 border-b border-white/30 hover:bg-white/50 transition-all cursor-pointer flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-800">Your application for <span className="font-bold">Lumina Gaming</span> was approved!</p>
                        <p className="text-xs text-gray-500 mt-1">1h ago</p>
                      </div>
                    </div>
                    <div className="p-4 border-b border-white/30 hover:bg-white/50 transition-all cursor-pointer flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-800">Your profile is missing payment details. Add them to receive earnings.</p>
                        <p className="text-xs text-gray-500 mt-1">5h ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 text-center border-t border-white/50 text-sm text-purple-600 font-semibold hover:bg-white/50 cursor-pointer transition-all">
                    View all notifications
                  </div>
                </div>
              )}
            </div>
            <button className="flex items-center gap-2 hover:bg-white/60 px-3 py-2 rounded-xl transition-all backdrop-blur-md hover:scale-105 hover:shadow-lg border border-transparent hover:border-white/50">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent"></div>
                <span className="relative">{initial}</span>
              </div>
              <span className="font-medium text-gray-900">{firstName}</span>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {activeTab === 'opportunities' ? (
            <OpportunitiesScreen />
          ) : activeTab === 'applications' ? (
            <MyApplicationsScreen />
          ) : activeTab === 'messages' ? (
            <MessagesScreen />
          ) : activeTab === 'analytics' ? (
            <AnalyticsScreen />
          ) : activeTab === 'earnings' ? (
            <EarningsScreen />
          ) : activeTab === 'settings' ? (
            <SettingsScreen />
          ) : (
            <>
          {/* Stats Cards Row - From Attached Image */}
          <div className="grid grid-cols-6 gap-4 mb-8">
            {/* Total Earnings */}
            <div className="bg-gradient-to-br from-emerald-300/70 to-teal-400/70 rounded-3xl p-5 text-gray-900 shadow-2xl relative overflow-hidden backdrop-blur-2xl border-2 border-white/60 hover:scale-105 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent pointer-events-none"></div>
              <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7)] rounded-3xl pointer-events-none"></div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/30 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
              <div className="absolute top-3 right-3 w-10 h-10 bg-white/50 backdrop-blur-xl rounded-full flex items-center justify-center shadow-xl border-2 border-white/70">
                <DollarSign className="w-5 h-5 text-white drop-shadow-lg" />
              </div>
              <div className="relative">
                <div className="text-xs font-semibold uppercase tracking-wide mb-1 drop-shadow-md">Total Earnings</div>
                <div className="text-3xl font-bold mb-0.5 drop-shadow-lg">$12,450</div>
                <div className="text-xs font-medium drop-shadow-md">+6%</div>
              </div>
            </div>

            {/* Active Campaigns */}
            <div className="bg-gradient-to-br from-blue-400/70 to-blue-500/70 rounded-3xl p-5 text-white shadow-2xl relative overflow-hidden backdrop-blur-2xl border-2 border-white/60 hover:scale-105 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent pointer-events-none"></div>
              <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7)] rounded-3xl pointer-events-none"></div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/30 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
              <div className="absolute top-3 right-3 w-10 h-10 bg-white/50 backdrop-blur-xl rounded-full flex items-center justify-center shadow-xl border-2 border-white/70">
                <TrendingUp className="w-5 h-5 text-white drop-shadow-lg" />
              </div>
              <div className="relative">
                <div className="text-xs font-semibold uppercase tracking-wide mb-1 drop-shadow-md">Active Campaigns</div>
                <div className="text-3xl font-bold drop-shadow-lg">8</div>
              </div>
            </div>

            {/* Pending Apps */}
            <div className="bg-gradient-to-br from-orange-400/70 to-orange-500/70 rounded-3xl p-5 text-white shadow-2xl relative overflow-hidden backdrop-blur-2xl border-2 border-white/60 hover:scale-105 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent pointer-events-none"></div>
              <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7)] rounded-3xl pointer-events-none"></div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/30 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
              <div className="absolute top-3 right-3 w-10 h-10 bg-white/50 backdrop-blur-xl rounded-full flex items-center justify-center shadow-xl border-2 border-white/70">
                <Grid3x3 className="w-5 h-5 text-white drop-shadow-lg" />
              </div>
              <div className="relative">
                <div className="text-xs font-semibold uppercase tracking-wide mb-1 drop-shadow-md">Pending Apps</div>
                <div className="text-3xl font-bold drop-shadow-lg">3</div>
              </div>
            </div>

            {/* New Opps */}
            <div className="bg-gradient-to-br from-purple-500/70 to-purple-600/70 rounded-3xl p-5 text-white shadow-2xl relative overflow-hidden backdrop-blur-2xl border-2 border-white/60 hover:scale-105 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent pointer-events-none"></div>
              <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7)] rounded-3xl pointer-events-none"></div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/30 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
              <div className="absolute top-3 right-3 w-10 h-10 bg-white/50 backdrop-blur-xl rounded-full flex items-center justify-center shadow-xl border-2 border-white/70">
                <svg className="w-5 h-5 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="relative">
                <div className="text-xs font-semibold uppercase tracking-wide mb-1 drop-shadow-md">New Opps</div>
                <div className="text-3xl font-bold mb-0.5 drop-shadow-lg">12</div>
                <div className="text-xs font-medium drop-shadow-md">+6</div>
              </div>
            </div>

            {/* Profile Views */}
            <div className="bg-gradient-to-br from-teal-200/70 to-cyan-300/70 rounded-3xl p-5 text-gray-900 shadow-2xl relative overflow-hidden backdrop-blur-2xl border-2 border-white/60 hover:scale-105 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent pointer-events-none"></div>
              <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7)] rounded-3xl pointer-events-none"></div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/30 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
              <div className="absolute top-3 right-3 w-10 h-10 bg-white/50 backdrop-blur-xl rounded-full flex items-center justify-center shadow-xl border-2 border-white/70">
                <Eye className="w-5 h-5 text-teal-700 drop-shadow-lg" />
              </div>
              <div className="relative">
                <div className="text-xs font-semibold uppercase tracking-wide mb-1 drop-shadow-md">Profile Views</div>
                <div className="text-3xl font-bold drop-shadow-lg">1.4k</div>
              </div>
            </div>

            {/* Messages */}
            <div className="bg-gradient-to-br from-purple-400/70 to-purple-500/70 rounded-3xl p-5 text-white shadow-2xl relative overflow-hidden backdrop-blur-2xl border-2 border-white/60 hover:scale-105 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent pointer-events-none"></div>
              <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7)] rounded-3xl pointer-events-none"></div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/30 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
              <div className="absolute top-3 right-3 w-10 h-10 bg-white/50 backdrop-blur-xl rounded-full flex items-center justify-center shadow-xl border-2 border-white/70">
                <MessageCircle className="w-5 h-5 text-white drop-shadow-lg" />
              </div>
              <div className="relative">
                <div className="text-xs font-semibold uppercase tracking-wide mb-1 drop-shadow-md">Messages</div>
                <div className="text-3xl font-bold drop-shadow-lg">24</div>
              </div>
            </div>
          </div>

          {/* Main Grid - From Second Image */}
          <div className="grid grid-cols-12 gap-6">
            {/* Current Balance */}
            <div className="col-span-4 bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden hover:scale-105 transition-transform">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide drop-shadow-sm">Current Balance</h3>
                  <button className="text-xs text-gray-700 flex items-center gap-1 hover:bg-white/50 px-2 py-1 rounded-lg transition-all backdrop-blur-sm">
                    Withdraw Limit <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-6 drop-shadow-md">$4,820.00</div>
                
                {/* Chart */}
                <div className="relative h-32 mb-4">
                  <svg viewBox="0 0 300 100" className="w-full h-full">
                    <defs>
                      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0,60 Q 30,50 60,55 T 120,50 T 180,45 T 240,50 T 300,40"
                      fill="none"
                      stroke="url(#gradient1)"
                      strokeWidth="3"
                      className="drop-shadow-lg"
                    />
                  </svg>
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-600 px-2">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold py-3 rounded-xl hover:shadow-2xl transition-all hover:scale-105 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative drop-shadow-md">Withdraw Earnings</span>
                </button>
              </div>
            </div>

            {/* Performance Snapshot */}
            <div className="col-span-4 bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden hover:scale-105 transition-transform">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide drop-shadow-sm">Performance Snapshot</h3>
                  <button className="text-xs text-gray-700 flex items-center gap-1 hover:bg-white/50 px-2 py-1 rounded-lg transition-all backdrop-blur-sm">
                    Liquid <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
                
                {/* Colorful Gradient Card */}
                <div className="bg-gradient-to-br from-purple-400 via-pink-400 to-blue-300 rounded-2xl p-6 mb-4 relative overflow-hidden shadow-xl hover:scale-105 transition-transform">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                  <div className="relative">
                    <div className="text-sm text-white/90 mb-1 drop-shadow-sm">Total chart</div>
                    <div className="text-3xl font-bold text-white mb-1 drop-shadow-md">$4,820.00</div>
                    <div className="text-sm text-white/90 drop-shadow-sm">Performance</div>
                    <div className="text-2xl font-bold text-white drop-shadow-md">50%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Opportunities */}
            <div className="col-span-4 bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden hover:scale-105 transition-transform">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-pink-200/30 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide drop-shadow-sm">Recommended Oppr.</h3>
                  <button className="text-gray-600 hover:bg-white/50 p-1 rounded-lg transition-all backdrop-blur-sm">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Nike Card */}
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 text-white relative overflow-hidden group cursor-pointer hover:scale-105 transition-transform shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
                  <div className="relative">
                    <h4 className="text-2xl font-bold mb-2 drop-shadow-lg">SUMMER</h4>
                    <h4 className="text-2xl font-bold mb-4 drop-shadow-lg">SPORTSWEAR</h4>
                    <h4 className="text-2xl font-bold mb-8 drop-shadow-lg">LAUNCH</h4>
                    <button className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm hover:bg-white/30 transition-all border border-white/30 shadow-lg">
                      Hover Hover
                    </button>
                  </div>
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-lg">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14.4 5.29c-1.03-2.32-3.76-2.32-4.79 0L7.5 9.38H3.5c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h17c1.1 0 2-.9 2-2v-9c0-1.1-.9-2-2-2h-4l-2.1-4.09z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Opportunities Grid */}
            <div className="col-span-8 bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden hover:scale-[1.02] transition-transform">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-200/20 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide drop-shadow-sm">Recommended Opportunities</h3>
                  <button className="text-gray-600 hover:bg-white/50 p-1 rounded-lg transition-all backdrop-blur-sm">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {/* Nike Sneakers */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group hover:scale-105 border border-white/60">
                    <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1580980637029-926d00ff8052?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMG5pa2UlMjBzbmVha2VycyUyMHNob2VzfGVufDF8fHx8MTc3MzIyNzk0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                        alt="Nike Sneakers"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="p-4">
                      <div className="text-2xl font-bold mb-2 drop-shadow-sm">#NIKE</div>
                      <p className="text-xs text-gray-700 mb-3">Good Morning, {firstName}! Tip: Boost engagement with a new Story.</p>
                      <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
                        Uovt more →
                      </button>
                    </div>
                  </div>

                  {/* Summer Sportswear */}
                  <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer hover:scale-105 border border-white/20">
                    <div className="aspect-[4/3] bg-black flex items-center justify-center p-6 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent"></div>
                      <div className="text-white relative">
                        <h4 className="text-xl font-bold mb-1 drop-shadow-lg">SUMMER</h4>
                        <h4 className="text-xl font-bold mb-1 drop-shadow-lg">SPORTSWEAR</h4>
                        <h4 className="text-xl font-bold drop-shadow-lg">LAUNCH</h4>
                      </div>
                    </div>
                    <div className="p-4 bg-black text-white">
                      <p className="text-xs text-gray-400 mb-2">
                        Uovt more: campaign with high-fashion editorial from high-calibre.
                      </p>
                    </div>
                  </div>

                  {/* Productivity Tool */}
                  <div className="bg-gradient-to-br from-purple-900 to-purple-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer hover:scale-105 border border-white/20 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
                    <div className="aspect-[4/3] flex items-center justify-center p-6">
                      <img 
                        src="https://images.unsplash.com/photo-1766051666522-9cfa12675f5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBzZXR1cCUyMHB1cnBsZSUyMGxpZ2h0cyUyMGRlc2t8ZW58MXx8fHwxNzczMjI3OTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                        alt="Gaming Setup"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4 text-white relative">
                      <h4 className="text-lg font-bold mb-1 drop-shadow-lg">PRODUCTIVITY</h4>
                      <h4 className="text-lg font-bold drop-shadow-lg">TOOL SERIES</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Deals */}
            <div className="col-span-4 bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden hover:scale-105 transition-transform">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-200/30 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide drop-shadow-sm">Active Deals</h3>
                  <button className="text-gray-600 hover:bg-white/50 p-1 rounded-lg transition-all backdrop-blur-sm">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {/* Aura Wellness */}
                  <div className="bg-gradient-to-r from-purple-200/80 to-purple-300/80 rounded-2xl p-4 backdrop-blur-md border border-white/40 shadow-lg hover:scale-105 transition-transform">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md">
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 drop-shadow-sm">Aura Wellness</h4>
                        <p className="text-xs text-gray-700">Progress → Aura Wellness</p>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="text-xs text-gray-800 mb-1 font-medium">Progress</div>
                      <div className="h-2 bg-white/60 backdrop-blur-sm rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full shadow-lg" style={{ width: '8%' }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-800 font-semibold">8%</span>
                      <button className="bg-white/90 backdrop-blur-sm text-purple-600 px-4 py-1.5 rounded-lg text-xs font-semibold hover:shadow-lg transition-all hover:scale-105 border border-purple-200">
                        EXCLUSIVE
                      </button>
                    </div>
                  </div>

                  {/* Lumina Gaming */}
                  <div className="bg-gradient-to-r from-teal-200/80 to-emerald-300/80 rounded-2xl p-4 backdrop-blur-md border border-white/40 shadow-lg hover:scale-105 transition-transform">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md">
                        <Grid3x3 className="w-5 h-5 text-teal-700" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 drop-shadow-sm">Lumina Gaming</h4>
                        <p className="text-xs text-gray-700">Progress → Lumina Gaming</p>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="text-xs text-gray-800 mb-1 font-medium">Progress</div>
                      <div className="h-2 bg-white/60 backdrop-blur-sm rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full shadow-lg" style={{ width: '8%' }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-800 font-semibold">8%</span>
                      <button className="bg-white/90 backdrop-blur-sm text-teal-700 px-4 py-1.5 rounded-lg text-xs font-semibold hover:shadow-lg transition-all hover:scale-105 border border-teal-200">
                        APPROVED
                      </button>
                    </div>
                  </div>

                  {/* Sephora Event */}
                  <div className="border-2 border-dashed border-gray-400/60 rounded-2xl p-4 bg-white/40 backdrop-blur-sm hover:scale-105 transition-transform hover:bg-white/60">
                    <h4 className="font-semibold text-gray-900 mb-1 drop-shadow-sm">Sephora Event</h4>
                    <p className="text-xs text-gray-700 mb-3">Boost engagement with a product launch</p>
                    <button className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-xl transition-all hover:scale-105 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="relative drop-shadow-md">Liquid Button</span>
                    </button>
                  </div>

                  {/* GoPro Partnership */}
                  <div className="border-2 border-dashed border-gray-400/60 rounded-2xl p-4 bg-white/40 backdrop-blur-sm hover:scale-105 transition-transform hover:bg-white/60">
                    <h4 className="font-semibold text-gray-900 mb-1 drop-shadow-sm">GoPro Partnership</h4>
                    <p className="text-xs text-gray-700 mb-3">Boost engagement with a new adventure</p>
                    <button className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-xl transition-all hover:scale-105 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="relative drop-shadow-md">Liquid Button</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Completion & Recent Alerts */}
            <div className="col-span-12 grid grid-cols-2 gap-6">
              {/* Profile Completion */}
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden hover:scale-105 transition-transform">
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-200/30 rounded-full blur-3xl"></div>
                <div className="relative">
                  <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-6 drop-shadow-sm">Profile Completion</h3>
                  
                  <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32 mb-4">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="url(#gradient2)"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${2 * Math.PI * 56 * 0}`}
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                          <Users className="w-8 h-8 text-white drop-shadow-md" />
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 mb-1 drop-shadow-sm">100% completed</div>
                      <p className="text-sm text-gray-700">Good Morning, {firstName}!</p>
                      <p className="text-sm text-gray-700">Tip: Boost engagement with a new Story.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Alerts */}
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden hover:scale-105 transition-transform">
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-yellow-200/30 rounded-full blur-3xl"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide drop-shadow-sm">Recent Alerts</h3>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full shadow-sm"></div>
                      <div className="w-2 h-2 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-sm"></div>
                      <div className="w-2 h-2 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full shadow-sm"></div>
                      <div className="w-2 h-2 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-sm"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Alert 1 */}
                    <div className="flex items-start gap-3 bg-white/40 backdrop-blur-sm p-3 rounded-2xl border border-white/50 hover:scale-105 transition-transform shadow-md">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent"></div>
                        <AlertTriangle className="w-5 h-5 text-white drop-shadow-md relative" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 drop-shadow-sm">Your attention</h4>
                        <p className="text-xs text-gray-700">1/1 months ago</p>
                      </div>
                    </div>

                    {/* Alert 2 */}
                    <div className="flex items-start gap-3 bg-white/40 backdrop-blur-sm p-3 rounded-2xl border border-white/50 hover:scale-105 transition-transform shadow-md">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent"></div>
                        <MessageCircle className="w-5 h-5 text-white drop-shadow-md relative" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 drop-shadow-sm">Notifications agnt</h4>
                        <p className="text-xs text-gray-700">1 hours ago</p>
                      </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center gap-2 pt-4">
                      <div className="w-2 h-2 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full shadow-md"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full shadow-sm"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full shadow-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CreatorDashboard() {
  return (
    <AppProvider navigate={() => {}}>
      <CreatorDashboardContent />
    </AppProvider>
  );
}
