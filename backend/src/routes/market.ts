import { Hono } from 'hono'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataPath = join(__dirname, '../../../data/market/overview.json')

const app = new Hono()

// 获取市场概览
app.get('/overview', (c) => {
  if (!existsSync(dataPath)) {
    // 返回模拟数据
    return c.json([
      { name: '上证指数', code: '000001', value: 3125.68, change: 23.45, changePercent: 0.76 },
      { name: '深证成指', code: '399001', value: 10234.56, change: 156.78, changePercent: 1.56 },
      { name: '创业板指', code: '399006', value: 2045.89, change: 45.67, changePercent: 2.28 },
      { name: '沪深300', code: '000300', value: 3856.23, change: 52.34, changePercent: 1.37 }
    ])
  }

  const content = readFileSync(dataPath, 'utf-8')
  const data = JSON.parse(content)
  return c.json(data.market || [])
})

export default app