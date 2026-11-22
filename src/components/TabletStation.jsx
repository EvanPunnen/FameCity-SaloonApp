import React, { useState, useMemo } from 'react';
import {
  Scissors,
  Plus,
  Clock,
  Sparkles,
  TrendingUp,
  UserCheck,
  Search,
  DollarSign,
  Award,
  ChevronRight,
  Shield,
  Layers,
  CheckCircle2,
  Edit2,
  Zap,
  X,
  User
} from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { AVATAR_PRESETS } from '../data/themes';
import ServiceModal from './ServiceModal';
import BarberDayLogModal from './BarberDayLogModal';

export default function TabletStation({
  barbers,
  services,
  categories,
  transactions,
  salonInfo,
  onRecordSale,
  onOpenOwnerDashboard,
  onUpdateBarbers
}) {
  const [selectedBarberForService, setSelectedBarberForService] = useState(null);
  const [selectedBarberForLog, setSelectedBarberForLog] = useState(null);
  const [editingBarberDirect, setEditingBarberDirect] = useState(null); // Direct edit employee data modal
  const [leaveConfirmBarber, setLeaveConfirmBarber] = useState(null); // Leave confirmation dialog
  const [searchBarber, setSearchBarber] = useState('');

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Quick toggle attendance / leave for a stylist
  const handleToggleLeave = (barberId) => {
    onUpdateBarbers(
      barbers.map((b) =>
        b.id === barberId
          ? {
              ...b,
              isOnLeave: !b.isOnLeave,
              leaveReason: !b.isOnLeave ? (b.leaveReason || 'On Leave Today') : ''
            }
          : b
      )
    );
  };

  const handleStartServiceForBarber = (barber) => {
    if (barber.isOnLeave) {
      setLeaveConfirmBarber(barber);
    } else {
      setSelectedBarberForService(barber);
    }
  };

  // Filter today's transactions
  const todayTransactions = useMemo(() => {
    return transactions.filter((t) => t.date === todayStr);
  }, [transactions, todayStr]);

  // Today's total sales
  const todayTotalSales = useMemo(() => {
    return todayTransactions.reduce((acc, t) => acc + (t.finalAmount || 0), 0);
  }, [todayTransactions]);

  // Today's total cuts / services
  const todayTotalCuts = useMemo(() => {
    return todayTransactions.reduce(
      (acc, t) => acc + t.services.reduce((sAcc, s) => sAcc + (s.quantity || 1), 0),
      0
    );
  }, [todayTransactions]);

  // Compute stats per barber for today
  const barberTodayStats = useMemo(() => {
    const map = {};
    barbers.forEach((b) => {
      map[b.id] = { cuts: 0, revenue: 0 };
    });

    todayTransactions.forEach((t) => {
      if (map[t.barberId]) {
        const cutCount = t.services.reduce((acc, s) => acc + (s.quantity || 1), 0);
        map[t.barberId].cuts += cutCount;
        map[t.barberId].revenue += t.finalAmount || 0;
      }
    });

    return map;
  }, [barbers, todayTransactions]);

  // Filtered barbers
  const filteredBarbers = useMemo(() => {
    return barbers.filter(
      (b) =>
        b.name.toLowerCase().includes(searchBarber.toLowerCase()) ||
        b.badgeId.toLowerCase().includes(searchBarber.toLowerCase()) ||
        b.role.toLowerCase().includes(searchBarber.toLowerCase())
    );
  }, [barbers, searchBarber]);

  // Handle direct employee save
  const handleSaveBarberDirect = (e) => {
    e.preventDefault();
    if (!editingBarberDirect) return;
    onUpdateBarbers(
      barbers.map((b) => (b.id === editingBarberDirect.id ? { ...editingBarberDirect } : b))
    );
    setEditingBarberDirect(null);
  };

  const activeDefaultBarber = barbers[0];

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col bg-slate-50/80">
      
      {/* Tablet Hero Banner: Live Salon Pulse & Quick Action Bar */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-8 py-4 sm:py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                TABLET BARBER STATION
              </span>
              <span className="text-xs text-slate-400">• White & Blue Saloon Theme</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              Barbers & Service Terminal
            </h1>
          </div>

          {/* Quick Metrics & Station Actions */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-3">
            {/* Quick Bill / Select Service Direct Button */}
            <button
              onClick={() => setSelectedBarberForService(activeDefaultBarber)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 transition shadow-sm active:scale-95 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current text-white" />
              <span>⚡ SELECT SERVICES / BILL</span>
            </button>

            {/* Owner Dashboard Access */}
            <button
              onClick={onOpenOwnerDashboard}
              className="bg-slate-900 hover:bg-black text-white font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 transition shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Owner Dashboard</span>
            </button>
          </div>
        </div>

        {/* Real-time Ticker Metrics */}
        <div className="max-w-7xl mx-auto mt-4 pt-3 border-t border-slate-100 flex items-center gap-4 text-xs overflow-x-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Today's Services:</span>
            <span className="font-extrabold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              ✂️ {todayTotalCuts} Cuts & Services
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Today's Revenue:</span>
            <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {formatCurrency(todayTotalSales, salonInfo.currency)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Staff Today:</span>
            <span className="font-extrabold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              🟢 {barbers.filter((b) => !b.isOnLeave).length} / {barbers.length} On Duty
              {barbers.some((b) => b.isOnLeave) && (
                <span className="text-amber-700 font-bold ml-1.5">
                  ({barbers.filter((b) => b.isOnLeave).length} On Leave)
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Main Barbers Grid Content */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 flex-1 flex flex-col">
        
        {/* Search Bar & Helper Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Barbers & Stylists ({filteredBarbers.length})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click on a card to select services or edit employee details
            </p>
          </div>

          <div className="w-full sm:w-72 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Find barber by name or badge ID..."
              value={searchBarber}
              onChange={(e) => setSearchBarber(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden shadow-2xs"
            />
          </div>
        </div>

        {/* The Barbers Cubes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredBarbers.map((barber) => {
            const stats = barberTodayStats[barber.id] || { cuts: 0, revenue: 0 };
            return (
              <div
                key={barber.id}
                className={`group bg-white rounded-3xl p-6 border-2 transition-all duration-200 shadow-sm hover:shadow-xl relative flex flex-col justify-between overflow-hidden ${
                  barber.isOnLeave
                    ? 'border-amber-300 bg-amber-50/15 hover:border-amber-400'
                    : 'border-slate-200 hover:border-blue-500'
                }`}
              >
                {/* Top Accent Line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 transition ${
                    barber.isOnLeave
                      ? 'bg-gradient-to-r from-amber-400 to-amber-600'
                      : 'bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 opacity-80 group-hover:opacity-100'
                  }`}
                />

                {/* Barber Header Info */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="relative">
                      <img
                        src={barber.photo}
                        alt={barber.name}
                        className={`w-20 h-20 rounded-2xl object-cover border-2 shadow-sm group-hover:scale-105 transition-transform ${
                          barber.isOnLeave ? 'border-amber-400 opacity-85' : 'border-blue-400'
                        }`}
                      />
                      <span
                        className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full border-2 border-white shadow-xs ${
                          barber.isOnLeave ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        title={barber.isOnLeave ? 'On Leave' : 'Active on duty'}
                      />
                    </div>

                    <div className="text-right flex flex-col items-end gap-1.5">
                      <span className="inline-block bg-blue-600 text-white font-mono font-extrabold text-xs px-2.5 py-1 rounded-lg tracking-wider shadow-xs">
                        {barber.badgeId}
                      </span>
                      {/* Attendance Toggle Pill */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleLeave(barber.id);
                        }}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1 border transition cursor-pointer ${
                          barber.isOnLeave
                            ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                        }`}
                        title="Click to toggle leave / attendance status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${barber.isOnLeave ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        <span>{barber.isOnLeave ? '🌴 On Leave' : '🟢 On Duty'}</span>
                      </button>
                    </div>
                  </div>

                  {/* On Leave Notice Banner */}
                  {barber.isOnLeave && (
                    <div className="mb-3 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-900 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <span>🌴 Marked on leave today</span>
                        {barber.leaveReason && <span className="text-amber-700 font-normal">({barber.leaveReason})</span>}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleLeave(barber.id)}
                        className="text-amber-800 hover:text-amber-950 underline font-bold cursor-pointer text-[10px]"
                      >
                        Mark Present
                      </button>
                    </div>
                  )}

                  {/* Name & Specialty */}
                  <div className="mb-4">
                    <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-700 transition">
                      {barber.name}
                    </h3>
                    <p className="text-xs font-semibold text-blue-600 mt-0.5">
                      {barber.role}
                    </p>
                  </div>

                  {/* Today's Counter Pill */}
                  <div className="bg-blue-50/70 rounded-2xl p-3 border border-blue-100 mb-5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-blue-900 font-bold flex items-center gap-1.5">
                        <Scissors className="w-3.5 h-3.5 text-blue-600" />
                        Today's Work:
                      </span>
                      <span className="font-extrabold text-blue-900 bg-white px-2 py-0.5 rounded-md border border-blue-200">
                        {stats.cuts} Cuts / Services
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-blue-200/50 text-xs">
                      <span className="text-slate-500">Sales Generated:</span>
                      <span className="font-bold text-blue-700">
                        {formatCurrency(stats.revenue, salonInfo.currency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Touch Actions */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => handleStartServiceForBarber(barber)}
                    className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-98 cursor-pointer"
                  >
                    <Plus className="w-5 h-5 stroke-[2.5]" />
                    <span>+ SELECT SERVICES & BILL</span>
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedBarberForLog(barber)}
                      className="flex-1 py-2 px-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 border border-slate-200 transition cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Day Log ({stats.cuts})</span>
                    </button>

                    <button
                      onClick={() => setEditingBarberDirect({ ...barber })}
                      className="py-2 px-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs flex items-center justify-center gap-1 border border-blue-200 transition cursor-pointer"
                      title="Edit this Employee's details"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleToggleLeave(barber.id)}
                      className={`py-2 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 border transition cursor-pointer ${
                        barber.isOnLeave
                          ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                      }`}
                      title={barber.isOnLeave ? 'Mark Stylist On Duty' : 'Mark Stylist On Leave for Today'}
                    >
                      <span>{barber.isOnLeave ? '🟢 Present' : '🌴 Leave'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredBarbers.length === 0 && (
          <div className="py-16 text-center text-slate-400">
            <p className="text-lg font-bold">No barbers found matching "{searchBarber}"</p>
          </div>
        )}

      </div>

      {/* Service Logging Modal */}
      {selectedBarberForService && (
        <ServiceModal
          isOpen={Boolean(selectedBarberForService)}
          onClose={() => setSelectedBarberForService(null)}
          barber={selectedBarberForService}
          services={services}
          categories={categories}
          salonInfo={salonInfo}
          onRecordSale={onRecordSale}
        />
      )}

      {/* Barber Personal Day Log Modal */}
      {selectedBarberForLog && (
        <BarberDayLogModal
          isOpen={Boolean(selectedBarberForLog)}
          onClose={() => setSelectedBarberForLog(null)}
          barber={selectedBarberForLog}
          todayTransactions={todayTransactions}
          salonInfo={salonInfo}
        />
      )}

      {/* DIRECT EDIT EMPLOYEE MODAL (Accessible right from Tablet Station) */}
      {editingBarberDirect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Edit Employee: {editingBarberDirect.name}
                  </h3>
                  <p className="text-xs text-slate-500">Update stylist name, badge ID, role, and photo</p>
                </div>
              </div>
              <button
                onClick={() => setEditingBarberDirect(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBarberDirect} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingBarberDirect.name}
                  onChange={(e) => setEditingBarberDirect({ ...editingBarberDirect, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Badge ID</label>
                  <input
                    type="text"
                    required
                    value={editingBarberDirect.badgeId}
                    onChange={(e) => setEditingBarberDirect({ ...editingBarberDirect, badgeId: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono font-bold uppercase focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={editingBarberDirect.phone || ''}
                    onChange={(e) => setEditingBarberDirect({ ...editingBarberDirect, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role / Title</label>
                <input
                  type="text"
                  value={editingBarberDirect.role}
                  onChange={(e) => setEditingBarberDirect({ ...editingBarberDirect, role: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Today's Attendance / Leave Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Today's Attendance Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingBarberDirect({ ...editingBarberDirect, isOnLeave: false })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      !editingBarberDirect.isOnLeave
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>🟢 On Duty / Present</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingBarberDirect({ ...editingBarberDirect, isOnLeave: true })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      editingBarberDirect.isOnLeave
                        ? 'bg-amber-50 border-amber-500 text-amber-800 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>🌴 On Leave Today</span>
                  </button>
                </div>
                {editingBarberDirect.isOnLeave && (
                  <input
                    type="text"
                    placeholder="Reason for leave (e.g. Weekly Off, Sick, Personal)..."
                    value={editingBarberDirect.leaveReason || ''}
                    onChange={(e) => setEditingBarberDirect({ ...editingBarberDirect, leaveReason: e.target.value })}
                    className="mt-2 w-full px-3 py-2 text-xs rounded-xl border border-amber-300 bg-amber-50/50 text-amber-950 focus:ring-2 focus:ring-amber-500"
                  />
                )}
              </div>

              {/* Photo Avatar Preset Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Stylist Photo Preset</label>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {AVATAR_PRESETS.map((av, idx) => (
                    <img
                      key={idx}
                      src={av.url}
                      alt={av.label}
                      onClick={() => setEditingBarberDirect({ ...editingBarberDirect, photo: av.url })}
                      className={`w-12 h-12 rounded-xl object-cover cursor-pointer border-2 transition ${
                        editingBarberDirect.photo === av.url ? 'border-blue-600 scale-105 shadow-md' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
                <input
                  type="url"
                  placeholder="Or paste custom image URL..."
                  value={editingBarberDirect.photo}
                  onChange={(e) => setEditingBarberDirect({ ...editingBarberDirect, photo: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white mt-1 text-slate-500"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingBarberDirect(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                >
                  Save Stylist Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave Confirmation Dialog when tapping Select Services on stylist on leave */}
      {leaveConfirmBarber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-amber-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-2xl">
                🌴
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Stylist Currently On Leave
                </h3>
                <p className="text-xs text-slate-500">
                  {leaveConfirmBarber.name} ({leaveConfirmBarber.badgeId}) is marked on leave today.
                </p>
              </div>
            </div>

            {leaveConfirmBarber.leaveReason && (
              <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-900 font-semibold mb-4 border border-amber-200">
                Reason noted: {leaveConfirmBarber.leaveReason}
              </div>
            )}

            <p className="text-xs text-slate-600 mb-5">
              Would you like to proceed with logging a customer bill under {leaveConfirmBarber.name}, or mark them back on duty first?
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  const b = leaveConfirmBarber;
                  setLeaveConfirmBarber(null);
                  setSelectedBarberForService(b);
                }}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer"
              >
                Proceed with Bill
              </button>
              <button
                onClick={() => {
                  const b = leaveConfirmBarber;
                  handleToggleLeave(b.id);
                  setLeaveConfirmBarber(null);
                  setSelectedBarberForService({ ...b, isOnLeave: false });
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer"
              >
                🟢 Mark Present & Bill
              </button>
              <button
                onClick={() => setLeaveConfirmBarber(null)}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
