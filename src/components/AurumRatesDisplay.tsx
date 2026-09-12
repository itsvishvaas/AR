import React, { useState } from 'react';
import { DailyRates, RateHistoryItem, StoreInfo } from '../types';
import { useLiveSpotRates } from '../utils/useLiveSpotRates';
import { MessageCircle, ShieldCheck, Clock, X, Phone, Mail, MapPin, TrendingUp, Lock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface AurumRatesDisplayProps {
  rates: DailyRates;
  history: RateHistoryItem[];
  storeInfo: StoreInfo;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const AurumRatesDisplay: React.FC<AurumRatesDisplayProps> = ({
  rates,
  history,
  storeInfo,
  onOpenAdmin,
  isAdminLoggedIn,
}) => {
  const [activeModal, setActiveModal] = useState<'none' | 'about' | 'history' | 'contact'>('none');
  const [currencyView, setCurrencyView] = useState<'plain' | 'rupee'>('plain');

  // Live second-by-second spot rates for Gold, Silver, and USDINR
  const {
    goldSpot,
    silverSpot,
    usdInr,
    goldTrend,
    silverTrend,
    usdTrend,
  } = useLiveSpotRates();

  const rateRows = [
    {
      key: 'gold24k',
      label: 'GOLD 24K (999)',
      price: rates.gold24k,
      unit: '/ gm',
      color: 'text-[#E6A23C]',
    },
    {
      key: 'gold22k',
      label: 'GOLD 22K (916)',
      price: rates.gold22k,
      unit: '/ gm',
      color: 'text-[#F5A623]',
    },
    {
      key: 'gold18k',
      label: 'GOLD 18K',
      price: rates.gold18k,
      unit: '/ gm',
      color: 'text-[#E6C96A]',
    },
    {
      key: 'silver',
      label: 'SILVER (HYD-SEC)',
      price: rates.silver,
      unit: '/ kg',
      color: 'text-[#E2E8F0]',
    },
  ];

  const formatPrice = (val: number, isSilver: boolean = false) => {
    const fixed = isSilver ? Math.round(val).toString() : Number(val).toFixed(1);
    if (currencyView === 'rupee') {
      return `₹ ${fixed}`;
    }
    return fixed;
  };

  // Prepare chart data for History modal
  const chartData = history.slice(-10).map((h) => ({
    date: h.date.slice(0, 6),
    '24K': h.gold24k,
    '22K': h.gold22k,
    '18K': h.gold18k,
    Silver: h.silver,
  }));

  return (
    <div className="min-h-screen bg-[#070E1A] text-white flex flex-col justify-between relative overflow-hidden font-sans select-none">
      {/* Background bullion bar silhouette subtle graphics matching screenshot */}
      <div className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full bg-blue-900/10 blur-3xl absolute -top-40 -left-40" />
        <div className="w-[700px] h-[700px] rounded-full bg-amber-500/5 blur-3xl absolute -bottom-40 -right-40" />
        {/* Subtle bullion ingot diagonal silhouette */}
        <div className="w-80 h-96 border-2 border-white/5 rounded-2xl rotate-12 transform translate-x-48 translate-y-12 bg-gradient-to-b from-amber-500/5 to-transparent flex flex-col items-center justify-center">
          <span className="text-white/10 font-serif-luxury text-4xl font-bold tracking-widest">999.9</span>
          <span className="text-white/5 text-xs tracking-widest mt-2">FINE GOLD</span>
        </div>
      </div>

      {/* 1. TOP NAVIGATION BAR */}
      <header className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-8 py-5 flex items-center justify-between">
        {/* Logo: aurumRates */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E6C96A] via-[#C9A227] to-[#8C6D14] p-0.5 shadow-lg shadow-amber-500/10 flex items-center justify-center">
            <div className="w-full h-full bg-[#070E1A] rounded-[10px] flex items-center justify-center border border-[#E6C96A]/40">
              <span className="font-serif-luxury font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#FFF1B8] to-[#E6A23C]">
                aR
              </span>
            </div>
          </div>
          <div>
            <span className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-wide text-white block leading-none">
              aurum<span className="text-[#F5A623]">Rates</span>
            </span>
            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-medium">
              Live Bullion Desk
            </span>
          </div>
        </div>

        {/* Right Navigation */}
        <nav className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveModal('none')}
            className="text-white hover:text-[#F5A623] transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => setActiveModal('about')}
            className="text-slate-300 hover:text-[#F5A623] transition-colors"
          >
            About
          </button>
          <button
            onClick={() => setActiveModal('history')}
            className="text-slate-300 hover:text-[#F5A623] transition-colors"
          >
            History
          </button>
          <button
            onClick={() => setActiveModal('contact')}
            className="text-slate-300 hover:text-[#F5A623] transition-colors"
          >
            Contact
          </button>

          {/* Admin / Login Button in gold accent matching screenshot's "Bills" button */}
          <button
            onClick={onOpenAdmin}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5 ${
              isAdminLoggedIn
                ? 'bg-emerald-500 text-black'
                : 'bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-black hover:brightness-110'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isAdminLoggedIn ? 'Admin Panel' : 'Login'}</span>
          </button>
        </nav>
      </header>

      {/* 2. MAIN CENTER RATE DISPLAY (Matches DP Gold Screenshot layout exactly) */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-10 max-w-4xl w-full mx-auto">
        <div className="w-full space-y-3.5">
          {/* Top 3 Spot Cards Container with Live Second-to-Second Updates */}
          <div className="rounded-lg overflow-hidden border border-[#14233D] bg-[#0A1628]/95 shadow-2xl">
            <div className="grid grid-cols-3 divide-x divide-[#14233D]">
              {/* Spot 1: GOLD SPOT */}
              <div
                className={`p-2.5 sm:p-4 text-center transition-colors duration-300 ${
                  goldTrend === 'up'
                    ? 'bg-emerald-950/30'
                    : goldTrend === 'down'
                    ? 'bg-rose-950/30'
                    : 'bg-transparent'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span className="text-[10px] sm:text-xs font-bold text-[#F5A623] uppercase tracking-wider">
                    GOLD SPOT
                  </span>
                  {goldTrend === 'up' && <ArrowUpRight className="w-3 h-3 text-emerald-400 inline" />}
                  {goldTrend === 'down' && <ArrowDownRight className="w-3 h-3 text-rose-400 inline" />}
                </div>
                <span
                  className={`text-base sm:text-xl md:text-2xl font-mono font-bold mt-0.5 block tracking-tight transition-colors duration-300 ${
                    goldTrend === 'up'
                      ? 'text-emerald-400'
                      : goldTrend === 'down'
                      ? 'text-rose-400'
                      : 'text-white'
                  }`}
                >
                  {goldSpot.toFixed(2)}
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono block">
                  $ / oz
                </span>
              </div>

              {/* Spot 2: SILVER SPOT */}
              <div
                className={`p-2.5 sm:p-4 text-center transition-colors duration-300 ${
                  silverTrend === 'up'
                    ? 'bg-emerald-950/30'
                    : silverTrend === 'down'
                    ? 'bg-rose-950/30'
                    : 'bg-transparent'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span className="text-[10px] sm:text-xs font-bold text-[#F5A623] uppercase tracking-wider">
                    SILVER SPOT
                  </span>
                  {silverTrend === 'up' && <ArrowUpRight className="w-3 h-3 text-emerald-400 inline" />}
                  {silverTrend === 'down' && <ArrowDownRight className="w-3 h-3 text-rose-400 inline" />}
                </div>
                <span
                  className={`text-base sm:text-xl md:text-2xl font-mono font-bold mt-0.5 block tracking-tight transition-colors duration-300 ${
                    silverTrend === 'up'
                      ? 'text-emerald-400'
                      : silverTrend === 'down'
                      ? 'text-rose-400'
                      : 'text-white'
                  }`}
                >
                  {silverSpot.toFixed(2)}
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono block">
                  $ / oz
                </span>
              </div>

              {/* Spot 3: USDINR */}
              <div
                className={`p-2.5 sm:p-4 text-center transition-colors duration-300 ${
                  usdTrend === 'up'
                    ? 'bg-emerald-950/30'
                    : usdTrend === 'down'
                    ? 'bg-rose-950/30'
                    : 'bg-transparent'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span className="text-[10px] sm:text-xs font-bold text-[#F5A623] uppercase tracking-wider">
                    USDINR
                  </span>
                  {usdTrend === 'up' && <ArrowUpRight className="w-3 h-3 text-emerald-400 inline" />}
                  {usdTrend === 'down' && <ArrowDownRight className="w-3 h-3 text-rose-400 inline" />}
                </div>
                <span
                  className={`text-base sm:text-xl md:text-2xl font-mono font-bold mt-0.5 block tracking-tight transition-colors duration-300 ${
                    usdTrend === 'up'
                      ? 'text-emerald-400'
                      : usdTrend === 'down'
                      ? 'text-rose-400'
                      : 'text-white'
                  }`}
                >
                  {usdInr.toFixed(2)}
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono block">
                  FX Rate
                </span>
              </div>
            </div>
          </div>

          {/* 4 Main Rate Rows (24K, 22K, 18K, Silver) */}
          <div className="space-y-2.5 sm:space-y-3">
            {rateRows.map((row) => (
              <div
                key={row.label}
                className="bg-[#0A1628]/95 border border-[#172B4D] hover:border-[#F5A623]/60 rounded-lg p-3 sm:p-4 flex items-center justify-between shadow-xl transition-all"
              >
                {/* Left Metal Label */}
                <div>
                  <span className={`text-sm sm:text-base md:text-lg font-bold tracking-wide uppercase ${row.color}`}>
                    {row.label}
                  </span>
                </div>

                {/* Right Fixed Rate */}
                <div className="text-right">
                  <span className="font-mono text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                    {formatPrice(row.price, row.key === 'silver')}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-mono ml-1.5">
                    {row.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Wastage and GST Notice right below the Silver row */}
          <div className="bg-[#0A1628]/90 border border-[#172B4D] rounded-lg px-3.5 py-2.5 flex items-center justify-center sm:justify-start gap-2 shadow-lg">
            <span className="text-[#F5A623] font-bold text-sm sm:text-base leading-none">*</span>
            <p className="text-xs sm:text-sm font-semibold text-[#F5A623] tracking-wide m-0">
              Wastage and GST applicable on these rates.
            </p>
          </div>

          {/* Disclaimer directly under rates */}
          <div className="pt-2 text-center text-[11px] text-slate-500">
            Rates are indicative and may vary at the time of purchase.
          </div>
        </div>
      </main>

      {/* 3. SUBTLE CLEAN FOOTER (Does not extend page down) */}
      <footer className="relative z-20 py-4 px-4 border-t border-[#14233D] text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} aurumRates. All rights reserved.</span>
          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setActiveModal('about')}
              className="hover:text-slate-300"
            >
              Purity Standards
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveModal('contact')}
              className="hover:text-slate-300"
            >
              Contact Desk
            </button>
            <span>•</span>
            <button
              onClick={onOpenAdmin}
              className="text-[#F5A623] hover:underline flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              <span>Store Admin</span>
            </button>
          </div>
        </div>
      </footer>

      {/* 4. FLOATING WHATSAPP BUTTON (Bottom Right - Exactly matches screenshot) */}
      <a
        href={`https://wa.me/${storeInfo.whatsapp}?text=Hello%20aurumRates,%20I%20am%20enquiring%20about%20today's%20rates.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-2xl shadow-green-500/30 transition-transform hover:scale-110 active:scale-95"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white text-white" />
      </a>

      {/* 5. MODALS (Keep page strictly single-screen without vertical scrolling) */}
      {/* ABOUT MODAL */}
      {activeModal === 'about' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#0A1628] border border-[#172B4D] rounded-2xl p-6 relative text-white shadow-2xl">
            <button
              onClick={() => setActiveModal('none')}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif-luxury text-xl font-bold text-[#F5A623] mb-3">
              About aurumRates
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              aurumRates provides real-time, clean bullion rate dissemination for gold (24K, 22K, 18K) and silver. Our rates benchmark official domestic market bullion movements and certified hallmarking standards.
            </p>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 p-2 bg-[#070E1A] rounded-lg border border-[#172B4D]">
                <ShieldCheck className="w-4 h-4 text-[#F5A623]" />
                <span>BIS Hallmark 916 & 999 Fine Bullion Certified</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-[#070E1A] rounded-lg border border-[#172B4D]">
                <Clock className="w-4 h-4 text-[#F5A623]" />
                <span>Rates calibrated daily with real-time bullion desk feeds</span>
              </div>
            </div>
            <button
              onClick={() => setActiveModal('none')}
              className="w-full mt-5 py-2 bg-[#F5A623] text-black font-bold text-xs rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* HISTORY MODAL */}
      {activeModal === 'history' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-[#0A1628] border border-[#172B4D] rounded-2xl p-6 relative text-white shadow-2xl">
            <button
              onClick={() => setActiveModal('none')}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-[#F5A623]">
                  Rate Movement History
                </h3>
                <p className="text-xs text-slate-400">Previous daily recorded rates</p>
              </div>
            </div>

            {/* Line Chart */}
            <div className="h-48 sm:h-56 w-full mb-4 bg-[#070E1A] p-2 rounded-xl border border-[#172B4D]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#172B4D" />
                  <XAxis dataKey="date" tick={{ fill: '#888', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#888', fontSize: 10 }} domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#070E1A', borderColor: '#F5A623', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="24K" stroke="#F5A623" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="22K" stroke="#E6C96A" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="18K" stroke="#D97706" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="Silver" stroke="#94A3B8" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Recent table */}
            <div className="max-h-36 overflow-y-auto border border-[#172B4D] rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#070E1A] text-slate-400 sticky top-0">
                  <tr>
                    <th className="p-2">Date</th>
                    <th className="p-2 text-right text-[#F5A623]">24K (999)</th>
                    <th className="p-2 text-right text-[#E6C96A]">22K (916)</th>
                    <th className="p-2 text-right">18K</th>
                    <th className="p-2 text-right text-slate-300">Silver (/kg)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#172B4D] font-mono">
                  {history.slice(-5).reverse().map((h) => (
                    <tr key={h.id}>
                      <td className="p-2 font-sans text-white">{h.date}</td>
                      <td className="p-2 text-right">{h.gold24k.toFixed(1)}</td>
                      <td className="p-2 text-right text-[#E6C96A]">{h.gold22k.toFixed(1)}</td>
                      <td className="p-2 text-right">{h.gold18k.toFixed(1)}</td>
                      <td className="p-2 text-right text-slate-300">{Math.round(h.silver)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT MODAL */}
      {activeModal === 'contact' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#0A1628] border border-[#172B4D] rounded-2xl p-6 relative text-white shadow-2xl space-y-4">
            <button
              onClick={() => setActiveModal('none')}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif-luxury text-xl font-bold text-[#F5A623]">
              Contact aurumRates Desk
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-3 p-3 bg-[#070E1A] rounded-xl border border-[#172B4D]">
                <Phone className="w-4 h-4 text-[#F5A623]" />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Direct Phone</div>
                  <a href={`tel:${storeInfo.phone}`} className="font-semibold text-white hover:underline">
                    {storeInfo.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#070E1A] rounded-xl border border-[#172B4D]">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">WhatsApp Hotline</div>
                  <a
                    href={`https://wa.me/${storeInfo.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#25D366] hover:underline"
                  >
                    {storeInfo.whatsappDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#070E1A] rounded-xl border border-[#172B4D]">
                <Mail className="w-4 h-4 text-[#F5A623]" />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Email Desk</div>
                  <a href={`mailto:${storeInfo.email}`} className="font-semibold text-white hover:underline break-all">
                    {storeInfo.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <a
                href={`tel:${storeInfo.phone}`}
                className="py-2.5 bg-[#F5A623] hover:bg-amber-400 text-black font-bold text-xs rounded-xl text-center flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
              <a
                href={`https://wa.me/${storeInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-black font-bold text-xs rounded-xl text-center flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-black text-black" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
