import { useState, useRef, useEffect } from 'react'
import { cn, formatPercent } from '../utils'
import { chatWithAI } from '../api'
import type { ChatMessage } from '../types'

const suggestedQuestions = [
  '我想投资科技主题基金，有什么推荐？',
  '低风险的债券基金有哪些？',
  '想定投指数基金，选哪个好？',
  '如何构建一个稳健的资产组合？',
]

export default function AIAdvisor() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '您好！我是 AI 基金选基助手。我可以帮您：\n\n• 根据投资目标推荐基金\n• 分析基金的投资价值\n• 比较不同基金的特点\n• 解答基金投资相关问题\n\n请问您想了解什么？',
      timestamp: Date.now(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (message?: string) => {
    const text = message || input.trim()
    if (!text || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, assistantMessage])

    try {
      await chatWithAI(text, (chunk) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? { ...msg, content: msg.content + chunk }
              : msg
          )
        )
      })
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? { ...msg, content: '抱歉，AI 服务暂时不可用，请稍后再试。' }
            : msg
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-grid">
      <div className="max-w-4xl w-full mx-auto flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-dark-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI 选基助手</h1>
              <p className="text-sm text-dark-400">智能分析，专业建议</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-3',
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-accent-blue to-accent-purple text-white'
                    : 'bg-dark-800 text-dark-100 border border-dark-700'
                )}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.content === '' && (
            <div className="flex justify-start">
              <div className="bg-dark-800 border border-dark-700 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent-blue rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-accent-blue rounded-full animate-pulse delay-75" />
                  <div className="w-2 h-2 bg-accent-blue rounded-full animate-pulse delay-150" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="px-6 pb-2">
            <p className="text-xs text-dark-500 mb-2">您可以问我：</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="text-xs px-3 py-1.5 bg-dark-800 hover:bg-dark-700 border border-dark-700 hover:border-dark-600 rounded-full text-dark-300 hover:text-white transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-6 border-t border-dark-800">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入您的投资问题..."
              className="flex-1 resize-none bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-accent-blue/50 transition-colors"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className={cn(
                'px-6 py-3 rounded-xl font-medium transition-all duration-200',
                input.trim() && !isLoading
                  ? 'bg-gradient-to-r from-accent-blue to-accent-purple text-white hover:opacity-90'
                  : 'bg-dark-800 text-dark-500 cursor-not-allowed'
              )}
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}