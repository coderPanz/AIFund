import { Hono } from 'hono'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataPath = join(__dirname, '../../../data/funds/funds.json')

// 读取基金数据
function getFundsData() {
  if (!existsSync(dataPath)) {
    return { funds: [] }
  }
  const content = readFileSync(dataPath, 'utf-8')
  return JSON.parse(content)
}

const app = new Hono()

// 获取基金列表
app.get('/', (c) => {
  const data = getFundsData()
  let funds = data.funds || []

  // 筛选
  const type = c.req.query('type')
  if (type) {
    funds = funds.filter((f: any) => f.type === type)
  }

  // 排序
  const sortField = c.req.query('sortField') || 'oneYearReturn'
  const sortOrder = c.req.query('sortOrder') || 'desc'

  funds.sort((a: any, b: any) => {
    let aVal = a.metrics?.[sortField] ?? 0
    let bVal = b.metrics?.[sortField] ?? 0

    if (sortField === 'scale') {
      aVal = a.scale || 0
      bVal = b.scale || 0
    }

    return sortOrder === 'desc' ? bVal - aVal : aVal - bVal
  })

  return c.json({
    total: funds.length,
    funds: funds.map((f: any) => ({
      ...f,
      metrics: f.metrics || {}
    }))
  })
})

// 获取基金详情
app.get('/:code', (c) => {
  const code = c.req.param('code')
  const data = getFundsData()
  const fund = data.funds?.find((f: any) => f.code === code)

  if (!fund) {
    return c.json({ error: '基金不存在' }, 404)
  }

  // 生成模拟的净值历史数据
  const navHistory = generateNavHistory(fund.metrics?.oneYearReturn || 0)

  // AI 分析
  const aiAnalysis = generateAIAnalysis(fund)

  return c.json({
    ...fund,
    navHistory,
    aiAnalysis
  })
})

// 获取净值历史
app.get('/:code/nav', (c) => {
  const code = c.req.param('code')
  const period = c.req.query('period') || '1y'
  const data = getFundsData()
  const fund = data.funds?.find((f: any) => f.code === code)

  if (!fund) {
    return c.json({ error: '基金不存在' }, 404)
  }

  const navHistory = generateNavHistory(fund.metrics?.oneYearReturn || 0, period)

  return c.json({ code, navHistory })
})

// 生成模拟净值历史
function generateNavHistory(annualReturn: number, period: string = '1y') {
  const data = []
  const days = period === '1y' ? 250 : period === '6m' ? 125 : period === '3m' ? 60 : 250
  const dailyReturn = annualReturn / 250 / 100
  let nav = 1.0

  const today = new Date()
  for (let i = days; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // 添加随机波动
    const randomFactor = 1 + (Math.random() - 0.5) * 0.02
    nav = nav * (1 + dailyReturn * randomFactor)

    data.push({
      date: date.toISOString().split('T')[0],
      nav: parseFloat(nav.toFixed(4)),
      accNav: parseFloat((nav * 1.2).toFixed(4)), // 累计净值模拟
      dailyReturn: parseFloat(((Math.random() - 0.5) * 3).toFixed(2))
    })
  }

  return data
}

// 生成 AI 分析
function generateAIAnalysis(fund: any) {
  const metrics = fund.metrics || {}
  const typeAnalysis: Record<string, string> = {
    '股票型': '该基金为股票型基金，主要投资于股票市场，风险较高但收益潜力也较大。',
    '混合型': '该基金为混合型基金，可灵活配置股票和债券资产，在控制风险的同时追求收益。',
    '债券型': '该基金为债券型基金，主要投资于债券市场，风险较低，收益相对稳定。',
    '指数型': '该基金为指数型基金，跟踪特定指数表现，具有费率低、透明度高的特点。',
    'QDII': '该基金为QDII基金，主要投资海外市场，可以有效分散单一市场风险。'
  }

  return `## 基金概况

${fund.name}（${fund.code}）是由${fund.company}管理的${fund.type}基金，基金经理为${fund.manager}，成立于${fund.establishDate}，当前规模为${fund.scale}亿元。

## 投资分析

${typeAnalysis[fund.type] || '该基金根据投资策略进行资产配置。'}

## 业绩表现

- 近一年收益：${metrics.oneYearReturn || 0}%，${metrics.oneYearReturn > 0 ? '表现较好' : '有所波动'}
- 近三年收益：${metrics.threeYearReturn || 0}%，年化收益率约${((Math.pow(1 + (metrics.threeYearReturn || 0) / 100, 1/3) - 1) * 100).toFixed(1)}%
- 最大回撤：${metrics.maxDrawdown || 0}%，风险控制${Math.abs(metrics.maxDrawdown) < 20 ? '较好' : '一般'}
- 夏普比率：${metrics.sharpeRatio || 0}，风险调整后收益${metrics.sharpeRatio > 1 ? '优秀' : metrics.sharpeRatio > 0.5 ? '良好' : '一般'}

## 风险提示

基金投资有风险，过往业绩不代表未来表现。投资者在投资前应仔细阅读基金合同和招募说明书。`
}

export default app