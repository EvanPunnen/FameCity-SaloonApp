import React, { useState, useEffect } from 'react';
import logoImg from '../assets/logo.jpg';
import {
  Scissors,
  Shield,
  Clock,
  Maximize2,
  Minimize2,
  MapPin
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
  salonInfo
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
        
        {/* Left Section: View Navigation Switcher */}
        <div className="flex items-center gap-2 flex-1 justify-start">
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-200">
            <button
              onClick={() => onSwitchView('tablet')}
              className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                currentView === 'tablet'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Tablet Station</span>
            </button>

            <button
              onClick={() => onSwitchView('owner')}
              className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                currentView === 'owner'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>Owner Dashboard</span>
            </button>
          </div>
        </div>

        {/* Center Section: Centered Logo & Brand Fitment */}
        <div
          className="flex flex-col items-center justify-center cursor-pointer group py-0.5 px-3 shrink-0"
          onClick={() => onSwitchView('tablet')}
        >
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src={logoImg}
                alt="Fame City"
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-600 shadow-sm group-hover:scale-105 transition"
              />
              <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[8px] font-black px-1 rounded-sm border border-white">
                FC
              </span>
            </div>

            <div className="text-center sm:text-left">
              <h1 className="text-base sm:text-lg font-black text-slate-950 tracking-wider luxury-serif uppercase leading-tight">
                FAME CITY
              </h1>
              <p className="text-[9px] font-bold tracking-widest text-blue-600 uppercase">
                BE YOUR OWN FAME
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Clock & Fullscreen */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          {/* Live Clock & Date */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-extrabold text-slate-900 font-mono text-xs">{formattedTime}</span>
            <span className="text-slate-400 hidden xl:inline font-medium">• {formattedDate}</span>
          </div>

          {/* Social Links */}
          <div className="hidden sm:flex items-center gap-1">
            {salonInfo.mapsUrl && (
              <a
                href={salonInfo.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Google Maps Location"
                className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 transition"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
              </a>
            )}
            {salonInfo.instagram && (
              <a
                href="https://www.instagram.com/famecity7?dmpr=MXIwc2FocGk1MmJmaA=="
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram Page"
                className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 transition"
              >
                <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />
              </a>
            )}
          </div>

          {/* Fullscreen Button for Tablet */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Tablet Kiosk Fullscreen'}
            className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 transition cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>
    </header>
  );
}
