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

const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '2mb' }))

const __dirname = path.dirname(fileURLToPath(import.meta.url))
app.use('/uploads', express.static(path.join(process.cwd(), UPLOAD_DIR)))

app.get('/health', async (_req, res) => {
  try { await prisma.$queryRaw`SELECT 1`; res.json({ ok: true }) }
  catch { res.status(500).json({ ok: false }) }
})

app.use('/auth', authRoutes)
app.use('/challenges', challengeRoutes)
app.use('/analytics', analyticsRoutes)
app.use('/ai', aiRoutes)
app.use('/upload', uploadRoutes)
app.use('/social', socialRoutes)

app.listen(PORT, () => {
  console.log(`GreenSteps PRO backend running on http://localhost:${PORT}`)
})
