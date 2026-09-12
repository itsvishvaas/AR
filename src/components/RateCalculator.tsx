import React, { useState } from 'react';
import { DailyRates, StoreInfo } from '../types';
import { formatIndianCurrency } from '../utils/storage';
import { Calculator, Sparkles, MessageCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface RateCalculatorProps {
  rates: DailyRates;
  storeInfo: StoreInfo;
  initialMetal?: 'gold24k' | 'gold22k' | 'gold18k' | 'silver';
}

export const RateCalculator: React.FC<RateCalculatorProps> = ({
  rates,
  storeInfo,
  initialMetal = 'gold22k',
}) => {
  const [metal, setMetal] = useState<'gold24k' | 'gold22k' | 'gold18k' | 'silver'>(initialMetal);
  const [weight, setWeight] = useState<string>('8'); // default 8 grams (1 sovereign)
  const [makingChargePercent, setMakingChargePercent] = useState<number>(8); // 8% default
  const [includeGST, setIncludeGST] = useState<boolean>(true); // 3% GST

  const weightNumber = parseFloat(weight) || 0;
  const pricePerGram = rates[metal];
  const metalCost = weightNumber * pricePerGram;
  const makingChargeAmount = (metalCost * makingChargePercent) / 100;
  const subtotal = metalCost + makingChargeAmount;
  const gstAmount = includeGST ? (subtotal * 0.03) : 0;
  const grandTotal = Math.round(subtotal + gstAmount);

  const metalLabels = {
    gold24k: '24K Gold (999 Pure Bullion)',
    gold22k: '22K Gold (916 BIS Hallmark)',
    gold18k: '18K Gold (750 Diamond Jewellery)',
    silver: '999 Pure Silver',
  };

  const handlePresetWeight = (w: number) => {
    setWeight(w.toString());
  };

  const handleWhatsAppEnquiry = () => {
    const text = `Hello ${storeInfo.storeName}, I used your website Rate Calculator:\n\n*Item Enquiry:*\n- Metal: ${metalLabels[metal]}\n- Weight: ${weightNumber} grams\n- Rate: ₹${formatIndianCurrency(pricePerGram)}/g\n- Metal Value: ₹${formatIndianCurrency(metalCost)}\n- Estimated Total: ~₹${formatIndianCurrency(grandTotal)}\n\nPlease let me know if this ornament is in stock or available for custom order.`;
    window.open(`https://wa.me/${storeInfo.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="calculator" className="py-14 bg-white border-y border-[#C9A227]/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111111] text-[#E6C96A] text-xs font-semibold uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Interactive Jewellery Estimator</span>
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#111111]">
            Instant Jewellery Price Calculator
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Calculate estimated buying price for any weight with transparent making charges and 3% GST.
          </p>
        </div>

        <div className="bg-[#FAF8F2] rounded-3xl border border-[#C9A227]/30 shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Input Controls Column */}
            <div className="space-y-5">
              {/* Metal Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                  Select Precious Metal
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['gold22k', 'gold24k', 'gold18k', 'silver'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMetal(m)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border text-left flex items-center justify-between ${
                        metal === m
                          ? 'bg-[#111111] text-[#E6C96A] border-[#C9A227] shadow-md'
                          : 'bg-white text-neutral-800 border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <span>{m === 'gold24k' ? '24K Gold' : m === 'gold22k' ? '22K Gold' : m === 'gold18k' ? '18K Gold' : 'Silver'}</span>
                      <span className="text-[10px] font-mono opacity-80">₹{formatIndianCurrency(rates[m])}/g</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight in Grams Input */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Ornament Weight (Grams)
                  </label>
                  <span className="text-xs text-neutral-500 font-mono">{weightNumber}g</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Enter weight in grams"
                    className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2.5 text-base font-bold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#C9A227] pr-16"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                    GRAMS
                  </span>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[11px] text-neutral-500 self-center mr-1">Quick:</span>
                  {[
                    { label: '1g', val: 1 },
                    { label: '4g', val: 4 },
                    { label: '8g (1 Pavan)', val: 8 },
                    { label: '10g (Tola)', val: 10 },
                    { label: '16g (2 Pavan)', val: 16 },
                    { label: '25g', val: 25 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handlePresetWeight(preset.val)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                        weightNumber === preset.val
                          ? 'bg-[#C9A227] text-black border-[#C9A227]'
                          : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Making Charges Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Est. Making & Wastage Charge
                  </label>
                  <span className="text-xs font-bold text-[#C9A227]">{makingChargePercent}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="1"
                  value={makingChargePercent}
                  onChange={(e) => setMakingChargePercent(Number(e.target.value))}
                  className="w-full accent-[#C9A227] h-2 bg-neutral-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                  <span>0% (Bullion Coins)</span>
                  <span>8-12% (Chains/Bangles)</span>
                  <span>18-25% (Intricate Bridal)</span>
                </div>
              </div>

              {/* GST 3% Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-neutral-200">
                <div>
                  <div className="text-xs font-semibold text-neutral-900">Include GST (3%)</div>
                  <div className="text-[11px] text-neutral-500">Government statutory tax</div>
                </div>
                <button
                  type="button"
                  onClick={() => setIncludeGST(!includeGST)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    includeGST ? 'bg-[#C9A227]' : 'bg-neutral-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      includeGST ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Price Breakdown Calculation Card */}
            <div className="bg-[#111111] text-white p-6 rounded-2xl border border-[#C9A227]/40 shadow-2xl flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-white/70">
                  <span className="font-semibold text-[#E6C96A]">Estimated Estimate</span>
                  <span>{metalLabels[metal].split(' ')[0]} • {weightNumber}g</span>
                </div>

                <div className="mt-4 space-y-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between text-white/80">
                    <span>Base Metal Value ({weightNumber}g × ₹{formatIndianCurrency(pricePerGram)}):</span>
                    <span className="font-mono font-semibold text-white">₹{formatIndianCurrency(metalCost)}</span>
                  </div>

                  <div className="flex justify-between text-white/80">
                    <span>Making Charge ({makingChargePercent}%):</span>
                    <span className="font-mono font-semibold text-[#E6C96A]">+₹{formatIndianCurrency(makingChargeAmount)}</span>
                  </div>

                  {includeGST && (
                    <div className="flex justify-between text-white/80">
                      <span>GST (3% on subtotal):</span>
                      <span className="font-mono font-semibold text-white/70">+₹{formatIndianCurrency(gstAmount)}</span>
                    </div>
                  )}

                  <div className="pt-4 mt-2 border-t border-white/15 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-[#E6C96A] font-bold block">
                        Estimated Final Price
                      </span>
                      <span className="text-[10px] text-white/50">*Indicative showroom price</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#FFF1B8] tracking-tight">
                        ₹{formatIndianCurrency(grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleWhatsAppEnquiry}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-black text-black" />
                  <span>Send Estimate to WhatsApp Desk</span>
                </button>
                <div className="text-center">
                  <span className="text-[10px] text-white/50">
                    Store representative will confirm exact weight & design availability
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
