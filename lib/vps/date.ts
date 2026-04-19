import { format, isValid, parse } from "date-fns"

export const DATE_FORMAT = "yyyy-MM-dd"
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export function parseDateOnly(value: string) {
  if (!DATE_PATTERN.test(value)) {
    return undefined
  }

  const parsed = parse(value, DATE_FORMAT, new Date())

  if (!isValid(parsed) || format(parsed, DATE_FORMAT) !== value) {
    return undefined
  }

  return parsed
}

export function isValidDateString(value: string) {
  return Boolean(parseDateOnly(value))
}

export function getDateFromValue(value: string) {
  return parseDateOnly(value)
}

export function formatDateValue(value: Date | undefined) {
  return value ? format(value, DATE_FORMAT) : ""
}
