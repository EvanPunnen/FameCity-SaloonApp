import React, { useState } from 'react';
import { X, Palette, Check, Sparkles, Sliders, RefreshCw } from 'lucide-react';
import { COLOR_THEMES } from '../data/themes';

export default function ThemeModal({ isOpen, onClose, currentTheme, onSelectTheme }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Salon Color Palette</h3>
              <p className="text-xs text-slate-500">
                Customize Fame City's branding colors and visual theme
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Themes Grid */}
        <div className="py-4 space-y-3 max-h-[65vh] overflow-y-auto pr-1">
          {COLOR_THEMES.map((th) => {
            const isSelected = (currentTheme?.id || 'famecity-gold') === th.id;
            return (
              <div
                key={th.id}
                onClick={() => onSelectTheme(th)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/40 shadow-sm ring-1 ring-amber-400'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {/* Color Swatch Circle */}
                  <div className="flex -space-x-2 overflow-hidden p-1 rounded-xl bg-slate-100 border border-slate-200">
                    <span
                      className="inline-block w-6 h-6 rounded-full shadow-xs"
                      style={{ backgroundColor: th.primary }}
                    />
                    <span
                      className="inline-block w-6 h-6 rounded-full shadow-xs"
                      style={{ backgroundColor: th.accent }}
                    />
                    <span
                      className="inline-block w-6 h-6 rounded-full border border-slate-300"
                      style={{ backgroundColor: th.bg }}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{th.name}</h4>
                      {isSelected && (
                        <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{th.description}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition ${
                      isSelected
                        ? 'bg-amber-500 border-amber-600 text-slate-950'
                        : 'border-slate-300 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Changes apply instantly across all tablet and owner screens.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
