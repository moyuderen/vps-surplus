import { addDays, differenceInCalendarDays, format, subMonths, subYears } from "date-fns"

import { RENEWAL_CYCLES, type RenewalCycle, type SupportedCurrency } from "@/lib/vps/constants"
import { DATE_FORMAT, parseDateOnly } from "@/lib/vps/date"

export type VpsCalculationInput = {
  renewalCurrency: SupportedCurrency
  exchangeRate: number
  expiryDate: string
  tradeDate: string
  renewalAmount: number
  transactionAmount: number
  renewalCycle: RenewalCycle
}

export type VpsCalculationResult = {
  remainingDays: number
  cycleTotalDays: number
  cycleStartDate: string
  cycleEndDate: string
  remainingValueInRenewalCurrency: number
  remainingValueInCny: number
  premiumAmountInRenewalCurrency: number
  premiumAmountInCny: number
}

function subtractCycle(expiryDate: Date, renewalCycle: RenewalCycle) {
  const cycle = RENEWAL_CYCLES[renewalCycle]

  return cycle.unit === "month"
    ? subMonths(expiryDate, cycle.amount)
    : subYears(expiryDate, cycle.amount)
}

export function getDefaultTradeDate() {
  return format(new Date(), DATE_FORMAT)
}

export function getDefaultExpiryDate() {
  return format(addDays(new Date(), 1), DATE_FORMAT)
}

export function calculateVpsSurplus(input: VpsCalculationInput): VpsCalculationResult {
  const expiryDate = parseDateOnly(input.expiryDate)
  const tradeDate = parseDateOnly(input.tradeDate)

  if (!expiryDate || !tradeDate) {
    throw new Error("日期格式无效")
  }

  const cycleStartDate = subtractCycle(expiryDate, input.renewalCycle)
  const cycleTotalDays = differenceInCalendarDays(expiryDate, cycleStartDate)
  const remainingDays = differenceInCalendarDays(expiryDate, tradeDate)

  if (remainingDays < 0) {
    throw new Error("交易日期不能晚于到期日期")
  }

  if (cycleTotalDays <= 0) {
    throw new Error("续费周期计算无效")
  }

  const remainingRatio = remainingDays / cycleTotalDays
  const remainingValueInRenewalCurrency = input.renewalAmount * remainingRatio
  const effectiveRate = input.renewalCurrency === "CNY" ? 1 : input.exchangeRate
  const remainingValueInCny = remainingValueInRenewalCurrency * effectiveRate
  const premiumAmountInCny = input.transactionAmount - remainingValueInCny
  const premiumAmountInRenewalCurrency = premiumAmountInCny / effectiveRate

  return {
    remainingDays,
    cycleTotalDays,
    cycleStartDate: format(cycleStartDate, DATE_FORMAT),
    cycleEndDate: format(expiryDate, DATE_FORMAT),
    remainingValueInRenewalCurrency,
    remainingValueInCny,
    premiumAmountInRenewalCurrency,
    premiumAmountInCny,
  }
}
