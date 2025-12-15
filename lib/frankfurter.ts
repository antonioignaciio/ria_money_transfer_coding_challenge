import {
  CurrencyList,
  ExchangeRateResponse,
  HistoricalRatesResponse,
} from '@/types';
import { HISTORICAL_DAYS } from './constants';

const BASE_URL = 'https://api.frankfurter.app';

export class FrankfurterAPIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'FrankfurterAPIError';
  }
}

export async function getCurrencies(): Promise<CurrencyList> {
  try {
    const response = await fetch(`${BASE_URL}/currencies`);
    
    if (!response.ok) {
      throw new FrankfurterAPIError(
        'Failed to fetch currencies',
        response.status
      );
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof FrankfurterAPIError) {
      throw error;
    }
    console.error('Error fetching currencies:', error);
    throw new FrankfurterAPIError('Network error while fetching currencies');
  }
}

export async function getConversionRate(
  from: string,
  to: string,
  amount: number = 1
): Promise<number | null> {
  if (from === to) return amount;
  
  if (amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  try {
    const url = `${BASE_URL}/latest?amount=${amount}&from=${from}&to=${to}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new FrankfurterAPIError('Failed to convert currency', response.status);
    }
    
    const data: ExchangeRateResponse = await response.json();
    return data.rates[to] || null;
  } catch (error) {
    if (error instanceof FrankfurterAPIError) {
      throw error;
    }
    console.error('Error converting currency:', error);
    return null;
  }
}

export async function getLatestRatesAll(): Promise<ExchangeRateResponse | null> {
  try {
    const response = await fetch(`${BASE_URL}/latest`);
    
    if (!response.ok) {
      throw new FrankfurterAPIError(
        'Failed to fetch latest exchange rates',
        response.status
      );
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof FrankfurterAPIError) {
      throw error;
    }
    console.error('Error fetching latest rates:', error);
    return null;
  }
}

export async function getLatestRates(
  base: string
): Promise<ExchangeRateResponse | null> {
  try {
    const response = await fetch(`${BASE_URL}/latest?from=${base}`);
    
    if (!response.ok) {
      throw new FrankfurterAPIError(
        'Failed to fetch exchange rates',
        response.status
      );
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof FrankfurterAPIError) {
      throw error;
    }
    console.error('Error fetching latest rates:', error);
    return null;
  }
}

export async function getRatesForDate(
  date: string,
  from: string,
  to?: string
): Promise<ExchangeRateResponse | null> {
  try {
    const toParam = to ? `&to=${to}` : '';
    const url = `${BASE_URL}/${date}?from=${from}${toParam}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new FrankfurterAPIError(
        'Failed to fetch rates for date',
        response.status
      );
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof FrankfurterAPIError) {
      throw error;
    }
    console.error('Error fetching rates for date:', error);
    return null;
  }
}

export async function getHistoricalRates(
  from: string,
  to: string,
  days: number = HISTORICAL_DAYS
): Promise<HistoricalRatesResponse | null> {
  if (from === to) {
    return null;
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const endStr = endDate.toISOString().split('T')[0];
  const startStr = startDate.toISOString().split('T')[0];

  try {
    const url = `${BASE_URL}/${startStr}..${endStr}?from=${from}&to=${to}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new FrankfurterAPIError(
        'Failed to fetch historical rates',
        response.status
      );
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof FrankfurterAPIError) {
      throw error;
    }
    console.error('Error fetching historical rates:', error);
    return null;
  }
}