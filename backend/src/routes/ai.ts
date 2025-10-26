import { Router } from 'express'

const router = Router()

router.post('/tips', async (req, res) => {
  const { context } = req.body || {}
  const fallback = [
    'Batch errands; replace 2 short car trips with walking/biking.',
    'Shift 1 meal/day to plant-based for a week.',
    'Switch to LEDs; unplug idle devices.',
    'Plan a transit day—log bus/train km saved.',
    'Set a weekly CO₂ goal and share progress.'
  ]
  // (Optionally integrate OpenAI like in the non-pro version; omitted here for brevity)
  res.json({ source: 'fallback', tips: fallback })
})

export default router
