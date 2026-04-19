export const SUPPORTED_CURRENCIES = ["CNY", "USD", "HKD", "EUR", "GBP"] as const

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number]

export const RENEWAL_CYCLES = {
  "1m": { label: "1个月", amount: 1, unit: "month" },
  "3m": { label: "3个月", amount: 3, unit: "month" },
  "6m": { label: "6个月", amount: 6, unit: "month" },
  "1y": { label: "1年", amount: 1, unit: "year" },
  "2y": { label: "2年", amount: 2, unit: "year" },
  "3y": { label: "3年", amount: 3, unit: "year" },
} as const

export type RenewalCycle = keyof typeof RENEWAL_CYCLES

export const RENEWAL_CYCLE_OPTIONS = Object.entries(RENEWAL_CYCLES).map(([value, config]) => ({
  value: value as RenewalCycle,
  label: config.label,
})) as {
  value: RenewalCycle
  label: string
}[]

export const CURRENCY_LABELS: Record<SupportedCurrency, string> = {
  CNY: "人民币",
  USD: "美元",
  HKD: "港币",
  EUR: "欧元",
  GBP: "英镑",
}

export const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  CNY: "¥",
  USD: "$",
  HKD: "HK$",
  EUR: "€",
  GBP: "£",
}

export const DEFAULT_VALUES = {
  renewalCurrency: "USD" as SupportedCurrency,
  exchangeRate: 7.2,
  renewalAmount: 100,
  transactionAmount: 500,
  renewalCycle: "1y" as RenewalCycle,
}
