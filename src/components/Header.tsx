import React, { useState } from 'react';
import { StoreInfo } from '../types';
import { Phone, MessageCircle, Menu, X, ShieldCheck, Lock, Clock } from 'lucide-react';

interface HeaderProps {
  storeInfo: StoreInfo;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({
  storeInfo,
  onOpenAdmin,
  isAdminLoggedIn,
  onNavigate,
  activeSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'rates', label: 'Today\'s Rates' },
    { id: 'gold-rates', label: 'Gold Rates' },
    { id: 'silver-rates', label: 'Silver Rates' },
    { id: 'calculator', label: 'Rate Calculator' },
    { id: 'history', label: 'Rate History' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#111111] text-white shadow-xl border-b border-[#C9A227]/30 backdrop-blur-md">
      {/* Top Banner with Store Hours & Hallmark Indicator */}
      <div className="bg-[#1a1814] text-[#E6C96A] text-xs py-1.5 px-4 border-b border-[#C9A227]/20">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
              {storeInfo.bisLicense}
            </span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="hidden sm:flex items-center gap-1 text-white/70">
              <Clock className="w-3.5 h-3.5 text-[#C9A227]" />
              {storeInfo.businessHoursWeekday.split(':')[0]}: 10 AM – 8:30 PM
            </span>
          </div>

          <div className="flex items-center gap-4 text-white/80">
            <a
              href={`tel:${storeInfo.phone}`}
              className="hover:text-[#E6C96A] transition-colors flex items-center gap-1"
              title="Call store desk"
            >
              <Phone className="w-3 h-3 text-[#C9A227]" />
              <span className="hidden md:inline">{storeInfo.phoneDisplay}</span>
            </a>
            <a
              href={`https://wa.me/${storeInfo.whatsapp}?text=Hello%20${encodeURIComponent(storeInfo.storeName)},%20I%20would%20like%20to%20inquire%20about%20today's%20gold%20and%20silver%20rates.`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#25D366] text-[#25D366] font-medium transition-colors flex items-center gap-1"
              title="WhatsApp store"
            >
              <MessageCircle className="w-3 h-3" />
              <span className="hidden md:inline">WhatsApp Rate Desk</span>
            </a>
            <button
              onClick={onOpenAdmin}
              className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded transition-all ${
                isAdminLoggedIn
                  ? 'bg-[#C9A227] text-black font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title="Store Owner / Administrator Portal"
            >
              <Lock className="w-3 h-3" />
              <span>{isAdminLoggedIn ? 'Admin Panel' : 'Staff Login'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <button
          onClick={() => handleNavClick('rates')}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#E6C96A] via-[#C9A227] to-[#8C6D14] p-[1.5px] shadow-md shadow-[#C9A227]/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#111111] rounded-[7px] flex items-center justify-center border border-[#C9A227]/40 group-hover:border-[#E6C96A] transition-colors">
              <span className="font-serif-luxury font-bold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5D6] via-[#E6C96A] to-[#C9A227]">
                {storeInfo.logoMonogram || 'SV'}
              </span>
            </div>
          </div>
          <div>
            <span className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-wide text-white block leading-tight group-hover:text-[#E6C96A] transition-colors">
              {storeInfo.storeName}
            </span>
            <span className="text-[10px] sm:text-xs text-[#E6C96A] tracking-wider uppercase font-medium block">
              Bullion & Hallmark Jewellers
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? 'text-[#E6C96A] bg-white/5 border-b-2 border-[#C9A227]'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* CTA Buttons (Desktop) */}
        <div className="hidden sm:flex items-center gap-2.5">
          <a
            href={`https://wa.me/${storeInfo.whatsapp}?text=Hello%20${encodeURIComponent(storeInfo.storeName)},%20please%20send%20me%20today's%20rates.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-black font-semibold px-3.5 py-2 rounded-lg text-xs shadow-md transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-black text-black" />
            <span>WhatsApp Us</span>
          </a>
          <a
            href={`tel:${storeInfo.phone}`}
            className="flex items-center gap-2 bg-gradient-to-r from-[#C9A227] to-[#E6C96A] hover:brightness-105 text-[#111111] font-bold px-3.5 py-2 rounded-lg text-xs shadow-md shadow-[#C9A227]/20 transition-all active:scale-95"
          >
            <Phone className="w-4 h-4" />
            <span>Call Now</span>
          </a>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={`tel:${storeInfo.phone}`}
            className="p-2 rounded-md bg-[#1f1d18] border border-[#C9A227]/40 text-[#E6C96A]"
            aria-label="Call Store"
          >
            <Phone className="w-4 h-4" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md bg-white/10 text-white hover:text-[#E6C96A] focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#161410] border-t border-[#C9A227]/30 px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-white/10">
            <a
              href={`tel:${storeInfo.phone}`}
              className="flex items-center justify-center gap-2 bg-[#C9A227] text-black font-bold py-2.5 px-3 rounded-lg text-sm text-center"
            >
              <Phone className="w-4 h-4" />
              Call Store
            </a>
            <a
              href={`https://wa.me/${storeInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] text-black font-bold py-2.5 px-3 rounded-lg text-sm text-center"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>

          <div className="space-y-1 pt-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  activeSection === item.id
                    ? 'text-[#E6C96A] bg-white/10 font-semibold border-l-4 border-[#C9A227]'
                    : 'text-white/90 hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg bg-white/5 text-white/80 hover:text-white"
              >
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#C9A227]" />
                  {isAdminLoggedIn ? 'Store Admin Dashboard (Logged in)' : 'Owner / Administrator Login'}
                </span>
                <span className="text-xs text-[#E6C96A] font-semibold">Access</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
