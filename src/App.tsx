/**
 * aurumRates - Live Daily Gold & Silver Bullion Rates
 * Inspired by clean professional rate boards (like DP Gold & CapsGold)
 */

import React, { useState } from 'react';
import { DailyRates, StoreInfo, RateHistoryItem } from './types';
import {
  getStoredRates,
  getStoredHistory,
  getStoredStoreInfo,
  checkIsAdminAuthenticated,
  setAdminAuth,
} from './utils/storage';
import { AurumRatesDisplay } from './components/AurumRatesDisplay';
import { AdminPanel } from './components/AdminPanel';

export default function App() {
  const [rates, setRates] = useState<DailyRates>(() => getStoredRates());
  const [history, setHistory] = useState<RateHistoryItem[]>(() => getStoredHistory());
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(() => getStoredStoreInfo());
  const [isAdminLoggedIn, setIsAdminLoggedInState] = useState<boolean>(() => checkIsAdminAuthenticated());
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const setIsAdminLoggedIn = (isAuth: boolean) => {
    setIsAdminLoggedInState(isAuth);
    setAdminAuth(isAuth);
  };

  const handleRatesUpdated = (newRates: DailyRates, newHistory: RateHistoryItem[]) => {
    setRates(newRates);
    setHistory(newHistory);
  };

  const handleHistoryUpdated = (newHistory: RateHistoryItem[]) => {
    setHistory(newHistory);
  };

  const handleStoreInfoUpdated = (newInfo: StoreInfo) => {
    setStoreInfo(newInfo);
  };

  return (
    <div className="min-h-screen bg-[#070E1A] text-white">
      {/* Primary Clean Bullion Board Display (Strictly Single-Screen like uploaded photo) */}
      <AurumRatesDisplay
        rates={rates}
        history={history}
        storeInfo={storeInfo}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Admin Panel Modal (Secure rate modifier for 24K, 22K, 18K, Silver) */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        rates={rates}
        onRatesUpdated={handleRatesUpdated}
        history={history}
        onHistoryUpdated={handleHistoryUpdated}
        storeInfo={storeInfo}
        onStoreInfoUpdated={handleStoreInfoUpdated}
        isAdminLoggedIn={isAdminLoggedIn}
        setIsAdminLoggedIn={setIsAdminLoggedIn}
      />
    </div>
  );
}
