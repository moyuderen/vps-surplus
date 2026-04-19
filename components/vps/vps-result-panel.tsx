import type { Ref } from "react"
import { intervalToDuration } from "date-fns"
import {
  ArrowLeftRight,
  BadgeDollarSign,
  CalendarClock,
  CalendarSync,
  Copy,
  Download,
  Eye,
  FileText,
  HandCoins,
  Minus,
  Timer,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { VpsCalculationInput, VpsCalculationResult } from "@/lib/vps/calculator"
import type { SupportedCurrency } from "@/lib/vps/constants"
import { CURRENCY_LABELS, RENEWAL_CYCLES } from "@/lib/vps/constants"
import { parseDateOnly } from "@/lib/vps/date"
import { formatCurrency, formatNumber } from "@/lib/vps/formatters"

type VpsResultPanelProps = {
  result: VpsCalculationResult | null
  input: VpsCalculationInput | null
  renewalCurrency: SupportedCurrency
  captureRef?: Ref<HTMLDivElement>
  onPreviewImage?: () => void
  onDownloadImage?: () => void
  onCopyImage?: () => void
  onCopyMarkdown?: () => void
  isDownloadingImage?: boolean
  isCopyingImage?: boolean
  isCopyingMarkdown?: boolean
}

const detailItemClassName = "flex flex-col gap-1 rounded-none border border-border px-3 py-2.5"
const compactPairClassName = "grid gap-3 sm:grid-cols-2"
const sectionClassName = "flex flex-col gap-3"
const detailLabelClassName = "flex items-center gap-1.5 text-xs/relaxed text-muted-foreground [&_svg]:shrink-0 [&_svg]:text-muted-foreground/80 [&_svg:not([class*='size-'])]:size-3"
const valueClassName = "text-sm font-medium text-foreground sm:text-base"
const moneyValueGroupClassName = "flex flex-wrap items-baseline gap-x-2 gap-y-1"
const primaryMoneyClassName = "text-sm font-medium text-foreground sm:text-base"
const secondaryMoneyClassName = "text-xs text-muted-foreground"
const remainingValuePrimaryMoneyClassName = "text-sm font-medium text-sky-700 sm:text-base dark:text-sky-300"
const remainingValueSecondaryMoneyClassName = "text-xs text-sky-700/75 dark:text-sky-300/75"
const transactionPrimaryMoneyClassName = "text-sm font-medium text-amber-600 sm:text-base dark:text-amber-400"
const transactionSecondaryMoneyClassName = "text-xs text-amber-700/80 dark:text-amber-300/80"
const actionButtonClassName = "flex-1 [&_svg:not([class*='size-'])]:size-3.5"

function formatRemainingDaysBreakdown(startDateValue: string, endDateValue: string) {
  const startDate = parseDateOnly(startDateValue)
  const endDate = parseDateOnly(endDateValue)

  if (!startDate || !endDate) {
    return "--"
  }

  const duration = intervalToDuration({ start: startDate, end: endDate })
  const years = duration.years ?? 0
  const months = duration.months ?? 0
  const days = duration.days ?? 0

  if (years < 1) {
    if (months < 1) {
      return `${days}天`
    }

    return [months > 0 ? `${months}个月` : null, days > 0 ? `${days}天` : null].filter(Boolean).join(" ")
  }

  return [years > 0 ? `${years}年` : null, months > 0 ? `${months}个月` : null, days > 0 ? `${days}天` : null]
    .filter(Boolean)
    .join(" ")
}

export function VpsResultPanel({
  result,
  input,
  renewalCurrency,
  captureRef,
  onPreviewImage,
  onDownloadImage,
  onCopyImage,
  onCopyMarkdown,
  isDownloadingImage = false,
  isCopyingImage = false,
  isCopyingMarkdown = false,
}: VpsResultPanelProps) {
  const effectiveExchangeRate = input ? (input.renewalCurrency === "CNY" ? 1 : input.exchangeRate) : null
  const renewalCycleLabel = input ? RENEWAL_CYCLES[input.renewalCycle].label : "--"
  const renewalAmountInCnyLabel = input && effectiveExchangeRate ? formatCurrency(input.renewalAmount * effectiveExchangeRate, "CNY") : `${CURRENCY_LABELS[renewalCurrency]} / 人民币`
  const renewalAmountInRenewalCurrencyLabel = input ? formatCurrency(input.renewalAmount, input.renewalCurrency) : "--"
  const remainingDaysLabel = result ? formatNumber(result.remainingDays, 0) : "--"
  const remainingDaysBreakdownLabel = input ? formatRemainingDaysBreakdown(input.tradeDate, input.expiryDate) : "--"
  const remainingValueInCnyLabel = result ? formatCurrency(result.remainingValueInCny, "CNY") : `${CURRENCY_LABELS[renewalCurrency]} / 人民币`
  const remainingValueInRenewalCurrencyLabel = result ? formatCurrency(result.remainingValueInRenewalCurrency, renewalCurrency) : "--"
  const exchangeRateLabel = input ? formatNumber(input.renewalCurrency === "CNY" ? 1 : input.exchangeRate, 6) : "--"
  const transactionAmountInCnyLabel = input ? formatCurrency(input.transactionAmount, "CNY") : "--"
  const transactionAmountInRenewalCurrencyLabel = input && effectiveExchangeRate ? formatCurrency(input.transactionAmount / effectiveExchangeRate, renewalCurrency) : "--"
  const premiumAmountInCnyLabel = result ? formatCurrency(result.premiumAmountInCny, "CNY") : "--"
  const premiumAmountInRenewalCurrencyLabel = result ? formatCurrency(result.premiumAmountInRenewalCurrency, renewalCurrency) : "--"
  const premiumState = !result
    ? "pending"
    : result.premiumAmountInCny > 0
      ? "premium"
      : result.premiumAmountInCny < 0
        ? "discount"
        : "flat"

  const premiumVariant =
    premiumState === "premium"
      ? "destructive"
      : premiumState === "discount"
        ? "tertiary"
        : premiumState === "flat"
          ? "secondary"
          : "outline"

  const premiumLabel =
    premiumState === "premium" ? "溢价" : premiumState === "discount" ? "折价" : premiumState === "flat" ? "原价" : "待计算"

  const PremiumIcon =
    premiumState === "premium" ? TrendingUp : premiumState === "discount" ? TrendingDown : Minus

  return (
    <div className="flex flex-col gap-3">
      <div ref={captureRef}>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>计算结果</CardTitle>
            <CardDescription>
              以到期日为周期结束日，按所选自然周期回推起始日估算剩余价值。
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className={sectionClassName}>
              <div className={compactPairClassName}>
                <div className={detailItemClassName}>
                  <span className={detailLabelClassName}>
                    <CalendarClock />
                    到期日期
                  </span>
                  <span className={valueClassName}>{input ? input.expiryDate : "--"}</span>
                </div>
                <div className={detailItemClassName}>
                  <span className={detailLabelClassName}>
                    <CalendarSync />
                    续费周期
                  </span>
                  <span className={valueClassName}>{renewalCycleLabel}</span>
                </div>
              </div>
              <div className={compactPairClassName}>
                <div className={detailItemClassName}>
                  <span className={detailLabelClassName}>
                    <HandCoins />
                    续费金额
                  </span>
                  <div className={moneyValueGroupClassName}>
                    <span className={primaryMoneyClassName}>{renewalAmountInCnyLabel}</span>
                    <span className={secondaryMoneyClassName}>{renewalAmountInRenewalCurrencyLabel}</span>
                  </div>
                </div>
                <div className={detailItemClassName}>
                  <span className={detailLabelClassName}>
                    <Timer />
                    剩余天数
                  </span>
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-sm font-medium text-foreground sm:text-base">{remainingDaysLabel}</span>
                    <span className={secondaryMoneyClassName}>{remainingDaysBreakdownLabel}</span>
                  </div>
                </div>
              </div>
              <div className={compactPairClassName}>
                <div className={detailItemClassName}>
                  <span className={detailLabelClassName}>
                    <Wallet />
                    剩余价值
                  </span>
                  <div className={moneyValueGroupClassName}>
                    <span className={remainingValuePrimaryMoneyClassName}>{remainingValueInCnyLabel}</span>
                    <span className={remainingValueSecondaryMoneyClassName}>{remainingValueInRenewalCurrencyLabel}</span>
                  </div>
                </div>
                <div className={detailItemClassName}>
                  <span className={detailLabelClassName}>
                    <ArrowLeftRight />
                    汇率
                  </span>
                  <span className={valueClassName}>{exchangeRateLabel}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className={sectionClassName}>
              <div className={detailItemClassName}>
                <span className={detailLabelClassName}>
                  <BadgeDollarSign />
                  交易金额
                </span>
                <div className={moneyValueGroupClassName}>
                  <span className={transactionPrimaryMoneyClassName}>{transactionAmountInCnyLabel}</span>
                  <span className={transactionSecondaryMoneyClassName}>{transactionAmountInRenewalCurrencyLabel}</span>
                </div>
              </div>
              <div
                className={cn(
                  detailItemClassName,
                  premiumState === "premium" && "border-destructive/30 bg-destructive/5",
                  premiumState === "discount" && "border-emerald-500/30 bg-emerald-500/8 dark:border-emerald-400/30 dark:bg-emerald-400/12",
                  premiumState === "flat" && "border-secondary bg-secondary/30",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={detailLabelClassName}>
                    <PremiumIcon />
                    折价 / 溢价
                  </span>
                  <Badge
                    variant={premiumVariant}
                    className={cn(
                      premiumState === "discount" && "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/15 dark:text-emerald-300",
                    )}
                  >
                    {premiumState !== "pending" && <PremiumIcon data-icon="inline-start" />}
                    {premiumLabel}
                  </Badge>
                </div>
                <div className={moneyValueGroupClassName}>
                  <span
                    className={cn(
                      "text-base font-medium sm:text-lg",
                      premiumState === "premium" && "text-destructive",
                      premiumState === "discount" && "text-emerald-700 dark:text-emerald-300",
                      premiumState === "flat" && "text-secondary-foreground",
                    )}
                  >
                    {premiumAmountInCnyLabel}
                  </span>
                  <span
                    className={cn(
                      secondaryMoneyClassName,
                      premiumState === "premium" && "text-destructive/80",
                      premiumState === "discount" && "text-emerald-700/80 dark:text-emerald-300/80",
                      premiumState === "flat" && "text-secondary-foreground/70",
                      premiumState === "pending" && "text-muted-foreground",
                    )}
                  >
                    {premiumAmountInRenewalCurrencyLabel}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {result ? (
        <div className="rounded-none border border-border px-3 py-3 sm:px-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Button type="button" className={actionButtonClassName} onClick={onPreviewImage}>
              <Eye data-icon="inline-start" />
              预览图片
            </Button>
            <Button type="button" className={actionButtonClassName} onClick={onDownloadImage} disabled={isDownloadingImage}>
              <Download data-icon="inline-start" />
              {isDownloadingImage ? "下载中..." : "下载图片"}
            </Button>
            <Button type="button" className={actionButtonClassName} onClick={onCopyImage} disabled={isCopyingImage}>
              <Copy data-icon="inline-start" />
              {isCopyingImage ? "复制中..." : "复制图片"}
            </Button>
            <Button type="button" className={actionButtonClassName} onClick={onCopyMarkdown} disabled={isCopyingMarkdown}>
              <FileText data-icon="inline-start" />
              {isCopyingMarkdown ? "复制中..." : "复制为 MD"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
