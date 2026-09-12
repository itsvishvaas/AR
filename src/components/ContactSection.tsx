import React, { useState } from 'react';
import { StoreInfo } from '../types';
import { MapPin, Phone, MessageCircle, Mail, Clock, Navigation, ExternalLink, Send, CheckCircle2 } from 'lucide-react';

interface ContactSectionProps {
  storeInfo: StoreInfo;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ storeInfo }) => {
  const [formSent, setFormSent] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactInquiry, setContactInquiry] = useState('');

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone) return;

    // Send via WhatsApp directly for maximum store conversion
    const message = `Hello ${storeInfo.storeName},\n\n*Website Contact Form Inquiry:*\n- Name: ${contactName}\n- Phone: ${contactPhone}\n- Message: ${contactInquiry || 'Interested in gold/silver rates & showroom visit.'}`;
    window.open(`https://wa.me/${storeInfo.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');

    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setContactName('');
      setContactPhone('');
      setContactInquiry('');
    }, 4000);
  };

  return (
    <section id="contact" className="py-16 sm:py-20 bg-white border-t border-[#C9A227]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111111] text-[#E6C96A] text-xs font-semibold uppercase tracking-wider mb-2.5">
            <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Visit Our Showroom</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#111111]">
            Contact & Store Location
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Reach our bullion desk or visit our flagship showroom. Our jewellery specialists are always at your service.
          </p>
        </div>

        {/* 3 Columns: Details & CTAs, Google Map, Quick Message */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Column 1: Store Details & Action Buttons (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FAF8F2] p-6 rounded-2xl border border-[#C9A227]/30 shadow-sm space-y-5">
              <h3 className="font-serif-luxury text-xl font-bold text-[#111111] pb-3 border-b border-neutral-200">
                {storeInfo.storeName}
              </h3>

              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#111111] text-[#E6C96A] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Store Address</div>
                  <div className="text-sm font-semibold text-neutral-900 leading-snug mt-0.5">
                    {storeInfo.address}
                  </div>
                  <div className="text-xs text-neutral-600">{storeInfo.cityStatePincode}</div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#111111] text-[#E6C96A] flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Phone Enquiries</div>
                  <a
                    href={`tel:${storeInfo.phone}`}
                    className="text-sm font-bold text-neutral-900 hover:text-[#C9A227] transition-colors block mt-0.5"
                  >
                    {storeInfo.phoneDisplay}
                  </a>
                  <div className="text-xs text-neutral-500">Direct Showroom & Bullion Desk</div>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#25D366] text-black flex items-center justify-center shrink-0 mt-0.5">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">WhatsApp Rates Desk</div>
                  <a
                    href={`https://wa.me/${storeInfo.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-[#25D366] hover:underline block mt-0.5"
                  >
                    {storeInfo.whatsappDisplay}
                  </a>
                  <div className="text-xs text-neutral-500">Instant Rate Quotes & Photos</div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#111111] text-[#E6C96A] flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Email Address</div>
                  <a
                    href={`mailto:${storeInfo.email}`}
                    className="text-sm font-semibold text-neutral-900 hover:text-[#C9A227] transition-colors block mt-0.5 break-all"
                  >
                    {storeInfo.email}
                  </a>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start gap-3 pt-2 border-t border-neutral-200">
                <div className="w-9 h-9 rounded-lg bg-[#111111] text-[#E6C96A] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Business Hours</div>
                  <div className="text-xs font-semibold text-neutral-900 mt-0.5">
                    {storeInfo.businessHoursWeekday}
                  </div>
                  <div className="text-xs text-neutral-600">
                    {storeInfo.businessHoursWeekend}
                  </div>
                </div>
              </div>

              {/* Primary Required Action Buttons: Call Now & WhatsApp Us */}
              <div className="grid grid-cols-2 gap-3 pt-3">
                <a
                  href={`tel:${storeInfo.phone}`}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E6C96A] hover:brightness-105 text-[#111111] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#C9A227]/20 transition-all active:scale-95 text-center"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Now</span>
                </a>

                <a
                  href={`https://wa.me/${storeInfo.whatsapp}?text=Hello%20${encodeURIComponent(storeInfo.storeName)},%20I%20have%20an%20enquiry%20regarding%20gold/silver%20jewellery.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 text-center"
                >
                  <MessageCircle className="w-4 h-4 fill-black text-black" />
                  <span>WhatsApp Us</span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Google Maps & Showroom Location (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-md overflow-hidden">
              <div className="p-4 bg-[#111111] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-[#C9A227]" />
                  <span className="font-serif-luxury font-bold text-sm">Google Maps Location</span>
                </div>
                <a
                  href={storeInfo.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#E6C96A] hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Embedded Google Map */}
              <div className="relative w-full h-64 sm:h-72 bg-neutral-100">
                <iframe
                  title="Store Location Map"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(storeInfo.address + ', ' + storeInfo.cityStatePincode)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
              </div>

              <div className="p-4 bg-[#FAF8F2] flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-neutral-700">
                  📍 Convenient valet parking and metro station nearby.
                </span>
                <a
                  href={storeInfo.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-3 rounded-lg bg-[#111111] text-[#E6C96A] font-semibold flex items-center gap-1.5 hover:bg-black transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>

            {/* Quick Enquiry Form */}
            <div className="bg-[#FAF8F2] p-5 sm:p-6 rounded-2xl border border-[#C9A227]/30 shadow-sm">
              <h4 className="font-serif-luxury font-bold text-base text-[#111111] mb-1">
                Have a Question for Our Bullion Desk?
              </h4>
              <p className="text-xs text-neutral-600 mb-4">
                Leave your details below and we will connect with today's best rates and custom booking options.
              </p>

              {formSent ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Thank you! Your message has been routed to our WhatsApp desk.</span>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Your Name *"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                    />
                    <input
                      type="tel"
                      placeholder="Mobile / WhatsApp Number *"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                    />
                  </div>
                  <textarea
                    placeholder="Message or specific jewellery requirement (e.g. 24K gold coin, wedding set)..."
                    rows={2}
                    value={contactInquiry}
                    onChange={(e) => setContactInquiry(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#111111] hover:bg-black text-[#E6C96A] font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow transition-all active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to Showroom</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
