// 基金类型
export type FundType = '股票型' | '混合型' | '债券型' | '货币型' | '指数型' | 'QDII' | 'FOF'

// 基金基础信息
export interface Fund {
  code: string
  name: string
  type: FundType
  manager: string
  company: string
  establishDate: string
  scale: number
  benchmark: string
  riskLevel: 1 | 2 | 3 | 4 | 5
}

// 基金净值数据
export interface FundNav {
  code: string
  date: string
  nav: number
  accNav: number
  dailyReturn: number
}

// 基金指标
export interface FundMetrics {
  code: string
  annualizedReturn: number
  sharpeRatio: number
  maxDrawdown: number
  volatility: number
  oneYearReturn: number
  threeYearReturn: number
  sixMonthReturn: number
  oneMonthReturn: number
}

// 基金详情（组合）
export interface FundDetail extends Fund {
  metrics: FundMetrics
  navHistory: FundNav[]
  description: string
  topHoldings: Holding[]
}

// 持仓明细
export interface Holding {
  name: string
  ratio: number
  type: 'stock' | 'bond'
}

// 筛选条件
export interface FundFilter {
  type?: FundType
  minReturn?: number
  maxDrawdown?: number
  riskLevel?: number
  scale?: [number, number]
}

// 排序
export type SortField = 'oneYearReturn' | 'threeYearReturn' | 'scale' | 'maxDrawdown'
export type SortOrder = 'asc' | 'desc'

// AI 消息
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

// 风险测评结果
export interface RiskAssessment {
  level: 1 | 2 | 3 | 4 | 5
  type: '保守型' | '稳健型' | '平衡型' | '成长型' | '进取型'
  description: string
}

// 资产配置建议
export interface PortfolioSuggestion {
  id: string
  name: string
  riskLevel: number
  expectedReturn: number
  expectedRisk: number
  allocations: Allocation[]
}

// 资产配置项
export interface Allocation {
  fundCode: string
  fundName: string
  ratio: number
  reason: string
}

// 市场概览
export interface MarketOverview {
  indexName: string
  value: number
  change: number
  changePercent: number
}