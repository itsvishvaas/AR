export type MetalType = 'gold24k' | 'gold22k' | 'gold18k' | 'silver';

export interface DailyRates {
  gold24k: number; // Price per gram in INR
  gold22k: number; // Price per gram in INR
  gold18k: number; // Price per gram in INR
  silver: number;  // Price per gram in INR
  lastUpdated: string; // e.g., "12 September 2026, 1:30 PM"
  updatedAtISO: string;
}

export interface RateHistoryItem {
  id: string;
  date: string; // e.g., "12 Sep 2026"
  timestamp: number;
  gold24k: number;
  gold22k: number;
  gold18k: number;
  silver: number;
  note?: string;
}

export interface StoreInfo {
  storeName: string;
  tagline: string;
  logoMonogram: string;
  address: string;
  cityStatePincode: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  whatsappDisplay: string;
  email: string;
  googleMapsUrl: string;
  googleMapsEmbedQuery: string;
  businessHoursWeekday: string;
  businessHoursWeekend: string;
  bisLicense: string;
  websiteUrl: string;
  instagramUrl: string;
  facebookUrl: string;
}

export interface RateCardData {
  id: MetalType;
  metalName: string;
  purity: string;
  purityCode: string;
  karat: string;
  pricePerGram: number;
  pricePer10Gram: number;
  change: number;
  isPositive: boolean;
  description: string;
  accentColor: string;
  badgeBg: string;
}
