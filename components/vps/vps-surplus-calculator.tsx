"use client"

import { useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ArrowLeftRight,
  BadgeDollarSign,
  Calendar as CalendarIcon,
  CalendarClock,
  CalendarSearch,
  CalendarSync,
  HandCoins,
  RefreshCw,
} from "lucide-react"
import { Controller, useForm, useWatch, type Control } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Calendar as DateCalendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { VpsResultPanel } from "@/components/vps/vps-result-panel"
import {
  calculateVpsSurplus,
  getDefaultExpiryDate,
  getDefaultTradeDate,
} from "@/lib/vps/calculator"
import {
  CURRENCY_SYMBOLS,
  DEFAULT_VALUES,
  RENEWAL_CYCLE_OPTIONS,
  SUPPORTED_CURRENCIES,
  type SupportedCurrency,
} from "@/lib/vps/constants"
import { formatDateValue, getDateFromValue } from "@/lib/vps/date"
import { vpsFormSchema, type VpsFormValues } from "@/lib/vps/schema"
import { cn } from "@/lib/utils"

function getDefaultValues(): VpsFormValues {
  return {
    renewalCurrency: DEFAULT_VALUES.renewalCurrency,
    exchangeRate: DEFAULT_VALUES.exchangeRate,
    expiryDate: getDefaultExpiryDate(),
    tradeDate: getDefaultTradeDate(),
    renewalAmount: DEFAULT_VALUES.renewalAmount,
    transactionAmount: DEFAULT_VALUES.transactionAmount,
    renewalCycle: DEFAULT_VALUES.renewalCycle,
  }
}

type DatePickerControlProps = {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  ariaInvalid: boolean
}

function DatePickerControl({ id, value, onChange, placeholder, ariaInvalid }: DatePickerControlProps) {
  const [open, setOpen] = useState(false)
  const selectedDate = useMemo(() => getDateFromValue(value), [value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <InputGroup>
        <InputGroupInput
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-invalid={ariaInvalid}
        />
        <InputGroupAddon align="inline-end">
          <PopoverTrigger asChild>
            <InputGroupButton variant="ghost" size="icon-xs" aria-label="打开日期选择器">
              <CalendarIcon />
            </InputGroupButton>
          </PopoverTrigger>
        </InputGroupAddon>
      </InputGroup>
      <PopoverContent className="w-auto p-0" align="start">
        <DateCalendar
          mode="single"
          captionLayout="dropdown"
          selected={selectedDate}
          defaultMonth={selectedDate ?? new Date()}
          onSelect={(date) => {
            onChange(formatDateValue(date))
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

type CalculatorResultProps = {
  control: Control<VpsFormValues>
}

function CalculatorResult({ control }: CalculatorResultProps) {
  const values = useWatch({ control })
  const renewalCurrency = values.renewalCurrency ?? DEFAULT_VALUES.renewalCurrency
  const dateRangeInvalid = Boolean(values.expiryDate && values.tradeDate && values.tradeDate > values.expiryDate)

  const result = useMemo(() => {
    const parsed = vpsFormSchema.safeParse(values)

    if (!parsed.success) {
      return null
    }

    try {
      return calculateVpsSurplus(parsed.data)
    } catch {
      return null
    }
  }, [values])

  return <VpsResultPanel result={dateRangeInvalid ? null : result} renewalCurrency={renewalCurrency} />
}

export function VpsSurplusCalculator() {
  const form = useForm<VpsFormValues>({
    resolver: zodResolver(vpsFormSchema),
    defaultValues: getDefaultValues(),
    mode: "onChange",
  })

  const renewalCurrency = useWatch({
    control: form.control,
    name: "renewalCurrency",
  }) ?? DEFAULT_VALUES.renewalCurrency

  const expiryDateError = form.formState.errors.expiryDate
  const tradeDateError = form.formState.errors.tradeDate
  const expiryDate = useWatch({
    control: form.control,
    name: "expiryDate",
  })
  const tradeDate = useWatch({
    control: form.control,
    name: "tradeDate",
  })
  const dateRangeInvalid = Boolean(expiryDate && tradeDate && tradeDate > expiryDate)

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(24rem,0.8fr)]">
      <Card>
        <CardHeader>
          <CardTitle>参数输入</CardTitle>
          <CardDescription>
            续费金额支持多币种输入，交易金额默认按人民币输入，结果会同时展示两种币种视角。
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <FieldGroup>
            <div className="grid gap-5 md:grid-cols-2">
              <Field data-invalid={!!form.formState.errors.exchangeRate || undefined}>
                <FieldLabel htmlFor="exchangeRate">
                  <ArrowLeftRight />
                  汇率
                </FieldLabel>
                <Input
                  id="exchangeRate"
                  type="number"
                  step="0.000001"
                  min="0"
                  disabled={renewalCurrency === "CNY"}
                  aria-invalid={!!form.formState.errors.exchangeRate}
                  {...form.register("exchangeRate", { valueAsNumber: true })}
                />
                <FieldError errors={[form.formState.errors.exchangeRate]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="renewalCycle">
                  <CalendarSync />
                  续费周期
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="renewalCycle"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="renewalCycle" className="w-full">
                        <SelectValue placeholder="选择续费周期" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {RENEWAL_CYCLE_OPTIONS.map((option: (typeof RENEWAL_CYCLE_OPTIONS)[number]) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field data-invalid={!!expiryDateError || undefined}>
                <FieldLabel htmlFor="expiryDate">
                  <CalendarClock />
                  到期日期
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <DatePickerControl
                      id={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="YYYY-MM-DD"
                      ariaInvalid={!!expiryDateError}
                    />
                  )}
                />
                <FieldError errors={[expiryDateError]} />
              </Field>

              <Field data-invalid={!!tradeDateError || dateRangeInvalid || undefined}>
                <FieldLabel htmlFor="tradeDate">
                  <CalendarSearch />
                  交易日期
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="tradeDate"
                  render={({ field }) => (
                    <DatePickerControl
                      id={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="YYYY-MM-DD"
                      ariaInvalid={!!tradeDateError || dateRangeInvalid}
                    />
                  )}
                />
                <FieldError errors={[tradeDateError, dateRangeInvalid ? { message: "交易日期不能晚于到期日期" } : undefined]} />
              </Field>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field data-invalid={!!form.formState.errors.renewalAmount || undefined}>
                <FieldLabel htmlFor="renewalAmount">
                  <HandCoins />
                  续费金额
                </FieldLabel>
                <div className="grid grid-cols-[minmax(0,1fr)_5rem] gap-0">
                  <div className="relative">
                    <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-xs text-muted-foreground">
                      {CURRENCY_SYMBOLS[renewalCurrency]}
                    </span>
                    <Input
                      id="renewalAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      aria-invalid={!!form.formState.errors.renewalAmount}
                      className="rounded-r-none pl-8"
                      {...form.register("renewalAmount", { valueAsNumber: true })}
                    />
                  </div>

                  <Controller
                    control={form.control}
                    name="renewalCurrency"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value: SupportedCurrency) => {
                          field.onChange(value)
                          if (value === "CNY") {
                            form.setValue("exchangeRate", 1, { shouldValidate: true, shouldDirty: true })
                          }
                        }}
                      >
                        <SelectTrigger
                          id="renewalCurrency"
                          aria-invalid={!!form.formState.errors.renewalCurrency}
                          className="w-full rounded-l-none border-l-0 px-2"
                        >
                          <SelectValue placeholder="币种" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {SUPPORTED_CURRENCIES.map((currency: SupportedCurrency) => (
                              <SelectItem key={currency} value={currency}>
                                {currency}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <FieldError errors={[form.formState.errors.renewalAmount]} />
              </Field>

              <Field data-invalid={!!form.formState.errors.transactionAmount || undefined}>
                <FieldLabel htmlFor="transactionAmount">
                  <BadgeDollarSign />
                  交易金额
                </FieldLabel>
                <div className="grid grid-cols-[minmax(0,1fr)_5rem] gap-0">
                  <div className="relative">
                    <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-xs text-muted-foreground">
                      ¥
                    </span>
                    <Input
                      id="transactionAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      aria-invalid={!!form.formState.errors.transactionAmount}
                      className="rounded-r-none pl-8"
                      {...form.register("transactionAmount", { valueAsNumber: true })}
                    />
                  </div>
                  <div
                    className={cn(
                      "flex items-center border border-l-0 border-input px-2 text-xs text-muted-foreground",
                      form.formState.errors.transactionAmount && "border-destructive",
                    )}
                  >
                    CNY
                  </div>
                </div>
                <FieldError errors={[form.formState.errors.transactionAmount]} />
              </Field>
            </div>
          </FieldGroup>

          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={() => form.reset(getDefaultValues())}>
              <RefreshCw data-icon="inline-start" />
              重置默认值
            </Button>
          </div>
        </CardContent>
      </Card>

      <CalculatorResult control={form.control} />
    </div>
  )
}
