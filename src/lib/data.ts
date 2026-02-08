export interface StockDataPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface Stock {
  id: string;
  nameKo: string;
  nameEn: string;
  ticker: string;
  currentPrice: number;
  change: number; // Percentage change
  changeAmount: number;
  data: StockDataPoint[];
  marketCap: number; // In KRW
  volume: number;
  per: number;
  eps: number;
  performance: {
    '1W': number;
    '1M': number;
    '3M': number;
    '6M': number;
    'YTD': number;
    '1Y': number;
  };
}

const STOCK_NAMES = [
  { nameKo: "삼성전자", nameEn: "Samsung Electronics", ticker: "005930.KS", basePrice: 75000 },
  { nameKo: "SK하이닉스", nameEn: "SK Hynix", ticker: "000660.KS", basePrice: 140000 },
  { nameKo: "LG에너지솔루션", nameEn: "LG Energy Solution", ticker: "373220.KS", basePrice: 400000 },
  { nameKo: "삼성바이오로직스", nameEn: "Samsung Biologics", ticker: "207940.KS", basePrice: 800000 },
  { nameKo: "현대차", nameEn: "Hyundai Motor", ticker: "005380.KS", basePrice: 250000 },
  { nameKo: "기아", nameEn: "Kia", ticker: "000270.KS", basePrice: 120000 },
  { nameKo: "셀트리온", nameEn: "Celltrion", ticker: "068270.KS", basePrice: 180000 },
  { nameKo: "POSCO홀딩스", nameEn: "POSCO Holdings", ticker: "005490.KS", basePrice: 450000 },
  { nameKo: "NAVER", nameEn: "Naver", ticker: "035420.KS", basePrice: 200000 },
  { nameKo: "카카오", nameEn: "Kakao", ticker: "035720.KS", basePrice: 55000 },
];

// Simple seeded random function
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function generateRandomOHLC(basePrice: number): StockDataPoint[] {
  const data: StockDataPoint[] = [];
  let currentPrice = basePrice;
  const now = new Date();
  const daysToGenerate = 365;
  let seed = basePrice; // Initial seed based on stock price

  for (let i = daysToGenerate; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const volatility = 0.02; // 2% daily volatility

    // Use seededRandom instead of Math.random()
    const r1 = seededRandom(seed + i * 1);
    const r2 = seededRandom(seed + i * 2);
    const r3 = seededRandom(seed + i * 3);

    const changePercent = (r1 * volatility * 2) - volatility;

    const open = currentPrice;
    const close = currentPrice * (1 + changePercent);
    const high = Math.max(open, close) * (1 + r2 * 0.01);
    const low = Math.min(open, close) * (1 - r3 * 0.01);

    data.push({
      time: date.toISOString().slice(0, 10), // YYYY-MM-DD
      open: Math.round(open),
      high: Math.round(high),
      low: Math.round(low),
      close: Math.round(close),
    });

    currentPrice = close;
  }
  return data;
}

// Generate data once to prevent hydration mismatch
export const STOCKS: Stock[] = STOCK_NAMES.map((stock) => {
  const data = generateRandomOHLC(stock.basePrice);
  const lastCandle = data[data.length - 1];
  const prevCandle = data[data.length - 2];

  const currentPrice = lastCandle.close;
  const previousPrice = prevCandle.close;
  const changeAmount = currentPrice - previousPrice;
  const change = (changeAmount / previousPrice) * 100;

  // Generate realistic financial metrics
  // Market Cap: Price * Random Shares (e.g., 50M ~ 200M shares)
  const marketCap = currentPrice * (50000000 + Math.random() * 150000000);
  const volume = Math.floor(Math.random() * 1000000) + 500000; // 500k ~ 1.5M
  const per = 8 + Math.random() * 20; // 8 ~ 28
  const eps = currentPrice / per;

  // Generate random performance data
  const performance = {
    '1W': (Math.random() * 10) - 5,
    '1M': (Math.random() * 20) - 10,
    '3M': (Math.random() * 30) - 15,
    '6M': (Math.random() * 40) - 20,
    'YTD': (Math.random() * 50) - 25,
    '1Y': (Math.random() * 60) - 30,
  };

  return {
    id: stock.ticker,
    nameKo: stock.nameKo,
    nameEn: stock.nameEn,
    ticker: stock.ticker,
    currentPrice,
    change,
    changeAmount,
    data,
    marketCap,
    volume,
    per,
    eps,
    performance,
  };
});

export const getStocks = (): Stock[] => STOCKS;
