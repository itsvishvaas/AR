import React, { useState } from 'react';
import { RateHistoryItem, DailyRates } from '../types';
import { formatIndianCurrency } from '../utils/storage';
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
import { TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, Minus, History, Lock } from 'lucide-react';

interface RateHistorySectionProps {
  history: RateHistoryItem[];
  rates: DailyRates;
  onOpenAdminHistory?: () => void;
}

export const RateHistorySection: React.FC<RateHistorySectionProps> = ({
  history,
  rates,
  onOpenAdminHistory,
}) => {
  const [metalFilter, setMetalFilter] = useState<'all' | 'gold24k' | 'gold22k' | 'gold18k' | 'silver'>('gold22k');
  const [daysFilter, setDaysFilter] = useState<number>(14);

  // Filter history based on days selected
  const displayedHistory = history.slice(-daysFilter);

  // Format data for Recharts
  const chartData = displayedHistory.map((item) => ({
    date: item.date.slice(0, 6), // "12 Sep"
    fullDate: item.date,
    '24K Gold': item.gold24k,
    '22K Gold': item.gold22k,
    '18K Gold': item.gold18k,
    'Silver (g)': item.silver,
  }));

  // Calculate day-on-day change for current rates against yesterday
  const prevEntry = history.length >= 2 ? history[history.length - 2] : null;

  const getDayChange = (current: number, previous?: number) => {
    if (!previous) return { change: 0, percent: 0, status: 'neutral' as const };
    const diff = current - previous;
    const percent = (diff / previous) * 100;
    return {
      change: diff,
      percent: percent.toFixed(2),
      status: diff > 0 ? ('up' as const) : diff < 0 ? ('down' as const) : ('neutral' as const),
    };
  };

  const change24k = getDayChange(rates.gold24k, prevEntry?.gold24k);
  const change22k = getDayChange(rates.gold22k, prevEntry?.gold22k);
  const change18k = getDayChange(rates.gold18k, prevEntry?.gold18k);
  const changeSilver = getDayChange(rates.silver, prevEntry?.silver);

  // Reverse list for history table so newest is first
  const tableData = [...displayedHistory].reverse();

  return (
    <section id="history" className="py-14 sm:py-20 bg-[#FAF8F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111111] text-[#E6C96A] text-xs font-semibold uppercase tracking-wider mb-2.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Bullion Market Trends</span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111]">
              Rate Movement History
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-xl">
              Track historical daily prices for 24K, 22K, 18K Gold and Silver. Clean price transparency records.
            </p>
          </div>

          {/* Controls: Days and View */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex p-1 bg-white border border-neutral-300 rounded-xl text-xs font-semibold shadow-sm">
              <button
                onClick={() => setDaysFilter(7)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  daysFilter === 7 ? 'bg-[#111111] text-[#E6C96A]' : 'text-neutral-600 hover:text-black'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setDaysFilter(14)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  daysFilter === 14 ? 'bg-[#111111] text-[#E6C96A]' : 'text-neutral-600 hover:text-black'
                }`}
              >
                14 Days
              </button>
              <button
                onClick={() => setDaysFilter(30)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  daysFilter === 30 ? 'bg-[#111111] text-[#E6C96A]' : 'text-neutral-600 hover:text-black'
                }`}
              >
                All Records
              </button>
            </div>

            {onOpenAdminHistory && (
              <button
                onClick={onOpenAdminHistory}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-[#C9A227]/40 rounded-xl text-xs font-semibold text-neutral-800 hover:bg-[#F4EEDF] transition-colors"
                title="Manage Rate Logs"
              >
                <Lock className="w-3 h-3 text-[#C9A227]" />
                <span>Admin Logs</span>
              </button>
            )}
          </div>
        </div>

        {/* Day-on-Day Change Summary Pills */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
            <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">24K Fine Gold</div>
            <div className="text-xl font-bold text-[#111111] mt-0.5">₹{formatIndianCurrency(rates.gold24k)}/g</div>
            <div className="mt-1 flex items-center text-xs font-medium">
              {change24k.status === 'up' && (
                <span className="text-emerald-700 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +₹{change24k.change} ({change24k.percent}%)
                </span>
              )}
              {change24k.status === 'down' && (
                <span className="text-rose-700 flex items-center gap-0.5">
                  <ArrowDownRight className="w-3.5 h-3.5" /> -₹{Math.abs(change24k.change)} ({change24k.percent}%)
                </span>
              )}
              {change24k.status === 'neutral' && (
                <span className="text-neutral-500 flex items-center gap-0.5">
                  <Minus className="w-3.5 h-3.5" /> Unchanged
                </span>
              )}
              <span className="text-neutral-400 text-[10px] ml-1">vs prev</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#C9A227]/40 shadow-sm ring-1 ring-[#C9A227]/20">
            <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">22K Jewellery Gold</div>
            <div className="text-xl font-bold text-[#111111] mt-0.5">₹{formatIndianCurrency(rates.gold22k)}/g</div>
            <div className="mt-1 flex items-center text-xs font-medium">
              {change22k.status === 'up' && (
                <span className="text-emerald-700 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +₹{change22k.change} ({change22k.percent}%)
                </span>
              )}
              {change22k.status === 'down' && (
                <span className="text-rose-700 flex items-center gap-0.5">
                  <ArrowDownRight className="w-3.5 h-3.5" /> -₹{Math.abs(change22k.change)} ({change22k.percent}%)
                </span>
              )}
              {change22k.status === 'neutral' && (
                <span className="text-neutral-500 flex items-center gap-0.5">
                  <Minus className="w-3.5 h-3.5" /> Unchanged
                </span>
              )}
              <span className="text-neutral-400 text-[10px] ml-1">vs prev</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
            <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">18K Hallmark Gold</div>
            <div className="text-xl font-bold text-[#111111] mt-0.5">₹{formatIndianCurrency(rates.gold18k)}/g</div>
            <div className="mt-1 flex items-center text-xs font-medium">
              {change18k.status === 'up' && (
                <span className="text-emerald-700 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +₹{change18k.change} ({change18k.percent}%)
                </span>
              )}
              {change18k.status === 'down' && (
                <span className="text-rose-700 flex items-center gap-0.5">
                  <ArrowDownRight className="w-3.5 h-3.5" /> -₹{Math.abs(change18k.change)} ({change18k.percent}%)
                </span>
              )}
              {change18k.status === 'neutral' && (
                <span className="text-neutral-500 flex items-center gap-0.5">
                  <Minus className="w-3.5 h-3.5" /> Unchanged
                </span>
              )}
              <span className="text-neutral-400 text-[10px] ml-1">vs prev</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
            <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">999 Pure Silver</div>
            <div className="text-xl font-bold text-[#111111] mt-0.5">₹{formatIndianCurrency(rates.silver)}/g</div>
            <div className="mt-1 flex items-center text-xs font-medium">
              {changeSilver.status === 'up' && (
                <span className="text-emerald-700 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +₹{changeSilver.change} ({changeSilver.percent}%)
                </span>
              )}
              {changeSilver.status === 'down' && (
                <span className="text-rose-700 flex items-center gap-0.5">
                  <ArrowDownRight className="w-3.5 h-3.5" /> -₹{Math.abs(changeSilver.change)} ({changeSilver.percent}%)
                </span>
              )}
              {changeSilver.status === 'neutral' && (
                <span className="text-neutral-500 flex items-center gap-0.5">
                  <Minus className="w-3.5 h-3.5" /> Unchanged
                </span>
              )}
              <span className="text-neutral-400 text-[10px] ml-1">vs prev</span>
            </div>
          </div>
        </div>

        {/* Interactive Line Chart */}
        <div className="bg-white p-5 sm:p-7 rounded-2xl border border-[#C9A227]/30 shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-neutral-100 gap-3">
            <div>
              <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#111111]">
                Daily Rate Trend Movement (₹/gram)
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Showing daily rate transitions over the last {daysFilter} days
              </p>
            </div>

            {/* Metal Selector for Chart Focus */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                onClick={() => setMetalFilter('gold22k')}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  metalFilter === 'gold22k'
                    ? 'bg-[#C9A227] text-black shadow-sm'
                    : 'bg-neutral-100 text-neutral-600 hover:text-black'
                }`}
              >
                22K Gold
              </button>
              <button
                onClick={() => setMetalFilter('gold24k')}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  metalFilter === 'gold24k'
                    ? 'bg-[#111111] text-[#E6C96A] shadow-sm'
                    : 'bg-neutral-100 text-neutral-600 hover:text-black'
                }`}
              >
                24K Gold
              </button>
              <button
                onClick={() => setMetalFilter('gold18k')}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  metalFilter === 'gold18k'
                    ? 'bg-[#8C6D14] text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-600 hover:text-black'
                }`}
              >
                18K Gold
              </button>
              <button
                onClick={() => setMetalFilter('silver')}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  metalFilter === 'silver'
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-600 hover:text-black'
                }`}
              >
                Silver
              </button>
              <button
                onClick={() => setMetalFilter('all')}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  metalFilter === 'all'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-600 hover:text-black'
                }`}
              >
                All Gold
              </button>
            </div>
          </div>

          <div className="w-full h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#666' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 11, fill: '#666' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E5E7EB' }}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#111111] text-white p-3 rounded-xl shadow-2xl border border-[#C9A227]/40 text-xs">
                          <div className="font-bold text-[#E6C96A] mb-1.5 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{label}</span>
                          </div>
                          <div className="space-y-1">
                            {payload.map((entry) => (
                              <div key={entry.name} className="flex items-center justify-between gap-4">
                                <span style={{ color: entry.color }} className="font-medium">
                                  {entry.name}:
                                </span>
                                <span className="font-bold text-white">
                                  ₹{formatIndianCurrency(Number(entry.value))}/g
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '14px', fontSize: '12px' }}
                />

                {(metalFilter === 'all' || metalFilter === 'gold24k') && (
                  <Line
                    type="monotone"
                    dataKey="24K Gold"
                    stroke="#C9A227"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#C9A227' }}
                    activeDot={{ r: 5 }}
                  />
                )}
                {(metalFilter === 'all' || metalFilter === 'gold22k') && (
                  <Line
                    type="monotone"
                    dataKey="22K Gold"
                    stroke="#D97706"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#D97706' }}
                    activeDot={{ r: 5 }}
                  />
                )}
                {(metalFilter === 'all' || metalFilter === 'gold18k') && (
                  <Line
                    type="monotone"
                    dataKey="18K Gold"
                    stroke="#B45309"
                    strokeWidth={2}
                    dot={{ r: 2.5, fill: '#B45309' }}
                    activeDot={{ r: 5 }}
                  />
                )}
                {metalFilter === 'silver' && (
                  <Line
                    type="monotone"
                    dataKey="Silver (g)"
                    stroke="#64748B"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#64748B' }}
                    activeDot={{ r: 5 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rate History Table */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-md overflow-hidden">
          <div className="p-4 sm:p-5 bg-[#111111] text-white flex items-center justify-between border-b border-[#C9A227]/30">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-[#C9A227]" />
              <h3 className="font-serif-luxury text-base sm:text-lg font-bold">
                Archived Daily Rates Log
              </h3>
            </div>
            <span className="text-xs text-[#E6C96A]">
              Showing {tableData.length} records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#1c1913] text-white/90 border-b border-neutral-200">
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 text-right font-semibold text-[#E6C96A]">24K (999)</th>
                  <th className="py-3 px-4 text-right font-semibold text-[#FFF1B8]">22K (916)</th>
                  <th className="py-3 px-4 text-right font-semibold text-[#E6C96A]">18K (750)</th>
                  <th className="py-3 px-4 text-right font-semibold text-slate-300">Silver (999)</th>
                  <th className="py-3 px-4 text-center font-semibold hidden md:table-cell">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {tableData.map((item, index) => {
                  const isLatest = index === 0;

                  return (
                    <tr
                      key={item.id || item.date}
                      className={`hover:bg-amber-50/50 transition-colors ${
                        isLatest ? 'bg-amber-50/70 font-semibold' : index % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'
                      }`}
                    >
                      <td className="py-3 px-4 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#C9A227]" />
                        <span className="text-neutral-900 font-medium">{item.date}</span>
                        {isLatest && (
                          <span className="text-[10px] bg-[#111111] text-[#E6C96A] font-bold px-1.5 py-0.5 rounded">
                            Today
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-neutral-900">
                        ₹{formatIndianCurrency(item.gold24k)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-amber-900">
                        ₹{formatIndianCurrency(item.gold22k)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-neutral-800">
                        ₹{formatIndianCurrency(item.gold18k)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-700">
                        ₹{formatIndianCurrency(item.silver)}
                      </td>
                      <td className="py-3 px-4 text-center hidden md:table-cell text-xs">
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                          Verified Official
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
