import { DailyRates, RateHistoryItem, StoreInfo, MetalType } from '../types';

const RATES_STORAGE_KEY = 'aurum_rates_v3';
const HISTORY_STORAGE_KEY = 'aurum_rates_history_v3';
const STORE_INFO_STORAGE_KEY = 'aurum_rates_store_info_v2';
const AUTH_STORAGE_KEY = 'aurum_rates_admin_auth';

export const DEFAULT_RATES: DailyRates = {
  gold24k: 15000,
  gold22k: 13750,
  gold18k: 11250,
  silver: 230000,
  lastUpdated: '12 September 2026, 1:30 PM',
  updatedAtISO: '2026-09-12T13:30:00.000Z',
};

export const PERMANENT_ADMIN_USERNAME = 'admin1';
export const PERMANENT_ADMIN_EMAIL = 'admin@gmail.com';
export const PERMANENT_ADMIN_PASSWORD = 'admin@987';

export const DEFAULT_STORE_INFO: StoreInfo = {
  storeName: 'aurumRates',
  tagline: 'Live Precious Metals & Bullion Rates Desk',
  logoMonogram: 'aR',
  address: 'Bullion Complex, Financial & Jewellery Hub',
  cityStatePincode: 'Bengaluru, Karnataka 560002',
  phone: '+919845012345',
  phoneDisplay: '+91 98450 12345',
  whatsapp: '919845012345',
  whatsappDisplay: '+91 98450 12345',
  email: 'admin@gmail.com',
  googleMapsUrl: 'https://maps.google.com/?q=Bullion+Rates+Hub',
  googleMapsEmbedQuery: 'Bullion+Rates+Hub',
  businessHoursWeekday: 'Monday – Saturday: 10:00 AM – 8:30 PM',
  businessHoursWeekend: 'Sunday: 10:30 AM – 3:00 PM',
  bisLicense: 'HM/C-7849204 (BIS Certified 916)',
  websiteUrl: 'https://aurumrates.com',
  instagramUrl: 'https://instagram.com',
  facebookUrl: 'https://facebook.com',
};

// Seed 14 days of rate history leading up to Sep 12, 2026
export const INITIAL_HISTORY: RateHistoryItem[] = [
  { id: 'hist-1', date: '30 Aug 2026', timestamp: 1788050400000, gold24k: 14720, gold22k: 13490, gold18k: 11040, silver: 222000 },
  { id: 'hist-2', date: '31 Aug 2026', timestamp: 1788136800000, gold24k: 14750, gold22k: 13520, gold18k: 11060, silver: 223000 },
  { id: 'hist-3', date: '01 Sep 2026', timestamp: 1788223200000, gold24k: 14790, gold22k: 13560, gold18k: 11090, silver: 224000 },
  { id: 'hist-4', date: '02 Sep 2026', timestamp: 1788309600000, gold24k: 14820, gold22k: 13585, gold18k: 11115, silver: 225000 },
  { id: 'hist-5', date: '03 Sep 2026', timestamp: 1788396000000, gold24k: 14800, gold22k: 13570, gold18k: 11100, silver: 224000 },
  { id: 'hist-6', date: '04 Sep 2026', timestamp: 1788482400000, gold24k: 14840, gold22k: 13605, gold18k: 11130, silver: 226000 },
  { id: 'hist-7', date: '05 Sep 2026', timestamp: 1788568800000, gold24k: 14890, gold22k: 13650, gold18k: 11170, silver: 227000 },
  { id: 'hist-8', date: '06 Sep 2026', timestamp: 1788655200000, gold24k: 14890, gold22k: 13650, gold18k: 11170, silver: 227000 },
  { id: 'hist-9', date: '07 Sep 2026', timestamp: 1788741600000, gold24k: 14920, gold22k: 13680, gold18k: 11190, silver: 228000 },
  { id: 'hist-10', date: '08 Sep 2026', timestamp: 1788828000000, gold24k: 14950, gold22k: 13705, gold18k: 11210, silver: 229000 },
  { id: 'hist-11', date: '09 Sep 2026', timestamp: 1788914400000, gold24k: 14930, gold22k: 13685, gold18k: 11195, silver: 228000 },
  { id: 'hist-12', date: '10 Sep 2026', timestamp: 1789000800000, gold24k: 14960, gold22k: 13715, gold18k: 11220, silver: 229000 },
  { id: 'hist-13', date: '11 Sep 2026', timestamp: 1789087200000, gold24k: 14980, gold22k: 13730, gold18k: 11235, silver: 229500 },
  { id: 'hist-14', date: '12 Sep 2026', timestamp: 1789173600000, gold24k: 15000, gold22k: 13750, gold18k: 11250, silver: 230000 },
];

export function getStoredRates(): DailyRates {
  try {
    const raw = localStorage.getItem(RATES_STORAGE_KEY);
    if (!raw) return DEFAULT_RATES;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.silver === 'number' && parsed.silver < 1000) {
      parsed.silver = 230000;
    }
    return parsed;
  } catch (err) {
    console.error('Error reading rates:', err);
    return DEFAULT_RATES;
  }
}

export function saveRates(newRates: DailyRates): void {
  try {
    localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(newRates));
  } catch (err) {
    console.error('Error saving rates:', err);
  }
}

export function getStoredHistory(): RateHistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return INITIAL_HISTORY;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_HISTORY;
  } catch (err) {
    console.error('Error reading history:', err);
    return INITIAL_HISTORY;
  }
}

export function saveHistory(history: RateHistoryItem[]): void {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (err) {
    console.error('Error saving history:', err);
  }
}

export function getStoredStoreInfo(): StoreInfo {
  try {
    const raw = localStorage.getItem(STORE_INFO_STORAGE_KEY);
    if (!raw) return DEFAULT_STORE_INFO;
    const parsed = JSON.parse(raw);
    const info = { ...DEFAULT_STORE_INFO, ...parsed };
    if (!info.email || info.email.includes('srivasavi')) {
      info.email = 'admin@gmail.com';
    }
    return info;
  } catch (err) {
    console.error('Error reading store info:', err);
    return DEFAULT_STORE_INFO;
  }
}

export function saveStoreInfo(info: StoreInfo): void {
  try {
    localStorage.setItem(STORE_INFO_STORAGE_KEY, JSON.stringify(info));
  } catch (err) {
    console.error('Error saving store info:', err);
  }
}

export function formatIndianCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrentTimestamp(): string {
  const now = new Date();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const day = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
}

export function formatDateShort(d: Date = new Date()): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = d.getDate().toString().padStart(2, '0');
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export function updateSingleMetalRate(
  metalKey: MetalType,
  newPricePerGram: number,
  currentRates: DailyRates,
  currentHistory: RateHistoryItem[]
): { updatedRates: DailyRates; updatedHistory: RateHistoryItem[] } {
  const nowFormatted = formatCurrentTimestamp();
  const todayShort = formatDateShort();

  const updatedRates: DailyRates = {
    ...currentRates,
    [metalKey]: Math.round(newPricePerGram),
    lastUpdated: nowFormatted,
    updatedAtISO: new Date().toISOString(),
  };

  saveRates(updatedRates);

  // Check if today already has an entry in history
  const updatedHistory = [...currentHistory];
  const existingTodayIndex = updatedHistory.findIndex(h => h.date === todayShort);

  if (existingTodayIndex >= 0) {
    updatedHistory[existingTodayIndex] = {
      ...updatedHistory[existingTodayIndex],
      gold24k: updatedRates.gold24k,
      gold22k: updatedRates.gold22k,
      gold18k: updatedRates.gold18k,
      silver: updatedRates.silver,
      timestamp: Date.now(),
    };
  } else {
    updatedHistory.push({
      id: 'hist-' + Date.now(),
      date: todayShort,
      timestamp: Date.now(),
      gold24k: updatedRates.gold24k,
      gold22k: updatedRates.gold22k,
      gold18k: updatedRates.gold18k,
      silver: updatedRates.silver,
    });
  }

  saveHistory(updatedHistory);
  return { updatedRates, updatedHistory };
}

export function updateAllDailyRates(
  newPrices: { gold24k: number; gold22k: number; gold18k: number; silver: number },
  currentHistory: RateHistoryItem[]
): { updatedRates: DailyRates; updatedHistory: RateHistoryItem[] } {
  const nowFormatted = formatCurrentTimestamp();
  const todayShort = formatDateShort();

  const updatedRates: DailyRates = {
    gold24k: Math.round(newPrices.gold24k),
    gold22k: Math.round(newPrices.gold22k),
    gold18k: Math.round(newPrices.gold18k),
    silver: Math.round(newPrices.silver),
    lastUpdated: nowFormatted,
    updatedAtISO: new Date().toISOString(),
  };

  saveRates(updatedRates);

  const updatedHistory = [...currentHistory];
  const existingTodayIndex = updatedHistory.findIndex(h => h.date === todayShort);

  if (existingTodayIndex >= 0) {
    updatedHistory[existingTodayIndex] = {
      ...updatedHistory[existingTodayIndex],
      gold24k: updatedRates.gold24k,
      gold22k: updatedRates.gold22k,
      gold18k: updatedRates.gold18k,
      silver: updatedRates.silver,
      timestamp: Date.now(),
    };
  } else {
    updatedHistory.push({
      id: 'hist-' + Date.now(),
      date: todayShort,
      timestamp: Date.now(),
      gold24k: updatedRates.gold24k,
      gold22k: updatedRates.gold22k,
      gold18k: updatedRates.gold18k,
      silver: updatedRates.silver,
    });
  }

  saveHistory(updatedHistory);
  return { updatedRates, updatedHistory };
}

// Admin Auth Helper
export function checkIsAdminAuthenticated(): boolean {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAdminAuth(isAuth: boolean): void {
  try {
    if (isAuth) {
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (err) {
    console.error('Auth storage error:', err);
  }
}
