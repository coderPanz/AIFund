import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Card, Button } from '../components/ui'
import { getMarketOverview, getFunds } from '../api'
import { formatPercent, getReturnColor } from '../utils'

export default function Home() {
  const { data: marketData, isLoading: marketLoading } = useQuery({
    queryKey: ['market'],
    queryFn: getMarketOverview,
  })

  const { data: hotFunds, isLoading: fundsLoading } = useQuery({
    queryKey: ['funds', { sortField: 'oneYearReturn', sortOrder: 'desc' }],
    queryFn: () => getFunds({ sortField: 'oneYearReturn', sortOrder: 'desc' }),
  })

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl text-white">
        <h1 className="text-3xl font-bold mb-4">AI 基金投资助手</h1>
        <p className="text-primary-100 mb-6 max-w-xl mx-auto">
          智能分析基金数据，为您提供个性化的投资建议，让投资更简单
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/ai">
            <Button variant="secondary" size="lg">
              开始 AI 选基
            </Button>
          </Link>
          <Link to="/funds">
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              浏览基金库
            </Button>
          </Link>
        </div>
      </section>

      {/* Market Overview */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">市场概览</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {marketLoading ? (
            <div className="col-span-4 text-center py-8 text-gray-500">加载中...</div>
          ) : (
            marketData?.map((index: any) => (
              <Card key={index.name} className="p-4">
                <p className="text-sm text-gray-500">{index.name}</p>
                <p className="text-xl font-semibold text-gray-900">{index.value.toFixed(2)}</p>
                <p className={`text-sm ${getReturnColor(index.changePercent)}`}>
                  {formatPercent(index.changePercent)}
                </p>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* Hot Funds */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">热门基金</h2>
          <Link to="/funds" className="text-sm text-primary-600 hover:text-primary-700">
            查看全部 →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fundsLoading ? (
            <div className="col-span-3 text-center py-8 text-gray-500">加载中...</div>
          ) : (
            hotFunds?.funds?.slice(0, 6).map((fund: any) => (
              <Link key={fund.code} to={`/funds/${fund.code}`}>
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900">{fund.name}</h3>
                      <p className="text-sm text-gray-500">{fund.code}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
                      {fund.type}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-gray-500">近一年收益</p>
                      <p className={`text-lg font-semibold ${getReturnColor(fund.metrics?.oneYearReturn || 0)}`}>
                        {formatPercent(fund.metrics?.oneYearReturn || 0)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{fund.manager}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">AI 智能选基</h3>
          <p className="text-sm text-gray-500 mb-4">
            描述您的投资需求，AI 为您推荐合适的基金
          </p>
          <Link to="/ai">
            <Button variant="outline" className="w-full">开始选基</Button>
          </Link>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">资产配置</h3>
          <p className="text-sm text-gray-500 mb-4">
            完成风险测评，获取个性化资产配置建议
          </p>
          <Link to="/portfolio">
            <Button variant="outline" className="w-full">开始测评</Button>
          </Link>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">基金库</h3>
          <p className="text-sm text-gray-500 mb-4">
            浏览全市场基金，筛选比较找到心仪标的
          </p>
          <Link to="/funds">
            <Button variant="outline" className="w-full">浏览基金</Button>
          </Link>
        </Card>
      </section>
    </div>
  )
}