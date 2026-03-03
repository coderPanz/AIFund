import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { cn, formatPercent, formatScale } from '../utils'
import { getFunds } from '../api'
import { FundType } from '../types'

const fundTypes: Array<{ value: FundType | ''; label: string }> = [
  { value: '', label: '全部' },
  { value: '股票型', label: '股票型' },
  { value: '混合型', label: '混合型' },
  { value: '债券型', label: '债券型' },
  { value: '指数型', label: '指数型' },
  { value: 'QDII', label: 'QDII' },
]

const sortOptions = [
  { value: 'oneYearReturn', label: '近一年收益' },
  { value: 'threeYearReturn', label: '近三年收益' },
  { value: 'scale', label: '规模' },
  { value: 'maxDrawdown', label: '最大回撤' },
]

export default function Funds() {
  const [type, setType] = useState<FundType | ''>('')
  const [sortField, setSortField] = useState('oneYearReturn')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const { data, isLoading } = useQuery({
    queryKey: ['funds', { type, sortField, sortOrder }],
    queryFn: () => getFunds({ type, sortField, sortOrder }),
  })

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  return (
    <div className="min-h-screen bg-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">基金库</h1>
            <p className="text-dark-400 mt-1">
              共 <span className="text-white font-medium">{data?.total || 0}</span> 只基金
            </p>
          </div>

          {/* Sort Options */}
          <div className="flex flex-wrap gap-2">
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => toggleSort(opt.value)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1',
                  sortField === opt.value
                    ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30'
                    : 'bg-dark-800 text-dark-400 hover:text-white border border-dark-700'
                )}
              >
                {opt.label}
                {sortField === opt.value && (
                  <span className="text-xs">{sortOrder === 'desc' ? '↓' : '↑'}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Type Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {fundTypes.map((t) => (
            <button
              key={t.value}
              onClick={() => setType(t.value)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                type === t.value
                  ? 'bg-gradient-to-r from-accent-blue to-accent-purple text-white'
                  : 'bg-dark-800/50 text-dark-400 hover:text-white border border-dark-700'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Fund Table */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-800 bg-dark-800/50">
                  <th className="text-left py-4 px-6 text-xs font-medium text-dark-400 uppercase tracking-wider">基金</th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-dark-400 uppercase tracking-wider">类型</th>
                  <th className="text-right py-4 px-4 text-xs font-medium text-dark-400 uppercase tracking-wider">近一年</th>
                  <th className="text-right py-4 px-4 text-xs font-medium text-dark-400 uppercase tracking-wider">近三年</th>
                  <th className="text-right py-4 px-4 text-xs font-medium text-dark-400 uppercase tracking-wider">最大回撤</th>
                  <th className="text-right py-4 px-4 text-xs font-medium text-dark-400 uppercase tracking-wider">规模</th>
                </tr>
              </thead>
              <tbody>
                {data?.funds?.map((fund: any) => (
                  <tr
                    key={fund.code}
                    className="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors cursor-pointer group"
                    onClick={() => window.location.href = `/funds/${fund.code}`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center">
                          <span className="text-accent-blue font-bold text-sm">{fund.type?.[0] || '基'}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium group-hover:text-accent-blue transition-colors">{fund.name}</p>
                          <p className="text-xs text-dark-500">{fund.code} · {fund.manager}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-dark-800 text-dark-300">
                        {fund.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={cn(
                        'font-mono font-medium',
                        fund.metrics?.oneYearReturn >= 0 ? 'text-accent-emerald' : 'text-accent-rose'
                      )}>
                        {formatPercent(fund.metrics?.oneYearReturn || 0)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={cn(
                        'font-mono',
                        fund.metrics?.threeYearReturn >= 0 ? 'text-accent-emerald' : 'text-accent-rose'
                      )}>
                        {formatPercent(fund.metrics?.threeYearReturn || 0)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-mono text-dark-400">
                        {formatPercent(fund.metrics?.maxDrawdown || 0)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-dark-300">{formatScale(fund.scale)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}