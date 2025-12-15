"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getHistoricalRates } from "@/lib/frankfurter";
import { HistoricalTrendProps, HistoricalRatesResponse } from "@/types";

interface ChartDataPoint {
  date: string;
  value: number;
}

export default function HistoricalTrend({ from, to }: HistoricalTrendProps) {
  const [history, setHistory] = useState<HistoricalRatesResponse | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trendPercentage, setTrendPercentage] = useState<number | null>(null);
  const [isRising, setIsRising] = useState<boolean>(false);

  useEffect(() => {
    if (from === to) {
      setHistory(null);
      setChartData([]);
      return;
    }

    const fetchHistory = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getHistoricalRates(from, to);
        if (data) {
          setHistory(data);
          
          const dates = Object.keys(data.rates).sort();
          const transformedData: ChartDataPoint[] = dates.map((dateStr) => {
            const rate = data.rates[dateStr]?.[to];
            if (!rate) return null;
            
            const date = new Date(dateStr);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const formattedDate = `${day}/${month}`;
            
            return {
              date: formattedDate,
              value: rate,
            };
          }).filter((item): item is ChartDataPoint => item !== null);
          
          setChartData(transformedData);
          
          if (transformedData.length >= 2) {
            const firstValue = transformedData[0].value;
            const lastValue = transformedData[transformedData.length - 1].value;
            const percentageChange = ((lastValue - firstValue) / firstValue) * 100;
            setTrendPercentage(percentageChange);
            setIsRising(percentageChange > 0);
          }
        } else {
          setError("No se pudo cargar el historial");
        }
      } catch (err) {
        setError("Error al cargar el historial");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [from, to]);

  if (from === to || !history || chartData.length === 0) return null;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-1">
            {payload[0].payload.date}
          </p>
          <p className="text-lg font-bold text-black">
            {payload[0].value.toFixed(4)} {to}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-7 bg-white rounded-2xl shadow-lg border-2 border-gray-200 w-full h-full">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-black mb-4">
          Tendencia (Últimos 7 días)
        </h3>
        
        {trendPercentage !== null && (
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`text-xl font-bold ${
                isRising ? "text-green-600" : "text-red-600"
              }`}
            >
              {isRising ? "↗" : "↘"} {isRising ? "Alza" : "Baja"}
            </span>
            <span
              className={`text-lg font-semibold ${
                isRising ? "text-green-600" : "text-red-600"
              }`}
            >
              {isRising ? "+" : ""}
              {trendPercentage.toFixed(2)}%
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8" role="status" aria-live="polite">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mb-2"></div>
          <p className="text-gray-600 text-sm font-medium">Cargando historial...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg" role="alert">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      ) : (
        <div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={['auto', 'auto']}
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
          
          <p className="text-xs text-gray-600 mt-4 font-medium">
            Analizar la tendencia te ayuda a decidir el mejor momento para transferir.
          </p>
        </div>
      )}
    </div>
  );
}
