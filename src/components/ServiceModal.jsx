import React, { useState, useMemo } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Check,
  CreditCard,
  Banknote,
  QrCode,
  Sparkles,
  Scissors,
  Palette,
  Sun,
  Flame,
  Gift,
  Clock,
  UserCheck,
  Phone,
  Search,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  ShoppingCart,
  Crown,
  HeartHandshake
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency, playSuccessChime } from '../utils/helpers';

export default function ServiceModal({
  isOpen,
  onClose,
  barber,
  services,
  categories,
  salonInfo,
  onRecordSale
}) {
  if (!isOpen || !barber) return null;

  // Active step for responsive split screens / tablets: 'catalog' | 'checkout'
  const [activeTab, setActiveTab] = useState('catalog');

  // Selected services cart: { [serviceId]: quantity }
  const [cart, setCart] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // Default
  const [cashTendered, setCashTendered] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');

  // Icon mapping for categories
  const categoryIcons = {
    Sparkles: Sparkles,
    Scissors: Scissors,
    Palette: Palette,
    Sun: Sun,
    Flame: Flame,
    Gift: Gift,
    Crown: Crown
  };

  // Filtered services
  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      const matchesCat = selectedCategory === 'all' || srv.category === selectedCategory;
      const matchesSearch =
        srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (srv.description && srv.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [services, selectedCategory, searchQuery]);

  // Cart operations
  const addToCart = (serviceId) => {
    setCart((prev) => ({
      ...prev,
      [serviceId]: (prev[serviceId] || 0) + 1
    }));
  };

  const removeFromCart = (serviceId) => {
    setCart((prev) => {
      const next = { ...prev };
      if (next[serviceId] > 1) {
        next[serviceId] -= 1;
      } else {
        delete next[serviceId];
      }
      return next;
    });
  };

  const deleteFromCart = (serviceId) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[serviceId];
      return next;
    });
  };

  // Cart items calculation
  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const srv = services.find((s) => s.id === id);
        if (!srv) return null;
        return {
          ...srv,
          quantity: qty,
          lineTotal: (srv.price || 0) * qty
        };
      })
      .filter(Boolean);
  }, [cart, services]);

  const totalCartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.lineTotal, 0);
  }, [cartItems]);

  const finalAmount = Math.max(0, subtotal - (Number(discount) || 0));

  const changeToReturn = useMemo(() => {
    if (paymentMethod !== 'CASH' || !cashTendered) return 0;
    const tendered = Number(cashTendered) || 0;
    return Math.max(0, tendered - finalAmount);
  }, [paymentMethod, cashTendered, finalAmount]);

  // Quick cash buttons
  const cashOptions = useMemo(() => {
    const list = [finalAmount];
    [500, 1000, 2000].forEach((val) => {
      if (val >= finalAmount && !list.includes(val)) {
        list.push(val);
      }
    });
    return list;
  }, [finalAmount]);

  // Submit Sale
  const handleSubmit = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert('Please select at least one service performed.');
      setActiveTab('catalog');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const txnId = `TXN-${todayStr.replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Calculate barber commission
    const commissionPercent = barber.commissionRate || 30;
    const commissionAmount = Math.round((finalAmount * commissionPercent) / 100);

    const newTxn = {
      id: txnId,
      timestamp: new Date().toISOString(),
      date: todayStr,
      barberId: barber.id,
      barberName: barber.name,
      barberBadge: barber.badgeId,
      services: cartItems.map((item) => ({
        serviceId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      totalAmount: subtotal,
      discount: Number(discount) || 0,
      finalAmount: finalAmount,
      paymentMethod: paymentMethod,
      paymentDetails:
        paymentMethod === 'UPI'
          ? { upiRef: `UPI-${Math.floor(1000000 + Math.random() * 9000000)}`, provider: 'UPI App' }
          : paymentMethod === 'CASH'
          ? { cashReceived: Number(cashTendered) || finalAmount, changeGiven: changeToReturn }
          : { cardLast4: `${Math.floor(1000 + Math.random() * 9000)}` },
      customerName: customerName.trim() || 'Walk-in Guest',
      customerPhone: customerPhone.trim(),
      barberCommission: commissionAmount,
      status: 'COMPLETED',
      notes: notes.trim()
    };

    // Trigger celebratory sound & confetti
    playSuccessChime();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (err) {}

    onRecordSale(newTxn);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Top Header Bar */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={barber.photo}
                alt={barber.name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-500 shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-md border border-white">
                {barber.badgeId}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900">{barber.name}</h2>
                <span className="bg-blue-50 text-blue-800 text-[11px] px-2 py-0.5 rounded-full font-bold border border-blue-200">
                  {barber.role}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Tap services below to add to bill
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Split Screen / Mobile View Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 lg:hidden">
              <button
                type="button"
                onClick={() => setActiveTab('catalog')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'catalog'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>1. Select Services</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('checkout')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'checkout'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>2. Bill ({totalCartCount})</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 flex overflow-hidden bg-slate-50 min-h-0">
          
          {/* Left Panel: Service Catalog (Always visible on desktop, or when activeTab === 'catalog') */}
          <div
            className={`flex-1 flex flex-col p-4 sm:p-5 overflow-hidden min-h-0 ${
              activeTab === 'checkout' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Search and Category Filter */}
            <div className="space-y-2.5 mb-3 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search haircut, beard trim, facial, hair color, massage..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden shadow-2xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Category tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {categories.map((cat) => {
                  const IconComp = categoryIcons[cat.icon] || Scissors;
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Services Grid (Scrollable) */}
            <div className="flex-1 overflow-y-auto pr-1 min-h-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 pb-20 lg:pb-4">
                {filteredServices.map((srv) => {
                  const count = cart[srv.id] || 0;
                  const isSelected = count > 0;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => addToCart(srv.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                        isSelected
                          ? 'bg-blue-50/70 border-blue-500 shadow-md ring-1 ring-blue-500'
                          : 'bg-white hover:bg-slate-50 border-slate-200 shadow-xs hover:border-blue-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <h4 className="font-bold text-sm text-slate-900 leading-snug">
                            {srv.name}
                          </h4>
                          {isSelected && (
                            <span className="bg-blue-600 text-white font-black text-xs px-2 py-0.5 rounded-full shadow-xs">
                              {count}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {srv.description || 'Standard salon procedure'}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{srv.duration}m</span>
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <span className="font-black text-base text-slate-900">
                            {formatCurrency(srv.price, salonInfo.currency)}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(srv.id);
                            }}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm transition ${
                              isSelected
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800'
                            }`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredServices.length === 0 && (
                <div className="py-16 text-center text-slate-400 text-sm">
                  No services matching "{searchQuery}".
                </div>
              )}
            </div>

            {/* Mobile / Split-screen Floating Sticky Action Bar */}
            <div className="lg:hidden absolute bottom-3 left-3 right-3 bg-slate-900 text-white p-3 rounded-2xl shadow-2xl flex items-center justify-between z-20 border border-slate-700">
              <div>
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">
                  {totalCartCount} Service{totalCartCount === 1 ? '' : 's'} Selected
                </p>
                <p className="text-lg font-black text-blue-400">
                  {formatCurrency(finalAmount, salonInfo.currency)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('checkout')}
                className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center gap-1.5 transition shadow-sm active:scale-95 cursor-pointer"
              >
                <span>PROCEED TO BILL</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Panel: Current Bill / Checkout (Always visible on desktop, or when activeTab === 'checkout') */}
          <div
            className={`w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between shadow-lg overflow-y-auto min-h-0 ${
              activeTab === 'catalog' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Bill Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('catalog')}
                  className="lg:hidden p-1 rounded-lg bg-white border border-slate-200 text-slate-600 mr-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Service Summary</h3>
                  <p className="text-[11px] text-slate-500">
                    {cartItems.length} service type{cartItems.length === 1 ? '' : 's'} added
                  </p>
                </div>
              </div>

              {cartItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCart({})}
                  className="text-xs text-rose-500 hover:text-rose-700 font-semibold"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="p-4 space-y-2 flex-1 overflow-y-auto min-h-[140px]">
              {cartItems.length === 0 ? (
                <div className="py-10 text-center text-slate-400">
                  <Scissors className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
                  <p className="text-sm font-bold text-slate-700">No services selected yet</p>
                  <p className="text-xs mt-1 text-slate-500">
                    Tap any haircut, beard, or facial service to add
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('catalog')}
                    className="mt-3 px-4 py-2 bg-blue-50 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 lg:hidden"
                  >
                    ← Browse Services Menu
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="font-bold text-slate-900 truncate">{item.name}</p>
                      <p className="text-slate-500">
                        {formatCurrency(item.price, salonInfo.currency)} each
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="w-6 h-6 rounded-md bg-white border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-slate-900 w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => addToCart(item.id)}
                        className="w-6 h-6 rounded-md bg-white border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteFromCart(item.id)}
                        className="w-6 h-6 ml-1 text-slate-400 hover:text-rose-500 flex items-center justify-center"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Customer Details & Payment Options Form */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3 shrink-0">
              
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    placeholder="Walk-in Guest"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition border cursor-pointer ${
                      paymentMethod === 'UPI'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>UPI / QR</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CASH')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition border cursor-pointer ${
                      paymentMethod === 'CASH'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span>Cash</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition border cursor-pointer ${
                      paymentMethod === 'CARD'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Card POS</span>
                  </button>
                </div>
              </div>

              {/* Dynamic QR preview if UPI is selected */}
              {paymentMethod === 'UPI' && (
                <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="bg-white p-1 rounded-lg border border-blue-200">
                      <QrCode className="w-6 h-6 text-blue-700" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Scan Fame City QR</p>
                      <p className="text-[10px] text-slate-600 font-mono">{salonInfo.upiId}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                    GPay • PhonePe
                  </span>
                </div>
              )}

              {/* Cash Calculator if CASH is selected */}
              {paymentMethod === 'CASH' && (
                <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Cash Given:</span>
                    <input
                      type="number"
                      placeholder={finalAmount.toString()}
                      value={cashTendered}
                      onChange={(e) => setCashTendered(e.target.value)}
                      className="w-24 px-2 py-1 text-right text-xs rounded-md border border-slate-200 bg-white font-bold"
                    />
                  </div>
                  <div className="flex gap-1.5 justify-end">
                    {cashOptions.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setCashTendered(amt.toString())}
                        className="px-2 py-0.5 bg-white hover:bg-emerald-100 border border-emerald-200 rounded text-[10px] font-semibold text-slate-700"
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                  {changeToReturn > 0 && (
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-emerald-200/60 font-bold text-emerald-800">
                      <span>Change to Return:</span>
                      <span>{formatCurrency(changeToReturn, salonInfo.currency)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Discount */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Discount ({salonInfo.currency}):</span>
                <input
                  type="number"
                  min="0"
                  max={subtotal}
                  value={discount || ''}
                  placeholder="0"
                  onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))}
                  className="w-20 px-2 py-1 text-right text-xs rounded-md border border-slate-200 bg-white"
                />
              </div>

              {/* Total & Submit Button */}
              <div className="pt-2 border-t border-slate-200">
                <div className="flex justify-between items-baseline mb-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Total Due
                  </span>
                  <span className="text-2xl font-black text-blue-600">
                    {formatCurrency(finalAmount, salonInfo.currency)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={cartItems.length === 0}
                  className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-md active:scale-98 cursor-pointer ${
                    cartItems.length > 0
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Check className="w-5 h-5 text-white stroke-[2.5]" />
                  <span>COMPLETE & LOG SERVICE</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
