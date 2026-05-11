import { DollarSign, Download, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useState } from 'react';

export function PaymentsPage() {
  const { payments, releasePayment } = useApp();
  const [filter, setFilter] = useState('all');

  const filteredPayments = payments.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-[#a3e4c7]" />;
      case 'escrow': return <Clock className="w-4 h-4 text-[#91c0cf]" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-[#f0ad9f]" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-[#a3e4c7]/30 text-[#4c7569] border border-[#a3e4c7]/50';
      case 'escrow': return 'bg-[#91c0cf]/30 text-[#4f8396] border border-[#91c0cf]/50';
      case 'pending': return 'bg-[#f4a298]/30 text-[#a56754] border border-[#f4a298]/50';
      default: return 'bg-white/20 text-white/80 border border-white/30';
    }
  };

  const totalSpend = payments.reduce((acc, curr) => acc + parseInt(curr.amount.replace(/[^0-9.-]+/g,"")), 0);
  const completedSpend = payments.filter((p) => p.status === 'completed').reduce((acc, curr) => acc + parseInt(curr.amount.replace(/[^0-9.-]+/g,"")), 0);
  const escrowSpend = payments.filter((p) => p.status === 'escrow').reduce((acc, curr) => acc + parseInt(curr.amount.replace(/[^0-9.-]+/g,"")), 0);
  const pendingSpend = payments.filter((p) => p.status === 'pending').reduce((acc, curr) => acc + parseInt(curr.amount.replace(/[^0-9.-]+/g,"")), 0);

  return (
    <div className="min-h-screen p-4 sm:p-6 font-sans text-slate-800 flex flex-col gap-4 sm:gap-6 w-full">
      {/* Header */}
      <header className="mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide mb-1">Payments</h1>
        <p className="text-white/80 text-sm">Manage your campaign payments and transactions</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
        <div className="bg-[#6f8e97]/40 backdrop-blur-xl border border-white/20 rounded-[32px] p-6 text-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
          <div className="flex items-center gap-3 mb-4 z-10 relative">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="z-10 relative">
            <p className="text-white/80 text-sm font-medium mb-1">Total Spend</p>
            <h3 className="text-3xl font-bold tracking-tight mb-2">${totalSpend.toLocaleString()}</h3>
          </div>
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all pointer-events-none" />
        </div>

        <div className="bg-[#6f8e97]/40 backdrop-blur-xl border border-white/20 rounded-[32px] p-6 text-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
          <div className="flex items-center gap-3 mb-4 z-10 relative">
            <div className="p-3 bg-[#a3e4c7]/30 border border-[#a3e4c7]/50 rounded-2xl backdrop-blur-md">
              <CheckCircle className="w-6 h-6 text-[#a3e4c7]" />
            </div>
          </div>
          <div className="z-10 relative">
            <p className="text-white/80 text-sm font-medium mb-1">Completed</p>
            <h3 className="text-3xl font-bold tracking-tight mb-2">${completedSpend.toLocaleString()}</h3>
          </div>
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-[#a3e4c7]/10 rounded-full blur-2xl group-hover:bg-[#a3e4c7]/20 transition-all pointer-events-none" />
        </div>

        <div className="bg-[#6f8e97]/40 backdrop-blur-xl border border-white/20 rounded-[32px] p-6 text-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
          <div className="flex items-center gap-3 mb-4 z-10 relative">
            <div className="p-3 bg-[#91c0cf]/30 border border-[#91c0cf]/50 rounded-2xl backdrop-blur-md">
              <Clock className="w-6 h-6 text-[#91c0cf]" />
            </div>
          </div>
          <div className="z-10 relative">
            <p className="text-white/80 text-sm font-medium mb-1">In Escrow</p>
            <h3 className="text-3xl font-bold tracking-tight mb-2">${escrowSpend.toLocaleString()}</h3>
          </div>
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-[#91c0cf]/10 rounded-full blur-2xl group-hover:bg-[#91c0cf]/20 transition-all pointer-events-none" />
        </div>

        <div className="bg-[#6f8e97]/40 backdrop-blur-xl border border-white/20 rounded-[32px] p-6 text-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
          <div className="flex items-center gap-3 mb-4 z-10 relative">
            <div className="p-3 bg-[#f4a298]/30 border border-[#f4a298]/50 rounded-2xl backdrop-blur-md">
              <AlertCircle className="w-6 h-6 text-[#f4a298]" />
            </div>
          </div>
          <div className="z-10 relative">
            <p className="text-white/80 text-sm font-medium mb-1">Pending</p>
            <h3 className="text-3xl font-bold tracking-tight mb-2">${pendingSpend.toLocaleString()}</h3>
          </div>
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-[#f4a298]/10 rounded-full blur-2xl group-hover:bg-[#f4a298]/20 transition-all pointer-events-none" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3 mb-2">
        {['all', 'completed', 'escrow', 'pending'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2.5 rounded-2xl transition-all font-semibold ${
              filter === f 
                ? 'bg-[#6f8e97] text-white shadow-md shadow-[#6f8e97]/20 border border-[#6f8e97]' 
                : 'bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Payments Table */}
      <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[15px] font-bold text-slate-800">Transaction History</h2>
          <button className="flex items-center gap-1.5 px-4 py-2 border border-white/60 bg-white/50 rounded-2xl text-xs font-bold text-slate-700 hover:bg-white transition-all shadow-sm">
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/50">
                <th className="pb-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Payment ID</th>
                <th className="pb-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Creator</th>
                <th className="pb-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Campaign</th>
                <th className="pb-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Amount</th>
                <th className="pb-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="pb-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                <th className="pb-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment, index) => (
                <tr key={index} className="border-b border-white/30 last:border-0 hover:bg-white/40 transition-colors">
                  <td className="py-4">
                    <span className="text-xs font-bold text-slate-700 bg-white/50 px-2.5 py-1 rounded-lg border border-white/60">{payment.id}</span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm border border-white/50 ${payment.color}`}>
                        {payment.creator.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-800 text-sm">{payment.creator}</span>
                    </div>
                  </td>
                  <td className="py-4 font-semibold text-slate-600 text-sm">{payment.campaign}</td>
                  <td className="py-4 font-bold text-slate-800">{payment.amount}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase flex items-center gap-1.5 ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        {payment.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 font-medium text-slate-500 text-sm">{payment.date}</td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      {payment.status === 'escrow' && (
                        <button onClick={() => releasePayment(payment.id)} className="px-4 py-1.5 bg-[#a3e4c7] text-[#345b4c] rounded-xl hover:bg-[#8fd0b5] transition-all font-bold text-xs shadow-sm shadow-[#a3e4c7]/20">
                          Release
                        </button>
                      )}
                      <button className="px-4 py-1.5 bg-white/60 border border-white/60 text-slate-700 rounded-xl hover:bg-white hover:text-slate-900 transition-all font-bold text-xs shadow-sm">
                        Invoice
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPayments.length === 0 && (
            <div className="py-12 text-center text-slate-500 font-medium">No payments found in this category.</div>
          )}
        </div>
      </div>
    </div>
  );
}

