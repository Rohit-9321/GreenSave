import { Router } from 'express'
import { prisma } from '../prisma.js'
import { auth, AuthRequest } from '../middleware/auth.js'
import { estimateCO2 } from '../utils/co2.js'

const router = Router()

router.get('/', async (_req, res) => {
  const rows = await prisma.challenge.findMany({ orderBy: { id: 'desc' } })
  res.json(rows)
})

router.post('/', auth, async (req: AuthRequest, res) => {
  const { title, description, start_date, end_date } = req.body || {}
  if (!title || !description) return res.status(400).json({ error: 'Missing fields' })
  const challenge = await prisma.challenge.create({
    data: { title, description, startDate: start_date ? new Date(start_date) : null, endDate: end_date ? new Date(end_date) : null, createdBy: req.user!.id }
  })
  res.json(challenge)
})

router.post('/:id/join', auth, async (req: AuthRequest, res) => {
  const id = Number(req.params.id)
  await prisma.userChallenge.upsert({
    where: { userId_challengeId: { userId: req.user!.id, challengeId: id } },
    update: {},
    create: { userId: req.user!.id, challengeId: id }
  })
  res.json({ ok: true })
})

router.post('/:id/action', auth, async (req: AuthRequest, res) => {
  const challengeId = Number(req.params.id)
  const { type, amount } = req.body || {}
  if (!type || typeof amount !== 'number') return res.status(400).json({ error: 'Missing fields' })
  const co2 = estimateCO2(type, amount)
  const action = await prisma.action.create({
    data: { userId: req.user!.id, challengeId, type, amount: Number(amount), co2Saved: co2 }
  })
  res.json({ id: action.id, co2_saved: co2 })
})

export default router
