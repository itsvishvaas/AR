import React from 'react';
import { StoreInfo } from '../types';
import { Award, ShieldCheck, Gem, RefreshCw, CheckCircle, MapPin } from 'lucide-react';

interface AboutSectionProps {
  storeInfo: StoreInfo;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ storeInfo }) => {
  const pillars = [
    {
      icon: ShieldCheck,
      title: '100% BIS HUID Hallmarked',
      desc: 'Every ornament carries the government-authorized 6-digit Hallmark Unique Identification (HUID) laser etched for guaranteed purity.',
    },
    {
      icon: Award,
      title: 'Real-Time Market Benchmarking',
      desc: 'Our daily published gold and silver rates match premier bullion desk standards, offering true fairness with no hidden markups.',
    },
    {
      icon: Gem,
      title: 'Computerised Caratometer Testing',
      desc: 'Transparent on-the-spot XRF gold purity verification in front of customers before purchase or exchange.',
    },
    {
      icon: RefreshCw,
      title: 'Lifetime Buyback & Exchange',
      desc: 'Enjoy transparent lifetime exchange policies at prevailing market rates on all our hallmarked gold and silver items.',
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-20 bg-[#FAF8F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text / Heritage Story */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111111] text-[#E6C96A] text-xs font-semibold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Legacy of Trust</span>
            </div>

            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#111111] leading-tight">
              Crafting Purity & Timeless Heritage
            </h2>

            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
              At <strong className="text-[#111111] font-semibold">{storeInfo.storeName}</strong>, we consider purity a sacred promise. Serving generations of families, we provide authenticated 24K bullion, 22K traditional heirloom jewellery, and 18K designer pieces backed by certified hallmarking.
            </p>

            <p className="text-sm text-neutral-600 leading-relaxed">
              Whether you are looking to purchase gold coins for Akshaya Tritiya, wedding bridal ornaments, or silver puja articles, our daily displayed rates provide full transparency so you always buy with total peace of mind.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <div className="bg-white p-3.5 rounded-xl border border-[#C9A227]/30 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#111111] text-[#E6C96A] flex items-center justify-center font-serif-luxury font-bold text-base">
                  916
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-900">BIS Hallmark Approved</div>
                  <div className="text-[11px] text-neutral-500">{storeInfo.bisLicense}</div>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#C9A227]/30 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#C9A227] text-black flex items-center justify-center font-bold text-sm">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-900">Assay Lab Verified</div>
                  <div className="text-[11px] text-neutral-500">Government Certified Weights</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Cards: Pillars of Quality */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm hover:border-[#C9A227] hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FAF8F2] border border-[#C9A227]/30 flex items-center justify-center text-[#C9A227] mb-3 group-hover:bg-[#111111] group-hover:text-[#E6C96A] transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif-luxury text-base font-bold text-neutral-900 mb-1.5">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
