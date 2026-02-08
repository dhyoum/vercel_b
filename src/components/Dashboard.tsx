"use client"

import { useState, useEffect } from "react";
import { STOCKS } from "@/lib/data";
import { TradingViewChart } from "@/components/TradingViewChart";
import { ArrowDownIcon, ArrowUpIcon, Globe, TrendingUp, Search } from "lucide-react";
import { cn, convertPrice, formatLargeNumber } from "@/lib/utils";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(STOCKS[0].id);
  const [language, setLanguage] = useState<'ko' | 'en'>('ko');
  const currency = language === 'ko' ? 'KRW' : 'USD';

  // Hydration fix: Ensure component mounts before rendering data-dependent UI
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const activeStock = STOCKS.find(s => s.id === activeTab) || STOCKS[0];

  return (
    <div
      className="flex h-screen w-full bg-slate-100 text-slate-900 font-sans overflow-hidden selection:bg-blue-100"
      style={{ backgroundColor: '#f1f5f9', color: '#0f172a' }} // Slate-100
    >
      {/* Sidebar - Card Style */}
      <aside className="w-72 bg-white m-4 rounded-3xl shadow-sm border border-slate-200 flex flex-col z-20 overflow-hidden">
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-3 text-slate-900">
            <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">{language === 'ko' ? 'Stock Trends' : 'Stock Trends'}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
          {STOCKS.map((stock) => (
            <button
              key={stock.id}
              onClick={() => setActiveTab(stock.id)}
              className={cn(
                "w-full text-left px-4 py-3.5 rounded-xl transition-all duration-200 group flex justify-between items-center relative outline-none",
                "active:scale-[0.98] hover:bg-slate-50",
                activeTab === stock.id ? "bg-blue-50/50 shadow-sm ring-1 ring-blue-100" : "bg-transparent"
              )}
            >
              <div className="overflow-hidden mr-3">
                <span className={cn(
                  "block text-sm truncate transition-colors mb-0.5",
                  activeTab === stock.id ? "font-bold text-blue-900" : "font-medium text-slate-600 group-hover:text-slate-900"
                )}>
                  {language === 'ko' ? stock.nameKo : stock.nameEn}
                </span>
                <span className="text-[11px] text-slate-400 font-medium bg-slate-100 px-1.5 py-0.5 rounded">{stock.ticker}</span>
              </div>
              <div className="text-right shrink-0">
                <div className={cn(
                  "text-sm tabular-nums transition-colors font-semibold",
                  activeTab === stock.id ? "text-blue-900" : "text-slate-900"
                )}>
                  {convertPrice(stock.currentPrice, currency)}
                </div>
                <div className={cn(
                  "text-[11px] flex items-center justify-end font-semibold mt-1",
                  stock.change >= 0 ? "text-blue-600" : "text-rose-500"
                )}>
                  {stock.change > 0 ? "+" : ""}{stock.change.toFixed(2)}%
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={() => setLanguage(prev => prev === 'ko' ? 'en' : 'ko')}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-300 hover:text-blue-600 hover:shadow-md transition-all text-sm font-bold text-slate-600 active:scale-95"
          >
            <Globe className="w-4 h-4" />
            {language === 'ko' ? 'Language: English' : '언어: 한국어'}
          </button>
        </div>
      </aside>

      {/* Main Content - Card Layout */}
      <main className="flex-1 flex flex-col min-w-0 p-4 pl-0 gap-4">

        {/* Header Card */}
        <header className="bg-white rounded-3xl shadow-sm border border-slate-200 px-10 py-8 flex justify-between items-center z-10">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
              {language === 'ko' ? activeStock.nameKo : activeStock.nameEn}
            </h2>
            <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-xs border border-slate-200 font-semibold">{activeStock.ticker}</span>
              <span className="text-slate-300">|</span>
              <span>KOSPI</span>
              <span className="text-slate-300">|</span>
              <span>Technology</span>
            </div>
          </div>

          <div className="text-right flex items-center gap-8">
            {/* Metrics in Header for better use of space */}
            <div className="flex gap-8 mr-8 border-r border-slate-100 pr-8">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Market Cap</div>
                <div className="font-semibold text-slate-700">{formatLargeNumber(currency === 'KRW' ? activeStock.marketCap : activeStock.marketCap / 1350, currency)}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Volume</div>
                <div className="font-semibold text-slate-700">{formatLargeNumber(activeStock.volume, currency)}</div>
              </div>
            </div>

            <div>
              <div
                className="font-bold text-slate-900 tracking-tighter text-right"
                style={{ fontSize: '3.5rem', lineHeight: '1' }}
              >
                {convertPrice(activeStock.currentPrice, currency)}
              </div>
              <div className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold mt-2 float-right",
                activeStock.change >= 0 ? "bg-blue-50 text-blue-600" : "bg-rose-50 text-rose-600"
              )}>
                {activeStock.change >= 0 ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                {Math.abs(activeStock.change).toFixed(2)}%
                <span className="opacity-60 font-medium ml-1">
                  {convertPrice(Math.abs(activeStock.changeAmount), currency)}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Chart Card */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative flex flex-col p-2">
          {/* Toolbar - Top Right of Chart Area */}
          <div className="absolute top-6 right-6 z-10 bg-slate-100/80 backdrop-blur p-1 rounded-xl flex gap-1 shadow-sm border border-slate-200/50">
            {['1D', '1W', '1M', '1Y', 'ALL'].map((tf, i) => (
              <button key={tf} className={cn(
                "px-4 py-1.5 text-xs font-bold rounded-lg transition-all active:scale-95",
                i === 2
                  ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5"
                  : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
              )}>
                {tf}
              </button>
            ))}
          </div>

          <div className="w-full h-full rounded-2xl overflow-hidden">
            <TradingViewChart
              data={activeStock.data}
              colors={{
                backgroundColor: '#ffffff',
                textColor: '#64748b', // slate-500
                lineColor: activeStock.change >= 0 ? '#2563eb' : '#ef4444', // blue-600 : rose-500
                areaTopColor: activeStock.change >= 0 ? 'rgba(37, 99, 235, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                areaBottomColor: activeStock.change >= 0 ? 'rgba(37, 99, 235, 0)' : 'rgba(239, 68, 68, 0)',
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
