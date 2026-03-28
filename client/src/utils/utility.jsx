
export const CURRENCY_RATES = { USD: 1, EUR: 0.92, GBP: 0.80 }

export const formatMoney = (value, currency) =>
  Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(value)

export const convertCurrency = (amount, source, target) => {
  if (!CURRENCY_RATES[source] || !CURRENCY_RATES[target]) return null
  return (amount / CURRENCY_RATES[source]) * CURRENCY_RATES[target]
}