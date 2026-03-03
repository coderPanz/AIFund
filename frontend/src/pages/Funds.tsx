import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, Button, Loading } from '../components/ui'
import { FundCard } from '../components/FundCard'
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">基金库</h1>
        <p className="text-sm text-gray-500">
          共 {data?.total || 0} 只基金
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="text-sm text-gray-500 mr-2">类型</label>
            <div className="inline-flex gap-1">
              {fundTypes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    type === t.value
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1" />

          <div className="flex gap-2">
            {sortOptions.map((opt) => (
              <Button
                key={opt.value}
                variant={sortField === opt.value ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => toggleSort(opt.value)}
              >
                {opt.label}
                {sortField === opt.value && (
                  <span className="ml-1">{sortOrder === 'desc' ? '↓' : '↑'}</span>
                )}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Fund List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loading size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.funds?.map((fund: any) => (
            <FundCard key={fund.code} fund={fund} />
          ))}
        </div>
      )}
    </div>
  )
}