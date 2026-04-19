import { Minus, TrendingDown, TrendingUp } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { VpsCalculationResult } from "@/lib/vps/calculator"
import type { SupportedCurrency } from "@/lib/vps/constants"
import { CURRENCY_LABELS } from "@/lib/vps/constants"
import { formatCurrency, formatNumber } from "@/lib/vps/formatters"

type VpsResultPanelProps = {
  result: VpsCalculationResult | null
  renewalCurrency: SupportedCurrency
}

const metricBaseClassName = "flex flex-col gap-2 rounded-none border border-border px-3 py-3"

export function VpsResultPanel({ result, renewalCurrency }: VpsResultPanelProps) {
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
    <Card className="h-full">
      <CardHeader>
        <CardTitle>计算结果</CardTitle>
        <CardDescription>
          以到期日期为本周期结束日，按所选自然周期向前回推起始日估算剩余价值。
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          <div className={metricBaseClassName}>
            <div className="text-muted-foreground">剩余天数</div>
            <div className="text-2xl font-medium">{result ? formatNumber(result.remainingDays, 0) : "--"}</div>
          </div>
          <div className={metricBaseClassName}>
            <div className="text-muted-foreground">剩余价值</div>
            <div className="text-2xl font-medium text-foreground">
              {result ? formatCurrency(result.remainingValueInCny, "CNY") : `${CURRENCY_LABELS[renewalCurrency]} / 人民币`}
            </div>
            <div className="text-sm text-muted-foreground">
              {result ? formatCurrency(result.remainingValueInRenewalCurrency, renewalCurrency) : "--"}
            </div>
          </div>
          <div
            className={cn(
              metricBaseClassName,
              premiumState === "premium" && "border-destructive/30 bg-destructive/5",
              premiumState === "discount" && "border-tertiary/30 bg-tertiary-fixed/15",
              premiumState === "flat" && "border-secondary bg-secondary/30",
            )}
          >
            <div className="flex justify-start">
              <Badge variant={premiumVariant}>
                {premiumState !== "pending" && <PremiumIcon data-icon="inline-start" />}
                {premiumLabel}
              </Badge>
            </div>
            <div
              className={cn(
                "text-2xl font-medium",
                premiumState === "premium" && "text-destructive",
                premiumState === "discount" && "text-on-tertiary-container",
                premiumState === "flat" && "text-secondary-foreground",
              )}
            >
              {result ? formatCurrency(result.premiumAmountInCny, "CNY") : "--"}
            </div>
            <div
              className={cn(
                "text-sm",
                premiumState === "premium" && "text-destructive/80",
                premiumState === "discount" && "text-on-tertiary-container/80",
                premiumState === "flat" && "text-secondary-foreground/80",
                premiumState === "pending" && "text-muted-foreground",
              )}
            >
              {result
                ? formatCurrency(result.premiumAmountInRenewalCurrency, renewalCurrency)
                : "--"}
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid gap-3 md:grid-cols-1">
          <div className="flex items-center gap-2 rounded-none border border-border px-3 py-3 text-muted-foreground">
            <TrendingDown className="size-4" />
            <div className="flex flex-col gap-1">
              <span>周期区间</span>
              <span className="text-foreground">
                {result ? `${result.cycleStartDate} 至 ${result.cycleEndDate}` : "--"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
