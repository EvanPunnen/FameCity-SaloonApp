import React, { useState } from 'react';
import { Lock, X, Delete, ShieldCheck, KeyRound } from 'lucide-react';

export default function PinModal({ isOpen, onClose, onSuccess, currentPin = '1234' }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleDigit = (digit) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setError(false);
      if (newPin.length === 4) {
        if (newPin === currentPin) {
          setTimeout(() => {
            onSuccess();
            setPin('');
          }, 150);
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 800);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const handleClear = () => {
    setPin('');
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 mx-auto mb-3 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-200">
          <Lock className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-slate-900">Owner Access</h3>
        <p className="text-sm text-slate-500 mt-1">Enter 4-digit security PIN to view sales & reports</p>

        {/* PIN Indicators */}
        <div className="flex justify-center gap-4 my-6">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  error
                    ? 'bg-rose-500 scale-110 animate-bounce'
                    : isFilled
                    ? 'bg-blue-600 scale-125'
                    : 'bg-slate-200'
                }`}
              />
            );
          })}
        </div>

        {error && (
          <p className="text-rose-500 text-xs font-semibold mb-3 -mt-2 animate-shake">
            Incorrect PIN. Try again.
          </p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 max-w-[260px] mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleDigit(num.toString())}
              className="h-14 rounded-2xl bg-slate-50 hover:bg-blue-50 active:bg-blue-100 text-slate-800 hover:text-blue-700 font-bold text-xl border border-slate-200 transition-all active:scale-95 shadow-xs cursor-pointer"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-500 font-medium text-sm border border-slate-200 transition-all active:scale-95 cursor-pointer"
          >
            Clear
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="h-14 rounded-2xl bg-slate-50 hover:bg-blue-50 active:bg-blue-100 text-slate-800 hover:text-blue-700 font-bold text-xl border border-slate-200 transition-all active:scale-95 shadow-xs cursor-pointer"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <KeyRound className="w-3.5 h-3.5 text-blue-600" />
          <span>Default PIN is <strong className="text-slate-700">1234</strong></span>
        </div>
      </div>
    </div>
  );
}
