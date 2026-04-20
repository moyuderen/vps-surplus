import type { SupportedCurrency } from "@/lib/vps/constants"

type FrankfurterResponse = {
  rates: Record<string, number>
}

export function getExchangeRateUrl(currency: SupportedCurrency): string | null {
  if (currency === "CNY") return null
  return `https://www.xe.com/currencyconverter/convert/?Amount=1&From=${currency}&To=CNY`
}

export async function fetchExchangeRateToCNY(currency: SupportedCurrency): Promise<number> {
  const response = await fetch(
    `https://api.frankfurter.dev/v1/latest?from=${currency}&to=CNY`,
  )

  if (!response.ok) {
    throw new Error(`汇率查询失败（HTTP ${response.status}）`)
  }

  const data: FrankfurterResponse = await response.json()
  const rate = data.rates?.CNY

  if (typeof rate !== "number" || rate <= 0) {
    throw new Error("汇率数据异常")
  }

  return rate
}
