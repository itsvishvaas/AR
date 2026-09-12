import React from 'react';
import { StoreInfo } from '../types';
import { ShieldCheck, Phone, Mail, MapPin, MessageCircle, Lock, Heart } from 'lucide-react';

interface FooterProps {
  storeInfo: StoreInfo;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  storeInfo,
  onOpenAdmin,
  isAdminLoggedIn,
  onNavigate,
}) => {
  return (
    <footer className="bg-[#0f0e0c] text-white border-t-2 border-[#C9A227]/40 pt-12 pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#E6C96A] via-[#C9A227] to-[#8C6D14] p-[1px] flex items-center justify-center">
                <div className="w-full h-full bg-[#111111] rounded-[7px] flex items-center justify-center">
                  <span className="font-serif-luxury font-bold text-base text-[#E6C96A]">
                    {storeInfo.logoMonogram}
                  </span>
                </div>
              </div>
              <span className="font-serif-luxury text-xl font-bold text-white tracking-wide">
                {storeInfo.storeName}
              </span>
            </div>

            <p className="text-xs text-white/60 leading-relaxed">
              {storeInfo.tagline}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-[#C9A227]/30 text-xs text-[#E6C96A]">
              <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
              <span>{storeInfo.bisLicense}</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-sm font-bold text-[#E6C96A] uppercase tracking-wider">
              Quick Rates & Tools
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <button
                  onClick={() => onNavigate('rates')}
                  className="hover:text-[#E6C96A] transition-colors"
                >
                  Today's Live Bullion Rates
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gold-rates')}
                  className="hover:text-[#E6C96A] transition-colors"
                >
                  24K, 22K & 18K Gold Chart
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('rates')}
                  className="hover:text-[#E6C96A] transition-colors"
                >
                  999 Fine Silver Rates
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('calculator')}
                  className="hover:text-[#E6C96A] transition-colors"
                >
                  Jewellery Price Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('history')}
                  className="hover:text-[#E6C96A] transition-colors"
                >
                  Rate History & Trend Chart
                </button>
              </li>
            </ul>
          </div>

          {/* Store Hours & Purity Assurance */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-sm font-bold text-[#E6C96A] uppercase tracking-wider">
              Showroom Hours
            </h4>
            <div className="text-xs text-white/70 space-y-1.5">
              <p className="font-medium text-white">{storeInfo.businessHoursWeekday}</p>
              <p>{storeInfo.businessHoursWeekend}</p>
              <p className="pt-2 text-[11px] text-white/50 leading-normal">
                *Rates published at 10:30 AM daily and recalibrated in accordance with international and domestic bullion exchanges.
              </p>
            </div>
          </div>

          {/* Direct Showroom Contact */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-sm font-bold text-[#E6C96A] uppercase tracking-wider">
              Connect With Us
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C9A227] shrink-0 mt-0.5" />
                <span>{storeInfo.address}, {storeInfo.cityStatePincode}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                <a href={`tel:${storeInfo.phone}`} className="hover:text-white transition-colors">
                  {storeInfo.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                <a
                  href={`https://wa.me/${storeInfo.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#25D366] transition-colors text-[#25D366]"
                >
                  WhatsApp Rate Hotline
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                <a href={`mailto:${storeInfo.email}`} className="hover:text-white transition-colors break-all">
                  {storeInfo.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Admin link and Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>
            © {new Date().getFullYear()} {storeInfo.storeName}. All rights reserved. Rates are indicative and subject to prevailing market conditions.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-white/40 hover:text-[#E6C96A] transition-colors text-[11px]"
              title="Store Owner Portal"
            >
              <Lock className="w-3 h-3 text-[#C9A227]" />
              <span>{isAdminLoggedIn ? 'Store Admin Console (Active)' : 'Store Owner Login'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
