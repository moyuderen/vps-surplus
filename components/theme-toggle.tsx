"use client"

import { Check, Monitor, MoonStar, SunMedium } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const themeOptions = [
  { value: "light", label: "浅色", icon: SunMedium },
  { value: "dark", label: "暗黑", icon: MoonStar },
  { value: "system", label: "系统", icon: Monitor },
] as const

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const selectedTheme = theme ?? "system"
  const SelectedIcon = themeOptions.find((option) => option.value === selectedTheme)?.icon ?? Monitor

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon-sm" aria-label="主题切换">
          <SelectedIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          {themeOptions.map((option) => {
            const Icon = option.icon
            const isSelected = selectedTheme === option.value

            return (
              <DropdownMenuItem
                key={option.value}
                onSelect={() => setTheme(option.value)}
              >
                <Icon data-icon="inline-start" />
                {option.label}
                {isSelected ? <Check data-icon="inline-end" /> : null}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
