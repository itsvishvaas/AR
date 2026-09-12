import React, { useState } from 'react';
import { DailyRates, StoreInfo, RateHistoryItem, MetalType } from '../types';
import {
  formatIndianCurrency,
  updateSingleMetalRate,
  updateAllDailyRates,
  formatCurrentTimestamp,
  saveStoreInfo,
  PERMANENT_ADMIN_USERNAME,
  PERMANENT_ADMIN_EMAIL,
  PERMANENT_ADMIN_PASSWORD
} from '../utils/storage';
import {
  Lock,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Save,
  Store,
  History,
  ShieldAlert,
  Coins,
  Sparkles,
  ArrowRight,
  LogOut,
  RefreshCw,
  Plus,
  Trash2
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  rates: DailyRates;
  onRatesUpdated: (newRates: DailyRates, newHistory: RateHistoryItem[]) => void;
  history: RateHistoryItem[];
  onHistoryUpdated: (newHistory: RateHistoryItem[]) => void;
  storeInfo: StoreInfo;
  onStoreInfoUpdated: (newInfo: StoreInfo) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (isAuth: boolean) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  rates,
  onRatesUpdated,
  history,
  onHistoryUpdated,
  storeInfo,
  onStoreInfoUpdated,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
}) => {
  // Authentication State
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'rates' | 'store' | 'history'>('rates');

  // Rates Form State (Individual inputs)
  const [rate24k, setRate24k] = useState<string>(rates.gold24k.toString());
  const [rate22k, setRate22k] = useState<string>(rates.gold22k.toString());
  const [rate18k, setRate18k] = useState<string>(rates.gold18k.toString());
  const [rateSilver, setRateSilver] = useState<string>(rates.silver.toString());

  // Feedback Messages
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Store Info Form State
  const [editStoreInfo, setEditStoreInfo] = useState<StoreInfo>({ ...storeInfo });

  // Add History Form State
  const [showAddHistory, setShowAddHistory] = useState(false);
  const [newHistDate, setNewHistDate] = useState('');
  const [newHist24k, setNewHist24k] = useState('');
  const [newHist22k, setNewHist22k] = useState('');
  const [newHist18k, setNewHist18k] = useState('');
  const [newHistSilver, setNewHistSilver] = useState('');

  if (!isOpen) return null;

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMessage({ type, text });
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const inputUser = authEmail.trim().toLowerCase();
    const inputPass = authPassword.trim();

    // Permanent Backend Authentication (Fixed and immutable from frontend)
    const validUser = inputUser === PERMANENT_ADMIN_USERNAME.toLowerCase() || inputUser === PERMANENT_ADMIN_EMAIL.toLowerCase();
    const validPass = inputPass === PERMANENT_ADMIN_PASSWORD;

    if (validUser && validPass) {
      setIsAdminLoggedIn(true);
      setAuthError('');
      showNotification('Successfully logged in as Administrator.');
    } else {
      setAuthError(`Invalid credentials. Please enter authorized username "${PERMANENT_ADMIN_USERNAME}" and password.`);
    }
  };

  const handleQuickDemoLogin = () => {
    setAuthEmail(PERMANENT_ADMIN_USERNAME);
    setAuthPassword(PERMANENT_ADMIN_PASSWORD);
    setIsAdminLoggedIn(true);
    showNotification('Logged in with permanent backend credentials.');
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    showNotification('Logged out of Admin Dashboard.');
  };

  // Update Individual Metal Rate as specifically illustrated in user prompt:
  // 24K Gold [ ₹ 15000 ] [Update]
  const handleUpdateSingleMetal = (metalKey: MetalType, inputVal: string, metalLabel: string) => {
    const num = parseFloat(inputVal);
    if (isNaN(num) || num <= 0) {
      showNotification(`Please enter a valid price for ${metalLabel}`, 'error');
      return;
    }

    const { updatedRates, updatedHistory } = updateSingleMetalRate(metalKey, num, rates, history);
    onRatesUpdated(updatedRates, updatedHistory);
    showNotification(`${metalLabel} updated to ₹${formatIndianCurrency(num)}/g. Website & timestamp refreshed!`);
  };

  // Update all rates at once
  const handleUpdateAllRates = (e: React.FormEvent) => {
    e.preventDefault();
    const g24 = parseFloat(rate24k);
    const g22 = parseFloat(rate22k);
    const g18 = parseFloat(rate18k);
    const sil = parseFloat(rateSilver);

    if (isNaN(g24) || isNaN(g22) || isNaN(g18) || isNaN(sil) || g24 <= 0 || g22 <= 0 || g18 <= 0 || sil <= 0) {
      showNotification('Please provide valid positive numbers for all 4 metal rates.', 'error');
      return;
    }

    const { updatedRates, updatedHistory } = updateAllDailyRates(
      { gold24k: g24, gold22k: g22, gold18k: g18, silver: sil },
      history
    );
    onRatesUpdated(updatedRates, updatedHistory);
    showNotification('All Gold & Silver rates updated successfully! Public website refreshed.');
  };

  // Auto-calculate 22K and 18K based on 24K pure rate
  const handleAutoCalculatePurities = () => {
    const g24 = parseFloat(rate24k);
    if (isNaN(g24) || g24 <= 0) {
      showNotification('Enter a valid 24K rate first to auto-derive purities', 'error');
      return;
    }
    // 22K standard is ~91.66% of 24K
    const calc22k = Math.round(g24 * 0.9166);
    // 18K standard is 75% of 24K
    const calc18k = Math.round(g24 * 0.75);

    setRate22k(calc22k.toString());
    setRate18k(calc18k.toString());
    showNotification(`Auto-calculated: 22K (91.6%) = ₹${calc22k}, 18K (75%) = ₹${calc18k}`);
  };

  // Save Store Info
  const handleSaveStoreInfo = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoreInfo(editStoreInfo);
    onStoreInfoUpdated(editStoreInfo);
    showNotification('Store profile & contact details updated successfully.');
  };

  // Add Manual History Entry
  const handleAddHistoryRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHistDate || !newHist24k || !newHist22k || !newHist18k || !newHistSilver) {
      showNotification('Please fill in all fields for the historical record.', 'error');
      return;
    }

    const newRecord: RateHistoryItem = {
      id: 'hist-' + Date.now(),
      date: newHistDate,
      timestamp: Date.now(),
      gold24k: parseFloat(newHist24k),
      gold22k: parseFloat(newHist22k),
      gold18k: parseFloat(newHist18k),
      silver: parseFloat(newHistSilver),
    };

    const updated = [newRecord, ...history];
    onHistoryUpdated(updated);
    setShowAddHistory(false);
    setNewHistDate('');
    setNewHist24k('');
    setNewHist22k('');
    setNewHist18k('');
    setNewHistSilver('');
    showNotification('Historical entry added successfully.');
  };

  // Delete History Record
  const handleDeleteHistoryRecord = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    onHistoryUpdated(updated);
    showNotification('Historical record removed.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#111111] text-white rounded-2xl sm:rounded-3xl border-2 border-[#C9A227] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#181612] border-b border-[#C9A227]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#E6C96A] to-[#8C6D14] p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-[#111111] rounded-[6px] flex items-center justify-center">
                <Lock className="w-4 h-4 text-[#E6C96A]" />
              </div>
            </div>
            <div>
              <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-white leading-tight">
                Store Administrator Panel
              </h2>
              <p className="text-[11px] text-[#E6C96A]">
                {storeInfo.storeName} • Rates & Store Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminLoggedIn && (
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white/80 hover:text-white transition-colors"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
              aria-label="Close Admin Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Notifications */}
        {feedbackMessage && (
          <div
            className={`px-4 py-2.5 text-xs font-semibold flex items-center gap-2 border-b ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                : 'bg-rose-950/80 text-rose-300 border-rose-800'
            }`}
          >
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {!isAdminLoggedIn ? (
            /* Admin Login View */
            <div className="max-w-md mx-auto py-6 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E6C96A] to-[#8C6D14] mx-auto flex items-center justify-center shadow-lg shadow-[#C9A227]/20">
                  <Lock className="w-7 h-7 text-[#111111]" />
                </div>
                <h3 className="font-serif-luxury text-2xl font-bold text-white">
                  Owner / Administrator Sign In
                </h3>
                <p className="text-xs text-white/70">
                  Enter your credentials to modify daily gold & silver rates and update store information.
                </p>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-900/40 border border-rose-700/60 text-xs text-rose-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1">
                    Username or Email
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="admin1 or admin@gmail.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-black/60 border border-[#C9A227]/40 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-black/60 border border-[#C9A227]/40 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#C9A227] to-[#E6C96A] hover:brightness-105 text-[#111111] font-bold text-sm rounded-xl shadow-lg shadow-[#C9A227]/20 transition-all active:scale-95"
                >
                  Sign In to Dashboard
                </button>
              </form>

              {/* Permanent Backend Credentials Box */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#E6C96A]">Permanent Admin Credentials:</span>
                  <button
                    type="button"
                    onClick={handleQuickDemoLogin}
                    className="text-[11px] text-[#E6C96A] hover:underline font-bold"
                  >
                    Auto-Fill Credentials →
                  </button>
                </div>
                <div className="font-mono text-[11px] text-white/80 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>Username: <strong className="text-white">admin1</strong></span>
                  <span>Email: <strong className="text-white">admin@gmail.com</strong></span>
                  <span>Password: <strong className="text-white">admin@987</strong></span>
                </div>
                <p className="text-[10px] text-amber-300/80 leading-tight">
                  Security notice: Permanent backend credentials. No changes can be made from frontend; modification is restricted to backend source code.
                </p>
              </div>
            </div>
          ) : (
            /* Authenticated Admin Dashboard */
            <div className="space-y-6">
              {/* Tab Navigation */}
              <div className="flex p-1 bg-black/50 border border-[#C9A227]/30 rounded-xl">
                <button
                  onClick={() => setActiveTab('rates')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'rates'
                      ? 'bg-[#C9A227] text-black shadow-md'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Coins className="w-4 h-4" />
                  <span>Daily Rates Manager</span>
                </button>
                <button
                  onClick={() => setActiveTab('store')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'store'
                      ? 'bg-[#C9A227] text-black shadow-md'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Store Profile & Info</span>
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'history'
                      ? 'bg-[#C9A227] text-black shadow-md'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <History className="w-4 h-4" />
                  <span>Rate Logs ({history.length})</span>
                </button>
              </div>

              {/* TAB 1: DAILY RATES MANAGER */}
              {activeTab === 'rates' && (
                <div className="space-y-6">
                  {/* Current Active Timestamp Banner */}
                  <div className="p-3.5 rounded-xl bg-black/40 border border-[#C9A227]/30 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#C9A227]" />
                      <span className="text-white/70">Current Live Website Timestamp:</span>
                      <strong className="text-[#E6C96A]">{rates.lastUpdated}</strong>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      Live on Public Site
                    </span>
                  </div>

                  {/* Individual Rate Modifier as described in prompt:
                      24K Gold [ ₹ 15000 ] [Update]
                      22K Gold [ ₹ 13750 ] [Update]
                      18K Gold [ ₹ 11250 ] [Update]
                      Silver   [ ₹ 220 ]   [Update]
                  */}
                  <div className="bg-[#181612] p-4 sm:p-6 rounded-2xl border border-white/10 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div>
                        <h3 className="font-serif-luxury text-base font-bold text-white">
                          Edit Metal Rates (Per Gram in ₹)
                        </h3>
                        <p className="text-xs text-white/60">
                          Clicking [Update] instantly updates the public site, updates timestamp, and appends to rate history.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAutoCalculatePurities}
                        className="text-xs text-[#E6C96A] hover:underline font-semibold flex items-center gap-1 bg-white/5 px-2.5 py-1.5 rounded-lg border border-[#C9A227]/30"
                        title="Derive 22K (91.6%) and 18K (75%) from 24K pure rate"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                        <span>Auto-Derive 22K/18K</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* 24K Gold Row */}
                      <div className="p-3.5 rounded-xl bg-black/40 border border-[#C9A227]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="sm:w-1/3">
                          <div className="flex items-center gap-2">
                            <span className="text-base">🏆</span>
                            <span className="font-bold text-white text-sm">24K Gold (999)</span>
                          </div>
                          <span className="text-[11px] text-white/50">Fine gold per gram</span>
                        </div>

                        <div className="flex items-center gap-2 flex-1 max-w-sm">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#C9A227] font-bold">
                              ₹
                            </span>
                            <input
                              type="number"
                              step="1"
                              value={rate24k}
                              onChange={(e) => setRate24k(e.target.value)}
                              className="w-full pl-7 pr-3 py-2 bg-black border border-[#C9A227]/50 rounded-lg text-base font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                              placeholder="15000"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleUpdateSingleMetal('gold24k', rate24k, '24K Gold (999)')}
                            className="py-2 px-4 bg-[#C9A227] hover:bg-[#E6C96A] text-black font-bold text-xs rounded-lg transition-all active:scale-95 shrink-0"
                          >
                            Update
                          </button>
                        </div>
                      </div>

                      {/* 22K Gold Row */}
                      <div className="p-3.5 rounded-xl bg-black/40 border border-[#E6C96A]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="sm:w-1/3">
                          <div className="flex items-center gap-2">
                            <span className="text-base">👑</span>
                            <span className="font-bold text-[#FFF1B8] text-sm">22K Gold (916)</span>
                          </div>
                          <span className="text-[11px] text-[#E6C96A]">916 gold per gram</span>
                        </div>

                        <div className="flex items-center gap-2 flex-1 max-w-sm">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#C9A227] font-bold">
                              ₹
                            </span>
                            <input
                              type="number"
                              step="1"
                              value={rate22k}
                              onChange={(e) => setRate22k(e.target.value)}
                              className="w-full pl-7 pr-3 py-2 bg-black border border-[#C9A227]/50 rounded-lg text-base font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                              placeholder="13750"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleUpdateSingleMetal('gold22k', rate22k, '22K Gold (916)')}
                            className="py-2 px-4 bg-[#C9A227] hover:bg-[#E6C96A] text-black font-bold text-xs rounded-lg transition-all active:scale-95 shrink-0"
                          >
                            Update
                          </button>
                        </div>
                      </div>

                      {/* 18K Gold Row */}
                      <div className="p-3.5 rounded-xl bg-black/40 border border-[#C9A227]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="sm:w-1/3">
                          <div className="flex items-center gap-2">
                            <span className="text-base">✨</span>
                            <span className="font-bold text-white text-sm">18K Gold</span>
                          </div>
                          <span className="text-[11px] text-white/50">18K gold per gram</span>
                        </div>

                        <div className="flex items-center gap-2 flex-1 max-w-sm">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#C9A227] font-bold">
                              ₹
                            </span>
                            <input
                              type="number"
                              step="1"
                              value={rate18k}
                              onChange={(e) => setRate18k(e.target.value)}
                              className="w-full pl-7 pr-3 py-2 bg-black border border-[#C9A227]/50 rounded-lg text-base font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                              placeholder="11250"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleUpdateSingleMetal('gold18k', rate18k, '18K Gold')}
                            className="py-2 px-4 bg-[#C9A227] hover:bg-[#E6C96A] text-black font-bold text-xs rounded-lg transition-all active:scale-95 shrink-0"
                          >
                            Update
                          </button>
                        </div>
                      </div>

                      {/* Silver Row */}
                      <div className="p-3.5 rounded-xl bg-black/40 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="sm:w-1/3">
                          <div className="flex items-center gap-2">
                            <span className="text-base">🥈</span>
                            <span className="font-bold text-white text-sm">Silver (HYD-SEC)</span>
                          </div>
                          <span className="text-[11px] text-white/50">Silver rate per kg (₹)</span>
                        </div>

                        <div className="flex items-center gap-2 flex-1 max-w-sm">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-300 font-bold">
                              ₹
                            </span>
                            <input
                              type="number"
                              step="1"
                              value={rateSilver}
                              onChange={(e) => setRateSilver(e.target.value)}
                              className="w-full pl-7 pr-3 py-2 bg-black border border-slate-600 rounded-lg text-base font-bold text-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                              placeholder="230000"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleUpdateSingleMetal('silver', rateSilver, 'Silver (HYD-SEC)')}
                            className="py-2 px-4 bg-slate-200 hover:bg-white text-black font-bold text-xs rounded-lg transition-all active:scale-95 shrink-0"
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Bulk Update All Button */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs text-white/60">
                        Or apply all changes at once:
                      </span>
                      <button
                        type="button"
                        onClick={handleUpdateAllRates}
                        className="py-2.5 px-5 bg-gradient-to-r from-[#C9A227] to-[#E6C96A] hover:brightness-105 text-[#111111] font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95"
                      >
                        Update All 4 Rates
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: STORE PROFILE & CONTACT SETTINGS */}
              {activeTab === 'store' && (
                <form onSubmit={handleSaveStoreInfo} className="space-y-4">
                  <div className="bg-[#181612] p-4 sm:p-5 rounded-2xl border border-white/10 space-y-4">
                    <h3 className="font-serif-luxury text-base font-bold text-white pb-2 border-b border-white/10">
                      Store Branding & Public Information
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-bold text-white/80 mb-1 uppercase tracking-wider">
                          Store Name
                        </label>
                        <input
                          type="text"
                          required
                          value={editStoreInfo.storeName}
                          onChange={(e) => setEditStoreInfo({ ...editStoreInfo, storeName: e.target.value })}
                          className="w-full p-2.5 bg-black border border-white/20 rounded-lg text-white font-medium focus:ring-2 focus:ring-[#C9A227]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-white/80 mb-1 uppercase tracking-wider">
                          Logo Monogram (2-3 chars)
                        </label>
                        <input
                          type="text"
                          maxLength={4}
                          value={editStoreInfo.logoMonogram}
                          onChange={(e) => setEditStoreInfo({ ...editStoreInfo, logoMonogram: e.target.value })}
                          className="w-full p-2.5 bg-black border border-white/20 rounded-lg text-white font-mono font-bold focus:ring-2 focus:ring-[#C9A227]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold text-white/80 mb-1 uppercase tracking-wider">
                          Tagline / Header Description
                        </label>
                        <input
                          type="text"
                          value={editStoreInfo.tagline}
                          onChange={(e) => setEditStoreInfo({ ...editStoreInfo, tagline: e.target.value })}
                          className="w-full p-2.5 bg-black border border-white/20 rounded-lg text-white font-medium focus:ring-2 focus:ring-[#C9A227]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold text-white/80 mb-1 uppercase tracking-wider">
                          Physical Store Address
                        </label>
                        <input
                          type="text"
                          required
                          value={editStoreInfo.address}
                          onChange={(e) => setEditStoreInfo({ ...editStoreInfo, address: e.target.value })}
                          className="w-full p-2.5 bg-black border border-white/20 rounded-lg text-white font-medium focus:ring-2 focus:ring-[#C9A227]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-white/80 mb-1 uppercase tracking-wider">
                          City, State & Pincode
                        </label>
                        <input
                          type="text"
                          required
                          value={editStoreInfo.cityStatePincode}
                          onChange={(e) => setEditStoreInfo({ ...editStoreInfo, cityStatePincode: e.target.value })}
                          className="w-full p-2.5 bg-black border border-white/20 rounded-lg text-white font-medium focus:ring-2 focus:ring-[#C9A227]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-white/80 mb-1 uppercase tracking-wider">
                          BIS Hallmarking License No.
                        </label>
                        <input
                          type="text"
                          value={editStoreInfo.bisLicense}
                          onChange={(e) => setEditStoreInfo({ ...editStoreInfo, bisLicense: e.target.value })}
                          className="w-full p-2.5 bg-black border border-white/20 rounded-lg text-white font-medium focus:ring-2 focus:ring-[#C9A227]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-white/80 mb-1 uppercase tracking-wider">
                          Phone Number (for Calls)
                        </label>
                        <input
                          type="text"
                          value={editStoreInfo.phoneDisplay}
                          onChange={(e) => setEditStoreInfo({ ...editStoreInfo, phoneDisplay: e.target.value, phone: e.target.value.replace(/[^0-9+]/g, '') })}
                          className="w-full p-2.5 bg-black border border-white/20 rounded-lg text-white font-medium focus:ring-2 focus:ring-[#C9A227]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-white/80 mb-1 uppercase tracking-wider">
                          WhatsApp Number (with country code)
                        </label>
                        <input
                          type="text"
                          value={editStoreInfo.whatsapp}
                          onChange={(e) => setEditStoreInfo({ ...editStoreInfo, whatsapp: e.target.value.replace(/[^0-9]/g, '') })}
                          className="w-full p-2.5 bg-black border border-white/20 rounded-lg text-white font-medium focus:ring-2 focus:ring-[#C9A227]"
                          placeholder="919845012345"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-white/80 mb-1 uppercase tracking-wider">
                          Store Email
                        </label>
                        <input
                          type="email"
                          value={editStoreInfo.email}
                          onChange={(e) => setEditStoreInfo({ ...editStoreInfo, email: e.target.value })}
                          className="w-full p-2.5 bg-black border border-white/20 rounded-lg text-white font-medium focus:ring-2 focus:ring-[#C9A227]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-white/80 mb-1 uppercase tracking-wider">
                          Google Maps URL
                        </label>
                        <input
                          type="url"
                          value={editStoreInfo.googleMapsUrl}
                          onChange={(e) => setEditStoreInfo({ ...editStoreInfo, googleMapsUrl: e.target.value })}
                          className="w-full p-2.5 bg-black border border-white/20 rounded-lg text-white font-medium focus:ring-2 focus:ring-[#C9A227]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-white/80 mb-1 uppercase tracking-wider">
                          Business Hours (Weekday)
                        </label>
                        <input
                          type="text"
                          value={editStoreInfo.businessHoursWeekday}
                          onChange={(e) => setEditStoreInfo({ ...editStoreInfo, businessHoursWeekday: e.target.value })}
                          className="w-full p-2.5 bg-black border border-white/20 rounded-lg text-white font-medium focus:ring-2 focus:ring-[#C9A227]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-white/80 mb-1 uppercase tracking-wider">
                          Business Hours (Sunday / Weekend)
                        </label>
                        <input
                          type="text"
                          value={editStoreInfo.businessHoursWeekend}
                          onChange={(e) => setEditStoreInfo({ ...editStoreInfo, businessHoursWeekend: e.target.value })}
                          className="w-full p-2.5 bg-black border border-white/20 rounded-lg text-white font-medium focus:ring-2 focus:ring-[#C9A227]"
                        />
                      </div>
                    </div>

                    {/* Security & Access Credentials Info */}
                    <div className="p-3.5 bg-black/40 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-xs text-slate-300">
                      <Lock className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="font-bold text-white">Permanent Admin Security Configuration</span>
                        <p className="text-[11px] text-slate-400">
                          Username: <span className="font-mono text-[#E6C96A] font-bold">{PERMANENT_ADMIN_USERNAME}</span> | Email: <span className="font-mono text-[#E6C96A] font-bold">{PERMANENT_ADMIN_EMAIL}</span> | Password: <span className="font-mono text-[#E6C96A] font-bold">{PERMANENT_ADMIN_PASSWORD}</span>.
                          <br />
                          <span className="text-amber-300/90 font-medium">Notice: Authentication credentials cannot be modified via frontend; they are permanently locked to backend source code.</span>
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex justify-end">
                      <button
                        type="submit"
                        className="py-2.5 px-6 bg-[#C9A227] hover:bg-[#E6C96A] text-black font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Store Profile</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* TAB 3: RATE HISTORY LOGS */}
              {activeTab === 'history' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div>
                      <h3 className="font-serif-luxury text-base font-bold text-white">
                        Archived Daily Rate Logs
                      </h3>
                      <p className="text-xs text-white/60">
                        Historical records stored in database. Powers the trend line chart.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAddHistory(!showAddHistory)}
                      className="py-1.5 px-3 bg-white/10 hover:bg-white/20 text-[#E6C96A] text-xs font-semibold rounded-lg flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{showAddHistory ? 'Cancel' : 'Add Past Record'}</span>
                    </button>
                  </div>

                  {/* Add Manual Record Sub-form */}
                  {showAddHistory && (
                    <form onSubmit={handleAddHistoryRecord} className="p-4 bg-black/60 border border-[#C9A227]/40 rounded-xl space-y-3 text-xs">
                      <div className="font-bold text-[#E6C96A]">Add Custom Historical Rate Entry</div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        <div>
                          <label className="block text-white/70 mb-1">Date (e.g. 29 Aug 2026)</label>
                          <input
                            type="text"
                            required
                            placeholder="29 Aug 2026"
                            value={newHistDate}
                            onChange={(e) => setNewHistDate(e.target.value)}
                            className="w-full p-2 bg-black border border-white/20 rounded text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-white/70 mb-1">24K (₹/g)</label>
                          <input
                            type="number"
                            required
                            placeholder="14700"
                            value={newHist24k}
                            onChange={(e) => setNewHist24k(e.target.value)}
                            className="w-full p-2 bg-black border border-white/20 rounded text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-white/70 mb-1">22K (₹/g)</label>
                          <input
                            type="number"
                            required
                            placeholder="13480"
                            value={newHist22k}
                            onChange={(e) => setNewHist22k(e.target.value)}
                            className="w-full p-2 bg-black border border-white/20 rounded text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-white/70 mb-1">18K (₹/g)</label>
                          <input
                            type="number"
                            required
                            placeholder="11020"
                            value={newHist18k}
                            onChange={(e) => setNewHist18k(e.target.value)}
                            className="w-full p-2 bg-black border border-white/20 rounded text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-white/70 mb-1">Silver (₹/g)</label>
                          <input
                            type="number"
                            required
                            placeholder="210"
                            value={newHistSilver}
                            onChange={(e) => setNewHistSilver(e.target.value)}
                            className="w-full p-2 bg-black border border-white/20 rounded text-white"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="py-1.5 px-4 bg-[#C9A227] text-black font-bold rounded text-xs"
                      >
                        Save Entry to History
                      </button>
                    </form>
                  )}

                  {/* History Logs Table */}
                  <div className="max-h-72 overflow-y-auto border border-white/10 rounded-xl bg-black/40">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="sticky top-0 bg-[#181612] text-white/80 border-b border-white/10">
                        <tr>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3 text-right">24K</th>
                          <th className="py-2.5 px-3 text-right text-[#E6C96A]">22K</th>
                          <th className="py-2.5 px-3 text-right">18K</th>
                          <th className="py-2.5 px-3 text-right">Silver</th>
                          <th className="py-2.5 px-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-mono">
                        {history.slice().reverse().map((item) => (
                          <tr key={item.id} className="hover:bg-white/5">
                            <td className="py-2 px-3 font-sans font-medium text-white">{item.date}</td>
                            <td className="py-2 px-3 text-right">₹{item.gold24k}</td>
                            <td className="py-2 px-3 text-right text-[#E6C96A] font-bold">₹{item.gold22k}</td>
                            <td className="py-2 px-3 text-right">₹{item.gold18k}</td>
                            <td className="py-2 px-3 text-right text-slate-300">₹{item.silver}</td>
                            <td className="py-2 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleDeleteHistoryRecord(item.id)}
                                className="text-white/40 hover:text-rose-400 transition-colors p-1"
                                title="Remove Entry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#181612] border-t border-[#C9A227]/20 flex items-center justify-between text-xs text-white/50">
          <span>Protected Store Management Console</span>
          <button
            onClick={onClose}
            className="py-1 px-3 rounded bg-white/10 hover:bg-white/20 text-white font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
