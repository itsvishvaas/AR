import React, { useState } from 'react';
import { DailyRates, StoreInfo } from '../types';
import { formatIndianCurrency } from '../utils/storage';
import {
  Sparkles,
  Clock,
  Info,
  Share2,
  CheckCircle2,
  TrendingUp,
  MessageCircle,
  Calculator,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface HeroRatesProps {
  rates: DailyRates;
  storeInfo: StoreInfo;
  onOpenCalculator: (metal: 'gold24k' | 'gold22k' | 'gold18k' | 'silver') => void;
  onRefresh?: () => void;
}

export const HeroRates: React.FC<HeroRatesProps> = ({
  rates,
  storeInfo,
  onOpenCalculator,
  onRefresh,
}) => {
  const [selectedWeightUnit, setSelectedWeightUnit] = useState<'both' | '1g' | '10g' | '8g'>('both');
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleShareRates = () => {
    const shareText = `*${storeInfo.storeName} - Today's Bullion Rates*\n🗓️ ${rates.lastUpdated}\n\n✨ *24K Gold (999)*: ₹${formatIndianCurrency(rates.gold24k)}/g | ₹${formatIndianCurrency(rates.gold24k * 10)}/10g\n✨ *22K Gold (916)*: ₹${formatIndianCurrency(rates.gold22k)}/g | ₹${formatIndianCurrency(rates.gold22k * 10)}/10g\n✨ *18K Gold (750)*: ₹${formatIndianCurrency(rates.gold18k)}/g | ₹${formatIndianCurrency(rates.gold18k * 10)}/10g\n🥈 *Silver (999)*: ₹${formatIndianCurrency(rates.silver)}/g | ₹${formatIndianCurrency(rates.silver * 10)}/10g (₹${formatIndianCurrency(rates.silver * 1000)}/kg)\n\n📍 ${storeInfo.address}\n📞 ${storeInfo.phoneDisplay}\n_Rates are indicative & subject to market fluctuations._`;

    if (navigator.share) {
      navigator.share({
        title: `${storeInfo.storeName} Daily Rates`,
        text: shareText,
        url: window.location.href,
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText);
        setCopiedNotification(true);
        setTimeout(() => setCopiedNotification(false), 2500);
      });
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    }
  };

  const cards = [
    {
      id: 'gold24k' as const,
      metalName: '24K GOLD',
      purityBadge: '99.9% Pure Fine Gold',
      purityCode: '999 Purity',
      subtitle: 'Bullion Coins & Minted Bars',
      rate1g: rates.gold24k,
      rate8g: rates.gold24k * 8,
      rate10g: rates.gold24k * 10,
      rate100g: rates.gold24k * 100,
      colorTheme: 'gold',
      accentBorder: 'border-[#C9A227]',
      cardBg: 'bg-gradient-to-b from-[#181612] to-[#12110e]',
      headerBg: 'bg-gradient-to-r from-[#C9A227]/20 via-[#E6C96A]/10 to-transparent',
      priceColor: 'text-[#E6C96A]',
      icon: '🏆',
      popular: false,
    },
    {
      id: 'gold22k' as const,
      metalName: '22K GOLD',
      purityBadge: '91.6% BIS Hallmark',
      purityCode: '916 Hallmark (HUID)',
      subtitle: 'Standard Indian Jewellery Gold',
      rate1g: rates.gold22k,
      rate8g: rates.gold22k * 8,
      rate10g: rates.gold22k * 10,
      rate100g: rates.gold22k * 100,
      colorTheme: 'gold-popular',
      accentBorder: 'border-[#E6C96A]',
      cardBg: 'bg-gradient-to-b from-[#1c1913] to-[#13110e]',
      headerBg: 'bg-gradient-to-r from-[#E6C96A]/30 via-[#C9A227]/20 to-transparent',
      priceColor: 'text-[#FFF1B8]',
      icon: '👑',
      popular: true,
      popularLabel: 'Most Popular for Jewellery',
    },
    {
      id: 'gold18k' as const,
      metalName: '18K GOLD',
      purityBadge: '75.0% Fine Gold',
      purityCode: '750 Hallmark',
      subtitle: 'Diamond & Contemporary Jewellery',
      rate1g: rates.gold18k,
      rate8g: rates.gold18k * 8,
      rate10g: rates.gold18k * 10,
      rate100g: rates.gold18k * 100,
      colorTheme: 'gold-light',
      accentBorder: 'border-[#C9A227]/70',
      cardBg: 'bg-gradient-to-b from-[#181612] to-[#12110e]',
      headerBg: 'bg-gradient-to-r from-[#C9A227]/15 via-[#E6C96A]/10 to-transparent',
      priceColor: 'text-[#E6C96A]',
      icon: '✨',
      popular: false,
    },
    {
      id: 'silver' as const,
      metalName: 'SILVER',
      purityBadge: '99.9% Pure Silver',
      purityCode: '999 Fine Silver',
      subtitle: 'Silver Utensils, Bars & Ornaments',
      rate1g: rates.silver,
      rate8g: rates.silver * 8,
      rate10g: rates.silver * 10,
      rate100g: rates.silver * 100,
      rate1kg: rates.silver * 1000,
      colorTheme: 'silver',
      accentBorder: 'border-[#D1D5DB]/60',
      cardBg: 'bg-gradient-to-b from-[#141619] to-[#0f1114]',
      headerBg: 'bg-gradient-to-r from-[#E5E7EB]/20 via-[#9CA3AF]/10 to-transparent',
      priceColor: 'text-[#F3F4F6]',
      icon: '🥈',
      popular: false,
    },
  ];

  return (
    <section id="rates" className="relative pt-6 pb-14 sm:pt-10 sm:pb-20 bg-[#FAF8F2] overflow-hidden">
      {/* Decorative luxury background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#C9A227]/10 via-[#FAF8F2]/50 to-transparent pointer-events-none blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header Title & Tagline */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111111] text-[#E6C96A] text-xs sm:text-sm font-semibold tracking-wider uppercase mb-3 shadow-md border border-[#C9A227]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Updated Daily • Live Store Rates</span>
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111111] tracking-tight leading-tight">
            Today's Gold & Silver Rates
          </h1>

          <p className="mt-2 text-sm sm:text-base text-[#555555] max-w-2xl mx-auto">
            Transparent, government-benchmarked bullion prices directly from{' '}
            <span className="font-semibold text-[#111111]">{storeInfo.storeName}</span>. Guaranteed 100% BIS HUID Hallmarked purity.
          </p>

          {/* Timestamp & Quick Actions Bar */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {/* Real-time Last Updated Display */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#C9A227]/30 shadow-sm text-xs sm:text-sm font-medium text-[#222222]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <Clock className="w-4 h-4 text-[#C9A227]" />
              <span className="text-[#666666]">Last Updated:</span>
              <strong className="text-[#111111] font-semibold">{rates.lastUpdated}</strong>
            </div>

            {/* Quick Share / WhatsApp Button */}
            <button
              onClick={handleShareRates}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F3EEDC] border border-[#C9A227]/30 text-xs sm:text-sm font-medium text-[#111111] transition-all shadow-sm active:scale-95"
              title="Share rates to WhatsApp or clipboard"
            >
              {copiedNotification ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Rates Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-[#C9A227]" />
                  <span>Share Rates</span>
                </>
              )}
            </button>

            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-600 transition-colors shadow-sm"
                title="Refresh Rates"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Weight Display View Toggle */}
        <div className="flex justify-center mb-7">
          <div className="inline-flex p-1 bg-neutral-200/70 backdrop-blur rounded-xl border border-neutral-300/80 text-xs font-medium">
            <button
              onClick={() => setSelectedWeightUnit('both')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                selectedWeightUnit === 'both'
                  ? 'bg-[#111111] text-[#E6C96A] font-semibold shadow-sm'
                  : 'text-neutral-700 hover:text-black'
              }`}
            >
              1g & 10g View
            </button>
            <button
              onClick={() => setSelectedWeightUnit('1g')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedWeightUnit === '1g'
                  ? 'bg-[#111111] text-[#E6C96A] font-semibold shadow-sm'
                  : 'text-neutral-700 hover:text-black'
              }`}
            >
              Per Gram (1g)
            </button>
            <button
              onClick={() => setSelectedWeightUnit('10g')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedWeightUnit === '10g'
                  ? 'bg-[#111111] text-[#E6C96A] font-semibold shadow-sm'
                  : 'text-neutral-700 hover:text-black'
              }`}
            >
              Per 10 Grams
            </button>
            <button
              onClick={() => setSelectedWeightUnit('8g')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedWeightUnit === '8g'
                  ? 'bg-[#111111] text-[#E6C96A] font-semibold shadow-sm'
                  : 'text-neutral-700 hover:text-black'
              }`}
              title="1 Sovereign / Pavan"
            >
              8g (1 Pavan)
            </button>
          </div>
        </div>

        {/* 4 Large Rate Cards Grid (2-column on tablet, 4-column on desktop, vertical stack or 2-col on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {cards.map((card) => {
            const isSilver = card.id === 'silver';
            const price1gFormatted = formatIndianCurrency(card.rate1g);
            const price10gFormatted = formatIndianCurrency(card.rate10g);
            const price8gFormatted = formatIndianCurrency(card.rate8g);

            return (
              <div
                key={card.id}
                id={`card-${card.id}`}
                className={`relative rounded-2xl ${card.cardBg} border-2 ${card.accentBorder} text-white shadow-xl flex flex-col justify-between transition-all duration-300 hover:translate-y-[-3px] hover:shadow-2xl overflow-hidden ${
                  card.popular ? 'ring-2 ring-[#E6C96A]/50' : ''
                }`}
              >
                {/* Popular Tag */}
                {card.popular && (
                  <div className="bg-gradient-to-r from-[#C9A227] to-[#E6C96A] text-[#111111] text-[11px] font-bold text-center py-1 px-3 tracking-wide uppercase shadow-sm">
                    {card.popularLabel}
                  </div>
                )}

                {/* Card Top / Header */}
                <div className={`p-5 ${card.headerBg} border-b border-white/10`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xl mr-2 inline-block">{card.icon}</span>
                      <h2 className="font-serif-luxury text-2xl font-bold tracking-wider text-white inline-block">
                        {card.metalName}
                      </h2>
                    </div>
                    <span className="text-[10px] font-bold tracking-wider px-2 py-1 rounded bg-black/40 border border-white/15 text-[#E6C96A]">
                      {card.purityCode}
                    </span>
                  </div>

                  <p className="text-xs text-white/70 mt-1 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
                    {card.purityBadge}
                  </p>
                </div>

                {/* Main Price Body */}
                <div className="p-5 flex-1 flex flex-col justify-center space-y-4">
                  {/* Primary Price: Per Gram */}
                  {(selectedWeightUnit === 'both' || selectedWeightUnit === '1g') && (
                    <div className="bg-black/35 p-3.5 rounded-xl border border-white/5">
                      <div className="flex items-baseline justify-between text-xs text-white/60 mb-1">
                        <span className="uppercase tracking-wider font-semibold text-white/80">Rate Per Gram</span>
                        <span className="text-[10px] text-[#C9A227]">Base Unit</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl sm:text-2xl text-[#C9A227] font-semibold">₹</span>
                        <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${card.priceColor}`}>
                          {price1gFormatted}
                        </span>
                        <span className="text-xs text-white/50 font-normal ml-1">/ gram</span>
                      </div>
                    </div>
                  )}

                  {/* Secondary Price: Per 10 Grams */}
                  {(selectedWeightUnit === 'both' || selectedWeightUnit === '10g') && (
                    <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                      <div className="flex items-baseline justify-between text-xs text-white/60 mb-1">
                        <span className="uppercase tracking-wider font-medium text-white/80">Rate Per 10 Grams</span>
                        <span className="text-[10px] text-white/50">Tola / 10g</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg text-[#C9A227] font-semibold">₹</span>
                        <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                          {price10gFormatted}
                        </span>
                        <span className="text-xs text-white/50 font-normal ml-1">/ 10g</span>
                      </div>
                    </div>
                  )}

                  {/* 8 Grams / 1 Pavan View */}
                  {selectedWeightUnit === '8g' && (
                    <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                      <div className="flex items-baseline justify-between text-xs text-white/60 mb-1">
                        <span className="uppercase tracking-wider font-medium text-white/80">Rate Per 8 Grams</span>
                        <span className="text-[10px] text-[#E6C96A]">1 Sovereign / Pavan</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg text-[#C9A227] font-semibold">₹</span>
                        <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                          {price8gFormatted}
                        </span>
                        <span className="text-xs text-white/50 font-normal ml-1">/ 8g</span>
                      </div>
                    </div>
                  )}

                  {/* Silver Special: 1 Kg Price Note */}
                  {isSilver && card.rate1kg && (
                    <div className="text-xs text-white/70 bg-white/5 px-3 py-1.5 rounded-lg flex items-center justify-between border border-white/5">
                      <span>Rate Per 1 Kg (1000g):</span>
                      <span className="font-bold text-white">₹{formatIndianCurrency(card.rate1kg)}</span>
                    </div>
                  )}

                  {/* Metal Subtitle / Info */}
                  <p className="text-[11px] text-white/60 leading-relaxed italic">
                    {card.subtitle}
                  </p>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 bg-black/40 border-t border-white/10 flex items-center gap-2">
                  <button
                    onClick={() => onOpenCalculator(card.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-all border border-white/15 active:scale-95"
                  >
                    <Calculator className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>Calculate Price</span>
                  </button>

                  <a
                    href={`https://wa.me/${storeInfo.whatsapp}?text=Hello%20${encodeURIComponent(storeInfo.storeName)},%20I%20am%20interested%20in%20purchasing%20${encodeURIComponent(card.metalName)}%20at%20today's%20rate%20of%20₹${price1gFormatted}/g.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-black transition-all border border-[#25D366]/40 active:scale-95"
                    title="Enquire on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer Note required by prompt */}
        <div className="mt-8 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs sm:text-sm text-amber-900 shadow-sm text-left">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Notice:</strong> Rates are indicative and may vary at the time of purchase. Subject to market movement, GST (3%), and making charges according to chosen ornament design.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
