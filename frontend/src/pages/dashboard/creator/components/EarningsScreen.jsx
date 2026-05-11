import { DollarSign, Download, TrendingUp, ArrowUpRight, ArrowDownRight, CreditCard, Building2, Smartphone, FileText, Calendar, CheckCircle, Clock, XCircle, X } from 'lucide-react';
import { useState } from 'react';

export function EarningsScreen() {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('bank');

  const handleWithdraw = () => {
    if (parseFloat(withdrawAmount) > 0 && parseFloat(withdrawAmount) <= 4820) {
      alert(`Withdrawal of $${withdrawAmount} initiated successfully!`);
      setShowWithdrawModal(false);
      setWithdrawAmount('');
    } else {
      alert('Please enter a valid amount');
    }
  };

  const transactions = [
    { id: 1, campaign: 'Nike Summer Launch', amount: 2500, date: '2026-03-28', status: 'completed', type: 'credit' },
    { id: 2, campaign: 'Withdrawal to Bank', amount: -1500, date: '2026-03-25', status: 'completed', type: 'debit' },
    { id: 3, campaign: 'Lumina Gaming', amount: 3800, date: '2026-03-22', status: 'completed', type: 'credit' },
    { id: 4, campaign: 'Aura Wellness', amount: 1800, date: '2026-03-18', status: 'pending', type: 'credit' },
    { id: 5, campaign: 'TechStyle Campaign', amount: 3200, date: '2026-03-15', status: 'processing', type: 'credit' },
    { id: 6, campaign: 'Withdrawal to UPI', amount: -2000, date: '2026-03-12', status: 'completed', type: 'debit' }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-6">
        {/* Total Earnings */}
        <div className="bg-gradient-to-br from-emerald-300/70 to-emerald-400/70 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-2xl border-2 border-white/60 hover:scale-105 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7)] rounded-3xl pointer-events-none"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/30 rounded-full blur-3xl"></div>

          <div className="relative">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-emerald-900 mb-1">Total Earnings</div>
                <div className="text-4xl font-bold text-white drop-shadow-lg">$12,450</div>
              </div>
              <div className="w-12 h-12 bg-white/50 backdrop-blur-xl rounded-full flex items-center justify-center shadow-xl border-2 border-white/70">
                <DollarSign className="w-6 h-6 text-emerald-700" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-900">
              <TrendingUp className="w-3 h-3" />
              <span className="font-semibold">+24% this month</span>
            </div>
          </div>
        </div>

        {/* Available Balance */}
        <div className="bg-gradient-to-br from-blue-300/70 to-blue-400/70 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-2xl border-2 border-white/60 hover:scale-105 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7)] rounded-3xl pointer-events-none"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/30 rounded-full blur-3xl"></div>

          <div className="relative">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-blue-900 mb-1">Available Balance</div>
                <div className="text-4xl font-bold text-white drop-shadow-lg">$4,820</div>
              </div>
              <div className="w-12 h-12 bg-white/50 backdrop-blur-xl rounded-full flex items-center justify-center shadow-xl border-2 border-white/70">
                <CreditCard className="w-6 h-6 text-blue-700" />
              </div>
            </div>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="text-xs font-semibold text-blue-900 hover:text-blue-800 transition-colors"
            >
              Withdraw Now →
            </button>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-gradient-to-br from-orange-300/70 to-orange-400/70 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-2xl border-2 border-white/60 hover:scale-105 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7)] rounded-3xl pointer-events-none"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/30 rounded-full blur-3xl"></div>

          <div className="relative">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-orange-900 mb-1">Pending Payments</div>
                <div className="text-4xl font-bold text-white drop-shadow-lg">$5,000</div>
              </div>
              <div className="w-12 h-12 bg-white/50 backdrop-blur-xl rounded-full flex items-center justify-center shadow-xl border-2 border-white/70">
                <Clock className="w-6 h-6 text-orange-700" />
              </div>
            </div>
            <div className="text-xs text-orange-900">
              2 campaigns processing
            </div>
          </div>
        </div>

        {/* This Month */}
        <div className="bg-gradient-to-br from-purple-300/70 to-purple-400/70 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-2xl border-2 border-white/60 hover:scale-105 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7)] rounded-3xl pointer-events-none"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/30 rounded-full blur-3xl"></div>

          <div className="relative">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-purple-900 mb-1">This Month</div>
                <div className="text-4xl font-bold text-white drop-shadow-lg">$8,300</div>
              </div>
              <div className="w-12 h-12 bg-white/50 backdrop-blur-xl rounded-full flex items-center justify-center shadow-xl border-2 border-white/70">
                <Calendar className="w-6 h-6 text-purple-700" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-purple-900">
              <ArrowUpRight className="w-3 h-3" />
              <span className="font-semibold">From 5 campaigns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions & Withdrawal */}
      <div className="grid grid-cols-12 gap-6">
        {/* Transaction History */}
        <div className="col-span-8 bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>

          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>
              <button className="px-4 py-2 bg-white/60 backdrop-blur-md border border-white/60 text-gray-700 rounded-xl hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2 text-sm font-semibold">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>

            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-lg hover:scale-102 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                      transaction.type === 'credit'
                        ? 'bg-gradient-to-br from-emerald-400 to-emerald-500'
                        : 'bg-gradient-to-br from-gray-700 to-gray-800'
                    }`}>
                      {transaction.type === 'credit' ? (
                        <ArrowDownRight className="w-6 h-6 text-white" />
                      ) : (
                        <ArrowUpRight className="w-6 h-6 text-white" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-gray-900 mb-1">{transaction.campaign}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-lg font-bold mb-1 ${
                        transaction.type === 'credit' ? 'text-emerald-600' : 'text-gray-900'
                      }`}>
                        {transaction.type === 'credit' ? '+' : ''}{transaction.amount < 0 ? transaction.amount : `$${transaction.amount}`}
                      </div>
                      <div className="flex items-center justify-end gap-1">
                        {transaction.status === 'completed' && (
                          <>
                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                            <span className="text-xs text-emerald-600 font-semibold">Completed</span>
                          </>
                        )}
                        {transaction.status === 'pending' && (
                          <>
                            <Clock className="w-3 h-3 text-orange-500" />
                            <span className="text-xs text-orange-600 font-semibold">Pending</span>
                          </>
                        )}
                        {transaction.status === 'processing' && (
                          <>
                            <Clock className="w-3 h-3 text-blue-500" />
                            <span className="text-xs text-blue-600 font-semibold">Processing</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Withdraw & Payout Methods */}
        <div className="col-span-4 space-y-6">
          {/* Quick Withdraw */}
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-200/30 rounded-full blur-3xl"></div>

            <div className="relative">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Withdraw</h3>

              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-700 mb-2 block">Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-md border border-white/60 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-md font-semibold"
                  />
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  Available: $4,820.00
                </div>
              </div>

              <button
                onClick={() => setShowWithdrawModal(true)}
                className="w-full bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-semibold py-3 rounded-xl hover:shadow-xl transition-all hover:scale-105 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative">Withdraw Now</span>
              </button>
            </div>
          </div>

          {/* Payout Methods */}
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl"></div>

            <div className="relative">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Payout Methods</h3>

              <div className="space-y-3">
                {/* Bank Account */}
                <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-lg hover:scale-105 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-gray-900">Bank Account</h4>
                      <p className="text-xs text-gray-600">••••1234</p>
                    </div>
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* UPI */}
                <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-lg hover:scale-105 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Smartphone className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-gray-900">UPI</h4>
                      <p className="text-xs text-gray-600">alex@upi</p>
                    </div>
                  </div>
                </div>

                {/* Add New */}
                <button className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-4 text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-all text-sm font-semibold">
                  + Add Payment Method
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Earnings Chart */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl"></div>

        <div className="relative">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Monthly Earnings Trend</h3>

          <div className="h-48 flex items-end justify-between gap-3">
            {[4200, 5100, 4800, 6200, 5900, 7100, 8300].map((amount, index) => {
              const maxAmount = 8300;
              const height = (amount / maxAmount) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-3">
                  <div className="text-xs font-bold text-gray-900">${(amount/1000).toFixed(1)}k</div>
                  <div className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-xl relative overflow-hidden" style={{ height: `${height}%` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
                  </div>
                  <span className="text-xs text-gray-600">
                    {['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'][index]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm" onClick={() => setShowWithdrawModal(false)}>
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 relative overflow-hidden max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent pointer-events-none"></div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl"></div>

            <div className="relative p-8">
              {/* Close Button */}
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>

              {/* Header */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Withdraw Earnings</h2>
              <p className="text-gray-600 mb-6">Available balance: $4,820.00</p>

              {/* Amount Input */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Withdrawal Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-md border border-white/60 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 shadow-md font-bold text-2xl"
                  />
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => setWithdrawAmount('1000')}
                    className="px-3 py-1 bg-white/60 backdrop-blur-md border border-white/60 text-gray-700 rounded-lg hover:shadow-lg transition-all text-sm font-semibold"
                  >
                    $1,000
                  </button>
                  <button
                    onClick={() => setWithdrawAmount('2500')}
                    className="px-3 py-1 bg-white/60 backdrop-blur-md border border-white/60 text-gray-700 rounded-lg hover:shadow-lg transition-all text-sm font-semibold"
                  >
                    $2,500
                  </button>
                  <button
                    onClick={() => setWithdrawAmount('4820')}
                    className="px-3 py-1 bg-white/60 backdrop-blur-md border border-white/60 text-gray-700 rounded-lg hover:shadow-lg transition-all text-sm font-semibold"
                  >
                    Max
                  </button>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 mb-3 block">Withdraw To</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedPaymentMethod('bank')}
                    className={`w-full p-4 rounded-2xl border transition-all ${
                      selectedPaymentMethod === 'bank'
                        ? 'bg-emerald-100/80 border-emerald-300 shadow-lg'
                        : 'bg-white/60 border-white/60 hover:bg-white/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-bold text-sm text-gray-900">Bank Account</div>
                        <div className="text-xs text-gray-600">••••1234 • 2-3 business days</div>
                      </div>
                      {selectedPaymentMethod === 'bank' && (
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedPaymentMethod('upi')}
                    className={`w-full p-4 rounded-2xl border transition-all ${
                      selectedPaymentMethod === 'upi'
                        ? 'bg-emerald-100/80 border-emerald-300 shadow-lg'
                        : 'bg-white/60 border-white/60 hover:bg-white/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Smartphone className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-bold text-sm text-gray-900">UPI</div>
                        <div className="text-xs text-gray-600">alex@upi • Instant transfer</div>
                      </div>
                      {selectedPaymentMethod === 'upi' && (
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      )}
                    </div>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 px-6 py-3 bg-white/80 backdrop-blur-md border border-white/60 text-gray-700 rounded-xl hover:shadow-lg transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdraw}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105"
                >
                  Confirm Withdrawal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


