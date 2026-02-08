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

  const [chartType, setChartType] = useState<'Candlestick' | 'Area' | 'Line'>('Candlestick');
  const [showSMA, setShowSMA] = useState(false);
  const [showEMA, setShowEMA] = useState(false);

  // Hydration fix: Ensure component mounts before rendering data-dependent UI
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const activeStock = STOCKS.find(s => s.id === activeTab) || STOCKS[0];

  // Calculate Indicators
  const indicators = [];
  if (showSMA) {
    // Dynamic import to avoid SSR issues if any, though calculateSMA is pure logic
    const { calculateSMA } = require("@/lib/indicators");
    indicators.push({
      name: 'SMA 20',
      data: calculateSMA(activeStock.data, 20),
      color: '#2962FF',
    });
  }
  if (showEMA) {
    const { calculateSMA } = require("@/lib/indicators");
    indicators.push({
      name: 'SMA 50', // Reusing SMA logic for demo simplicity as "EMA" pending implementation
      data: calculateSMA(activeStock.data, 50),
      color: '#FF9800',
    });
  }


  return (
    <div className="flex h-screen w-full bg-white text-[#131722] font-sans overflow-hidden">
      {/* Main Chart Area (Left) */}
      <main className="flex-1 flex flex-col min-w-0 border-r border-[#E0E3EB] overflow-hidden">
        {/* Top Bar / Header */}
        <header className="h-[52px] border-b border-[#E0E3EB] flex items-center px-4 justify-between bg-white shrink-0 overflow-x-auto custom-scrollbar">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-black rounded text-white flex items-center justify-center font-bold text-xs">
                {activeStock.ticker[0]}
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-[#131722] text-sm">{activeStock.ticker}</span>
                  <span className="text-xs text-[#787B86]">{language === 'ko' ? activeStock.nameKo : activeStock.nameEn}</span>
                </div>
                <div className="text-[10px] text-[#787B86] flex gap-1">
                  <span>KOSPI</span>
                  <span>•</span>
                  <span>D</span>
                  <span>•</span>
                  <span>KRW</span>
                </div>
              </div>
            </div>

            <div className="h-6 w-[1px] bg-[#E0E3EB] mx-2"></div>

            {/* Timeframe Toolbar */}
            <div className="flex gap-1">
              {['1D', '1W', '1M', '1Y', 'ALL'].map((tf, i) => (
                <button 
                  key={tf}
                  className={cn(
                    "px-3 py-1 text-[13px] font-semibold rounded hover:bg-[#F0F3FA] transition-colors",
                    i === 2 ? "text-[#2962FF]" : "text-[#131722]"
                  )}
                >
                  {tf}
                </button>
              ))}
            </div>

            <div className="h-6 w-[1px] bg-[#E0E3EB] mx-2"></div>

            {/* Chart Controls */}
            <div className="flex items-center gap-2">
              <div className="flex bg-[#F0F3FA] rounded p-0.5">
                <button
                  onClick={() => setChartType('Candlestick')}
                  className={cn("p-1 rounded text-xs", chartType === 'Candlestick' ? "bg-white shadow text-[#2962FF] font-bold" : "text-[#787B86]")}
                  title="Candles"
                >
                  <TrendingUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setChartType('Line')}
                  className={cn("p-1 rounded text-xs", chartType === 'Line' ? "bg-white shadow text-[#2962FF] font-bold" : "text-[#787B86]")}
                  title="Line"
                >
                  <TrendingUp className="w-4 h-4 rotate-90" />
                </button>
              </div>

              <button
                onClick={() => setShowSMA(!showSMA)}
                className={cn(
                  "px-2 py-1 text-xs font-semibold rounded transition-colors border",
                  showSMA ? "bg-[#e8f0fe] text-[#2962FF] border-[#2962FF]" : "bg-white text-[#131722] border-transparent hover:bg-[#F0F3FA]"
                )}
              >
                SMA 20
              </button>
              <button
                onClick={() => setShowEMA(!showEMA)}
                className={cn(
                  "px-2 py-1 text-xs font-semibold rounded transition-colors border",
                  showEMA ? "bg-[#fff3e0] text-[#FF9800] border-[#FF9800]" : "bg-white text-[#131722] border-transparent hover:bg-[#F0F3FA]"
                )}
              >
                SMA 50
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(prev => prev === 'ko' ? 'en' : 'ko')}
              className="flex items-center gap-1 px-3 py-1.5 rounded hover:bg-[#F0F3FA] text-xs font-medium text-[#131722] transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
            </button>
            <button className="px-3 py-1.5 bg-[#2962FF] hover:bg-[#1E53E5] text-white text-xs font-semibold rounded">
              Publish
            </button>
          </div>
        </header>

        {/* Chart Container */}
        <div className="flex-1 relative bg-white">
          <TradingViewChart
            data={activeStock.data}
            chartType={chartType}
            indicators={indicators}
            colors={{
              backgroundColor: '#ffffff',
              textColor: '#787B86',
              lineColor: activeStock.change >= 0 ? '#089981' : '#F23645',
              areaTopColor: activeStock.change >= 0 ? 'rgba(8, 153, 129, 0.15)' : 'rgba(242, 54, 69, 0.15)',
              areaBottomColor: activeStock.change >= 0 ? 'rgba(8, 153, 129, 0.0)' : 'rgba(242, 54, 69, 0.0)',
            }}
          />
          {/* Legend/Status Overlay */}
          <div className="absolute top-4 left-4 flex gap-4 text-xs font-mono z-10 pointer-events-none">
            <span className={cn(
              "font-bold",
              activeStock.change >= 0 ? "text-[#089981]" : "text-[#F23645]"
            )}>
              O: {convertPrice(activeStock.currentPrice * 0.99, currency)} H: {convertPrice(activeStock.currentPrice * 1.01, currency)} L: {convertPrice(activeStock.currentPrice * 0.98, currency)} C: {convertPrice(activeStock.currentPrice, currency)}
            </span>
            {showSMA && <span style={{ color: '#2962FF' }}>SMA20</span>}
            {showEMA && <span style={{ color: '#FF9800' }}>SMA50</span>}
          </div>
        </div>
      </main>

      {/* Right Sidebar - Watchlist & Details */}
      <aside className="w-[320px] flex flex-col bg-white shrink-0 z-20 shadow-lg relative">

        {/* Watchlist Header */}
        <div className="h-[52px] border-b border-[#E0E3EB] flex items-center justify-between px-4 shrink-0">
          <span className="font-semibold text-[#131722] text-sm">Watchlist</span>
          <div className="flex gap-2">
            <Search className="w-4 h-4 text-[#787B86] cursor-pointer hover:text-[#131722]" />
            <div className="w-[1px] h-4 bg-[#E0E3EB]"></div>
            <ArrowDownIcon className="w-4 h-4 text-[#787B86] cursor-pointer hover:text-[#131722]" />
          </div>
        </div>

        {/* Watchlist Table */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex px-4 py-2 border-b border-[#E0E3EB] text-[10px] text-[#787B86] font-medium">
            <div className="w-1/3">Key</div>
            <div className="w-1/3 text-right">Last</div>
            <div className="w-1/3 text-right">Chg%</div>
          </div>
          {STOCKS.map((stock) => (
            <div
              key={stock.id}
              onClick={() => setActiveTab(stock.id)}
              className={cn(
                "flex px-4 py-3 border-b border-[#F0F3FA] cursor-pointer hover:bg-[#F0F3FA] transition-colors items-center",
                activeTab === stock.id ? "bg-[#F0F3FA]" : ""
              )}
            >
              <div className="w-1/3 overflow-hidden">
                <div className="font-semibold text-sm text-[#131722] truncate">{stock.ticker}</div>
                <div className="text-[10px] text-[#787B86] truncate">{language === 'ko' ? stock.nameKo : stock.nameEn}</div>
              </div>
              <div className="w-1/3 text-right text-sm text-[#131722] font-mono">
                {convertPrice(stock.currentPrice, currency).replace(/[^0-9.,]/g, '')}
              </div>
              <div className="w-1/3 text-right flex justify-end">
                <span className={cn(
                  "text-xs font-medium px-1.5 py-0.5 rounded text-white min-w-[50px] text-center",
                  stock.change >= 0 ? "bg-[#089981]" : "bg-[#F23645]"
                )}>
                  {stock.change > 0 ? "+" : ""}{stock.change.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>


        {/* Bottom Details Panel */}
        <div className="h-[250px] border-t border-[#E0E3EB] flex flex-col bg-white shrink-0">
          <div className="p-4">
            {/* Key Statistics Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-6">
              <div className="flex justify-between items-center border-b border-[#F0F3FA] pb-1">
                <span className="text-xs text-[#787B86]">Open</span>
                <span className="text-sm font-medium text-[#131722]">{convertPrice(activeStock.currentPrice * 0.99, currency)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#F0F3FA] pb-1">
                <span className="text-xs text-[#787B86]">High</span>
                <span className="text-sm font-medium text-[#131722]">{convertPrice(activeStock.currentPrice * 1.01, currency)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#F0F3FA] pb-1">
                <span className="text-xs text-[#787B86]">Low</span>
                <span className="text-sm font-medium text-[#131722]">{convertPrice(activeStock.currentPrice * 0.98, currency)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#F0F3FA] pb-1">
                <span className="text-xs text-[#787B86]">Volume</span>
                <span className="text-sm font-medium text-[#131722]">{formatLargeNumber(activeStock.volume, currency)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#F0F3FA] pb-1">
                <span className="text-xs text-[#787B86]">Mkt Cap</span>
                <span className="text-sm font-medium text-[#131722]">{formatLargeNumber(activeStock.marketCap, currency)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#F0F3FA] pb-1">
                <span className="text-xs text-[#787B86]">PER</span>
                <span className="text-sm font-medium text-[#131722]">{activeStock.per.toFixed(2)}x</span>
              </div>
            </div>

            {/* Performance Grid */}
            <div>
              <div className="text-sm font-bold text-[#131722] mb-2">Performance</div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '1W', val: activeStock.performance['1W'] },
                  { label: '1M', val: activeStock.performance['1M'] },
                  { label: '3M', val: activeStock.performance['3M'] },
                  { label: '6M', val: activeStock.performance['6M'] },
                  { label: 'YTD', val: activeStock.performance['YTD'] },
                  { label: '1Y', val: activeStock.performance['1Y'] }
                ].map((p, i) => (
                  <div key={p.label} className={cn(
                    "flex flex-col items-center justify-center py-1.5 rounded",
                    p.val >= 0 ? "bg-[#E6F4F1] text-[#00796B]" : "bg-[#FDECEF] text-[#D32F2F]"
                  )}>
                      <span className="text-xs font-bold">{p.val > 0 ? "+" : ""}{p.val.toFixed(2)}%</span>
                      <span className="text-[10px] font-medium text-[#787B86]">{p.label}</span>
                    </div>
                  ))}
              </div>
            </div>

          </div>
        </div>
      </aside >
    </div>
  );
}
