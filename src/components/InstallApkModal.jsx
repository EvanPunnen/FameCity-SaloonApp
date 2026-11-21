import React, { useState, useEffect } from 'react';
import { X, Smartphone, Download, CheckCircle2, QrCode, Monitor, Tablet, Copy, Check, Info } from 'lucide-react';

export default function InstallApkModal({ isOpen, onClose, salonInfo }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [copied, setCopied] = useState(false);
  const currentUrl = window.location.href;

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
      try {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setDeferredPrompt(null);
          onClose();
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      // If prompt is not ready yet, guide the user to the native Chrome menu
      alert(
        '📱 How to Install Directly:\n\n' +
        '1. Tap the 3 dots menu (⋮) at the top-right corner of Chrome.\n' +
        '2. Tap "Install app" (or "Add to Home screen").\n' +
        '3. Tap "Add / Install".\n\n' +
        'This creates the official full-screen Fame City app on your home screen!'
      );
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(currentUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-xs">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Install Fame City App</h3>
              <p className="text-xs text-slate-500">
                Run as a full-screen standalone app on your tablet or phone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-5 space-y-4 text-xs">
          
          {/* Direct Install Button */}
          <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-200">
            <p className="font-bold text-blue-950 text-sm mb-1">Direct Installation</p>
            <p className="text-blue-700 text-[11px] mb-3">
              Installs with the official Fame City logo icon and runs in fullscreen kiosk mode.
            </p>

            <button
              onClick={handleInstallClick}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition shadow-md active:scale-98 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>TAP TO INSTALL APP</span>
            </button>
          </div>

          {/* Quick Chrome / Safari 2-Step Guide */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600" />
              <span>If it says "Can't install app right now":</span>
            </p>
            <div className="space-y-2 text-slate-600 leading-relaxed text-[11px]">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <p className="font-bold text-slate-900 mb-0.5">On Android Chrome:</p>
                <p>
                  1. Tap the <strong>3 vertical dots menu (⋮)</strong> at the top right of Chrome.<br />
                  2. Select <strong>"Add to Home screen"</strong> (or <strong>"Install app"</strong>).<br />
                  3. Tap <strong>"Install"</strong> — this bypasses WebAPK server minting delays and instantly places the app icon on your tablet!
                </p>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <p className="font-bold text-slate-900 mb-0.5">On iPad / iPhone (Safari):</p>
                <p>
                  1. Tap the <strong>Share</strong> button (box with upward arrow).<br />
                  2. Scroll down and tap <strong>"Add to Home Screen"</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Share / Open URL */}
          <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono text-xs">
            <span className="flex-1 text-slate-800 font-semibold truncate text-[11px]">{currentUrl}</span>
            <button
              onClick={copyUrl}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-sans font-bold flex items-center gap-1 border border-slate-200"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
