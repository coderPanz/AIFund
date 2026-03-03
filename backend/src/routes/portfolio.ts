import { Hono } from 'hono'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const portfolioPath = join(__dirname, '../../../data/funds/portfolios.json')

const app = new Hono()

// 风险测评
app.post('/risk-assessment', async (c) => {
  const body = await c.req.json()
  const answers = body.answers || []

  if (answers.length === 0) {
    return c.json({ error: '请完成风险测评问卷' }, 400)
  }

  // 计算风险等级
  const totalScore = answers.reduce((a: number, b: number) => a + b, 0)
  const avgScore = totalScore / answers.length
  const riskLevel = Math.min(5, Math.max(1, Math.round(avgScore)))

  const riskProfiles: Record<number, { type: string; description: string }> = {
    1: { type: '保守型', description: '您倾向于低风险投资，适合以债券、货币基金为主的稳健配置。' },
    2: { type: '稳健型', description: '您可以承受适度风险，适合股债平衡型的配置方案。' },
    3: { type: '平衡型', description: '您追求风险与收益的平衡，适合股债均衡配置。' },
    4: { type: '成长型', description: '您能承受较高风险追求更高收益，适合偏股型配置。' },
    5: { type: '进取型', description: '您追求较高收益，能承受较大波动，适合积极型配置。' }
  }

  const profile = riskProfiles[riskLevel]

  return c.json({
    level: riskLevel,
    type: profile.type,
    description: profile.description
  })
})

// 获取配置建议
app.get('/suggestion', (c) => {
  const riskLevel = parseInt(c.req.query('riskLevel') || '3')

  if (!existsSync(portfolioPath)) {
    // 返回默认配置
    return c.json(getDefaultPortfolio(riskLevel))
  }

  const content = readFileSync(portfolioPath, 'utf-8')
  const data = JSON.parse(content)
  const portfolio = data.portfolios?.[riskLevel.toString()]

  if (!portfolio) {
    return c.json(getDefaultPortfolio(riskLevel))
  }

  return c.json(portfolio)
})

function getDefaultPortfolio(riskLevel: number) {
  const portfolios: Record<number, any> = {
    1: {
      id: 'conservative',
      name: '稳健保守型配置',
      riskLevel: 1,
      expectedReturn: 4.5,
      expectedRisk: -5.0,
      allocations: [
        { fundCode: '050025', fundName: '博时信用债券A', ratio: 60, reason: '核心债券配置' },
        { fundCode: '519678', fundName: '银河稳健债券A', ratio: 30, reason: '补充债券配置' },
        { fundCode: '000961', fundName: '沪深300ETF', ratio: 10, reason: '适度权益配置' }
      ]
    },
    3: {
      id: 'balanced',
      name: '平衡型配置',
      riskLevel: 3,
      expectedReturn: 9.0,
      expectedRisk: -18.0,
      allocations: [
        { fundCode: '519778', fundName: '交银定期支付双息平衡混合', ratio: 30, reason: '核心平衡配置' },
        { fundCode: '000961', fundName: '沪深300ETF', ratio: 30, reason: '核心宽基指数' },
        { fundCode: '163406', fundName: '兴全合润混合', ratio: 20, reason: '主动管理增强' },
        { fundCode: '050025', fundName: '博时信用债券A', ratio: 20, reason: '债券配置' }
      ]
    },
    5: {
      id: 'aggressive',
      name: '进取型配置',
      riskLevel: 5,
      expectedReturn: 15.0,
      expectedRisk: -40.0,
      allocations: [
        { fundCode: '004854', fundName: '广发高端制造股票A', ratio: 30, reason: '高端制造主题' },
        { fundCode: '270050', fundName: '广发纳斯达克100指数A', ratio: 25, reason: '海外科技配置' },
        { fundCode: '110011', fundName: '易方达中小盘混合', ratio: 25, reason: '主动管理增强' },
        { fundCode: '000961', fundName: '沪深300ETF', ratio: 20, reason: '宽基指数底仓' }
      ]
    }
  }

  return portfolios[riskLevel] || portfolios[3]
}

export default app