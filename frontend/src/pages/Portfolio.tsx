import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, Button, Badge } from '../components/ui'
import { getPortfolioSuggestion } from '../api'
import { formatPercent } from '../utils'

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

const riskProfiles = {
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
      // Calculate risk level
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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">资产配置建议</h1>
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">风险评估问卷</h2>
          <p className="text-gray-500 mb-6">
            完成 5 道问题，我们将根据您的风险偏好为您推荐合适的资产配置方案。
          </p>
          <Button size="lg" onClick={() => setStep('quiz')}>
            开始测评
          </Button>
        </Card>
      </div>
    )
  }

  if (step === 'quiz') {
    const question = riskQuestions[currentQuestion]
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-gray-900">风险评估</h1>
            <span className="text-sm text-gray-500">
              {currentQuestion + 1} / {riskQuestions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / riskQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {question.question}
          </h2>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.score)}
                className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-colors"
              >
                {option.text}
              </button>
            ))}
          </div>
        </Card>
      </div>
    )
  }

  // Result
  const profile = riskProfiles[riskLevel as keyof typeof riskProfiles]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">您的配置建议</h1>
        <Button variant="outline" onClick={resetQuiz}>
          重新测评
        </Button>
      </div>

      {/* Risk Profile */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
            <span className="text-xl font-bold text-primary-600">{riskLevel}</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{profile.type}投资者</h2>
            <p className="text-gray-500">{profile.description}</p>
          </div>
        </div>
      </Card>

      {/* Portfolio Suggestion */}
      {isLoading ? (
        <Card className="p-6 text-center text-gray-500">正在生成配置建议...</Card>
      ) : suggestion ? (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">推荐配置方案</h2>

          {/* Allocation Bar */}
          <div className="mb-6">
            <div className="flex h-8 rounded-lg overflow-hidden">
              {suggestion.allocations?.map((alloc: any, index: number) => {
                const colors = ['bg-primary-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500']
                return (
                  <div
                    key={index}
                    className={`${colors[index % colors.length]} flex items-center justify-center text-white text-sm`}
                    style={{ width: `${alloc.ratio}%` }}
                  >
                    {alloc.ratio}%
                  </div>
                )
              })}
            </div>
          </div>

          {/* Allocation Details */}
          <div className="space-y-4">
            {suggestion.allocations?.map((alloc: any, index: number) => (
              <div key={index} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{alloc.fundName}</h3>
                  <p className="text-sm text-gray-500">{alloc.fundCode}</p>
                </div>
                <div className="text-right">
                  <Badge variant={alloc.ratio > 30 ? 'warning' : 'default'}>
                    {alloc.ratio}%
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">{alloc.reason}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">预期年化收益</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatPercent(suggestion.expectedReturn || 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">预期最大回撤</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatPercent(suggestion.expectedRisk || 0)}
              </p>
            </div>
          </div>
        </Card>
      ) : null}

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 text-center">
        以上配置建议仅供参考，不构成投资建议。投资有风险，入市需谨慎。
      </p>
    </div>
  )
}