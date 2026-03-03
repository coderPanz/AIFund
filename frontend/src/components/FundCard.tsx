import { Link } from 'react-router-dom'
import { Card, Badge } from './ui'
import { Fund } from '../types'
import { formatPercent, formatScale, getReturnColor } from '../utils'

interface FundCardProps {
  fund: Fund & { metrics?: { oneYearReturn: number; maxDrawdown: number } }
}

export function FundCard({ fund }: FundCardProps) {
  const returnColor = getReturnColor(fund.metrics?.oneYearReturn || 0)

  return (
    <Link to={`/funds/${fund.code}`}>
      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium text-gray-900">{fund.name}</h3>
            <p className="text-sm text-gray-500">{fund.code}</p>
          </div>
          <Badge>{fund.type}</Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500">近一年收益</p>
            <p className={`font-semibold ${returnColor}`}>
              {formatPercent(fund.metrics?.oneYearReturn || 0)}
            </p>
          </div>
          <div>
            <p className="text-gray-500">最大回撤</p>
            <p className="font-semibold text-gray-900">
              {formatPercent(fund.metrics?.maxDrawdown || 0)}
            </p>
          </div>
          <div>
            <p className="text-gray-500">规模</p>
            <p className="font-semibold text-gray-900">{formatScale(fund.scale)}</p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-500">
          <span>基金经理: {fund.manager}</span>
          <span>{fund.company}</span>
        </div>
      </Card>
    </Link>
  )
}