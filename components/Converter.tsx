"use client";

import { useState, useEffect, useRef } from "react";
import { getConversionRate } from "@/lib/frankfurter";
import { ConverterProps } from "@/types";
import { useCurrencies } from "@/hooks/useCurrencies";
import { isValidAmount, formatCurrency } from "@/lib/utils";
import { DEFAULT_AMOUNT } from "@/lib/constants";

export default function Converter({
  from,
  setFrom,
  to,
  setTo,
}: ConverterProps) {
  const { currencies, loading: currenciesLoading } = useCurrencies();
  const [amount, setAmount] = useState<number>(DEFAULT_AMOUNT);
  const [amountInput, setAmountInput] = useState<string>(String(DEFAULT_AMOUNT));
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (from === to && amount > 0) {
      setError("Por favor selecciona monedas diferentes para convertir.");
      setResult(null);
      return;
    }
    setError("");
  }, [from, to]);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (from === to || amount <= 0 || currenciesLoading || Object.keys(currencies).length === 0) {
      setResult(null);
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      setLoading(true);
      setError("");
      setResult(null);

      try {
        const convertedValue = await getConversionRate(from, to, amount);

        if (convertedValue === null) {
          setError("Error al realizar la conversión. Por favor intenta nuevamente.");
        } else {
          setResult(convertedValue);
        }
      } catch (err) {
        setError("Error al realizar la conversión. Por favor intenta nuevamente.");
        console.error("Conversion error:", err);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [from, to, amount, currenciesLoading, currencies]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();

    if (value === "" || value === "0") {
      setAmountInput(value);
      setAmount(0);
      setError("");
      setResult(null);
      return;
    }

    if (isValidAmount(value)) {
      const numValue = parseFloat(value);
      setAmountInput(value);
      setAmount(numValue);
      setError("");
    }
  };

  const handleAmountBlur = () => {
    if (amountInput === "" || amountInput === "0" || amount <= 0) {
      setAmountInput(String(DEFAULT_AMOUNT));
      setAmount(DEFAULT_AMOUNT);
    }
  };

  const handleConvert = async () => {
    if (from === to) {
      setError("Por favor selecciona monedas diferentes para convertir.");
      return;
    }

    if (amount <= 0) {
      setError("Por favor ingresa un monto mayor a 0.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const convertedValue = await getConversionRate(from, to, amount);

      if (convertedValue === null) {
        setError("Error al realizar la conversión. Por favor intenta nuevamente.");
      } else {
        setResult(convertedValue);
      }
    } catch (err) {
      setError("Error al realizar la conversión. Por favor intenta nuevamente.");
      console.error("Conversion error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-auto border border-gray-200 relative z-10">
      <h2 className="text-3xl font-bold mb-6 text-black">Conversor de Divisas</h2>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-black mb-2">Monto</label>
          <input
            type="text"
            inputMode="decimal"
            value={amountInput}
            onChange={handleAmountChange}
            onBlur={handleAmountBlur}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black bg-white"
            placeholder="0"
            aria-label="Monto a convertir"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-black mb-2">De</label>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black bg-white"
              disabled={currenciesLoading}
              aria-label="Moneda de origen"
            >
              {Object.entries(currencies).map(([code, name]) => (
                <option key={code} value={code}>
                  {code} - {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">A</label>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black bg-white"
              disabled={currenciesLoading}
              aria-label="Moneda de destino"
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
          onClick={handleConvert}
          disabled={loading || from === to || amount <= 0}
          className="w-full bg-orange-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-orange-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Convertir moneda"
        >
          {loading ? "Convirtiendo..." : "Convertir"}
        </button>

        {error && (
          <div className="mt-2 p-3 bg-red-50 border-2 border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-medium" role="alert">{error}</p>
          </div>
        )}
        
        {loading && !error && (
          <div className="mt-6 p-5 bg-gray-50 rounded-xl text-center border-2 border-gray-200">
            <p className="text-sm text-gray-600 font-medium">Calculando conversión...</p>
          </div>
        )}
        
        {result !== null && !loading && (
          <div className="mt-6 p-5 bg-orange-50 rounded-xl text-center border-2 border-orange-200">
            <p className="text-sm text-gray-700 font-medium mb-2">Resultado:</p>
            <p className="text-4xl font-bold text-orange-600" aria-live="polite">
              {formatCurrency(result, to)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {formatCurrency(amount, from)} = {formatCurrency(result, to)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}