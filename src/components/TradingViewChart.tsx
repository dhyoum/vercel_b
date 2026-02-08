import { useEffect, useRef } from 'react';
import { createChart, ColorType, CrosshairMode, CandlestickSeries, AreaSeries, LineSeries, IChartApi, ISeriesApi } from 'lightweight-charts';
import { StockDataPoint } from '@/lib/data';

interface TradingViewChartProps {
    data: StockDataPoint[];
    chartType?: 'Candlestick' | 'Area' | 'Line';
    indicators?: {
        name: string;
        data: { time: string; value: number }[];
        color: string;
    }[];
    colors?: {
        backgroundColor?: string;
        lineColor?: string;
        textColor?: string;
        areaTopColor?: string;
        areaBottomColor?: string;
    };
}

export const TradingViewChart = ({ data, chartType = 'Candlestick', indicators = [], colors = {} }: TradingViewChartProps) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: colors.backgroundColor || '#ffffff' },
                textColor: colors.textColor || '#333',
            },
            width: chartContainerRef.current.clientWidth,
            height: 480, // Increased height
            grid: {
                vertLines: { color: 'rgba(42, 46, 57, 0.06)' },
                horzLines: { color: 'rgba(42, 46, 57, 0.06)' },
            },
            crosshair: {
                mode: CrosshairMode.Normal,
            },
            rightPriceScale: {
                borderColor: 'rgba(197, 203, 206, 0.4)',
            },
            timeScale: {
                borderColor: 'rgba(197, 203, 206, 0.4)',
            },
        });

        chartRef.current = chart;

        // Main Series
        let mainSeries: ISeriesApi<"Candlestick" | "Area" | "Line">;

        if (chartType === 'Area') {
            mainSeries = chart.addSeries(AreaSeries, {
                lineColor: colors.lineColor || '#2962FF',
                topColor: colors.areaTopColor || 'rgba(41, 98, 255, 0.3)',
                bottomColor: colors.areaBottomColor || 'rgba(41, 98, 255, 0)',
            });
            mainSeries.setData(data.map(d => ({ time: d.time, value: d.close })));
        } else if (chartType === 'Line') {
            mainSeries = chart.addSeries(LineSeries, {
                color: colors.lineColor || '#2962FF',
            });
            mainSeries.setData(data.map(d => ({ time: d.time, value: d.close })));
        } else {
            // Default Candlestick
            mainSeries = chart.addSeries(CandlestickSeries, {
                upColor: '#089981',
                downColor: '#F23645',
                borderVisible: false,
                 wickUpColor: '#089981',
                 wickDownColor: '#F23645',
             });
            mainSeries.setData(data.map(d => ({
                time: d.time,
                open: d.open,
                high: d.high,
                low: d.low,
                close: d.close,
            })));
        }

        // Indicators
        indicators.forEach(ind => {
            const lineSeries = chart.addSeries(LineSeries, {
                color: ind.color,
                lineWidth: 2,
                title: ind.name,
            });
            lineSeries.setData(ind.data);
        });


        chart.timeScale().fitContent();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [data, colors, chartType, indicators]);

    return <div ref={chartContainerRef} className="w-full h-full" />;
};
