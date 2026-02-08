
"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { StockDataPoint } from "@/lib/data"

interface StockChartProps {
  data: StockDataPoint[]
  color?: string
}

export function StockChart({ data, color = "#2563eb" }: StockChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => {
            // value is YYYY-MM
            // return MM.YY or just MM
            const [year, month] = value.split('-');
            return `${month}.${year.slice(2)}`;
          }}
          interval={1} // Show every 2nd tick or so if needed, but Recharts handles it well.
        />
        <YAxis
          stroke="#888888"
          fontSize={11} // Slightly smaller font
          domain={['auto', 'auto']}
          padding={{ top: 10, bottom: 10 }}
          tickLine={false}
          axisLine={false}
          width={40} // Fixed width to prevent jumping, adjust as needed or let it be auto but formatting helps.
          tickFormatter={(value) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
            return value;
          }}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Price
                      </span>
                      <span className="font-bold text-muted-foreground">
                        {payload[0].value} KRW
                      </span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
