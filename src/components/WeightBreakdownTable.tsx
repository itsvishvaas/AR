import React, { useState } from 'react';
import { DailyRates } from '../types';
import { formatIndianCurrency } from '../utils/storage';
import { Scale, ChevronRight, Coins } from 'lucide-react';

interface WeightBreakdownTableProps {
  rates: DailyRates;
}

export const WeightBreakdownTable: React.FC<WeightBreakdownTableProps> = ({ rates }) => {
  const [selectedMetal, setSelectedMetal] = useState<'gold22k' | 'gold24k' | 'gold18k' | 'silver'>('gold22k');

  const standardWeights = [
    { label: '0.5 Gram', weight: 0.5, desc: 'Nose pins, stud earrings' },
    { label: '1 Gram', weight: 1, desc: 'Base benchmark unit' },
    { label: '2 Grams', weight: 2, desc: 'Lightweight rings & pendants' },
    { label: '4 Grams (1/2 Pavan)', weight: 4, desc: 'Half Sovereign coin or chain' },
    { label: '8 Grams (1 Pavan)', weight: 8, desc: '1 Sovereign / Ginni' },
    { label: '10 Grams (1 Tola)', weight: 10, desc: 'Standard bullion bar' },
    { label: '20 Grams', weight: 20, desc: 'Bangles & wedding necklaces' },
    { label: '50 Grams', weight: 50, desc: 'Bridal sets & bullion' },
    { label: '100 Grams', weight: 100, desc: '10 Tolas minted bar' },
    { label: '1,000 Grams (1 Kg)', weight: 1000, desc: 'Bullion bar / bulk' },
  ];

  const metals = [
    { key: 'gold22k' as const, name: '22K Gold (916)', rate: rates.gold22k, color: 'text-amber-700' },
    { key: 'gold24k' as const, name: '24K Gold (999)', rate: rates.gold24k, color: 'text-yellow-700' },
    { key: 'gold18k' as const, name: '18K Gold (750)', rate: rates.gold18k, color: 'text-amber-800' },
    { key: 'silver' as const, name: 'Silver (999)', rate: rates.silver, color: 'text-slate-700' },
  ];

  const activeRate = rates[selectedMetal];

  return (
    <section id="gold-rates" className="py-12 bg-white border-y border-[#C9A227]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C9A227] mb-2">
              <Scale className="w-3.5 h-3.5" />
              <span>Standard Denomination Matrix</span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#111111]">
              Weight-Wise Price Chart
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Instant conversion matrix across standard Indian bullion and jewellery weights.
            </p>
          </div>

          {/* Metal Tab Switcher */}
          <div className="flex p-1 bg-[#FAF8F2] border border-[#C9A227]/30 rounded-xl overflow-x-auto">
            {metals.map((m) => (
              <button
                key={m.key}
                onClick={() => setSelectedMetal(m.key)}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedMetal === m.key
                    ? 'bg-[#111111] text-[#E6C96A] shadow-md'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* Breakdown Table */}
        <div className="overflow-hidden rounded-2xl border border-neutral-200 shadow-md bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#111111] text-white text-xs uppercase tracking-wider font-semibold border-b border-[#C9A227]/40">
                  <th className="py-3.5 px-4 sm:px-6">Weight Denomination</th>
                  <th className="py-3.5 px-4 text-center">Grams</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Metal Price (₹)</th>
                  <th className="py-3.5 px-4 hidden sm:table-cell">Common Usage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-sm">
                {standardWeights.map((row, idx) => {
                  const totalPrice = Math.round(row.weight * activeRate);
                  const isSovereignOrTola = row.weight === 8 || row.weight === 10 || row.weight === 1;

                  return (
                    <tr
                      key={row.label}
                      className={`transition-colors hover:bg-amber-50/60 ${
                        isSovereignOrTola
                          ? 'bg-[#FAF8F2] font-medium'
                          : idx % 2 === 0
                          ? 'bg-white'
                          : 'bg-neutral-50/50'
                      }`}
                    >
                      <td className="py-3.5 px-4 sm:px-6 flex items-center gap-2">
                        <Coins className="w-4 h-4 text-[#C9A227] shrink-0" />
                        <span className="font-semibold text-neutral-900">{row.label}</span>
                        {row.weight === 8 && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                            Sovereign
                          </span>
                        )}
                        {row.weight === 10 && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                            Tola
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center text-neutral-600 font-mono text-xs">
                        {row.weight} g
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <span className="text-base sm:text-lg font-bold text-[#111111]">
                          ₹{formatIndianCurrency(totalPrice)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 hidden sm:table-cell text-xs text-neutral-500">
                        {row.desc}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-[#FAF8F2] px-4 py-3 border-t border-neutral-200 flex flex-wrap items-center justify-between text-xs text-neutral-600 gap-2">
            <span>
              *Pure metal cost only. GST (3%) and making charges are calculated separately at purchase.
            </span>
            <span className="text-[#C9A227] font-semibold flex items-center gap-1">
              Certified 100% BIS Hallmarked Purity <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
