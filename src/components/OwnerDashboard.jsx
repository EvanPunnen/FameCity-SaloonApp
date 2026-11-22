import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  Scissors,
  Users,
  Calendar,
  CreditCard,
  Banknote,
  QrCode,
  Download,
  Printer,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Layers,
  Award,
  ChevronDown,
  Trash2,
  FileText,
  BarChart3,
  SlidersHorizontal,
  Settings,
  RefreshCw,
  Eye,
  CheckCircle2,
  Smartphone,
  Edit2,
  Check,
  X,
  Palette,
  Clock,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { formatCurrency, formatDate, formatTime, exportToCSV } from '../utils/helpers';
import { AVATAR_PRESETS } from '../data/themes';
import ReceiptModal from './ReceiptModal';

export default function OwnerDashboard({
  barbers,
  services,
  categories,
  transactions,
  salonInfo,
  onUpdateBarbers,
  onUpdateServices,
  onUpdateSalonInfo,
  onDeleteTransaction,
  onBackToTablet,
  initialTab = 'overview'
}) {
  // Navigation tabs in Owner Dashboard
  const [activeTab, setActiveTab] = useState(initialTab); // 'overview' | 'barbers' | 'services' | 'transactions' | 'settings'

  // Date filtering state
  const [dateFilter, setDateFilter] = useState('today'); // 'today' | 'yesterday' | 'week' | 'month' | 'all' | 'custom'
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Transactions table search & filters
  const [searchTxn, setSearchTxn] = useState('');
  const [filterBarber, setFilterBarber] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');

  // Receipt viewing modal
  const [viewingReceiptTxn, setViewingReceiptTxn] = useState(null);

  // Add / Edit Barber State
  const [isAddBarberOpen, setIsAddBarberOpen] = useState(false);
  const [editingBarber, setEditingBarber] = useState(null); // null or barber object
  const [newBarber, setNewBarber] = useState({
    name: '',
    badgeId: '',
    role: 'Senior Stylist',
    photo: AVATAR_PRESETS[0].url,
    phone: '',
    commissionRate: 30
  });

  // Add / Edit Service State
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [editingService, setEditingService] = useState(null); // null or service object
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState('all');
  const [searchService, setSearchService] = useState('');
  const [newService, setNewService] = useState({
    name: '',
    category: 'hair',
    price: 300,
    duration: 30,
    description: ''
  });

  // Settings State
  const [settingsForm, setSettingsForm] = useState({ ...salonInfo });
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // Today string
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Compute yesterday string
  const yesterdayStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  }, []);

  // Filter transactions based on date filter
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return transactions.filter((t) => {
      const tDate = new Date(t.date);

      if (dateFilter === 'today') {
        return t.date === todayStr;
      }
      if (dateFilter === 'yesterday') {
        return t.date === yesterdayStr;
      }
      if (dateFilter === 'week') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        return tDate >= sevenDaysAgo && tDate <= now;
      }
      if (dateFilter === 'month') {
        return tDate.getFullYear() === currentYear && tDate.getMonth() === currentMonth;
      }
      if (dateFilter === 'custom') {
        if (customStartDate && customEndDate) {
          return t.date >= customStartDate && t.date <= customEndDate;
        }
      }
      return true; // 'all'
    });
  }, [transactions, dateFilter, todayStr, yesterdayStr, customStartDate, customEndDate]);

  // Executive Metrics
  const totalGrossSales = useMemo(() => {
    return filteredTransactions.reduce((acc, t) => acc + (t.finalAmount || 0), 0);
  }, [filteredTransactions]);

  const totalCutsCount = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, t) => acc + t.services.reduce((sAcc, s) => sAcc + (s.quantity || 1), 0),
      0
    );
  }, [filteredTransactions]);

  const totalClientsCount = filteredTransactions.length;
  const avgTicketValue = totalClientsCount > 0 ? Math.round(totalGrossSales / totalClientsCount) : 0;

  // Monthly Sales Total
  const monthlyTotalSales = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    return transactions
      .filter((t) => {
        const d = new Date(t.date);
        return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      })
      .reduce((acc, t) => acc + (t.finalAmount || 0), 0);
  }, [transactions]);

  // Payment Breakdown
  const paymentBreakdown = useMemo(() => {
    const summary = {
      UPI: { amount: 0, count: 0, label: 'UPI / Online (GPay/PhonePe)', icon: QrCode, color: 'bg-blue-600' },
      CASH: { amount: 0, count: 0, label: 'Cash Tendered', icon: Banknote, color: 'bg-emerald-500' },
      CARD: { amount: 0, count: 0, label: 'Card Swipe', icon: CreditCard, color: 'bg-indigo-500' }
    };

    filteredTransactions.forEach((t) => {
      const method = t.paymentMethod || 'CASH';
      if (!summary[method]) {
        summary[method] = { amount: 0, count: 0, label: method, icon: Banknote, color: 'bg-slate-500' };
      }
      summary[method].amount += t.finalAmount || 0;
      summary[method].count += 1;
    });

    return summary;
  }, [filteredTransactions]);

  // Barber Performance Matrix
  const barberPerformance = useMemo(() => {
    const map = {};
    barbers.forEach((b) => {
      map[b.id] = {
        ...b,
        cuts: 0,
        tickets: 0,
        revenue: 0,
        topServices: {}
      };
    });

    filteredTransactions.forEach((t) => {
      if (map[t.barberId]) {
        const itemCuts = t.services.reduce((acc, s) => acc + (s.quantity || 1), 0);
        map[t.barberId].cuts += itemCuts;
        map[t.barberId].tickets += 1;
        map[t.barberId].revenue += t.finalAmount || 0;

        t.services.forEach((s) => {
          map[t.barberId].topServices[s.name] = (map[t.barberId].topServices[s.name] || 0) + (s.quantity || 1);
        });
      }
    });

    return Object.values(map).sort((a, b) => b.revenue - a.revenue);
  }, [barbers, filteredTransactions]);

  // Daily Trend Data
  const dailyTrends = useMemo(() => {
    const dayMap = {};
    filteredTransactions.forEach((t) => {
      if (!dayMap[t.date]) {
        dayMap[t.date] = { date: t.date, revenue: 0, cuts: 0, count: 0 };
      }
      dayMap[t.date].revenue += t.finalAmount || 0;
      dayMap[t.date].cuts += t.services.reduce((acc, s) => acc + (s.quantity || 1), 0);
      dayMap[t.date].count += 1;
    });

    return Object.values(dayMap).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredTransactions]);

  const maxDailyRevenue = useMemo(() => {
    return Math.max(...dailyTrends.map((d) => d.revenue), 1000);
  }, [dailyTrends]);

  // Search & Filtered Transactions
  const auditTransactions = useMemo(() => {
    return filteredTransactions.filter((t) => {
      const matchSearch =
        t.id.toLowerCase().includes(searchTxn.toLowerCase()) ||
        t.barberName.toLowerCase().includes(searchTxn.toLowerCase()) ||
        (t.customerName && t.customerName.toLowerCase().includes(searchTxn.toLowerCase())) ||
        (t.customerPhone && t.customerPhone.includes(searchTxn));

      const matchBarber = filterBarber === 'all' || t.barberId === filterBarber;
      const matchPayment = filterPayment === 'all' || t.paymentMethod === filterPayment;

      return matchSearch && matchBarber && matchPayment;
    });
  }, [filteredTransactions, searchTxn, filterBarber, filterPayment]);

  // Filtered Services in Management Tab
  const displayedServices = useMemo(() => {
    return services.filter((srv) => {
      const matchesCat = serviceCategoryFilter === 'all' || srv.category === serviceCategoryFilter;
      const matchesSearch =
        srv.name.toLowerCase().includes(searchService.toLowerCase()) ||
        (srv.description && srv.description.toLowerCase().includes(searchService.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [services, serviceCategoryFilter, searchService]);

  // --- BARBERS HANDLERS ---
  const handleAddBarber = (e) => {
    e.preventDefault();
    if (!newBarber.name || !newBarber.badgeId) {
      alert('Please enter barber name and badge ID');
      return;
    }
    const created = {
      ...newBarber,
      id: `fc-${Date.now()}`,
      status: 'active',
      joinedDate: todayStr
    };
    onUpdateBarbers([...barbers, created]);
    setIsAddBarberOpen(false);
    setNewBarber({
      name: '',
      badgeId: '',
      role: 'Senior Stylist',
      photo: AVATAR_PRESETS[0].url,
      phone: '',
      commissionRate: 30
    });
  };

  const handleSaveEditBarber = (e) => {
    e.preventDefault();
    if (!editingBarber) return;
    onUpdateBarbers(
      barbers.map((b) => (b.id === editingBarber.id ? { ...editingBarber } : b))
    );
    setEditingBarber(null);
  };

  const handleDeleteBarber = (barberId) => {
    const target = barbers.find((b) => b.id === barberId);
    if (confirm(`Are you sure you want to remove barber "${target?.name}"?`)) {
      onUpdateBarbers(barbers.filter((b) => b.id !== barberId));
    }
  };

  // --- SERVICES HANDLERS ---
  const handleAddService = (e) => {
    e.preventDefault();
    if (!newService.name || !newService.price) {
      alert('Please enter service name and price');
      return;
    }
    const created = {
      ...newService,
      id: `srv-${Date.now()}`,
      price: Number(newService.price),
      duration: Number(newService.duration)
    };
    onUpdateServices([...services, created]);
    setIsAddServiceOpen(false);
    setNewService({
      name: '',
      category: 'hair',
      price: 300,
      duration: 30,
      description: ''
    });
  };

  const handleSaveEditService = (e) => {
    e.preventDefault();
    if (!editingService) return;
    onUpdateServices(
      services.map((s) =>
        s.id === editingService.id
          ? {
              ...editingService,
              price: Number(editingService.price),
              duration: Number(editingService.duration)
            }
          : s
      )
    );
    setEditingService(null);
  };

  const handleDeleteService = (serviceId) => {
    const target = services.find((s) => s.id === serviceId);
    if (confirm(`Are you sure you want to delete service "${target?.name}" from the menu?`)) {
      onUpdateServices(services.filter((s) => s.id !== serviceId));
    }
  };

  // --- SETTINGS HANDLERS ---
  const handleSaveSettings = (e) => {
    e.preventDefault();
    onUpdateSalonInfo(settingsForm);
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16">
      
      {/* Top Owner Header - White & Blue Theme */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Owner Dashboard
                </h1>
                <span className="bg-blue-50 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                  WHITE & BLUE
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Fame City Financials, Barbers & Services Control Center
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('barbers')}
              className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs flex items-center gap-1.5 transition border border-blue-200 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>+ Add / Edit Barbers</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs flex items-center gap-1.5 transition border border-blue-200 cursor-pointer"
            >
              <Scissors className="w-3.5 h-3.5 text-blue-600" />
              <span>+ Add / Edit Services</span>
            </button>

            <button
              onClick={() => exportToCSV(filteredTransactions, `famecity-sales-${dateFilter}.csv`)}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition border border-slate-200 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>CSV</span>
            </button>

            <button
              onClick={onBackToTablet}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm active:scale-95 cursor-pointer ml-1"
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Tablet Station</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center gap-1 sm:gap-2 border-t border-slate-100 overflow-x-auto">
          {[
            { id: 'overview', label: '📊 Financial Overview', icon: BarChart3 },
            { id: 'barbers', label: '💈 Barbers (+ Add & Edit)', icon: Award },
            { id: 'services', label: '✂️ Services & Pricing (+ Add & Edit)', icon: Scissors },
            { id: 'transactions', label: '🧾 Transactions Log', icon: FileText },
            { id: 'settings', label: '⚙️ Salon Settings & PIN', icon: Settings }
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-3.5 font-bold text-xs flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Views */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        
        {/* Date Filter Bar */}
        {['overview', 'barbers', 'transactions'].includes(activeTab) && (
          <div className="bg-white rounded-2xl p-3 border border-slate-200 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Timeframe:
              </span>
              {[
                { id: 'today', label: 'Today' },
                { id: 'yesterday', label: 'Yesterday' },
                { id: 'week', label: 'Last 7 Days' },
                { id: 'month', label: 'This Month' },
                { id: 'all', label: 'All Time' },
                { id: 'custom', label: 'Custom' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setDateFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    dateFilter === f.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {dateFilter === 'custom' && (
              <div className="flex items-center gap-2 text-xs">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
                <span className="text-slate-400">to</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>
            )}

            <div className="text-xs text-slate-500">
              Showing <strong>{filteredTransactions.length}</strong> transactions
            </div>
          </div>
        )}

        {/* TAB 1: FINANCIAL OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Top 4 Key Metric Cards in Blue & White */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Gross Sales */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                    Total Sales ({dateFilter})
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {formatCurrency(totalGrossSales, salonInfo.currency)}
                </div>
                <div className="mt-2 text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Real-time revenue flow</span>
                </div>
              </div>

              {/* Card 2: Monthly Total */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                    Month-to-Date Total
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-blue-600 tracking-tight">
                  {formatCurrency(monthlyTotalSales, salonInfo.currency)}
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Current calendar month sales
                </p>
              </div>

              {/* Card 3: Cuts / Customers */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                    Cuts & Services
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Scissors className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {totalCutsCount} <span className="text-sm font-bold text-slate-400">cuts</span>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Across <strong>{totalClientsCount}</strong> customers (Avg {formatCurrency(avgTicketValue, salonInfo.currency)})
                </div>
              </div>

              {/* Card 4: Avg Spend per Customer */}
              <div className="bg-white p-5 rounded-3xl border border-emerald-200 shadow-xs relative overflow-hidden bg-gradient-to-br from-white to-emerald-50/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-emerald-800 tracking-wider">
                    Avg Ticket Size
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-emerald-600 tracking-tight">
                  {formatCurrency(avgTicketValue, salonInfo.currency)}
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Average spend across <strong>{totalClientsCount}</strong> customer visits
                </div>
              </div>

            </div>

            {/* Middle Section: Payment Breakdown & Top Barbers */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Payment Method Breakdown */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Payment Method Breakdown</h3>
                    <p className="text-xs text-slate-500 mt-0.5">How customers paid for their services</p>
                  </div>
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <QrCode className="w-4 h-4" />
                  </span>
                </div>

                <div className="space-y-4">
                  {Object.entries(paymentBreakdown).map(([mode, data]) => {
                    const pct = totalGrossSales > 0 ? Math.round((data.amount / totalGrossSales) * 100) : 0;
                    const IconComp = data.icon;
                    return (
                      <div key={mode} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <div className="flex items-center gap-2">
                            <IconComp className="w-4 h-4 text-slate-600" />
                            <span className="font-bold text-slate-900">{data.label}</span>
                          </div>
                          <span className="font-bold text-slate-700">{pct}%</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                          <div
                            className={`h-full ${data.color} rounded-full transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>

                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">{data.count} bills</span>
                          <span className="font-black text-slate-900">
                            {formatCurrency(data.amount, salonInfo.currency)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Barber Performance Preview */}
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      Barber Performance Ranking
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Service counts and revenue generated by each stylist
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('barbers')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Full Matrix & Edit</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {barberPerformance.slice(0, 5).map((barber, index) => {
                    const rankMedal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
                    return (
                      <div
                        key={barber.id}
                        className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/40 border border-slate-100 transition flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-base w-6 text-center">{rankMedal}</span>
                          <img
                            src={barber.photo}
                            alt={barber.name}
                            className="w-12 h-12 rounded-xl object-cover border border-blue-300"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-slate-900">{barber.name}</h4>
                              <span className="bg-blue-100 text-blue-800 text-[10px] font-mono px-1.5 py-0.2 rounded font-bold">
                                {barber.badgeId}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">
                              <strong className="text-slate-800">{barber.cuts} cuts</strong> • {barber.tickets} clients
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-black text-slate-900 text-base">
                            {formatCurrency(barber.revenue, salonInfo.currency)}
                          </div>
                          <p className="text-[11px] text-blue-600 font-semibold">
                            {barber.cuts} services done
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Daily Trend Visual Chart */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Daily Revenue Trend</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sales performance by day across the chosen date period
                  </p>
                </div>
                <div className="text-xs text-slate-500">
                  Peak Day: <strong>{formatCurrency(maxDailyRevenue, salonInfo.currency)}</strong>
                </div>
              </div>

              {dailyTrends.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-sm">
                  No trend data available for this timeframe.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="h-48 flex items-end gap-2 pt-6 pb-2 border-b border-slate-100 overflow-x-auto">
                    {dailyTrends.map((d) => {
                      const heightPercent = Math.max(8, Math.round((d.revenue / maxDailyRevenue) * 100));
                      const isToday = d.date === todayStr;
                      return (
                        <div
                          key={d.date}
                          className="flex-1 min-w-[36px] flex flex-col items-center gap-1 group relative h-full justify-end"
                        >
                          <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2 rounded-md pointer-events-none whitespace-nowrap z-20 shadow-md">
                            {formatDate(d.date)}: {formatCurrency(d.revenue, salonInfo.currency)} ({d.cuts} cuts)
                          </div>

                          <div
                            className={`w-full rounded-t-lg transition-all duration-300 ${
                              isToday
                                ? 'bg-blue-600 group-hover:bg-blue-700'
                                : 'bg-slate-800 group-hover:bg-slate-700'
                            }`}
                            style={{ height: `${heightPercent}%` }}
                          />
                          <span className="text-[10px] text-slate-400 font-mono rotate-[-45deg] origin-top-left mt-2 block whitespace-nowrap">
                            {d.date.slice(5)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: MANAGE & RANK BARBERS (+ ADD & EDIT) */}
        {activeTab === 'barbers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Manage Barbers & Performance
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click <strong>"Edit"</strong> on any stylist card to update their name, avatar, badge ID, or role
                </p>
              </div>

              <button
                onClick={() => setIsAddBarberOpen(true)}
                className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-2 transition shadow-md active:scale-95 self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ ADD NEW BARBER</span>
              </button>
            </div>

            {/* Performance Grid / Table with Direct EDIT button */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="py-4 px-6">Barber / Stylist</th>
                      <th className="py-4 px-4 text-center">Services Done</th>
                      <th className="py-4 px-4 text-center">Clients</th>
                      <th className="py-4 px-4 text-right">Total Revenue</th>
                      <th className="py-4 px-4 text-right">Avg / Client</th>
                      <th className="py-4 px-6 text-center">Manage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {barberPerformance.map((b, idx) => (
                      <tr key={b.id} className="hover:bg-blue-50/30 transition">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-xs text-slate-400 w-4">
                              {idx + 1}
                            </span>
                            <img
                              src={b.photo}
                              alt={b.name}
                              className="w-12 h-12 rounded-2xl object-cover border border-blue-400"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-900">{b.name}</h4>
                                <span className="bg-blue-100 text-blue-800 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                                  {b.badgeId}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500">{b.role} {b.phone ? `• ${b.phone}` : ''}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-center">
                          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-900 font-extrabold text-sm border border-blue-200">
                            ✂️ {b.cuts}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-center font-semibold text-slate-700">
                          {b.tickets} clients
                        </td>

                        <td className="py-4 px-4 text-right font-black text-base text-slate-900">
                          {formatCurrency(b.revenue, salonInfo.currency)}
                        </td>

                        <td className="py-4 px-4 text-right font-semibold text-slate-700">
                          {formatCurrency(b.tickets > 0 ? Math.round(b.revenue / b.tickets) : 0, salonInfo.currency)}
                        </td>

                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setEditingBarber({ ...b })}
                              className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs flex items-center gap-1 border border-blue-200 transition cursor-pointer"
                              title="Edit Barber Details"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteBarber(b.id)}
                              className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                              title="Delete Barber"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Barber Cards with Direct Edit buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {barberPerformance.map((b) => (
                <div key={b.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs relative flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <img src={b.photo} alt={b.name} className="w-14 h-14 rounded-xl object-cover border-2 border-blue-400" />
                        <div>
                          <h4 className="font-bold text-slate-900">{b.name}</h4>
                          <span className="text-[10px] bg-blue-100 px-1.5 py-0.5 rounded font-mono font-bold text-blue-800">
                            {b.badgeId}
                          </span>
                          <p className="text-xs text-slate-500 mt-0.5">{b.role}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => setEditingBarber({ ...b })}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold rounded-lg border border-blue-200 flex items-center gap-1 transition cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3 text-blue-600" />
                        <span>Edit</span>
                      </button>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs space-y-1 mb-3">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Contact:</span>
                        <span>{b.phone || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Services in Period:</span>
                        <strong className="text-blue-700">{b.cuts} cuts</strong>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <p className="font-semibold text-slate-700 mb-1">Top Services Performed:</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(b.topServices).length === 0 ? (
                        <span className="text-slate-400 text-[11px]">No services recorded yet</span>
                      ) : (
                        Object.entries(b.topServices).slice(0, 3).map(([srv, count]) => (
                          <span
                            key={srv}
                            className="bg-blue-50 text-blue-900 px-2 py-0.5 rounded text-[10px] font-medium border border-blue-200"
                          >
                            {srv} (x{count})
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 3: SERVICES & PRICING (+ ADD & EDIT) */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Manage Services & Pricing Menu
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click <strong>"Edit"</strong> on any service to change prices, durations, or names in real-time
                </p>
              </div>

              <button
                onClick={() => setIsAddServiceOpen(true)}
                className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-2 transition shadow-md active:scale-95 self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ ADD NEW SERVICE</span>
              </button>
            </div>

            {/* Category Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setServiceCategoryFilter(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      serviceCategoryFilter === c.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search service by name..."
                  value={searchService}
                  onChange={(e) => setSearchService(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Services Grid with Edit and Delete Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedServices.map((srv) => (
                <div
                  key={srv.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-blue-400 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-bold text-slate-900 text-base leading-snug">{srv.name}</h4>
                      <span className="bg-blue-50 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-blue-200 shrink-0">
                        {srv.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {srv.description || 'Standard salon procedure'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">⏱️ {srv.duration} mins</span>
                      <span className="font-black text-lg text-blue-600">
                        {formatCurrency(srv.price, salonInfo.currency)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingService({ ...srv })}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs flex items-center gap-1 border border-blue-200 transition cursor-pointer"
                        title="Edit Service Price & Details"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteService(srv.id)}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {displayedServices.length === 0 && (
              <div className="py-16 text-center text-slate-400">
                <p className="text-base font-semibold">No services found.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ALL TRANSACTIONS AUDIT LOG */}
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3 flex-1 min-w-[280px]">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search receipt ID, customer, barber..."
                    value={searchTxn}
                    onChange={(e) => setSearchTxn(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <select
                  value={filterBarber}
                  onChange={(e) => setFilterBarber(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                >
                  <option value="all">All Barbers</option>
                  {barbers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.badgeId})
                    </option>
                  ))}
                </select>

                <select
                  value={filterPayment}
                  onChange={(e) => setFilterPayment(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                >
                  <option value="all">All Payment Modes</option>
                  <option value="UPI">UPI / Online</option>
                  <option value="CASH">Cash</option>
                  <option value="CARD">Card</option>
                </select>
              </div>

              <div className="text-xs text-slate-500">
                Found <strong>{auditTransactions.length}</strong> transactions
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Receipt #</th>
                      <th className="py-3.5 px-4">Date & Time</th>
                      <th className="py-3.5 px-4">Barber</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Services Rendered</th>
                      <th className="py-3.5 px-4 text-center">Payment</th>
                      <th className="py-3.5 px-4 text-right">Amount</th>
                      <th className="py-3.5 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {auditTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400 text-sm">
                          No transactions matching criteria.
                        </td>
                      </tr>
                    ) : (
                      auditTransactions.map((txn) => (
                        <tr key={txn.id} className="hover:bg-blue-50/20 transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                            {txn.id}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            <div>{formatDate(txn.date)}</div>
                            <div className="text-[10px] text-slate-400">{formatTime(txn.timestamp)}</div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-900">
                            {txn.barberName} <span className="text-[10px] text-slate-400">({txn.barberBadge})</span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-700">
                            <div className="font-medium">{txn.customerName || 'Walk-in'}</div>
                            {txn.customerPhone && (
                              <div className="text-[10px] text-slate-400">{txn.customerPhone}</div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                            {txn.services.map((s, i) => (
                              <span key={i} className="inline-block bg-slate-100 rounded px-1.5 py-0.5 text-[10px] mr-1 mb-0.5">
                                {s.name} {s.quantity > 1 ? `x${s.quantity}` : ''}
                              </span>
                            ))}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                txn.paymentMethod === 'UPI'
                                  ? 'bg-blue-100 text-blue-800'
                                  : txn.paymentMethod === 'CASH'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-indigo-100 text-indigo-800'
                              }`}
                            >
                              {txn.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right font-black text-slate-900 text-sm">
                            {formatCurrency(txn.finalAmount, salonInfo.currency)}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setViewingReceiptTxn(txn)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-600 transition"
                                title="View Receipt"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Void transaction ${txn.id} of ${formatCurrency(txn.finalAmount, salonInfo.currency)}?`)) {
                                    onDeleteTransaction(txn.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition"
                                title="Void/Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: SALON SETTINGS & PIN */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Fame City Profile & Security</h2>
            <p className="text-xs text-slate-500 mb-6">
              Update salon metadata, currency, owner security PIN, and payment details
            </p>

            {settingsSavedToast && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Settings saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Salon Business Name
                </label>
                <input
                  type="text"
                  value={settingsForm.name}
                  onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={settingsForm.tagline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone / Contact
                  </label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    value={settingsForm.currency}
                    onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  UPI ID for QR Payments
                </label>
                <input
                  type="text"
                  value={settingsForm.upiId}
                  onChange={(e) => setSettingsForm({ ...settingsForm, upiId: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Owner Dashboard Access PIN (4 digits)
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={settingsForm.ownerPin}
                  onChange={(e) => setSettingsForm({ ...settingsForm, ownerPin: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white font-mono font-bold focus:ring-1 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Default is <strong>1234</strong>. Used by the owner to unlock this dashboard.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* MODAL: ADD BARBER */}
      {isAddBarberOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Add New Stylist / Barber</h3>
            <form onSubmit={handleAddBarber} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Karan Malhotra"
                  value={newBarber.name}
                  onChange={(e) => setNewBarber({ ...newBarber, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Badge ID</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FC-107"
                    value={newBarber.badgeId}
                    onChange={(e) => setNewBarber({ ...newBarber, badgeId: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white uppercase font-mono font-bold focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98..."
                    value={newBarber.phone}
                    onChange={(e) => setNewBarber({ ...newBarber, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Hair Stylist"
                  value={newBarber.role}
                  onChange={(e) => setNewBarber({ ...newBarber, role: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Photo Avatar Preset Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Choose Stylist Photo</label>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {AVATAR_PRESETS.map((av, idx) => (
                    <img
                      key={idx}
                      src={av.url}
                      alt={av.label}
                      onClick={() => setNewBarber({ ...newBarber, photo: av.url })}
                      className={`w-12 h-12 rounded-xl object-cover cursor-pointer border-2 transition ${
                        newBarber.photo === av.url ? 'border-blue-600 scale-105 shadow-md' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
                <input
                  type="url"
                  placeholder="Or paste custom image URL..."
                  value={newBarber.photo}
                  onChange={(e) => setNewBarber({ ...newBarber, photo: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white mt-1 text-slate-500"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddBarberOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                >
                  Add Barber
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT BARBER */}
      {editingBarber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                Edit Barber: {editingBarber.name}
              </h3>
              <button
                onClick={() => setEditingBarber(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditBarber} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingBarber.name}
                  onChange={(e) => setEditingBarber({ ...editingBarber, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Badge ID</label>
                  <input
                    type="text"
                    required
                    value={editingBarber.badgeId}
                    onChange={(e) => setEditingBarber({ ...editingBarber, badgeId: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={editingBarber.phone || ''}
                    onChange={(e) => setEditingBarber({ ...editingBarber, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role / Title</label>
                <input
                  type="text"
                  value={editingBarber.role}
                  onChange={(e) => setEditingBarber({ ...editingBarber, role: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>

              {/* Photo Avatar Preset Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Update Barber Avatar</label>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {AVATAR_PRESETS.map((av, idx) => (
                    <img
                      key={idx}
                      src={av.url}
                      alt={av.label}
                      onClick={() => setEditingBarber({ ...editingBarber, photo: av.url })}
                      className={`w-12 h-12 rounded-xl object-cover cursor-pointer border-2 transition ${
                        editingBarber.photo === av.url ? 'border-blue-600 scale-105 shadow-md' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
                <input
                  type="url"
                  placeholder="Custom image URL..."
                  value={editingBarber.photo}
                  onChange={(e) => setEditingBarber({ ...editingBarber, photo: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white mt-1 text-slate-500"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingBarber(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SERVICE */}
      {isAddServiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Add New Salon Service</h3>
            <form onSubmit={handleAddService} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Keratin Hair Spa"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newService.category}
                    onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    {categories.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price ({salonInfo.currency})</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  min="5"
                  value={newService.duration}
                  onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief details of service..."
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddServiceOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                >
                  Add Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT SERVICE */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                Edit Service: {editingService.name}
              </h3>
              <button
                onClick={() => setEditingService(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditService} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  value={editingService.name}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingService.category}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    {categories.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price ({salonInfo.currency})</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editingService.price}
                    onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  min="5"
                  value={editingService.duration}
                  onChange={(e) => setEditingService({ ...editingService, duration: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingService.description || ''}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {viewingReceiptTxn && (
        <ReceiptModal
          isOpen={Boolean(viewingReceiptTxn)}
          onClose={() => setViewingReceiptTxn(null)}
          transaction={viewingReceiptTxn}
          salonInfo={salonInfo}
        />
      )}

    </div>
  );
}
