import React from 'react';
import { StoreInfo, DailyRates } from '../types';
import { formatIndianCurrency } from '../utils/storage';
import { Phone, MessageCircle, TrendingUp } from 'lucide-react';

interface StickyMobileBarProps {
  storeInfo: StoreInfo;
  rates: DailyRates;
}

export const StickyMobileBar: React.FC<StickyMobileBarProps> = ({ storeInfo, rates }) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#111111]/95 backdrop-blur-md border-t border-[#C9A227]/40 px-3 py-2 shadow-2xl safe-bottom">
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        {/* Quick Rate Pill */}
        <div className="flex flex-col justify-center px-2 py-1 bg-white/5 rounded-lg border border-white/10 shrink-0">
          <span className="text-[9px] text-[#E6C96A] uppercase font-bold tracking-wider leading-none">
            22K (916)
          </span>
          <span className="text-xs font-mono font-bold text-white leading-tight">
            ₹{formatIndianCurrency(rates.gold22k)}/g
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-1">
          <a
            href={`tel:${storeInfo.phone}`}
            className="flex-1 py-2.5 px-3 bg-gradient-to-r from-[#C9A227] to-[#E6C96A] hover:brightness-105 text-[#111111] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 text-center"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Now</span>
          </a>

          <a
            href={`https://wa.me/${storeInfo.whatsapp}?text=Hello%20${encodeURIComponent(storeInfo.storeName)},%20I%20am%20enquiring%20about%20today's%20rates.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba5a] text-black font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 text-center"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-black text-black" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
