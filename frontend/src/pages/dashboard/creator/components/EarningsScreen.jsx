import { Calendar, Clock, Download, FileText, Wallet } from 'lucide-react';
import { useMemo } from 'react';
import { useApp } from '../../shared/context/AppContext';

function parseMoney(value) {
  return Number(String(value || '').replace(/[^\d.-]/g, '')) || 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function EarningsScreen() {
  const { payments = [], analytics = {}, loadingDashboard } = useApp() || {};
  const totals = useMemo(() => {
    const total = payments.reduce((sum, payment) => sum + parseMoney(payment.amount), 0);
    const pending = payments
      .filter((payment) => ['pending', 'held'].includes(String(payment.status || '').toLowerCase()))
      .reduce((sum, payment) => sum + parseMoney(payment.amount), 0);
    const released = payments
      .filter((payment) => String(payment.status || '').toLowerCase() === 'released')
      .reduce((sum, payment) => sum + parseMoney(payment.amount), 0);
    return { total, pending, released };
  }, [payments]);

  const performance = analytics.performanceData || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card label="Total Recorded" value={formatCurrency(totals.total)} helper={`${payments.length} database payments`} />
        <Card label="Released" value={formatCurrency(totals.released)} helper="Paid out from escrow" />
        <Card label="Pending / Held" value={formatCurrency(totals.pending)} helper="Awaiting release" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section className="xl:col-span-8 rounded-3xl border border-white/50 bg-white/60 p-6 shadow-xl backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Payment History</h3>
            <button className="flex items-center gap-2 rounded-xl border border-white/60 bg-white/60 px-4 py-2 text-sm font-semibold text-gray-700">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
          {loadingDashboard ? (
            <Empty title="Loading payments" body="Fetching payment records from the database." />
          ) : payments.length ? (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div key={payment.id} className="rounded-2xl border border-white/60 bg-white/60 p-4 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg">
                      <Wallet className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{payment.campaign}</h4>
                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                        <Calendar className="h-3 w-3" />
                        <span>{payment.date}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-700">{payment.amount}</div>
                      <div className="mt-1 text-xs font-bold uppercase text-gray-500">{payment.status}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty title="No payments yet" body="Only payment records stored in the database are displayed here." />
          )}
        </section>

        <section className="xl:col-span-4 rounded-3xl border border-white/50 bg-white/60 p-6 shadow-xl backdrop-blur-xl">
          <h3 className="mb-6 text-lg font-bold text-gray-900">Monthly Earnings</h3>
          {performance.length ? (
            <div className="flex h-56 items-end justify-between gap-3">
              {performance.map((row) => {
                const max = Math.max(...performance.map((item) => Number(item.spend || 0)), 1);
                const height = (Number(row.spend || 0) / max) * 100;
                return (
                  <div key={row.month} className="flex flex-1 flex-col items-center gap-3">
                    <div className="text-xs font-bold text-gray-900">{formatCurrency(row.spend || 0)}</div>
                    <div className="w-full rounded-t-xl bg-gradient-to-t from-emerald-500 to-emerald-400" style={{ height: `${Math.max(height, 4)}%` }} />
                    <span className="text-xs text-gray-600">{row.month}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <Empty title="No chart data" body="Monthly payment data will appear after database payments exist." />
          )}
        </section>
      </div>
    </div>
  );
}

function Card({ label, value, helper }) {
  return (
    <div className="rounded-3xl border-2 border-white/60 bg-gradient-to-br from-emerald-300/80 to-teal-400/80 p-6 shadow-2xl">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-emerald-950/80">{label}</div>
          <div className="mt-2 text-3xl font-bold text-white drop-shadow-lg">{value}</div>
          <div className="mt-2 text-xs font-semibold text-emerald-950/80">{helper}</div>
        </div>
        <Clock className="h-6 w-6 text-emerald-950/70" />
      </div>
    </div>
  );
}

function Empty({ title, body }) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/50 p-8 text-center">
      <FileText className="mx-auto h-8 w-8 text-emerald-700" />
      <p className="mt-3 font-bold text-gray-900">{title}</p>
      <p className="mt-2 text-sm text-gray-600">{body}</p>
    </div>
  );
}
