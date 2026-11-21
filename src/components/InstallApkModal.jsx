import React, { useState, useEffect } from 'react';
import { X, Smartphone, Download, CheckCircle2, QrCode, Monitor, Tablet, Copy, Check } from 'lucide-react';

export default function InstallApkModal({ isOpen, onClose, salonInfo }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [copied, setCopied] = useState(false);
  const localUrl = window.location.origin;

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert(
        'To install on Android / Tablet:\n\n1. Open Chrome on your tablet.\n2. Tap the 3 dots (⋮) in the top-right corner.\n3. Tap "Install App" or "Add to Home screen".\n\nThis creates the native full-screen Fame City app APK!'
      );
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(localUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-sm">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Install Tablet App (APK)</h3>
              <p className="text-xs text-slate-500">
                Run Fame City as a standalone fullscreen app on your salon tablet
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

        {/* Content */}
        <div className="py-5 space-y-4 text-xs">
          {/* 1-Click Install Button */}
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-bold text-slate-900 text-sm">Direct Android Tablet Installation</p>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Installs as a native APK with the Fame City crown icon and full kiosk mode.
                </p>
              </div>
            </div>

            <button
              onClick={handleInstallClick}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-black text-amber-300 font-extrabold text-xs flex items-center justify-center gap-2 transition shadow-sm active:scale-98 cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>TAP TO INSTALL APP NOW</span>
            </button>
          </div>

          {/* Wi-Fi URL for Tablet */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <Tablet className="w-4 h-4 text-amber-600" />
              <span>Open on Your Salon Tablet / Phone:</span>
            </p>
            <p className="text-slate-500 text-[11px]">
              Connect your tablet to the same salon Wi-Fi and open this URL in Chrome:
            </p>

            <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 font-mono text-xs">
              <span className="flex-1 text-slate-800 font-bold truncate">{localUrl}</span>
              <button
                onClick={copyUrl}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans font-semibold flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Step by step instructions */}
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <p className="font-bold text-slate-700">Quick 2-Step Tablet Setup:</p>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 leading-relaxed">
              <li>
                Open the link above in <strong>Google Chrome</strong> on your tablet.
              </li>
              <li>
                Tap the <strong>3 vertical dots (⋮)</strong> menu at the top right of Chrome and select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
              </li>
              <li>
                The Fame City icon will appear on your tablet home screen. Tap it to launch full-screen!
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
}
