/**
 * Currency Utilities
 *
 * Helpers for formatting, parsing, and working with currency amounts
 */

export type CurrencyCode =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'JPY'
  | 'CAD'
  | 'AUD'
  | 'CHF'
  | 'CNY'
  | 'INR'
  | 'SGD'
  | 'NZD'
  | 'MXN'
  | 'BRL'
  | 'ZAR'
  | 'KRW'
  | 'SEK'
  | 'NOK'
  | 'DKK'
  | 'PLN'
  | 'THB'
  | 'IDR'
  | 'MYR'
  | 'PHP'
  | 'VND'
  | 'RUB'
  | 'TRY'
  | 'AED'
  | 'SAR'
  | 'HKD'
  | 'TWD';

/**
 * Supported currencies for the banking app
 */
export const SUPPORTED_CURRENCIES: CurrencyCode[] = [
  'USD',
  'EUR',
  'GBP',
  'JPY',
  'CAD',
  'AUD',
  'CHF',
  'CNY',
  'INR',
  'SGD',
  'NZD',
  'MXN',
  'BRL',
  'ZAR',
  'KRW',
  'SEK',
  'NOK',
  'DKK',
  'PLN',
  'THB',
  'IDR',
  'MYR',
  'PHP',
  'VND',
  'RUB',
  'TRY',
  'AED',
  'SAR',
  'HKD',
  'TWD',
];

/**
 * Currency symbols mapping
 */
const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
  CHF: 'CHF',
  CNY: '¥',
  INR: '₹',
  SGD: 'S$',
  NZD: 'NZ$',
  MXN: '$',
  BRL: 'R$',
  ZAR: 'R',
  KRW: '₩',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  PLN: 'zł',
  THB: '฿',
  IDR: 'Rp',
  MYR: 'RM',
  PHP: '₱',
  VND: '₫',
  RUB: '₽',
  TRY: '₺',
  AED: 'د.إ',
  SAR: '﷼',
  HKD: 'HK$',
  TWD: 'NT$',
};

/**
 * Default locale for formatting
 */
const DEFAULT_LOCALE = 'en-US';

/**
 * Format an amount as a currency string
 *
 * @param amount - The numeric amount to format
 * @param currency - The currency code (e.g., 'USD', 'EUR')
 * @param locale - Optional locale string (defaults to 'en-US')
 * @returns Formatted currency string
 *
 * @example
 * formatAmount(1234.56, 'USD') // '$1,234.56'
 * formatAmount(1234.56, 'EUR', 'de-DE') // '1.234,56 €'
 */
export function formatAmount(
  amount: number,
  currency: string,
  locale: string = DEFAULT_LOCALE
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback if currency is not supported by Intl
    const symbol = getCurrencySymbol(currency);
    const formattedNumber = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    return `${symbol}${formattedNumber}`;
  }
}

/**
 * Parse a currency string back to a number
 *
 * @param input - The string to parse (e.g., '$1,234.56' or '1234.56')
 * @returns The parsed number or null if invalid
 *
 * @example
 * parseAmount('$1,234.56') // 1234.56
 * parseAmount('1.234,56') // 1234.56 (European format)
 * parseAmount('invalid') // null
 */
export function parseAmount(input: string): number | null {
  if (!input || typeof input !== 'string') {
    return null;
  }

  // Remove currency symbols and whitespace
  const cleaned = input
    .replace(/[\s$€£¥₹₩₽₺฿₱₫RpRMCHFA$NZ$]/g, '')
    .trim();

  if (!cleaned) {
    return null;
  }

  // Handle European format (1.234,56)
  const hasCommaDecimal = cleaned.includes(',') && !cleaned.includes('.');
  const hasDotDecimal = cleaned.includes('.') && !cleaned.includes(',');
  const hasBoth = cleaned.includes(',') && cleaned.includes('.');

  let normalized: string;

  if (hasCommaDecimal) {
    // European format: 1.234,56 -> 1234.56
    normalized = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (hasDotDecimal || !hasBoth) {
    // US format: 1,234.56 -> 1234.56
    normalized = cleaned.replace(/,/g, '');
  } else {
    // Both present - determine which is decimal separator
    const lastComma = cleaned.lastIndexOf(',');
    const lastDot = cleaned.lastIndexOf('.');

    if (lastComma > lastDot) {
      // European: 1.234,56
      normalized = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      // US: 1,234.56
      normalized = cleaned.replace(/,/g, '');
    }
  }

  const parsed = parseFloat(normalized);

  if (isNaN(parsed) || !isFinite(parsed)) {
    return null;
  }

  // Validate reasonable range for banking amounts
  if (parsed < 0 || parsed > 999999999999.99) {
    return null;
  }

  return parsed;
}

/**
 * Get the symbol for a currency code
 *
 * @param currency - The currency code
 * @returns The currency symbol or the code itself if not found
 *
 * @example
 * getCurrencySymbol('USD') // '$'
 * getCurrencySymbol('EUR') // '€'
 * getCurrencySymbol('XXX') // 'XXX'
 */
export function getCurrencySymbol(currency: string): string {
  const upperCode = currency.toUpperCase() as CurrencyCode;
  return CURRENCY_SYMBOLS[upperCode] || upperCode;
}

/**
 * Check if a currency code is supported
 *
 * @param currency - The currency code to check
 * @returns True if the currency is supported
 */
export function isSupportedCurrency(currency: string): boolean {
  return SUPPORTED_CURRENCIES.includes(currency.toUpperCase() as CurrencyCode);
}

/**
 * Get currency display name
 *
 * @param currency - The currency code
 * @param locale - Optional locale for the display name
 * @returns The localized currency name
 */
export function getCurrencyName(
  currency: string,
  locale: string = DEFAULT_LOCALE
): string {
  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency.toUpperCase(),
    });
    const parts = formatter.formatToParts(0);
    const currencyPart = parts.find((part) => part.type === 'currency');
    return currencyPart?.value || currency.toUpperCase();
  } catch {
    return currency.toUpperCase();
  }
}
