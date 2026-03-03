import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import fundRoutes from './routes/funds'
import marketRoutes from './routes/market'
import aiRoutes from './routes/ai'
import portfolioRoutes from './routes/portfolio'

const app = new Hono()

// CORS
app.use('/*', cors())

// API Routes
app.route('/api/funds', fundRoutes)
app.route('/api/market', marketRoutes)
app.route('/api/ai', aiRoutes)
app.route('/api/portfolio', portfolioRoutes)

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

const port = Number(process.env.PORT) || 3001

serve({
  fetch: app.fetch,
  port
})

console.log(`🚀 Server is running on http://localhost:${port}`)