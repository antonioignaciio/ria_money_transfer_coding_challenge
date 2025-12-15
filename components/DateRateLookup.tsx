"use client";

import { useState } from "react";
import { getRatesForDate } from "@/lib/frankfurter";
import { ExchangeRateResponse } from "@/types";
import { useCurrencies } from "@/hooks/useCurrencies";
import { formatCurrency } from "@/lib/utils";

export default function DateRateLookup() {
  const { currencies, loading: currenciesLoading } = useCurrencies();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [baseCurrency, setBaseCurrency] = useState<string>("USD");
  const [targetCurrency, setTargetCurrency] = useState<string>("EUR");
  const [rates, setRates] = useState<ExchangeRateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const minDate = oneYearAgo.toISOString().split('T')[0];

  const handleLookup = async () => {
    if (!selectedDate) {
      setError("Por favor selecciona una fecha");
      return;
    }

    if (baseCurrency === targetCurrency) {
      setError("Por favor selecciona monedas diferentes");
      return;
    }

    setLoading(true);
    setError(null);
    setRates(null);

    try {
      const data = await getRatesForDate(selectedDate, baseCurrency, targetCurrency);
      if (data) {
        setRates(data);
      } else {
        setError("No se pudieron obtener las tasas para esta fecha");
      }
    } catch (err) {
      setError("Error al buscar las tasas. Verifica que la fecha sea válida.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full h-full border border-gray-200">
      <h3 className="text-2xl font-bold text-black mb-6">
        Buscar Tasas por Fecha
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-black mb-2">
            Fecha
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={minDate}
            max={today}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black bg-white"
            aria-label="Seleccionar fecha para buscar tasas"
          />
          <p className="text-xs text-gray-500 mt-1">
            Selecciona una fecha para ver las tasas de cambio de ese día
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Moneda Base
            </label>
            <select
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black bg-white"
              disabled={currenciesLoading}
              aria-label="Moneda base"
            >
              {Object.entries(currencies).map(([code, name]) => (
                <option key={code} value={code}>
                  {code} - {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Moneda Destino
            </label>
            <select
              value={targetCurrency}
              onChange={(e) => setTargetCurrency(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black bg-white"
              disabled={currenciesLoading}
              aria-label="Moneda destino"
            >
              {Object.entries(currencies).map(([code, name]) => (
                <option key={code} value={code}>
                  {code} - {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleLookup}
          disabled={loading || !selectedDate || baseCurrency === targetCurrency}
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Buscar tasas de cambio"
        >
          {loading ? "Buscando..." : "Buscar Tasas"}
        </button>

        {error && (
          <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg" role="alert">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        {rates && !loading && (
          <div className="mt-6 p-5 bg-orange-50 rounded-xl border-2 border-orange-200">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-700 font-medium mb-1">
                Tasas de cambio del {rates.date}
              </p>
              <p className="text-xs text-gray-500">
                Base: {rates.base} ({currencies[rates.base] || rates.base})
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-orange-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-semibold">
                  {targetCurrency} ({currencies[targetCurrency] || targetCurrency})
                </span>
                <span className="text-2xl font-bold text-orange-600">
                  {rates.rates[targetCurrency]?.toFixed(4) || "N/A"}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                1 {rates.base} = {rates.rates[targetCurrency]?.toFixed(4) || "N/A"} {targetCurrency}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

