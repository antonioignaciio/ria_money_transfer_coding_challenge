export interface CurrencyList {
  [code: string]: string;
}

export interface ExchangeRateResponse {
  amount: number;
  base: string;
  date: string;
  rates: {
    [currencyCode: string]: number;
  };
}

export interface HistoricalRatesResponse {
  amount: number;
  base: string;
  start_date: string;
  end_date: string;
  rates: {
    [date: string]: {
      [currencyCode: string]: number;
    };
  };
}

export interface ConverterProps {
  from: string;
  setFrom: React.Dispatch<React.SetStateAction<string>>;
  to: string;
  setTo: React.Dispatch<React.SetStateAction<string>>;
}

export interface HistoricalTrendProps {
  from: string;
  to: string;
}

export type TrendDirection = 'rising' | 'falling';