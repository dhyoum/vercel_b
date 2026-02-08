
import { StockDataPoint } from "./data";

export interface IndicatorData {
  time: string;
  value: number;
}

export function calculateSMA(data: StockDataPoint[], period: number): IndicatorData[] {
  const smaData: IndicatorData[] = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val.close, 0);
    smaData.push({
      time: data[i].time,
      value: sum / period,
    });
  }
  return smaData;
}
