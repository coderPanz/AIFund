const API_BASE = '/api'

// 基金列表
export async function getFunds(params?: {
  type?: string
  sortField?: string
  sortOrder?: string
}) {
  const searchParams = new URLSearchParams()
  if (params?.type) searchParams.set('type', params.type)
  if (params?.sortField) searchParams.set('sortField', params.sortField)
  if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder)

  const url = `${API_BASE}/funds${searchParams.toString() ? `?${searchParams}` : ''}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('获取基金列表失败')
  return res.json()
}

// 基金详情
export async function getFundDetail(code: string) {
  const res = await fetch(`${API_BASE}/funds/${code}`)
  if (!res.ok) throw new Error('获取基金详情失败')
  return res.json()
}

// 基金净值历史
export async function getFundNavHistory(code: string, period?: string) {
  const url = `${API_BASE}/funds/${code}/nav${period ? `?period=${period}` : ''}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('获取净值历史失败')
  return res.json()
}

// AI 选基对话（流式）
export async function chatWithAI(message: string, onMessage: (text: string) => void) {
  const res = await fetch(`${API_BASE}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })

  if (!res.ok) throw new Error('AI 服务异常')

  const reader = res.body?.getReader()
  const decoder = new TextDecoder()

  if (!reader) return

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value)
    onMessage(chunk)
  }
}

// 风险测评
export async function submitRiskAssessment(answers: number[]) {
  const res = await fetch(`${API_BASE}/portfolio/risk-assessment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers }),
  })
  if (!res.ok) throw new Error('风险测评失败')
  return res.json()
}

// 获取配置建议
export async function getPortfolioSuggestion(riskLevel: number) {
  const res = await fetch(`${API_BASE}/portfolio/suggestion?riskLevel=${riskLevel}`)
  if (!res.ok) throw new Error('获取配置建议失败')
  return res.json()
}

// 市场概览
export async function getMarketOverview() {
  const res = await fetch(`${API_BASE}/market/overview`)
  if (!res.ok) throw new Error('获取市场概览失败')
  return res.json()
}