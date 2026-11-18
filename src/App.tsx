/**
 * aurumRates - Live Daily Gold & Silver Bullion Rates
 * Inspired by clean professional rate boards (like DP Gold & CapsGold)
 */

import React, { useEffect, useState } from 'react';
import { DailyRates, StoreInfo, RateHistoryItem } from './types';
import {
  getStoredRates,
  getStoredHistory,
  getStoredStoreInfo,
  checkIsAdminAuthenticated,
  setAdminToken,
  fetchSiteData,
  saveSiteData,
  verifyAdminSession,
  AuthExpiredError,
} from './utils/storage';
import { AurumRatesDisplay } from './components/AurumRatesDisplay';
import { AdminPanel } from './components/AdminPanel';

export default function App() {
  const [rates, setRates] = useState<DailyRates>(() => getStoredRates());
  const [history, setHistory] = useState<RateHistoryItem[]>(() => getStoredHistory());
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(() => getStoredStoreInfo());
  const [isAdminLoggedIn, setIsAdminLoggedInState] = useState<boolean>(() => checkIsAdminAuthenticated());
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Load the shared data from the server so every device shows the same settings.
  useEffect(() => {
    let cancelled = false;
    fetchSiteData().then((data) => {
      if (cancelled || !data) return;
      setRates(data.rates);
      setHistory(data.history);
      setStoreInfo(data.storeInfo);
    });
    if (checkIsAdminAuthenticated()) {
      verifyAdminSession().then((valid) => {
        if (!cancelled && !valid) setIsAdminLoggedInState(false);
      });
    }
    return () => {
      cancelled = true;
    };
  }, []);

  const setIsAdminLoggedIn = (isAuth: boolean) => {
    setIsAdminLoggedInState(isAuth);
    if (!isAuth) setAdminToken(null);
  };

  // Saves to the server; throws on failure so the admin panel can show the error.
  const persist = async (partial: Parameters<typeof saveSiteData>[0]) => {
    try {
      await saveSiteData(partial);
    } catch (err) {
      if (err instanceof AuthExpiredError) setIsAdminLoggedInState(false);
      throw err;
    }
  };

  const handleRatesUpdated = async (newRates: DailyRates, newHistory: RateHistoryItem[]) => {
    await persist({ rates: newRates, history: newHistory });
    setRates(newRates);
    setHistory(newHistory);
  };

  const handleHistoryUpdated = async (newHistory: RateHistoryItem[]) => {
    await persist({ history: newHistory });
    setHistory(newHistory);
  };

  const handleStoreInfoUpdated = async (newInfo: StoreInfo) => {
    await persist({ storeInfo: newInfo });
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
