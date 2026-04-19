import type { Metadata } from "next"

import { ThemeToggle } from "@/components/theme-toggle"
import { VpsSurplusCalculator } from "@/components/vps/vps-surplus-calculator"
import { getSiteUrl, siteConfig } from "@/lib/site"

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  title: "VPS 剩余价值计算器",
  description: "在线计算 VPS 剩余天数、剩余价值与交易折溢价，适合二手 VPS 估价与交易前快速比对。",
  keywords: siteConfig.keywords,
  alternates: {
    canonical: siteUrl ? "/" : undefined,
  },
  openGraph: {
    title: "VPS 剩余价值计算器",
    description: "快速估算 VPS 剩余价值、剩余天数和交易折溢价。",
    url: siteUrl || undefined,
  },
  twitter: {
    title: "VPS 剩余价值计算器",
    description: "快速估算 VPS 剩余价值、剩余天数和交易折溢价。",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: siteConfig.name,
      description: siteConfig.description,
      inLanguage: "zh-CN",
      ...(siteUrl ? { url: siteUrl } : {}),
    },
    {
      "@type": "WebApplication",
      name: siteConfig.name,
      description: "用于计算 VPS 剩余天数、剩余价值与交易折溢价的在线工具。",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      inLanguage: "zh-CN",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "CNY",
      },
      ...(siteUrl ? { url: siteUrl } : {}),
    },
  ],
}

function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c")
}

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-muted/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">VPS 剩余价值计算器</h1>
              <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                输入续费金额、续费币种、汇率、到期日期、交易日期与成交金额，快速估算 VPS 剩余天数、剩余价值和折溢价空间。
              </p>
            </div>
            <ThemeToggle />
          </div>
        </section>

        <VpsSurplusCalculator />
      </div>
    </main>
  )
}
