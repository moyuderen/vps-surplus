export const siteKeywords = [
  "VPS剩余价值计算器",
  "VPS估价",
  "VPS剩余价值计算",
  "VPS折溢价计算",
  "VPS交易估价",
  "VPS剩余天数计算",
]

export const siteConfig = {
  name: "VPS 剩余价值计算器",
  shortName: "VPS 估价计算器",
  description: "用于估算 VPS 剩余天数、剩余价值与交易折溢价的在线计算工具。",
  locale: "zh_CN",
  keywords: siteKeywords,
  get siteUrl() {
    return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "")
  },
} as const

export function getSiteUrl() {
  return siteConfig.siteUrl
}
