import { useState, useEffect } from 'react';
import { getCurrencies } from '@/lib/frankfurter';
import { CurrencyList } from '@/types';

export function useCurrencies() {
  const [currencies, setCurrencies] = useState<CurrencyList>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCurrencies();
        setCurrencies(data);
      } catch (err) {
        setError('Error al cargar las monedas disponibles');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  return { currencies, loading, error };
}

