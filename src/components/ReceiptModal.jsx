import React from 'react';
import { X, Printer, CheckCircle, Share2, Scissors, ArrowDown } from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '../utils/helpers';

export default function ReceiptModal({ isOpen, onClose, transaction, salonInfo }) {
  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 my-auto">
        {/* Top Header Controls in Royal Blue */}
        <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-white" />
            <span className="font-bold text-sm">Service Logged Successfully</span>
          </div>
          <button
            onClick={onClose}
            className="text-blue-100 hover:text-white p-1 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Container */}
        <div className="p-6 bg-slate-50">
          <div
            id="printable-receipt"
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-slate-800 text-sm font-mono relative"
          >
            {/* Salon Header */}
            <div className="text-center pb-4 border-b border-dashed border-slate-300">
              <div className="flex justify-center mb-2">
                <img
                  src={salonInfo.logo || '/logo.jpg'}
                  alt={salonInfo.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-xs"
                />
              </div>
              <h2 className="font-black text-base tracking-wide text-slate-900 uppercase">
                {salonInfo.name}
              </h2>
              <p className="text-xs text-blue-700 font-bold tracking-wider uppercase mt-0.5">
                "{salonInfo.tagline}"
              </p>
              <p className="text-xs text-slate-500 mt-1">{salonInfo.address}</p>
              <p className="text-xs text-slate-500">Ph: {salonInfo.phone}</p>
              {salonInfo.instagram && (
                <p className="text-xs text-blue-600 font-medium">Insta: {salonInfo.instagram}</p>
              )}
            </div>

            {/* Invoice Meta */}
            <div className="py-3 border-b border-dashed border-slate-300 text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Receipt #:</span>
                <span className="font-bold text-slate-900">{transaction.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Time:</span>
                <span>{formatDate(transaction.date)} {formatTime(transaction.timestamp)}</span>
              </div>
              <div className="flex justify-between">
                <span>Stylist:</span>
                <span className="font-bold text-slate-900">
                  {transaction.barberName} ({transaction.barberBadge})
                </span>
              </div>
              {transaction.customerName && (
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="font-semibold text-slate-900">{transaction.customerName}</span>
                </div>
              )}
              {transaction.customerPhone && (
                <div className="flex justify-between">
                  <span>Phone:</span>
                  <span>{transaction.customerPhone}</span>
                </div>
              )}
            </div>

            {/* Itemized Services */}
            <div className="py-3 border-b border-dashed border-slate-300">
              <div className="text-xs font-bold text-slate-500 uppercase mb-2 flex justify-between">
                <span>Service Description</span>
                <span>Amount</span>
              </div>
              <div className="space-y-2">
                {transaction.services.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <div>
                      <span className="text-slate-800 font-medium">{item.name}</span>
                      {item.quantity > 1 && (
                        <span className="text-slate-400 ml-1">x{item.quantity}</span>
                      )}
                    </div>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(item.price * (item.quantity || 1), salonInfo.currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations */}
            <div className="py-3 border-b border-dashed border-slate-300 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span>{formatCurrency(transaction.totalAmount, salonInfo.currency)}</span>
              </div>
              {transaction.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount:</span>
                  <span>-{formatCurrency(transaction.discount, salonInfo.currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
                <span>NET TOTAL PAID:</span>
                <span className="text-base text-blue-600 font-black">
                  {formatCurrency(transaction.finalAmount, salonInfo.currency)}
                </span>
              </div>
            </div>

            {/* Payment Details */}
            <div className="py-3 border-b border-dashed border-slate-300 text-xs space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Payment Mode:</span>
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-blue-600 text-white font-bold uppercase text-[10px]">
                  {transaction.paymentMethod}
                </span>
              </div>
              {transaction.paymentMethod === 'UPI' && transaction.paymentDetails?.upiRef && (
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>UPI Ref:</span>
                  <span className="font-mono">{transaction.paymentDetails.upiRef}</span>
                </div>
              )}
              {transaction.paymentMethod === 'CASH' && transaction.paymentDetails?.cashReceived && (
                <>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Cash Tendered:</span>
                    <span>{formatCurrency(transaction.paymentDetails.cashReceived, salonInfo.currency)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Change Returned:</span>
                    <span>{formatCurrency(transaction.paymentDetails.changeGiven || 0, salonInfo.currency)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Footer Message */}
            <div className="text-center pt-3 text-[11px] text-slate-400 space-y-1">
              <p className="font-semibold text-slate-700">Thank you for visiting Fame City!</p>
              <p>Tag us @famecity7 & flaunt your new look ✨</p>
              <p className="text-[9px] text-slate-400 pt-1 font-sans">
                Fame City Saloon POS System
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white py-3 px-4 rounded-xl font-bold text-sm transition shadow-sm active:scale-98 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-blue-400" />
            <span>Print Receipt</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition shadow-sm active:scale-98 cursor-pointer"
          >
            Done / Next Client
          </button>
        </div>
      </div>
    </div>
  );
}
