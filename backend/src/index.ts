import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { PORT, UPLOAD_DIR } from './config.js'
import { prisma } from './prisma.js'

import authRoutes from './routes/auth.js'
import challengeRoutes from './routes/challenges.js'
import analyticsRoutes from './routes/analytics.js'
import aiRoutes from './routes/ai.js'
import uploadRoutes from './routes/upload.js'
import socialRoutes from './routes/social.js'
import type { Request, Response, NextFunction } from 'express';
const app = express()

// ---- CORS (defaults + env override)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost',
  'https://greensave-1.onrender.com',
  ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',').map(s => s.trim()) : [])
]

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true) // curl/postman/same-origin
      if (allowedOrigins.includes(origin)) return cb(null, true)
      return cb(new Error(`Origin ${origin} not allowed by CORS`))
    },
    credentials: true,
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
  })
)
app.options('*', cors())

app.use(express.json({ limit: '2mb' }))

// ---- Static uploads
const __dirname = path.dirname(fileURLToPath(import.meta.url))
app.use('/uploads', express.static(path.join(process.cwd(), UPLOAD_DIR)))

// ---- Health & Debug
app.get('/health', async (_req, res) => {
  try { await prisma.$queryRaw`SELECT 1`; res.json({ ok: true }) }
  catch { res.status(500).json({ ok: false }) }
})

app.get('/debug', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({
      ok: true,
      jwt: process.env.JWT_SECRET ? 'set' : 'missing',
      origins: allowedOrigins
    })
  } catch (e) {
    console.error('DEBUG ERROR:', e)
    res.status(500).json({ ok: false })
  }
})

// ---- Routes
app.use('/auth', authRoutes)
app.use('/challenges', challengeRoutes)
app.use('/analytics', analyticsRoutes)
app.use('/ai', aiRoutes)
app.use('/upload', uploadRoutes)
app.use('/social', socialRoutes)

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Request error:', err);
  const message = err instanceof Error ? err.message : 'Internal Server Error';
  res.status(500).json({ error: message });
});

app.listen(PORT, () => {
  console.log(`GreenSteps PRO backend running on http://localhost:${PORT}`)
})
