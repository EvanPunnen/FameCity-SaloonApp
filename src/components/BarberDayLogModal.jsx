import React from 'react';
import { X, Calendar, Award, Scissors, Clock, Banknote, User } from 'lucide-react';
import { formatCurrency, formatTime, formatDate } from '../utils/helpers';

export default function BarberDayLogModal({ isOpen, onClose, barber, todayTransactions, salonInfo }) {
  if (!isOpen || !barber) return null;

  // Filter transactions for this barber today
  const barberTxns = todayTransactions.filter((t) => t.barberId === barber.id);

  const totalCuts = barberTxns.reduce(
    (acc, t) => acc + t.services.reduce((sAcc, s) => sAcc + (s.quantity || 1), 0),
    0
  );

  const totalRevenue = barberTxns.reduce((acc, t) => acc + (t.finalAmount || 0), 0);
  const totalCommission = barberTxns.reduce((acc, t) => acc + (t.barberCommission || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={barber.photo}
              alt={barber.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">{barber.name}</h3>
                <span className="bg-amber-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded-md">
                  {barber.badgeId}
                </span>
              </div>
              <p className="text-xs text-amber-200/80 mt-0.5">{barber.role}</p>
              <p className="text-xs text-slate-400 mt-1">
                Today's Performance Log • Commission Rate: {barber.commissionRate}%
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-3 gap-3 p-5 bg-amber-50/50 border-b border-amber-100">
          <div className="bg-white p-3.5 rounded-2xl border border-amber-200/70 shadow-2xs">
            <span className="text-xs text-slate-500 font-semibold uppercase block">Services Done</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-slate-900">{totalCuts}</span>
              <span className="text-xs text-slate-500">cuts/services</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-amber-200/70 shadow-2xs">
            <span className="text-xs text-slate-500 font-semibold uppercase block">Total Sales</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-amber-600">
                {formatCurrency(totalRevenue, salonInfo.currency)}
              </span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-2xs">
            <span className="text-xs text-emerald-800 font-semibold uppercase block">My Commission</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-emerald-600">
                {formatCurrency(totalCommission, salonInfo.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Today's Services Breakdown ({barberTxns.length} tickets)</span>
          </h4>

          {barberTxns.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Scissors className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
              <p className="font-semibold text-slate-600">No services logged today yet</p>
              <p className="text-xs mt-1">Services logged on your card will show up here automatically.</p>
            </div>
          ) : (
            barberTxns.map((txn, index) => (
              <div
                key={txn.id}
                className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2 font-mono text-slate-500">
                    <span className="font-bold text-slate-800">#{index + 1}</span>
                    <span>•</span>
                    <span>{formatTime(txn.timestamp)}</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-900">{txn.customerName || 'Walk-in'}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-white border border-slate-200 text-slate-700">
                    {txn.paymentMethod}
                  </span>
                </div>

                <div className="space-y-1 my-2">
                  {txn.services.map((srv, si) => (
                    <div key={si} className="flex justify-between text-xs text-slate-700">
                      <span className="font-medium">• {srv.name} {srv.quantity > 1 ? `x${srv.quantity}` : ''}</span>
                      <span className="font-semibold">
                        {formatCurrency(srv.price * (srv.quantity || 1), salonInfo.currency)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-500">
                    Commission ({barber.commissionRate}%):{' '}
                    <strong className="text-emerald-700">
                      {formatCurrency(txn.barberCommission, salonInfo.currency)}
                    </strong>
                  </span>
                  <span className="text-slate-900 text-sm">
                    {formatCurrency(txn.finalAmount, salonInfo.currency)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-sm font-semibold transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
