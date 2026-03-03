import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getMarketOverview, getFunds } from '../api'
import { cn, formatPercent, formatNumber } from '../utils'

export default function Home() {
  const { data: marketData } = useQuery({
    queryKey: ['market'],
    queryFn: getMarketOverview,
  })

  const { data: hotFunds } = useQuery({
    queryKey: ['funds', { sortField: 'oneYearReturn', sortOrder: 'desc' }],
    queryFn: () => getFunds({ sortField: 'oneYearReturn', sortOrder: 'desc' }),
  })

  return (
    <div className="bg-grid">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-glow" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800/50 border border-dark-700 mb-8">
              <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
              <span className="text-sm text-dark-300">AI 驱动的智能投资平台</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-white">让投资</span>
              <br />
              <span className="gradient-text">更智能、更简单</span>
            </h1>

            <p className="text-xl text-dark-400 max-w-2xl mx-auto mb-10">
              基于 AI 技术的专业基金投资分析平台，为您提供个性化的投资建议和资产配置方案
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/ai">
                <button className="btn-primary flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  开始 AI 选基
                </button>
              </Link>
              <Link to="/funds">
                <button className="btn-secondary flex items-center gap-2">
                  浏览基金库
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: '覆盖基金', value: '10,000+', icon: '📊' },
              { label: 'AI 分析次数', value: '1,000,000+', icon: '🤖' },
              { label: '服务用户', value: '50,000+', icon: '👥' },
              { label: '平均收益率', value: '+12.5%', icon: '📈' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-4 text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-dark-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Overview Ticker */}
      <section className="border-y border-dark-800 bg-dark-900/50 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between overflow-x-auto gap-8">
            {marketData?.map((index: any) => (
              <div key={index.code} className="flex items-center gap-4 shrink-0">
                <span className="text-dark-400 text-sm">{index.name}</span>
                <span className="text-white font-mono font-medium">{formatNumber(index.value)}</span>
                <span className={cn(
                  'font-mono text-sm',
                  index.changePercent >= 0 ? 'text-accent-emerald' : 'text-accent-rose'
                )}>
                  {formatPercent(index.changePercent)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Analytics Preview */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              智能投资组合分析
            </h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              AI 驱动的多维度分析，帮助您深入了解投资组合的风险与收益特征
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Chart Preview */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-white">收益走势</h3>
                <div className="flex gap-2">
                  {['1月', '3月', '6月', '1年'].map((period) => (
                    <button key={period} className="px-3 py-1 text-xs rounded-lg bg-dark-800 text-dark-400 hover:text-white transition-colors">
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="h-64 flex items-end gap-2">
                {[35, 45, 30, 55, 40, 65, 50, 75, 60, 85, 70, 90].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-accent-blue to-accent-purple rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Risk Analysis */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-medium text-white mb-6">风险评估</h3>

              <div className="space-y-6">
                {[
                  { label: '市场风险', value: 35, color: 'from-accent-blue to-accent-cyan' },
                  { label: '行业风险', value: 28, color: 'from-accent-purple to-accent-rose' },
                  { label: '流动性风险', value: 15, color: 'from-accent-emerald to-accent-cyan' },
                  { label: '信用风险', value: 22, color: 'from-accent-amber to-accent-rose' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-dark-400">{item.label}</span>
                      <span className="text-white font-mono">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full bg-gradient-to-r rounded-full', item.color)}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-dark-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent-blue/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">综合风险评级</p>
                    <p className="text-xs text-dark-400">中风险 · 适合稳健型投资者</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Data Widgets */}
      <section className="py-24 bg-dark-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              实时市场数据
            </h2>
            <p className="text-dark-400">
              多维度市场数据，助您把握投资机会
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Hot Funds */}
            <div className="md:col-span-2 glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                  <span className="text-accent-amber">🔥</span> 热门基金
                </h3>
                <Link to="/funds" className="text-sm text-accent-blue hover:text-accent-cyan transition-colors">
                  查看全部 →
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-dark-400 border-b border-dark-800">
                      <th className="pb-3 font-medium">基金名称</th>
                      <th className="pb-3 font-medium">类型</th>
                      <th className="pb-3 font-medium text-right">近一年</th>
                      <th className="pb-3 font-medium text-right">最大回撤</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotFunds?.funds?.slice(0, 5).map((fund: any) => (
                      <tr key={fund.code} className="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors">
                        <td className="py-4">
                          <Link to={`/funds/${fund.code}`} className="group">
                            <p className="text-white group-hover:text-accent-blue transition-colors">{fund.name}</p>
                            <p className="text-xs text-dark-500">{fund.code}</p>
                          </Link>
                        </td>
                        <td className="py-4">
                          <span className="px-2 py-1 text-xs rounded-full bg-dark-800 text-dark-300">
                            {fund.type}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <span className={cn(
                            'font-mono',
                            fund.metrics?.oneYearReturn >= 0 ? 'text-accent-emerald' : 'text-accent-rose'
                          )}>
                            {formatPercent(fund.metrics?.oneYearReturn || 0)}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <span className="font-mono text-dark-400">
                            {formatPercent(fund.metrics?.maxDrawdown || 0)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              <div className="stat-card">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-dark-400 text-sm">今日涨跌</span>
                  <span className="text-accent-emerald text-sm">↑ 上涨居多</span>
                </div>
                <div className="flex items-end gap-4">
                  <div>
                    <p className="text-3xl font-bold text-white font-mono">2,856</p>
                    <p className="text-xs text-dark-500">上涨</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-dark-400 font-mono">1,234</p>
                    <p className="text-xs text-dark-500">下跌</p>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-dark-400 text-sm">市场情绪</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-3 bg-dark-800 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-accent-emerald to-accent-cyan rounded-full" />
                  </div>
                  <span className="text-white font-medium">偏乐观</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-purple/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">AI 配置建议</p>
                    <p className="text-sm text-dark-400">根据您的风险偏好定制</p>
                  </div>
                </div>
                <Link to="/portfolio">
                  <button className="w-full mt-4 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-sm text-dark-300 hover:text-white transition-all">
                    开始测评
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Educational Resources */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              投资知识库
            </h2>
            <p className="text-dark-400">
              从入门到精通，系统学习基金投资
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '📚',
                title: '基金入门',
                desc: '了解基金的基本概念、类型和运作方式',
                articles: 24,
                color: 'from-accent-blue to-accent-cyan',
              },
              {
                icon: '📊',
                title: '投资策略',
                desc: '学习定投、资产配置等实用投资策略',
                articles: 36,
                color: 'from-accent-purple to-accent-rose',
              },
              {
                icon: '🛡️',
                title: '风险管理',
                desc: '掌握风险评估和控制的方法与技巧',
                articles: 18,
                color: 'from-accent-emerald to-accent-cyan',
              },
            ].map((category) => (
              <div key={category.title} className="glass-card p-6 hover:border-accent-blue/30 transition-all duration-300 cursor-pointer group">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-lg font-medium text-white mb-2 group-hover:text-accent-blue transition-colors">
                  {category.title}
                </h3>
                <p className="text-sm text-dark-400 mb-4">{category.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-dark-500">{category.articles} 篇文章</span>
                  <svg className="w-5 h-5 text-dark-600 group-hover:text-accent-blue group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Featured Articles */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {[
              {
                title: '2026年基金投资策略：把握结构性机会',
                tag: '策略',
                readTime: '8分钟',
              },
              {
                title: '新手必读：如何构建第一个投资组合',
                tag: '入门',
                readTime: '12分钟',
              },
            ].map((article, i) => (
              <div key={i} className="glass-card p-6 flex items-start gap-4 hover:border-accent-blue/30 transition-all cursor-pointer group">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center shrink-0">
                  <svg className="w-8 h-8 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-dark-800 text-accent-blue">{article.tag}</span>
                    <span className="text-xs text-dark-500">{article.readTime}阅读</span>
                  </div>
                  <h4 className="text-white font-medium group-hover:text-accent-blue transition-colors">
                    {article.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-dark-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              为什么选择我们
            </h2>
            <p className="text-dark-400">
              专业、安全、可靠的投资服务平台
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: '数据安全',
                desc: '银行级数据加密，保护您的隐私安全',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: 'AI 智能分析',
                desc: '先进 AI 技术，提供专业投资建议',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ),
                title: '实时数据',
                desc: '覆盖全市场基金，数据实时更新',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: '专业团队',
                desc: '资深金融专家和技术团队支持',
              },
            ].map((item) => (
              <div key={item.title} className="glass-card p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-dark-800 flex items-center justify-center text-accent-blue">
                  {item.icon}
                </div>
                <h3 className="text-white font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-dark-400">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Data Partners */}
          <div className="mt-16 text-center">
            <p className="text-sm text-dark-500 mb-6">数据合作伙伴</p>
            <div className="flex justify-center items-center gap-12 text-dark-600">
              {['天天基金', 'Wind', '同花顺', '东方财富'].map((partner) => (
                <span key={partner} className="text-lg font-medium">{partner}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            开始您的智能投资之旅
          </h2>
          <p className="text-dark-400 mb-10">
            免费使用 AI 选基功能，获取个性化投资建议
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/ai">
              <button className="btn-primary text-lg px-8 py-4">
                立即开始
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}