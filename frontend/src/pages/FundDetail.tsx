import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Card, Button, Badge, Loading } from '../components/ui'
import { NavChart } from '../components/NavChart'
import { getFundDetail } from '../api'
import { formatPercent, formatNumber, formatScale, getRiskLabel, getReturnColor } from '../utils'

export default function FundDetail() {
  const { code } = useParams<{ code: string }>()

  const { data: fund, isLoading } = useQuery({
    queryKey: ['fund', code],
    queryFn: () => getFundDetail(code!),
    enabled: !!code,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loading size="lg" />
      </div>
    )
  }

  if (!fund) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">基金不存在</p>
        <Link to="/funds">
          <Button className="mt-4">返回基金库</Button>
        </Link>
      </div>
    )
  }

  const metrics = fund.metrics || {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{fund.name}</h1>
            <Badge>{fund.type}</Badge>
          </div>
          <p className="text-gray-500">{fund.code} · {fund.company}</p>
        </div>
        <Link to="/funds">
          <Button variant="outline">返回列表</Button>
        </Link>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">近一年收益</p>
          <p className={`text-2xl font-bold ${getReturnColor(metrics.oneYearReturn || 0)}`}>
            {formatPercent(metrics.oneYearReturn || 0)}
          </p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">近三年收益</p>
          <p className={`text-2xl font-bold ${getReturnColor(metrics.threeYearReturn || 0)}`}>
            {formatPercent(metrics.threeYearReturn || 0)}
          </p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">最大回撤</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatPercent(metrics.maxDrawdown || 0)}
          </p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">夏普比率</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatNumber(metrics.sharpeRatio || 0)}
          </p>
        </Card>
      </div>

      {/* Chart */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">净值走势</h2>
        <NavChart data={fund.navHistory || []} height={350} />
      </Card>

      {/* Fund Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">基金信息</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">基金经理</span>
              <span className="text-gray-900">{fund.manager}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">基金规模</span>
              <span className="text-gray-900">{formatScale(fund.scale)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">成立日期</span>
              <span className="text-gray-900">{fund.establishDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">风险等级</span>
              <span className="text-gray-900">{getRiskLabel(fund.riskLevel)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">业绩基准</span>
              <span className="text-gray-900 text-right text-sm">{fund.benchmark}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">业绩指标</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">年化收益</span>
              <span className={`font-medium ${getReturnColor(metrics.annualizedReturn || 0)}`}>
                {formatPercent(metrics.annualizedReturn || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">波动率</span>
              <span className="text-gray-900">{formatPercent(metrics.volatility || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">近六月收益</span>
              <span className={`font-medium ${getReturnColor(metrics.sixMonthReturn || 0)}`}>
                {formatPercent(metrics.sixMonthReturn || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">近一月收益</span>
              <span className={`font-medium ${getReturnColor(metrics.oneMonthReturn || 0)}`}>
                {formatPercent(metrics.oneMonthReturn || 0)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Analysis */}
      {fund.aiAnalysis && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">AI 分析</h2>
          <div className="prose prose-sm max-w-none text-gray-700">
            {fund.aiAnalysis}
          </div>
        </Card>
      )}

      {/* Top Holdings */}
      {fund.topHoldings && fund.topHoldings.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">前十大持仓</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-gray-500 font-medium">名称</th>
                  <th className="text-right py-2 text-gray-500 font-medium">占比</th>
                </tr>
              </thead>
              <tbody>
                {fund.topHoldings.map((holding: any, index: number) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 text-gray-900">{holding.name}</td>
                    <td className="py-2 text-right text-gray-900">{holding.ratio}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}