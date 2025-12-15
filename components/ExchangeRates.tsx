"use client";

import { useState, useEffect } from "react";
import { getLatestRates } from "@/lib/frankfurter";
import { useCurrencies } from "@/hooks/useCurrencies";
import { MAJOR_CURRENCIES } from "@/lib/constants";

export default function ExchangeRates() {
  const [base, setBase] = useState<string>("USD");
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currencies } = useCurrencies();

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getLatestRates(base);
        if (data) {
          setRates(data.rates);
        } else {
          setError("No se pudieron cargar las tasas de cambio");
        }
      } catch (err) {
        setError("Error al cargar las tasas de cambio");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [base]);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full border border-gray-200">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-black">Tipos de Cambio Actuales</h2>
        
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-black">Base:</label>
          <select
            value={base}
            onChange={(e) => setBase(e.target.value)}
            className="p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-medium text-black bg-white"
            aria-label="Moneda base para tasas de cambio"
          >
            {Object.keys(currencies).map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-600 font-medium" role="status" aria-live="polite">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4"></div>
          <p>Cargando tasas...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 p-4 bg-red-50 border-2 border-red-200 rounded-lg" role="alert">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Object.entries(rates)
              .filter(([code]) => MAJOR_CURRENCIES.includes(code as typeof MAJOR_CURRENCIES[number]))
              .map(([code, rate]) => (
                <div
                  key={code}
                  className="p-5 border-2 border-gray-200 rounded-xl hover:shadow-lg hover:border-orange-300 transition-all duration-200 bg-white flex flex-col items-center text-center"
                  role="article"
                  aria-label={`Tasa de cambio ${code}`}
                >
                  <span className="text-gray-700 text-sm font-semibold mb-2">
                    {currencies[code] || code}
                  </span>
                  <span className="text-2xl font-bold text-black mt-1">
                    {rate.toFixed(4)}
                  </span>
                  <span className="text-xs text-gray-500 mt-2 font-medium">
                    1 {base} = {rate.toFixed(4)} {code}
                  </span>
                </div>
              ))}
          </div>
          <p className="text-xs text-gray-500 mt-6 text-center font-medium">
            Mostrando {Object.entries(rates).filter(([code]) => MAJOR_CURRENCIES.includes(code as typeof MAJOR_CURRENCIES[number])).length} de {Object.keys(rates).length} monedas disponibles. Datos provistos por Frankfurter API.
          </p>
        </>
      )}
    </div>
  );
}