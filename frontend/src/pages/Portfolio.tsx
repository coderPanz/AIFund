import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { cn, formatPercent } from '../utils'
import { getPortfolioSuggestion } from '../api'

const riskQuestions = [
  {
    question: '您的年龄范围是？',
    options: [
      { text: '30岁以下', score: 5 },
      { text: '30-45岁', score: 4 },
      { text: '45-55岁', score: 3 },
      { text: '55-65岁', score: 2 },
      { text: '65岁以上', score: 1 },
    ],
  },
  {
    question: '您的主要收入来源是？',
    options: [
      { text: '工资收入为主', score: 3 },
      { text: '经营收入为主', score: 4 },
      { text: '投资收入为主', score: 5 },
      { text: '退休金为主', score: 2 },
      { text: '其他', score: 3 },
    ],
  },
  {
    question: '您计划投资的资金占您总资产的比例？',
    options: [
      { text: '10%以下', score: 5 },
      { text: '10%-30%', score: 4 },
      { text: '30%-50%', score: 3 },
      { text: '50%-70%', score: 2 },
      { text: '70%以上', score: 1 },
    ],
  },
  {
    question: '您的投资期限是？',
    options: [
      { text: '1年以内', score: 1 },
      { text: '1-3年', score: 2 },
      { text: '3-5年', score: 3 },
      { text: '5-10年', score: 4 },
      { text: '10年以上', score: 5 },
    ],
  },
  {
    question: '如果您的投资亏损了20%，您会？',
    options: [
      { text: '立即卖出止损', score: 1 },
      { text: '卖出部分减少风险', score: 2 },
      { text: '持有等待恢复', score: 3 },
      { text: '考虑加仓', score: 4 },
      { text: '大量加仓', score: 5 },
    ],
  },
]

const riskProfiles: Record<number, { type: string; description: string }> = {
  1: { type: '保守型', description: '您倾向于低风险投资，适合以债券、货币基金为主的稳健配置。' },
  2: { type: '稳健型', description: '您可以承受适度风险，适合股债平衡型的配置方案。' },
  3: { type: '平衡型', description: '您追求风险与收益的平衡，适合股债均衡配置。' },
  4: { type: '成长型', description: '您能承受较高风险追求更高收益，适合偏股型配置。' },
  5: { type: '进取型', description: '您追求较高收益，能承受较大波动，适合积极型配置。' },
}

export default function Portfolio() {
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [riskLevel, setRiskLevel] = useState(3)

  const { data: suggestion, isLoading } = useQuery({
    queryKey: ['portfolio', riskLevel],
    queryFn: () => getPortfolioSuggestion(riskLevel),
    enabled: step === 'result',
  })

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score]
    setAnswers(newAnswers)

    if (currentQuestion < riskQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      const totalScore = newAnswers.reduce((a, b) => a + b, 0)
      const avgScore = totalScore / newAnswers.length
      const level = Math.min(5, Math.max(1, Math.round(avgScore)))
      setRiskLevel(level)
      setStep('result')
    }
  }

  const resetQuiz = () => {
    setStep('intro')
    setCurrentQuestion(0)
    setAnswers([])
  }

  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-grid flex items-center justify-center">
        <div className="max-w-lg w-full mx-4">
          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">资产配置建议</h2>
            <p className="text-dark-400 mb-8">
              完成 5 道问题，我们将根据您的风险偏好为您推荐合适的资产配置方案。
            </p>
            <button
              onClick={() => setStep('quiz')}
              className="btn-primary w-full text-lg py-4"
            >
              开始测评
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'quiz') {
    const question = riskQuestions[currentQuestion]
    return (
      <div className="min-h-screen bg-grid flex items-center justify-center">
        <div className="max-w-2xl w-full mx-4">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-dark-400 text-sm">问题 {currentQuestion + 1} / {riskQuestions.length}</span>
              <span className="text-dark-500 text-sm">{Math.round(((currentQuestion + 1) / riskQuestions.length) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-blue to-accent-purple rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / riskQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="glass-card p-8">
            <h2 className="text-xl font-semibold text-white mb-6">
              {question.question}
            </h2>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.score)}
                  className="w-full text-left px-5 py-4 bg-dark-800/50 border border-dark-700 rounded-xl text-dark-200 hover:bg-dark-800 hover:border-accent-blue/30 hover:text-white transition-all duration-200"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Result
  const profile = riskProfiles[riskLevel]

  return (
    <div className="min-h-screen bg-grid">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">您的配置建议</h1>
            <p className="text-dark-400 mt-1">基于您的风险偏好量身定制</p>
          </div>
          <button
            onClick={resetQuiz}
            className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-dark-300 hover:text-white hover:border-dark-600 transition-all"
          >
            重新测评
          </button>
        </div>

        {/* Risk Profile */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className={cn(
              'w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold text-white',
              riskLevel <= 2 ? 'bg-gradient-to-br from-accent-emerald to-accent-cyan' :
              riskLevel === 3 ? 'bg-gradient-to-br from-accent-blue to-accent-purple' :
              'bg-gradient-to-br from-accent-amber to-accent-rose'
            )}>
              {riskLevel}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{profile.type}投资者</h2>
              <p className="text-dark-400">{profile.description}</p>
            </div>
          </div>
        </div>

        {/* Portfolio Suggestion */}
        {isLoading ? (
          <div className="glass-card p-8 text-center">
            <div className="w-8 h-8 mx-auto border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
            <p className="text-dark-400 mt-4">正在生成配置建议...</p>
          </div>
        ) : suggestion ? (
          <>
            {/* Allocation Chart */}
            <div className="glass-card p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">资产配置比例</h3>
              <div className="h-10 flex rounded-xl overflow-hidden mb-4">
                {suggestion.allocations?.map((alloc: any, index: number) => {
                  const colors = [
                    'bg-gradient-to-r from-accent-blue to-accent-cyan',
                    'bg-gradient-to-r from-accent-purple to-accent-rose',
                    'bg-gradient-to-r from-accent-emerald to-accent-cyan',
                    'bg-gradient-to-r from-accent-amber to-accent-rose',
                    'bg-gradient-to-r from-accent-blue to-accent-purple',
                  ]
                  return (
                    <div
                      key={index}
                      className={cn('flex items-center justify-center text-white text-sm font-medium', colors[index % colors.length])}
                      style={{ width: `${alloc.ratio}%` }}
                    >
                      {alloc.ratio}%
                    </div>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4">
                {suggestion.allocations?.map((alloc: any, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={cn(
                      'w-3 h-3 rounded',
                      index === 0 ? 'bg-accent-blue' :
                      index === 1 ? 'bg-accent-purple' :
                      index === 2 ? 'bg-accent-emerald' :
                      index === 3 ? 'bg-accent-amber' :
                      'bg-accent-rose'
                    )} />
                    <span className="text-sm text-dark-300">{alloc.fundName}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Allocation Details */}
            <div className="space-y-4 mb-6">
              {suggestion.allocations?.map((alloc: any, index: number) => (
                <div key={index} className="glass-card p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-white font-medium">{alloc.fundName}</h4>
                      <p className="text-xs text-dark-500 mt-1">{alloc.fundCode}</p>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        'px-3 py-1 rounded-full text-sm font-medium',
                        alloc.ratio > 30 ? 'bg-accent-amber/20 text-accent-amber' : 'bg-dark-800 text-dark-300'
                      )}>
                        {alloc.ratio}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-dark-400 mt-3">{alloc.reason}</p>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="glass-card p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-dark-800/50 rounded-xl">
                  <p className="text-sm text-dark-400 mb-1">预期年化收益</p>
                  <p className="text-2xl font-bold text-accent-emerald">
                    {formatPercent(suggestion.expectedReturn || 0)}
                  </p>
                </div>
                <div className="text-center p-4 bg-dark-800/50 rounded-xl">
                  <p className="text-sm text-dark-400 mb-1">预期最大回撤</p>
                  <p className="text-2xl font-bold text-accent-rose">
                    {formatPercent(suggestion.expectedRisk || 0)}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : null}

        {/* Disclaimer */}
        <p className="text-xs text-dark-500 text-center mt-8">
          以上配置建议仅供参考，不构成投资建议。投资有风险，入市需谨慎。
        </p>
      </div>
    </div>
  )
}