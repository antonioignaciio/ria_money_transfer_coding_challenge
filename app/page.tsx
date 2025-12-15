"use client";

import { useState } from "react";
import Converter from "@/components/Converter";
import ExchangeRates from "@/components/ExchangeRates";
import HistoricalTrend from "@/components/HistoricalTrend";
import DateRateLookup from "@/components/DateRateLookup";
import { DEFAULT_CURRENCIES } from "@/lib/constants";

export default function Home() {
  const [from, setFrom] = useState<string>(DEFAULT_CURRENCIES.FROM);
  const [to, setTo] = useState<string>(DEFAULT_CURRENCIES.TO);

  return (
    <main className="min-h-screen flex flex-col items-center py-12 px-4" style={{ backgroundColor: '#F6F6F6' }}>
      <div className="mb-10 text-center">
      </div>
      
      <div className="w-full max-w-6xl mb-8">
        <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
          <div className="flex items-center">
            <h2 className="text-5xl md:text-6xl font-extrabold text-black leading-tight">
              Envíos de dinero rápidos y seguros.
            </h2>
          </div>

          <div className="flex justify-center md:justify-end">
            <Converter from={from} setFrom={setFrom} to={to} setTo={setTo} />
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl space-y-8">
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          <HistoricalTrend from={from} to={to} />
          <DateRateLookup />
        </div>
        
        <ExchangeRates />
      </div>
      
    </main>
  );
}