export function isValidAmount(value: string): boolean {
  const numValue = parseFloat(value);
  return !isNaN(numValue) && numValue >= 0 && isFinite(numValue);
}

export function formatCurrency(
  amount: number,
  currencyCode: string,
  decimals: number = 2
): string {
  return `${amount.toFixed(decimals)} ${currencyCode}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function calculateTrend(
  firstRate: number,
  lastRate: number
): 'rising' | 'falling' {
  return lastRate > firstRate ? 'rising' : 'falling';
}

