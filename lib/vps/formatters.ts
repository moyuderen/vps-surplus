import type { SupportedCurrency } from "@/lib/vps/constants"

const currencyFormatters = new Map<SupportedCurrency, Intl.NumberFormat>()
const numberFormatters = new Map<number, Intl.NumberFormat>()

function getCurrencyFormatter(currency: SupportedCurrency) {
  const existingFormatter = currencyFormatters.get(currency)

  if (existingFormatter) {
    return existingFormatter
  }

  const formatter = new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  currencyFormatters.set(currency, formatter)
  return formatter
}

function getNumberFormatter(maximumFractionDigits: number) {
  const existingFormatter = numberFormatters.get(maximumFractionDigits)

  if (existingFormatter) {
    return existingFormatter
  }

  const formatter = new Intl.NumberFormat("zh-CN", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  })

  numberFormatters.set(maximumFractionDigits, formatter)
  return formatter
}

export function formatCurrency(value: number, currency: SupportedCurrency) {
  return getCurrencyFormatter(currency).format(value)
}

export function formatNumber(value: number, maximumFractionDigits = 2) {
  return getNumberFormatter(maximumFractionDigits).format(value)
}
