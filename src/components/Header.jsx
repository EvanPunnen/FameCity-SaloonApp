import React, { useState, useEffect } from 'react';
import {
  Scissors,
  Shield,
  Clock,
  Maximize2,
  Minimize2,
  MapPin,
  RotateCcw,
  Sparkles,
  Palette,
  Smartphone
} from 'lucide-react';

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function Header({
  currentView,
  onSwitchView,
  salonInfo,
  onResetData,
  onOpenThemeModal,
  onOpenInstallModal
}) {
  const [time, setTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const formattedTime = time.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const formattedDate = time.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-between gap-3">
        
        {/* Brand Left Section */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={() => onSwitchView('tablet')}>
            <img
              src={salonInfo.logo || '/logo.jpg'}
              alt={salonInfo.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-sm group-hover:scale-105 transition"
            />
            <span className="absolute -bottom-1 -right-1 bg-slate-900 text-amber-400 text-[8px] font-black px-1 rounded-sm border border-amber-400">
              FC
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-950 tracking-wider luxury-serif uppercase flex items-center gap-1.5">
                <span>FAME CITY</span>
              </h1>
              <span className="hidden sm:inline-block text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                SALOON POS
              </span>
            </div>
            <p className="text-[10px] font-bold tracking-widest text-amber-700 uppercase">
              BE YOUR OWN FAME
            </p>
          </div>
        </div>

        {/* Live Clock & Date for Tablet */}
        <div className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
          <Clock className="w-4 h-4 text-amber-600 animate-spin-slow" />
          <div className="text-right">
            <span className="font-extrabold text-slate-900 font-mono text-xs">{formattedTime}</span>
            <span className="text-slate-400 ml-1.5 font-medium">{formattedDate}</span>
          </div>
        </div>

        {/* Right Navigation & Interface Switcher */}
        <div className="flex items-center gap-2">
          
          {/* Interface Switch Pills */}
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-200">
            <button
              onClick={() => onSwitchView('tablet')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                currentView === 'tablet'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Scissors className="w-3.5 h-3.5 text-amber-600" />
              <span>Tablet Station</span>
            </button>

            <button
              onClick={() => onSwitchView('owner')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                currentView === 'owner'
                  ? 'bg-slate-900 text-amber-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Owner Dashboard</span>
            </button>
          </div>

          {/* Theme Palette Button */}
          <button
            onClick={onOpenThemeModal}
            title="Modify Salon Color Palette"
            className="w-9 h-9 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 flex items-center justify-center border border-amber-300 transition cursor-pointer"
          >
            <Palette className="w-4 h-4 text-amber-600" />
          </button>

          {/* Install APK / PWA Button */}
          <button
            onClick={onOpenInstallModal}
            title="Install App (APK / PWA)"
            className="w-9 h-9 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 flex items-center justify-center border border-emerald-300 transition cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-emerald-600" />
          </button>

          {/* Social / External Links */}
          <div className="hidden md:flex items-center gap-1 pl-1">
            {salonInfo.mapsUrl && (
              <a
                href={salonInfo.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Google Maps Location"
                className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 transition"
              >
                <MapPin className="w-4 h-4 text-rose-500" />
              </a>
            )}
            {salonInfo.instagram && (
              <a
                href="https://www.instagram.com/famecity7?dmpr=MXIwc2FocGk1MmJmaA=="
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram Page"
                className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 transition"
              >
                <InstagramIcon className="w-4 h-4 text-pink-600" />
              </a>
            )}
          </div>

          {/* Fullscreen Button for Tablet */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Tablet Kiosk Fullscreen'}
            className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 transition"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </header>
  );
}
