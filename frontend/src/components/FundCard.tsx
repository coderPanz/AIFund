import { Link } from 'react-router-dom'
import { cn, formatPercent, formatScale } from '../utils'
import { Fund } from '../types'

interface FundCardProps {
  fund: Fund & { metrics?: { oneYearReturn: number; maxDrawdown: number } }
}

export function FundCard({ fund }: FundCardProps) {
  const isPositive = fund.metrics?.oneYearReturn >= 0

  return (
    <Link to={`/funds/${fund.code}`}>
      <div className="glass-card p-5 hover:border-accent-blue/30 transition-all duration-300 cursor-pointer group">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-medium text-white group-hover:text-accent-blue transition-colors">{fund.name}</h3>
            <p className="text-sm text-dark-500 mt-1">{fund.code}</p>
          </div>
          <span className="px-2.5 py-1 text-xs rounded-full bg-dark-800 text-dark-300 border border-dark-700">
            {fund.type}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-dark-500 text-xs mb-1">近一年收益</p>
            <p className={cn(
              'font-semibold font-mono',
              isPositive ? 'text-accent-emerald' : 'text-accent-rose'
            )}>
              {formatPercent(fund.metrics?.oneYearReturn || 0)}
            </p>
          </div>
          <div>
            <p className="text-dark-500 text-xs mb-1">最大回撤</p>
            <p className="font-semibold font-mono text-dark-200">
              {formatPercent(fund.metrics?.maxDrawdown || 0)}
            </p>
          </div>
          <div>
            <p className="text-dark-500 text-xs mb-1">规模</p>
            <p className="font-semibold text-dark-200">{formatScale(fund.scale)}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-dark-800 flex justify-between text-xs text-dark-500">
          <span>{fund.manager}</span>
          <span>{fund.company}</span>
        </div>
      </div>
    </Link>
  )
}