import { z } from "zod"

import { RENEWAL_CYCLES, SUPPORTED_CURRENCIES, type RenewalCycle, type SupportedCurrency } from "@/lib/vps/constants"
import { isValidDateString } from "@/lib/vps/date"

export const vpsFormSchema = z.object({
  renewalCurrency: z.enum(SUPPORTED_CURRENCIES),
  exchangeRate: z.number().positive("汇率必须大于 0"),
  expiryDate: z.string().min(1, "请选择到期日期"),
  tradeDate: z.string().min(1, "请选择交易日期"),
  renewalAmount: z.number().positive("续费金额必须大于 0"),
  transactionAmount: z.number().nonnegative("交易金额不能为负数"),
  renewalCycle: z.enum(Object.keys(RENEWAL_CYCLES) as [RenewalCycle, ...RenewalCycle[]]),
}).superRefine((value, ctx) => {
  if (value.renewalCurrency === "CNY" && value.exchangeRate !== 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["exchangeRate"],
      message: "人民币续费时汇率固定为 1",
    })
  }

  if (!isValidDateString(value.expiryDate)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["expiryDate"],
      message: "日期格式必须为 YYYY-MM-DD",
    })
  }

  if (!isValidDateString(value.tradeDate)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["tradeDate"],
      message: "日期格式必须为 YYYY-MM-DD",
    })
  }
})

export type VpsFormValues = z.infer<typeof vpsFormSchema>
export type VpsRenewalCycle = RenewalCycle
export type VpsCurrency = SupportedCurrency
