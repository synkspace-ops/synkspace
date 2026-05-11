import { Search, Filter, CheckCircle, Clock, XCircle, Eye, Edit, Trash2, DollarSign, Calendar, Building2, Globe, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';

export function MyApplicationsScreen() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [editingApplication, setEditingApplication] = useState(null);
  const [proposedPrice, setProposedPrice] = useState('');

  const applications = [
    {
      id: 1,
      campaign: 'Nike Summer Launch',
      brand: 'Nike',
      brandInitial: 'N',
      proposedPrice: '$2,500',
      submittedDate: '2026-03-28',
      status: 'accepted',
      platforms: ['Instagram', 'Youtube'],
      deadline: '2026-04-15',
      response: 'Great proposal! We\'d love to work with you.'
    },
    {
      id: 2,
      campaign: 'Gaming Headset Review',
      brand: 'Lumina Gaming',
      brandInitial: 'LG',
      proposedPrice: '$3,800',
      submittedDate: '2026-03-25',
      status: 'pending',
      platforms: ['Youtube'],
      deadline: '2026-04-20',
      response: null
    },
    {
      id: 3,
      campaign: 'Mindfulness App Launch',
      brand: 'Aura Wellness',
      brandInitial: 'AW',
      proposedPrice: '$1,800',
      submittedDate: '2026-03-22',
      status: 'accepted',
      platforms: ['Instagram', 'Facebook'],
      deadline: '2026-04-10',
      response: 'Your approach aligns perfectly with our vision!'
    },
    {
      id: 4,
      campaign: 'Smart Watch Campaign',
      brand: 'TechStyle',
      brandInitial: 'TS',
      proposedPrice: '$3,200',
      submittedDate: '2026-03-18',
      status: 'rejected',
      platforms: ['Instagram', 'Youtube'],
      deadline: '2026-04-12',
      response: 'We decided to go with creators who have more tech-focused content.'
    },
    {
      id: 5,
      campaign: 'Skincare Routine Series',
      brand: 'Pure Beauty',
      brandInitial: 'PB',
      proposedPrice: '$2,100',
      submittedDate: '2026-03-15',
      status: 'pending',
      platforms: ['Instagram'],
      deadline: '2026-04-18',
      response: null
    }
  ];

  const filteredApplications = applications.filter(app => {
    if (activeFilter === 'all') return true;
    return app.status === activeFilter;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    acceptanceRate: Math.round((applications.filter(a => a.status === 'accepted').length / applications.length) * 100)
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-5 gap-4">
        {/* Total Applications */}
        <div className="bg-gradient-to-br from-purple-300/70 to-purple-400/70 rounded-3xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-2xl border-2 border-white/60 hover:scale-105 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7)] rounded-3xl pointer-events-none"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/30 rounded-full blur-3xl"></div>

          <div className="relative">
            <div className="text-xs font-semibold uppercase tracking-wide text-purple-900 mb-1">Total Apps</div>
            <div className="text-4xl font-bold text-white drop-shadow-lg">{stats.total}</div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-gradient-to-br from-orange-300/70 to-orange-400/70 rounded-3xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-2xl border-2 border-white/60 hover:scale-105 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7)] rounded-3xl pointer-events-none"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/30 rounded-full blur-3xl"></div>

          <div className="relative">
            <div className="text-xs font-semibold uppercase tracking-wide text-orange-900 mb-1">Pending</div>
            <div className="text-4xl font-bold text-white drop-shadow-lg">{stats.pending}</div>
          </div>
        </div>

        {/* Accepted */}
        <div className="bg-gradient-to-br from-emerald-300/70 to-emerald-400/70 rounded-3xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-2xl border-2 border-white/60 hover:scale-105 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7)] rounded-3xl pointer-events-none"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/30 rounded-full blur-3xl"></div>

          <div className="relative">
            <div className="text-xs font-semibold uppercase tracking-wide text-emerald-900 mb-1">Accepted</div>
            <div className="text-4xl font-bold text-white drop-shadow-lg">{stats.accepted}</div>
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-gradient-to-br from-red-300/70 to-red-400/70 rounded-3xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-2xl border-2 border-white/60 hover:scale-105 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7)] rounded-3xl pointer-events-none"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/30 rounded-full blur-3xl"></div>

          <div className="relative">
            <div className="text-xs font-semibold uppercase tracking-wide text-red-900 mb-1">Rejected</div>
            <div className="text-4xl font-bold text-white drop-shadow-lg">{stats.rejected}</div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-gradient-to-br from-blue-300/70 to-blue-400/70 rounded-3xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-2xl border-2 border-white/60 hover:scale-105 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7)] rounded-3xl pointer-events-none"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/30 rounded-full blur-3xl"></div>

          <div className="relative">
            <div className="text-xs font-semibold uppercase tracking-wide text-blue-900 mb-1">Success Rate</div>
            <div className="text-4xl font-bold text-white drop-shadow-lg">{stats.acceptanceRate}%</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/30 pointer-events-none"></div>

        <div className="relative flex items-center justify-between">
          {/* Status Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                activeFilter === 'all'
                  ? 'bg-white/80 backdrop-blur-md shadow-lg text-gray-900 border border-white/70'
                  : 'text-gray-600 hover:bg-white/40'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                activeFilter === 'pending'
                  ? 'bg-white/80 backdrop-blur-md shadow-lg text-gray-900 border border-white/70'
                  : 'text-gray-600 hover:bg-white/40'
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setActiveFilter('accepted')}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                activeFilter === 'accepted'
                  ? 'bg-white/80 backdrop-blur-md shadow-lg text-gray-900 border border-white/70'
                  : 'text-gray-600 hover:bg-white/40'
              }`}
            >
              Accepted ({stats.accepted})
            </button>
            <button
              onClick={() => setActiveFilter('rejected')}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                activeFilter === 'rejected'
                  ? 'bg-white/80 backdrop-blur-md shadow-lg text-gray-900 border border-white/70'
                  : 'text-gray-600 hover:bg-white/40'
              }`}
            >
              Rejected ({stats.rejected})
            </button>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications..."
                className="pl-10 pr-4 py-2 bg-white/80 backdrop-blur-md border border-white/60 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-md"
              />
            </div>
            <button className="px-4 py-2 bg-white/80 backdrop-blur-md border border-white/60 text-gray-700 rounded-xl hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2 font-semibold text-sm">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((app) => (
          <div key={app.id} className="bg-white/40 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl border border-white/60 relative hover:scale-[1.01] transition-all">
            {/* Ultra Glossy Liquid Glass Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-white/30 via-transparent to-white/40 pointer-events-none"></div>

            {/* Floating Orbs */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/30 rounded-full blur-3xl"></div>

            <div className="p-6 relative">
              <div className="flex items-start gap-6">
                {/* Brand Logo */}
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center shadow-xl border border-white/20 flex-shrink-0">
                  <span className="text-white font-bold text-xl">{app.brandInitial}</span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{app.campaign}</h3>
                      <p className="text-sm text-gray-600">{app.brand}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {app.status === 'accepted' && (
                        <span className="px-3 py-1.5 bg-emerald-500/90 backdrop-blur-md text-white text-xs font-bold rounded-full shadow-lg border border-white/30 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          ACCEPTED
                        </span>
                      )}
                      {app.status === 'pending' && (
                        <span className="px-3 py-1.5 bg-orange-500/90 backdrop-blur-md text-white text-xs font-bold rounded-full shadow-lg border border-white/30 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          PENDING
                        </span>
                      )}
                      {app.status === 'rejected' && (
                        <span className="px-3 py-1.5 bg-red-500/90 backdrop-blur-md text-white text-xs font-bold rounded-full shadow-lg border border-white/30 flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          REJECTED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="bg-white/40 backdrop-blur-md p-3 rounded-xl border border-white/60 shadow-md">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span className="text-xs text-gray-600">Proposed Price</span>
                      </div>
                      <div className="font-bold text-gray-900">{app.proposedPrice}</div>
                    </div>

                    <div className="bg-white/40 backdrop-blur-md p-3 rounded-xl border border-white/60 shadow-md">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-xs text-gray-600">Submitted</span>
                      </div>
                      <div className="font-bold text-gray-900 text-sm">
                        {new Date(app.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>

                    <div className="bg-white/40 backdrop-blur-md p-3 rounded-xl border border-white/60 shadow-md">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-xs text-gray-600">Deadline</span>
                      </div>
                      <div className="font-bold text-gray-900 text-sm">
                        {new Date(app.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>

                    <div className="bg-white/40 backdrop-blur-md p-3 rounded-xl border border-white/60 shadow-md">
                      <div className="text-xs text-gray-600 mb-1">Platforms</div>
                      <div className="flex gap-1">
                        {app.platforms.includes('Instagram') && (
                          <div className="w-6 h-6 bg-white/80 backdrop-blur-md rounded-lg flex items-center justify-center shadow-md border border-white/60">
                            <Globe className="w-3.5 h-3.5 text-gray-700" />
                          </div>
                        )}
                        {app.platforms.includes('Youtube') && (
                          <div className="w-6 h-6 bg-white/80 backdrop-blur-md rounded-lg flex items-center justify-center shadow-md border border-white/60">
                            <Globe className="w-3.5 h-3.5 text-gray-700" />
                          </div>
                        )}
                        {app.platforms.includes('Facebook') && (
                          <div className="w-6 h-6 bg-white/80 backdrop-blur-md rounded-lg flex items-center justify-center shadow-md border border-white/60">
                            <Globe className="w-3.5 h-3.5 text-gray-700" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Brand Response */}
                  {app.response && (
                    <div className="bg-white/60 backdrop-blur-md p-3 rounded-xl border border-white/60 shadow-md mb-4">
                      <div className="text-xs font-semibold text-gray-700 mb-1">Brand Response</div>
                      <p className="text-sm text-gray-600">{app.response}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedApplication(app);
                      }}
                      className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 hover:shadow-xl transition-all flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    {app.status === 'pending' && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingApplication(app);
                            setProposedPrice(app.proposedPrice.replace('$', '').replace(',', ''));
                          }}
                          className="px-4 py-2 bg-white/80 backdrop-blur-md border border-white/60 text-gray-700 rounded-xl hover:shadow-lg transition-all text-sm font-semibold flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit Proposal
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Are you sure you want to withdraw this application?')) {
                              // Handle withdrawal
                              alert('Application withdrawn successfully!');
                            }
                          }}
                          className="px-4 py-2 bg-white/80 backdrop-blur-md border border-white/60 text-red-600 rounded-xl hover:shadow-lg transition-all text-sm font-semibold flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Withdraw
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedApplication(null)}>
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 relative overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent pointer-events-none"></div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl"></div>

            <div className="relative p-8">
              {/* Close Button */}
              <button
                onClick={() => setSelectedApplication(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>

              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center shadow-xl">
                    <span className="text-white font-bold text-xl">{selectedApplication.brandInitial}</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-1">{selectedApplication.campaign}</h2>
                    <p className="text-lg text-gray-700">{selectedApplication.brand}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedApplication.status === 'accepted' && (
                    <span className="px-4 py-2 bg-emerald-500/90 backdrop-blur-md text-white text-sm font-bold rounded-full shadow-lg">
                      ACCEPTED
                    </span>
                  )}
                  {selectedApplication.status === 'pending' && (
                    <span className="px-4 py-2 bg-orange-500/90 backdrop-blur-md text-white text-sm font-bold rounded-full shadow-lg">
                      PENDING
                    </span>
                  )}
                  {selectedApplication.status === 'rejected' && (
                    <span className="px-4 py-2 bg-red-500/90 backdrop-blur-md text-white text-sm font-bold rounded-full shadow-lg">
                      REJECTED
                    </span>
                  )}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-lg">
                  <div className="text-sm text-gray-600 mb-1">Proposed Price</div>
                  <div className="text-2xl font-bold text-gray-900">{selectedApplication.proposedPrice}</div>
                </div>
                <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-lg">
                  <div className="text-sm text-gray-600 mb-1">Submitted On</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {new Date(selectedApplication.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-lg">
                  <div className="text-sm text-gray-600 mb-1">Campaign Deadline</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {new Date(selectedApplication.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-lg">
                  <div className="text-sm text-gray-600 mb-1">Platforms</div>
                  <div className="flex gap-2 mt-2">
                    {selectedApplication.platforms.map((platform, index) => (
                      <div key={index} className="w-8 h-8 bg-white/80 backdrop-blur-md rounded-lg flex items-center justify-center shadow-md">
                        {platform === 'Instagram' && <Globe className="w-4 h-4 text-gray-700" />}
                        {platform === 'Youtube' && <Globe className="w-4 h-4 text-gray-700" />}
                        {platform === 'Facebook' && <Globe className="w-4 h-4 text-gray-700" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Brand Response */}
              {selectedApplication.response && (
                <div className="bg-blue-100/80 backdrop-blur-md rounded-2xl p-4 mb-6 border border-white/60">
                  <div className="text-sm font-semibold text-blue-900 mb-2">Brand Response</div>
                  <p className="text-blue-900">{selectedApplication.response}</p>
                </div>
              )}

              {/* Actions */}
              {selectedApplication.status === 'accepted' && (
                <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 rounded-xl text-lg font-bold hover:shadow-2xl transition-all hover:scale-105">
                  Start Campaign
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Proposal Modal */}
      {editingApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm" onClick={() => setEditingApplication(null)}>
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 relative overflow-hidden max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent pointer-events-none"></div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl"></div>

            <div className="relative p-8">
              {/* Close Button */}
              <button
                onClick={() => setEditingApplication(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>

              {/* Header */}
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Proposal</h2>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Campaign</label>
                  <div className="text-lg font-bold text-gray-900">{editingApplication.campaign}</div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Proposed Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={proposedPrice}
                      onChange={(e) => setProposedPrice(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-md border border-white/60 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-md font-semibold text-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Proposal Message</label>
                  <textarea
                    rows={4}
                    placeholder="Tell the brand why you're the perfect fit..."
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-md border border-white/60 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-md resize-none"
                    defaultValue="I'm excited about this opportunity and believe my audience aligns perfectly with your brand values..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setEditingApplication(null)}
                  className="flex-1 px-6 py-3 bg-white/80 backdrop-blur-md border border-white/60 text-gray-700 rounded-xl hover:shadow-lg transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle save
                    alert('Proposal updated successfully!');
                    setEditingApplication(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


