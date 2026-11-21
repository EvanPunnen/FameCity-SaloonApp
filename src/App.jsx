import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TabletStation from './components/TabletStation';
import OwnerDashboard from './components/OwnerDashboard';
import PinModal from './components/PinModal';
import ReceiptModal from './components/ReceiptModal';
import ThemeModal from './components/ThemeModal';
import InstallApkModal from './components/InstallApkModal';
import {
  INITIAL_BARBERS,
  INITIAL_SERVICES,
  INITIAL_CATEGORIES,
  INITIAL_TRANSACTIONS,
  SALON_INFO
} from './data/initialData';
import { COLOR_THEMES } from './data/themes';

export default function App() {
  // LocalStorage state persistence
  const [barbers, setBarbers] = useState(() => {
    const saved = localStorage.getItem('famecity_barbers');
    return saved ? JSON.parse(saved) : INITIAL_BARBERS;
  });

  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem('famecity_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('famecity_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [salonInfo, setSalonInfo] = useState(() => {
    const saved = localStorage.getItem('famecity_salonInfo');
    return saved ? JSON.parse(saved) : SALON_INFO;
  });

  // Default to White & Blue theme
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('famecity_theme');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return COLOR_THEMES[0]; // famecity-blue
  });

  const categories = INITIAL_CATEGORIES;

  // View state
  const [currentView, setCurrentView] = useState('tablet'); // 'tablet' | 'owner'
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isOwnerUnlocked, setIsOwnerUnlocked] = useState(false);
  const [pendingActionAfterPin, setPendingActionAfterPin] = useState(null);

  // Modals state
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [lastCompletedTxn, setLastCompletedTxn] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('famecity_barbers', JSON.stringify(barbers));
  }, [barbers]);

  useEffect(() => {
    localStorage.setItem('famecity_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('famecity_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('famecity_salonInfo', JSON.stringify(salonInfo));
  }, [salonInfo]);

  useEffect(() => {
    localStorage.setItem('famecity_theme', JSON.stringify(currentTheme));
    if (currentTheme?.bg) {
      document.body.style.backgroundColor = currentTheme.bg;
    }
  }, [currentTheme]);

  // Handle View Switching
  const handleSwitchView = (targetView) => {
    if (targetView === 'owner') {
      if (isOwnerUnlocked) {
        setCurrentView('owner');
      } else {
        setPendingActionAfterPin(() => () => setCurrentView('owner'));
        setIsPinModalOpen(true);
      }
    } else {
      setCurrentView('tablet');
    }
  };

  const handlePinSuccess = () => {
    setIsOwnerUnlocked(true);
    setIsPinModalOpen(false);
    if (pendingActionAfterPin) {
      pendingActionAfterPin()();
      setPendingActionAfterPin(null);
    } else {
      setCurrentView('owner');
    }
  };

  // Record a new service transaction
  const handleRecordSale = (newTxn) => {
    setTransactions((prev) => [newTxn, ...prev]);
    setLastCompletedTxn(newTxn);
  };

  // Delete / void a transaction
  const handleDeleteTransaction = (txnId) => {
    setTransactions((prev) => prev.filter((t) => t.id !== txnId));
  };

  // Reset to initial demo data
  const handleResetData = () => {
    if (confirm('Reset Fame City app back to demo data?')) {
      localStorage.clear();
      setBarbers(INITIAL_BARBERS);
      setServices(INITIAL_SERVICES);
      setTransactions(INITIAL_TRANSACTIONS);
      setSalonInfo(SALON_INFO);
      setCurrentTheme(COLOR_THEMES[0]);
      setIsOwnerUnlocked(false);
      setCurrentView('tablet');
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 transition-colors duration-300"
      style={{ backgroundColor: currentTheme?.bg || '#f8fafc' }}
    >
      
      {/* Top Main Navigation Header */}
      <Header
        currentView={currentView}
        onSwitchView={handleSwitchView}
        salonInfo={salonInfo}
        onResetData={handleResetData}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1 flex flex-col">
        {currentView === 'tablet' ? (
          <TabletStation
            barbers={barbers}
            services={services}
            categories={categories}
            transactions={transactions}
            salonInfo={salonInfo}
            onRecordSale={handleRecordSale}
            onOpenOwnerDashboard={() => handleSwitchView('owner')}
            onOpenThemeModal={() => setIsThemeModalOpen(true)}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
            onUpdateBarbers={setBarbers}
          />
        ) : (
          <OwnerDashboard
            barbers={barbers}
            services={services}
            categories={categories}
            transactions={transactions}
            salonInfo={salonInfo}
            onUpdateBarbers={setBarbers}
            onUpdateServices={setServices}
            onUpdateSalonInfo={setSalonInfo}
            onDeleteTransaction={handleDeleteTransaction}
            onBackToTablet={() => setCurrentView('tablet')}
            onOpenThemeModal={() => setIsThemeModalOpen(true)}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
          />
        )}
      </main>

      {/* Color Palette Theme Modal */}
      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={currentTheme}
        onSelectTheme={(theme) => setCurrentTheme(theme)}
      />

      {/* Install APK / PWA Modal */}
      <InstallApkModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        salonInfo={salonInfo}
      />

      {/* Owner Security PIN Keypad Modal */}
      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => {
          setIsPinModalOpen(false);
          setPendingActionAfterPin(null);
        }}
        onSuccess={handlePinSuccess}
        currentPin={salonInfo.ownerPin || '1234'}
      />

      {/* Thermal Receipt Print Modal after Service Entry */}
      {lastCompletedTxn && (
        <ReceiptModal
          isOpen={Boolean(lastCompletedTxn)}
          onClose={() => setLastCompletedTxn(null)}
          transaction={lastCompletedTxn}
          salonInfo={salonInfo}
        />
      )}

    </div>
  );
}
