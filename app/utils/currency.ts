/**
 * Currency Conversion Utilities
 * Converts prices from RUB to supported PayPal currencies
 */

// Exchange rates (update these periodically or use an API)
// 1 USD = 80.51 RUB — ადმინთან ghrs-admin/src/lib/coursePriceConvert.ts უნდა ემთხვეოდეს
export const EXCHANGE_RATES = {
  RUB_TO_USD: 1 / 80.51, // 1 RUB → USD (1 USD = 80.51 ₽)
  RUB_TO_EUR: 0.010,  // 1 RUB ≈ 0.010 EUR
  RUB_TO_GBP: 0.009,  // 1 RUB ≈ 0.009 GBP
  RUB_TO_GEL: 0.029,  // 1 RUB ≈ 0.029 GEL
};

/**
 * Convert RUB to USD
 * @param amountInRUB - Amount in Russian Rubles
 * @returns Amount in US Dollars (rounded to 2 decimal places)
 */
export function convertRUBtoUSD(amountInRUB: number): number {
  const amountInUSD = amountInRUB * EXCHANGE_RATES.RUB_TO_USD;
  return Math.round(amountInUSD * 100) / 100; // Round to 2 decimal places
}

/**
 * Convert RUB to EUR
 * @param amountInRUB - Amount in Russian Rubles
 * @returns Amount in Euros (rounded to 2 decimal places)
 */
export function convertRUBtoEUR(amountInRUB: number): number {
  const amountInEUR = amountInRUB * EXCHANGE_RATES.RUB_TO_EUR;
  return Math.round(amountInEUR * 100) / 100;
}

/**
 * Convert RUB to GBP
 * @param amountInRUB - Amount in Russian Rubles
 * @returns Amount in British Pounds (rounded to 2 decimal places)
 */
export function convertRUBtoGBP(amountInRUB: number): number {
  const amountInGBP = amountInRUB * EXCHANGE_RATES.RUB_TO_GBP;
  return Math.round(amountInGBP * 100) / 100;
}

/**
 * Convert RUB to GEL
 * @param amountInRUB - Amount in Russian Rubles
 * @returns Amount in Georgian Lari (rounded to 2 decimal places)
 */
export function convertRUBtoGEL(amountInRUB: number): number {
  const amountInGEL = amountInRUB * EXCHANGE_RATES.RUB_TO_GEL;
  return Math.round(amountInGEL * 100) / 100;
}

/**
 * Convert RUB to any supported currency
 * @param amountInRUB - Amount in Russian Rubles
 * @param targetCurrency - Target currency code (USD, EUR, GBP, GEL)
 * @returns Amount in target currency
 */
export function convertRUB(
  amountInRUB: number,
  targetCurrency: 'USD' | 'EUR' | 'GBP' | 'GEL' = 'USD'
): number {
  switch (targetCurrency) {
    case 'USD':
      return convertRUBtoUSD(amountInRUB);
    case 'EUR':
      return convertRUBtoEUR(amountInRUB);
    case 'GBP':
      return convertRUBtoGBP(amountInRUB);
    case 'GEL':
      return convertRUBtoGEL(amountInRUB);
    default:
      return convertRUBtoUSD(amountInRUB);
  }
}

/**
 * Format currency for display
 * @param amount - Amount to format
 * @param currency - Currency code
 * @returns Formatted string (e.g., "$66.00", "€60.00")
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const symbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    GEL: '₾',
    RUB: '₽',
  };

  const symbol = symbols[currency] || currency;
  const formattedAmount = amount.toFixed(2);
  
  return `${symbol}${formattedAmount}`;
}

/**
 * Format price showing both RUB and converted currency
 * @param amountInRUB - Original amount in RUB
 * @param targetCurrency - Target currency for conversion
 * @returns Formatted string (e.g., "6,000 ₽ (≈ $66.00)")
 */
export function formatPriceWithConversion(
  amountInRUB: number,
  targetCurrency: 'USD' | 'EUR' | 'GBP' | 'GEL' = 'USD'
): string {
  const convertedAmount = convertRUB(amountInRUB, targetCurrency);
  const rubFormatted = amountInRUB.toLocaleString('ru-RU');
  const convertedFormatted = formatCurrency(convertedAmount, targetCurrency);
  
  return `${rubFormatted} ₽ (≈ ${convertedFormatted})`;
}

/**
 * Format price based on locale WITHOUT conversion text
 * @param amountInRUB - Original amount in RUB
 * @param locale - Current locale (ka, ru, en)
 * @returns Formatted string based on locale
 */
export function formatPriceByLocale(
  amountInRUB: number,
  locale: 'ka' | 'ru' | 'en' = 'ru'
): string {
  switch (locale) {
    case 'ru':
      // Russian: Show in Rubles (but payment will be in USD)
      return `${amountInRUB.toLocaleString('ru-RU')} ₽`;
    case 'en':
      // English: Show in Dollars
      const usdAmount = convertRUBtoUSD(amountInRUB);
      return `$${usdAmount.toFixed(2)}`;
    case 'ka':
      // Georgian: Show in Lari
      const gelAmount = convertRUBtoGEL(amountInRUB);
      return `${gelAmount.toFixed(2)} ₾`;
    default:
      return `${amountInRUB.toLocaleString('ru-RU')} ₽`;
  }
}

/**
 * Get exchange rate for a currency pair
 * @param from - Source currency
 * @param to - Target currency
 * @returns Exchange rate
 */
export function getExchangeRate(from: string, to: string): number {
  if (from === 'RUB') {
    switch (to) {
      case 'USD': return EXCHANGE_RATES.RUB_TO_USD;
      case 'EUR': return EXCHANGE_RATES.RUB_TO_EUR;
      case 'GBP': return EXCHANGE_RATES.RUB_TO_GBP;
      case 'GEL': return EXCHANGE_RATES.RUB_TO_GEL;
      default: return 1;
    }
  }
  return 1;
}

// Example usage:
// const priceInRUB = 6000;
// const priceInUSD = convertRUBtoUSD(priceInRUB); // 66.00
// const formatted = formatPriceWithConversion(priceInRUB, 'USD'); // "6,000 ₽ (≈ $66.00)"
