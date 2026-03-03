import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { cn, formatPercent, formatNumber, formatScale, getRiskLabel } from '../utils'
import { getFundDetail } from '../api'
import { NavChart } from '../components/NavChart'

export default function FundDetail() {
  const { code } = useParams<{ code: string }>()

  const { data: fund, isLoading } = useQuery({
    queryKey: ['fund', code],
    queryFn: () => getFundDetail(code!),
    enabled: !!code,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!fund) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center">
        <p className="text-dark-400 mb-4">基金不存在</p>
        <Link to="/funds" className="text-accent-blue hover:text-accent-cyan transition-colors">
          返回基金库
        </Link>
      </div>
    )
  }

  const metrics = fund.metrics || {}

  return (
    <div className="min-h-screen bg-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{fund.name}</h1>
              <span className="px-3 py-1 text-sm rounded-full bg-dark-800 text-dark-300 border border-dark-700">
                {fund.type}
              </span>
            </div>
            <p className="text-dark-400">{fund.code} · {fund.company}</p>
          </div>
          <Link
            to="/funds"
            className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-dark-300 hover:text-white hover:border-dark-600 transition-all"
          >
            返回列表
          </Link>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: '近一年收益', value: metrics.oneYearReturn, isPercent: true, highlight: true },
            { label: '近三年收益', value: metrics.threeYearReturn, isPercent: true },
            { label: '最大回撤', value: metrics.maxDrawdown, isPercent: true, negative: true },
            { label: '夏普比率', value: metrics.sharpeRatio, decimals: 2 },
          ].map((item) => (
            <div key={item.label} className="glass-card p-5">
              <p className="text-sm text-dark-400 mb-1">{item.label}</p>
              <p className={cn(
                'text-2xl font-bold font-mono',
                item.highlight
                  ? item.value >= 0 ? 'text-accent-emerald' : 'text-accent-rose'
                  : item.negative
                    ? 'text-dark-200'
                    : item.value >= 0 ? 'text-accent-emerald' : 'text-accent-rose'
              )}>
                {item.isPercent ? formatPercent(item.value || 0) : formatNumber(item.value || 0, item.decimals || 1)}
              </p>
            </div>
          ))}
        </div>

        {/* Chart & Info */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Chart */}
          <div className="lg:col-span-2 glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">净值走势</h2>
            <NavChart data={fund.navHistory || []} height={350} />
          </div>

          {/* Fund Info */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">基金信息</h2>
            <div className="space-y-4">
              {[
                { label: '基金经理', value: fund.manager },
                { label: '基金规模', value: formatScale(fund.scale) },
                { label: '成立日期', value: fund.establishDate },
                { label: '风险等级', value: getRiskLabel(fund.riskLevel) },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-dark-800">
                  <span className="text-dark-400 text-sm">{item.label}</span>
                  <span className="text-white text-sm">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-dark-800">
              <p className="text-xs text-dark-500 mb-1">业绩基准</p>
              <p className="text-sm text-dark-300">{fund.benchmark}</p>
            </div>
          </div>
        </div>

        {/* AI Analysis */}
        {fund.aiAnalysis && (
          <div className="glass-card p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white">AI 分析</h2>
            </div>
            <div className="prose prose-invert prose-sm max-w-none text-dark-300">
              <div className="whitespace-pre-wrap">{fund.aiAnalysis}</div>
            </div>
          </div>
        )}

        {/* Top Holdings */}
        {fund.topHoldings && fund.topHoldings.length > 0 && (
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">前十大持仓</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {fund.topHoldings.map((holding: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-dark-700 flex items-center justify-center text-xs text-dark-400">
                      {index + 1}
                    </span>
                    <span className="text-white">{holding.name}</span>
                  </div>
                  <span className="font-mono text-dark-300">{holding.ratio}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}