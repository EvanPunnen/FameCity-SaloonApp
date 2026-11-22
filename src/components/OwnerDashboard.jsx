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
    isOnLeave: false,
    leaveReason: ''
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

  // Helper for attendance / leave toggle
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

  const onDutyCount = useMemo(() => barbers.filter((b) => !b.isOnLeave).length, [barbers]);
  const onLeaveCount = useMemo(() => barbers.filter((b) => b.isOnLeave).length, [barbers]);

  // Executive Metrics for active filter
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

  // Specific Today Metrics
  const todayTransactions = useMemo(() => {
    return transactions.filter((t) => t.date === todayStr);
  }, [transactions, todayStr]);

  const todayGrossSales = useMemo(() => {
    return todayTransactions.reduce((acc, t) => acc + (t.finalAmount || 0), 0);
  }, [todayTransactions]);

  const todayCutsCount = useMemo(() => {
    return todayTransactions.reduce(
      (acc, t) => acc + t.services.reduce((sAcc, s) => sAcc + (s.quantity || 1), 0),
      0
    );
  }, [todayTransactions]);

  const todayBillsCount = todayTransactions.length;
  const todayAvgTicket = todayBillsCount > 0 ? Math.round(todayGrossSales / todayBillsCount) : 0;

  // Specific Yesterday Metrics for comparison
  const yesterdayTransactions = useMemo(() => {
    return transactions.filter((t) => t.date === yesterdayStr);
  }, [transactions, yesterdayStr]);

  const yesterdayGrossSales = useMemo(() => {
    return yesterdayTransactions.reduce((acc, t) => acc + (t.finalAmount || 0), 0);
  }, [yesterdayTransactions]);

  // Specific Current Month Metrics
  const currentMonthTransactions = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    return transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    });
  }, [transactions]);

  // Monthly Sales Total
  const monthlyTotalSales = useMemo(() => {
    return currentMonthTransactions.reduce((acc, t) => acc + (t.finalAmount || 0), 0);
  }, [currentMonthTransactions]);

  const monthlyTotalCuts = useMemo(() => {
    return currentMonthTransactions.reduce(
      (acc, t) => acc + t.services.reduce((sAcc, s) => sAcc + (s.quantity || 1), 0),
      0
    );
  }, [currentMonthTransactions]);

  const monthlyTotalBills = currentMonthTransactions.length;
  const monthlyAvgTicket = monthlyTotalBills > 0 ? Math.round(monthlyTotalSales / monthlyTotalBills) : 0;
  const daysInCurrentMonthSoFar = Math.max(new Date().getDate(), 1);
  const monthlyAvgDailySales = Math.round(monthlyTotalSales / daysInCurrentMonthSoFar);

  // Comprehensive Per-Barber Breakdown (Today, Month & All-Time)
  const perBarberMatrix = useMemo(() => {
    return barbers.map((b) => {
      // Today stats
      const bTodayTxns = todayTransactions.filter((t) => t.barberId === b.id);
      const todayRevenue = bTodayTxns.reduce((acc, t) => acc + (t.finalAmount || 0), 0);
      const todayCuts = bTodayTxns.reduce(
        (acc, t) => acc + t.services.reduce((sAcc, s) => sAcc + (s.quantity || 1), 0),
        0
      );
      const todayBills = bTodayTxns.length;

      // Month stats
      const bMonthTxns = currentMonthTransactions.filter((t) => t.barberId === b.id);
      const monthRevenue = bMonthTxns.reduce((acc, t) => acc + (t.finalAmount || 0), 0);
      const monthCuts = bMonthTxns.reduce(
        (acc, t) => acc + t.services.reduce((sAcc, s) => sAcc + (s.quantity || 1), 0),
        0
      );
      const monthBills = bMonthTxns.length;

      // Filtered period stats
      const bFilteredTxns = filteredTransactions.filter((t) => t.barberId === b.id);
      const periodRevenue = bFilteredTxns.reduce((acc, t) => acc + (t.finalAmount || 0), 0);
      const periodCuts = bFilteredTxns.reduce(
        (acc, t) => acc + t.services.reduce((sAcc, s) => sAcc + (s.quantity || 1), 0),
        0
      );
      const periodBills = bFilteredTxns.length;

      const avgTicket = periodBills > 0 ? Math.round(periodRevenue / periodBills) : 0;
      const shareOfTotal = totalGrossSales > 0 ? Math.round((periodRevenue / totalGrossSales) * 100) : 0;

      // Top service
      const topSrvMap = {};
      bFilteredTxns.forEach((t) => {
        t.services.forEach((s) => {
          topSrvMap[s.name] = (topSrvMap[s.name] || 0) + (s.quantity || 1);
        });
      });

      return {
        ...b,
        todayRevenue,
        todayCuts,
        todayBills,
        monthRevenue,
        monthCuts,
        monthBills,
        periodRevenue,
        periodCuts,
        periodBills,
        avgTicket,
        shareOfTotal,
        topServices: topSrvMap
      };
    }).sort((a, b) => b.todayRevenue - a.todayRevenue || b.monthRevenue - a.monthRevenue);
  }, [barbers, todayTransactions, currentMonthTransactions, filteredTransactions, totalGrossSales]);

  // Top Barber Today
  const topBarberToday = useMemo(() => {
    return perBarberMatrix[0] || null;
  }, [perBarberMatrix]);

  // Day-by-Day Historical Sales Log
  const dayByDayHistory = useMemo(() => {
    const dayMap = {};
    transactions.forEach((t) => {
      if (!dayMap[t.date]) {
        dayMap[t.date] = {
          date: t.date,
          revenue: 0,
          cuts: 0,
          bills: 0,
          barberSales: {},
          paymentSplit: { UPI: 0, CASH: 0, CARD: 0 }
        };
      }
      dayMap[t.date].revenue += t.finalAmount || 0;
      dayMap[t.date].cuts += t.services.reduce((acc, s) => acc + (s.quantity || 1), 0);
      dayMap[t.date].bills += 1;
      dayMap[t.date].barberSales[t.barberName] = (dayMap[t.date].barberSales[t.barberName] || 0) + (t.finalAmount || 0);
      const method = t.paymentMethod || 'CASH';
      dayMap[t.date].paymentSplit[method] = (dayMap[t.date].paymentSplit[method] || 0) + (t.finalAmount || 0);
    });

    return Object.values(dayMap)
      .map((day) => {
        let topName = '—';
        let topAmount = 0;
        Object.entries(day.barberSales).forEach(([name, amt]) => {
          if (amt > topAmount) {
            topAmount = amt;
            topName = name;
          }
        });
        return {
          ...day,
          topBarberName: topName,
          topBarberAmount: topAmount,
          avgTicket: day.bills > 0 ? Math.round(day.revenue / day.bills) : 0
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions]);

  // Month-by-Month History
  const monthByMonthHistory = useMemo(() => {
    const monthMap = {};
    transactions.forEach((t) => {
      const monthKey = t.date.substring(0, 7); // 'YYYY-MM'
      if (!monthMap[monthKey]) {
        monthMap[monthKey] = {
          monthKey,
          revenue: 0,
          cuts: 0,
          bills: 0,
          uniqueDates: new Set()
        };
      }
      monthMap[monthKey].revenue += t.finalAmount || 0;
      monthMap[monthKey].cuts += t.services.reduce((acc, s) => acc + (s.quantity || 1), 0);
      monthMap[monthKey].bills += 1;
      monthMap[monthKey].uniqueDates.add(t.date);
    });

    return Object.values(monthMap)
      .map((m) => {
        const [year, month] = m.monthKey.split('-');
        const dateObj = new Date(Number(year), Number(month) - 1, 1);
        const monthLabel = dateObj.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
        const activeDays = m.uniqueDates.size;
        return {
          ...m,
          monthLabel,
          activeDays,
          avgPerDay: activeDays > 0 ? Math.round(m.revenue / activeDays) : 0,
          avgTicket: m.bills > 0 ? Math.round(m.revenue / m.bills) : 0
        };
      })
      .sort((a, b) => b.monthKey.localeCompare(a.monthKey));
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

  // Barber Performance for Active Filter
  const barberPerformance = useMemo(() => {
    return perBarberMatrix.map((b) => ({
      ...b,
      cuts: b.periodCuts,
      tickets: b.periodBills,
      revenue: b.periodRevenue
    })).sort((a, b) => b.revenue - a.revenue);
  }, [perBarberMatrix]);

  // Daily Trend Data for Active Filter
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
      isOnLeave: Boolean(newBarber.isOnLeave),
      leaveReason: newBarber.leaveReason || '',
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
      isOnLeave: false,
      leaveReason: ''
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
            
            {/* Top 4 Key Metric Cards: Daily Sales, Monthly Sales, Top Barber, Attendance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Today's Daily Sales */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                    Today's Daily Sales
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {formatCurrency(todayGrossSales, salonInfo.currency)}
                </div>
                <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
                  <span>✂️ <strong>{todayCutsCount}</strong> cuts • <strong>{todayBillsCount}</strong> bills</span>
                  <span className="text-emerald-600 font-semibold text-[11px]">Avg {formatCurrency(todayAvgTicket, salonInfo.currency)}</span>
                </div>
                {yesterdayGrossSales > 0 && (
                  <p className="text-[10px] text-slate-400 mt-1">
                    Yesterday: {formatCurrency(yesterdayGrossSales, salonInfo.currency)}
                  </p>
                )}
              </div>

              {/* Card 2: Monthly Total Sales */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                    This Month's Sales
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-blue-600 tracking-tight">
                  {formatCurrency(monthlyTotalSales, salonInfo.currency)}
                </div>
                <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
                  <span>✂️ <strong>{monthlyTotalCuts}</strong> cuts • <strong>{monthlyTotalBills}</strong> visits</span>
                  <span className="text-blue-600 font-semibold text-[11px]">~{formatCurrency(monthlyAvgDailySales, salonInfo.currency)}/day</span>
                </div>
              </div>

              {/* Card 3: Top Stylist Today */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                    Top Stylist Today
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 tracking-tight truncate">
                  {topBarberToday ? topBarberToday.name : '—'}
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  {topBarberToday && topBarberToday.todayRevenue > 0 ? (
                    <span className="text-emerald-600 font-bold">
                      {formatCurrency(topBarberToday.todayRevenue, salonInfo.currency)} ({topBarberToday.todayCuts} cuts)
                    </span>
                  ) : (
                    <span>Ready for first customer today</span>
                  )}
                </div>
              </div>

              {/* Card 4: Staff Attendance & Leave */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                    Staff Attendance Today
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  <span className="text-emerald-600">{onDutyCount}</span>
                  <span className="text-slate-400 text-xl font-bold"> / {barbers.length}</span>
                </div>
                <div className="mt-2 text-xs">
                  {onLeaveCount > 0 ? (
                    <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                      🌴 {onLeaveCount} Stylist{onLeaveCount > 1 ? 's' : ''} on leave today
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                      🟢 Full attendance (all on duty)
                    </span>
                  )}
                </div>
              </div>

            </div>

            {/* SECTION 1: PER BARBER SALES MATRIX (Today & Month-to-Date) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <span>💈 Per Barber Sales & Attendance Breakdown</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live breakdown of sales generated per barber (Daily, Monthly & Attendance Status)
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 font-bold">
                    🟢 {onDutyCount} On Duty
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200 font-bold">
                    🌴 {onLeaveCount} On Leave
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Barber / Stylist</th>
                      <th className="py-3.5 px-3 text-center">Today's Attendance</th>
                      <th className="py-3.5 px-4 text-right">Today's Sales</th>
                      <th className="py-3.5 px-4 text-right">This Month's Sales</th>
                      <th className="py-3.5 px-3 text-center">Month Cuts</th>
                      <th className="py-3.5 px-4 text-right">Avg / Client</th>
                      <th className="py-3.5 px-3 text-center">Salon Share</th>
                      <th className="py-3.5 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {perBarberMatrix.map((b, idx) => (
                      <tr key={b.id} className="hover:bg-blue-50/20 transition">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-xs text-slate-400 w-4">
                              {idx + 1}
                            </span>
                            <img
                              src={b.photo}
                              alt={b.name}
                              className={`w-10 h-10 rounded-xl object-cover border-2 ${
                                b.isOnLeave ? 'border-amber-400 opacity-80' : 'border-blue-400'
                              }`}
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-900 text-sm">{b.name}</h4>
                                <span className="bg-blue-100 text-blue-800 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded">
                                  {b.badgeId}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500">{b.role}</p>
                            </div>
                          </div>
                        </td>

                        {/* Attendance Toggle Pill */}
                        <td className="py-3.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleLeave(b.id)}
                            className={`px-2.5 py-1 rounded-full text-xs font-bold border transition cursor-pointer ${
                              b.isOnLeave
                                ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            }`}
                            title="Click to toggle on duty / on leave"
                          >
                            <span>{b.isOnLeave ? '🌴 On Leave' : '🟢 On Duty'}</span>
                          </button>
                          {b.isOnLeave && b.leaveReason && (
                            <p className="text-[10px] text-amber-700 mt-0.5 truncate max-w-[100px] mx-auto">
                              {b.leaveReason}
                            </p>
                          )}
                        </td>

                        {/* Today's Sales */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="font-black text-slate-900 text-sm">
                            {formatCurrency(b.todayRevenue, salonInfo.currency)}
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium">
                            {b.todayCuts} cuts today
                          </div>
                        </td>

                        {/* This Month's Sales */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="font-black text-blue-600 text-sm">
                            {formatCurrency(b.monthRevenue, salonInfo.currency)}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {b.monthBills} clients
                          </div>
                        </td>

                        {/* Month Cuts */}
                        <td className="py-3.5 px-3 text-center font-bold text-slate-700 text-xs">
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-900 border border-blue-200">
                            ✂️ {b.monthCuts}
                          </span>
                        </td>

                        {/* Avg / Client */}
                        <td className="py-3.5 px-4 text-right font-semibold text-slate-700 text-xs">
                          {formatCurrency(b.avgTicket, salonInfo.currency)}
                        </td>

                        {/* Share of Total */}
                        <td className="py-3.5 px-3 text-center">
                          <span className="font-bold text-xs text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                            {b.shareOfTotal}%
                          </span>
                        </td>

                        {/* Action */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingBarber({ ...b });
                              }}
                              className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs flex items-center gap-1 border border-blue-200 transition cursor-pointer"
                              title="Edit Barber"
                            >
                              <Edit2 className="w-3 h-3 text-blue-600" />
                              <span>Edit</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 2: DAILY SALES LOG (Day-by-Day Historical Log) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <span>📅 Daily Sales Breakdown & History</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Day-by-day revenue, cuts, customers, and top stylist performance
                  </p>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  Last <strong>{dayByDayHistory.length}</strong> active sales days
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Daily Revenue</th>
                      <th className="py-3 px-3 text-center">Cuts & Services</th>
                      <th className="py-3 px-3 text-center">Bills</th>
                      <th className="py-3 px-4 text-right">Avg / Client</th>
                      <th className="py-3 px-4 text-left">Top Barber of Day</th>
                      <th className="py-3 px-4 text-right">UPI / Online</th>
                      <th className="py-3 px-4 text-right">Cash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dayByDayHistory.slice(0, 10).map((day) => {
                      const isToday = day.date === todayStr;
                      const isYesterday = day.date === yesterdayStr;
                      return (
                        <tr
                          key={day.date}
                          className={`transition ${
                            isToday ? 'bg-blue-50/40 font-semibold' : 'hover:bg-slate-50/70'
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-xs">
                                {formatDate(day.date)}
                              </span>
                              {isToday && (
                                <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                                  Today
                                </span>
                              )}
                              {isYesterday && (
                                <span className="bg-slate-200 text-slate-700 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                                  Yesterday
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3 px-4 text-right font-black text-slate-900 text-sm">
                            {formatCurrency(day.revenue, salonInfo.currency)}
                          </td>

                          <td className="py-3 px-3 text-center font-bold text-slate-700 text-xs">
                            ✂️ {day.cuts}
                          </td>

                          <td className="py-3 px-3 text-center text-slate-600 text-xs">
                            {day.bills} clients
                          </td>

                          <td className="py-3 px-4 text-right font-semibold text-slate-700 text-xs">
                            {formatCurrency(day.avgTicket, salonInfo.currency)}
                          </td>

                          <td className="py-3 px-4 text-left text-xs font-medium text-slate-800">
                            {day.topBarberName !== '—' ? (
                              <span>
                                🌟 <strong>{day.topBarberName}</strong> ({formatCurrency(day.topBarberAmount, salonInfo.currency)})
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right text-xs font-semibold text-blue-600">
                            {formatCurrency(day.paymentSplit?.UPI || 0, salonInfo.currency)}
                          </td>

                          <td className="py-3 px-4 text-right text-xs font-semibold text-emerald-600">
                            {formatCurrency(day.paymentSplit?.CASH || 0, salonInfo.currency)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 3: MONTHLY SALES OVERVIEW & TRENDS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Month-by-Month Historical Summary Cards */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Monthly Sales History</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Month-by-month performance</p>
                  </div>
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </span>
                </div>

                <div className="space-y-3">
                  {monthByMonthHistory.map((m) => (
                    <div
                      key={m.monthKey}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-extrabold text-slate-900 text-sm">{m.monthLabel}</span>
                        <span className="font-black text-blue-600 text-base">
                          {formatCurrency(m.revenue, salonInfo.currency)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>✂️ {m.cuts} cuts across {m.bills} clients</span>
                        <span className="font-semibold text-slate-700">Avg {formatCurrency(m.avgPerDay, salonInfo.currency)}/day</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

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

              {/* Daily Trend Visual Chart */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">Daily Revenue Trend</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Peak Day: <strong>{formatCurrency(maxDailyRevenue, salonInfo.currency)}</strong>
                      </p>
                    </div>
                  </div>

                  {dailyTrends.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-sm">
                      No trend data available.
                    </div>
                  ) : (
                    <div className="h-44 flex items-end gap-1.5 pt-6 pb-2 border-b border-slate-100 overflow-x-auto">
                      {dailyTrends.slice(-14).map((d) => {
                        const heightPercent = Math.max(8, Math.round((d.revenue / maxDailyRevenue) * 100));
                        const isToday = d.date === todayStr;
                        return (
                          <div
                            key={d.date}
                            className="flex-1 min-w-[28px] flex flex-col items-center gap-1 group relative h-full justify-end"
                          >
                            <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2 rounded-md pointer-events-none whitespace-nowrap z-20 shadow-md">
                              {formatDate(d.date)}: {formatCurrency(d.revenue, salonInfo.currency)}
                            </div>

                            <div
                              className={`w-full rounded-t-lg transition-all duration-300 ${
                                isToday
                                  ? 'bg-blue-600 group-hover:bg-blue-700'
                                  : 'bg-slate-800 group-hover:bg-slate-700'
                              }`}
                              style={{ height: `${heightPercent}%` }}
                            />
                            <span className="text-[9px] text-slate-400 font-mono rotate-[-45deg] origin-top-left mt-2 block whitespace-nowrap">
                              {d.date.slice(5)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="pt-3 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Blue: Today's live flow</span>
                  <span>Slate: Past days</span>
                </div>
              </div>

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
                  Click <strong>"Edit"</strong> on any stylist card to update their details or mark leave
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

            {/* Attendance & Leave Quick Overview Banner */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-800">Staff Attendance Today:</span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200">
                  🟢 {onDutyCount} Stylists On Duty
                </span>
                <span className={`px-3 py-1 rounded-full font-extrabold border ${
                  onLeaveCount > 0
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}>
                  🌴 {onLeaveCount} Stylists On Leave
                </span>
              </div>
              <span className="text-slate-400">
                Tap on any stylist's attendance pill to toggle On Duty / On Leave for today
              </span>
            </div>

            {/* Performance Grid / Table with Direct EDIT button */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="py-4 px-6">Barber / Stylist</th>
                      <th className="py-4 px-3 text-center">Today's Attendance</th>
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
                              className={`w-12 h-12 rounded-2xl object-cover border ${
                                b.isOnLeave ? 'border-amber-400 opacity-80' : 'border-blue-400'
                              }`}
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

                        {/* Today's Attendance Toggle */}
                        <td className="py-4 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleLeave(b.id)}
                            className={`px-2.5 py-1 rounded-full text-xs font-bold border transition cursor-pointer ${
                              b.isOnLeave
                                ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            }`}
                            title="Click to toggle leave status"
                          >
                            <span>{b.isOnLeave ? '🌴 On Leave' : '🟢 On Duty'}</span>
                          </button>
                          {b.isOnLeave && b.leaveReason && (
                            <p className="text-[10px] text-amber-700 mt-0.5 truncate max-w-[90px] mx-auto">
                              {b.leaveReason}
                            </p>
                          )}
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
                        <img src={b.photo} alt={b.name} className={`w-14 h-14 rounded-xl object-cover border-2 ${b.isOnLeave ? 'border-amber-400 opacity-80' : 'border-blue-400'}`} />
                        <div>
                          <h4 className="font-bold text-slate-900">{b.name}</h4>
                          <span className="text-[10px] bg-blue-100 px-1.5 py-0.5 rounded font-mono font-bold text-blue-800">
                            {b.badgeId}
                          </span>
                          <p className="text-xs text-slate-500 mt-0.5">{b.role}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <button
                          onClick={() => setEditingBarber({ ...b })}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold rounded-lg border border-blue-200 flex items-center gap-1 transition cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3 text-blue-600" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleLeave(b.id)}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition cursor-pointer ${
                            b.isOnLeave
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {b.isOnLeave ? '🌴 Leave' : '🟢 Duty'}
                        </button>
                      </div>
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
                      {b.isOnLeave && (
                        <div className="flex justify-between text-amber-800 font-semibold pt-1 border-t border-slate-200">
                          <span>Leave Status:</span>
                          <span>{b.leaveReason || 'On Leave Today'}</span>
                        </div>
                      )}
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

              {/* Attendance Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Today's Attendance Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewBarber({ ...newBarber, isOnLeave: false })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      !newBarber.isOnLeave
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>🟢 On Duty / Present</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewBarber({ ...newBarber, isOnLeave: true })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      newBarber.isOnLeave
                        ? 'bg-amber-50 border-amber-500 text-amber-800 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>🌴 On Leave Today</span>
                  </button>
                </div>
                {newBarber.isOnLeave && (
                  <input
                    type="text"
                    placeholder="Reason for leave (e.g. Weekly Off, Sick, Personal)..."
                    value={newBarber.leaveReason || ''}
                    onChange={(e) => setNewBarber({ ...newBarber, leaveReason: e.target.value })}
                    className="mt-2 w-full px-3 py-2 text-xs rounded-xl border border-amber-300 bg-amber-50/50 text-amber-950 focus:ring-2 focus:ring-amber-500"
                  />
                )}
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

              {/* Attendance Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Today's Attendance Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingBarber({ ...editingBarber, isOnLeave: false })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      !editingBarber.isOnLeave
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>🟢 On Duty / Present</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingBarber({ ...editingBarber, isOnLeave: true })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      editingBarber.isOnLeave
                        ? 'bg-amber-50 border-amber-500 text-amber-800 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>🌴 On Leave Today</span>
                  </button>
                </div>
                {editingBarber.isOnLeave && (
                  <input
                    type="text"
                    placeholder="Reason for leave (e.g. Weekly Off, Sick, Personal)..."
                    value={editingBarber.leaveReason || ''}
                    onChange={(e) => setEditingBarber({ ...editingBarber, leaveReason: e.target.value })}
                    className="mt-2 w-full px-3 py-2 text-xs rounded-xl border border-amber-300 bg-amber-50/50 text-amber-950 focus:ring-2 focus:ring-amber-500"
                  />
                )}
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
