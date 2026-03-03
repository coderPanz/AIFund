import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function formatNumber(value: number, decimals = 2): string {
  return value.toFixed(decimals)
}

export function formatScale(value: number): string {
  if (value >= 100) {
    return `${(value / 100).toFixed(2)}万亿`
  }
  return `${value.toFixed(2)}亿`
}

export function getRiskLabel(level: number): string {
  const labels = ['', '低风险', '中低风险', '中风险', '中高风险', '高风险']
  return labels[level] || ''
}

export function getReturnColor(value: number): string {
  if (value > 0) return 'text-red-500'
  if (value < 0) return 'text-green-500'
  return 'text-gray-500'
}