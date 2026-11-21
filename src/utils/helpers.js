// Format currency
export const formatCurrency = (amount, symbol = '₹') => {
  if (amount === undefined || amount === null || isNaN(amount)) return `${symbol}0`;
  return `${symbol}${Number(amount).toLocaleString('en-IN')}`;
};

// Format Date
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Format Time
export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const d = new Date(timeStr);
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Play pleasant register chime using Web Audio API
export const playSuccessChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // Notes: C5 -> G5 chord chime
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.55);
    });
  } catch (e) {
    console.error('Audio chime error:', e);
  }
};

// Export to CSV
export const exportToCSV = (transactions, filename = 'famecity-sales-report.csv') => {
  if (!transactions || !transactions.length) return;

  const headers = [
    'Transaction ID',
    'Date',
    'Time',
    'Barber ID',
    'Barber Name',
    'Customer Name',
    'Customer Phone',
    'Services Rendered',
    'Payment Method',
    'Gross Total',
    'Discount',
    'Net Amount',
    'Barber Commission',
    'Salon Net Share',
    'Status'
  ];

  const rows = transactions.map((t) => {
    const srvNames = t.services.map((s) => `${s.name} (x${s.quantity || 1})`).join('; ');
    const salonShare = (t.finalAmount || 0) - (t.barberCommission || 0);
    return [
      `"${t.id}"`,
      `"${t.date}"`,
      `"${formatTime(t.timestamp)}"`,
      `"${t.barberBadge}"`,
      `"${t.barberName}"`,
      `"${t.customerName || 'Walk-in'}"`,
      `"${t.customerPhone || ''}"`,
      `"${srvNames}"`,
      `"${t.paymentMethod}"`,
      t.totalAmount,
      t.discount || 0,
      t.finalAmount,
      t.barberCommission || 0,
      salonShare,
      `"${t.status}"`
    ];
  });

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
