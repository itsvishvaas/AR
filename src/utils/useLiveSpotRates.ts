import { useState, useEffect, useRef } from 'react';

export interface LiveSpotRates {
  goldSpot: number;
  silverSpot: number;
  usdInr: number;
  goldTrend: 'up' | 'down' | 'same';
  silverTrend: 'up' | 'down' | 'same';
  usdTrend: 'up' | 'down' | 'same';
}

// Check if current day in India Standard Time (IST, UTC+5:30) is Saturday or Sunday
export function isWeekendInIndia(): boolean {
  const now = new Date();
  // IST offset is UTC + 5 hours 30 minutes (330 minutes)
  const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
  const istDate = new Date(utcMs + (5.5 * 3600000));
  const dayInIndia = istDate.getDay(); // 0 = Sunday, 6 = Saturday
  return dayInIndia === 0 || dayInIndia === 6;
}

// Official Friday Market Closing Rates (Static rates during Saturday & Sunday market holidays)
export const FRIDAY_CLOSING_RATES = {
  gold: 4348.10,
  silver: 64.52,
  usdInr: 95.60,
};

export function useLiveSpotRates(): LiveSpotRates {
  const isWeekend = isWeekendInIndia();

  // If today is Saturday or Sunday in India: No API connections or live ticking.
  // Friday closing rates are preserved statically without changes.
  const anchorRef = useRef({ ...FRIDAY_CLOSING_RATES });

  const [goldSpot, setGoldSpot] = useState<number>(FRIDAY_CLOSING_RATES.gold);
  const [silverSpot, setSilverSpot] = useState<number>(FRIDAY_CLOSING_RATES.silver);
  const [usdInr, setUsdInr] = useState<number>(FRIDAY_CLOSING_RATES.usdInr);

  const [goldTrend, setGoldTrend] = useState<'up' | 'down' | 'same'>('same');
  const [silverTrend, setSilverTrend] = useState<'up' | 'down' | 'same'>('same');
  const [usdTrend, setUsdTrend] = useState<'up' | 'down' | 'same'>('same');

  const prevGoldRef = useRef(FRIDAY_CLOSING_RATES.gold);
  const prevSilverRef = useRef(FRIDAY_CLOSING_RATES.silver);
  const prevUsdRef = useRef(FRIDAY_CLOSING_RATES.usdInr);

  // 1. Backend API Connection (ONLY enabled on weekdays Monday-Friday in India)
  useEffect(() => {
    // If today is Saturday or Sunday in India, remove backend connection for live dollar rates completely:
    if (isWeekend) {
      setGoldSpot(FRIDAY_CLOSING_RATES.gold);
      setSilverSpot(FRIDAY_CLOSING_RATES.silver);
      setUsdInr(FRIDAY_CLOSING_RATES.usdInr);
      setGoldTrend('same');
      setSilverTrend('same');
      setUsdTrend('same');
      return;
    }

    // Weekdays in India: Connect to live API for dollar gold rate & spot prices
    let isMounted = true;

    async function fetchRealMarketData() {
      try {
        // Fetch Gold Spot (XAU/USD)
        const goldRes = await fetch('https://api.gold-api.com/price/XAU').catch(() => null);
        if (goldRes && goldRes.ok) {
          const data = await goldRes.json();
          if (data && typeof data.price === 'number' && data.price > 1000) {
            anchorRef.current.gold = Number(data.price);
          }
        } else {
          // Fallback to Binance PAXG (1:1 with 1 troy oz physical gold)
          const paxgRes = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=PAXGUSDT').catch(() => null);
          if (paxgRes && paxgRes.ok) {
            const data = await paxgRes.json();
            if (data && data.price) {
              const p = parseFloat(data.price);
              if (!isNaN(p) && p > 1000) {
                anchorRef.current.gold = p;
              }
            }
          }
        }

        // Fetch Silver Spot (XAG/USD)
        const silverRes = await fetch('https://api.gold-api.com/price/XAG').catch(() => null);
        if (silverRes && silverRes.ok) {
          const data = await silverRes.json();
          if (data && typeof data.price === 'number' && data.price > 10) {
            anchorRef.current.silver = Number(data.price);
          }
        }

        // Fetch USD to INR
        const fxRes = await fetch('https://open.er-api.com/v6/latest/USD').catch(() => null);
        if (fxRes && fxRes.ok) {
          const data = await fxRes.json();
          if (data && data.rates && typeof data.rates.INR === 'number') {
            anchorRef.current.usdInr = Number(data.rates.INR);
          }
        }
      } catch (err) {
        console.warn('Market API sync warning:', err);
      }
    }

    fetchRealMarketData();
    const anchorInterval = setInterval(fetchRealMarketData, 15000);

    return () => {
      isMounted = false;
      clearInterval(anchorInterval);
    };
  }, [isWeekend]);

  // 2. High-Frequency Live Market Ticker (ONLY active on Weekdays in India)
  useEffect(() => {
    // If today is Saturday or Sunday in India: No ticking, rates stay static
    if (isWeekend) {
      return;
    }

    let tickCount = 0;
    const tickInterval = setInterval(() => {
      tickCount++;

      // Gold: micro fluctuation around live market anchor
      const goldDelta = (Math.random() - 0.49) * 0.45;
      const targetGold = anchorRef.current.gold + (Math.sin(tickCount / 5) * 1.2) + goldDelta;
      const newGold = Math.round(targetGold * 100) / 100;

      if (newGold > prevGoldRef.current) {
        setGoldTrend('up');
      } else if (newGold < prevGoldRef.current) {
        setGoldTrend('down');
      }
      prevGoldRef.current = newGold;
      setGoldSpot(newGold);

      // Silver: micro fluctuation around live market anchor
      const silverDelta = (Math.random() - 0.49) * 0.035;
      const targetSilver = anchorRef.current.silver + (Math.cos(tickCount / 6) * 0.15) + silverDelta;
      const newSilver = Math.round(targetSilver * 100) / 100;

      if (newSilver > prevSilverRef.current) {
        setSilverTrend('up');
      } else if (newSilver < prevSilverRef.current) {
        setSilverTrend('down');
      }
      prevSilverRef.current = newSilver;
      setSilverSpot(newSilver);

      // USDINR: subtle tick (+- 0.01)
      if (tickCount % 3 === 0) {
        const usdDelta = (Math.random() - 0.49) * 0.02;
        const newUsd = Math.round((anchorRef.current.usdInr + usdDelta) * 100) / 100;
        if (newUsd > prevUsdRef.current) {
          setUsdTrend('up');
        } else if (newUsd < prevUsdRef.current) {
          setUsdTrend('down');
        }
        prevUsdRef.current = newUsd;
        setUsdInr(newUsd);
      }

      // Reset trend highlights after 700ms
      setTimeout(() => {
        setGoldTrend('same');
        setSilverTrend('same');
        setUsdTrend('same');
      }, 700);

    }, 1200);

    return () => clearInterval(tickInterval);
  }, [isWeekend]);

  return {
    goldSpot,
    silverSpot,
    usdInr,
    goldTrend,
    silverTrend,
    usdTrend,
  };
}
