import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { OAuth2Client } from 'google-auth-library'
import { prisma } from '../prisma.js'
import { signToken } from '../utils/jwt.js'
import { GOOGLE_CLIENT_ID, SMTP } from '../config.js'
import nodemailer from 'nodemailer'

const router = Router()
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null

router.post('/register', async (req, res) => {
  const { email, name, password } = req.body || {}
  if (!email || !name || !password) return res.status(400).json({ error: 'Missing fields' })
  const hash = bcrypt.hashSync(password, 10)
  try {
    const user = await prisma.user.create({ data: { email, name, passwordHash: hash }})
    const token = signToken({ id: user.id, email: user.email, name: user.name })
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
  } catch (e: any) {
    if (String(e).includes('Unique constraint')) return res.status(409).json({ error: 'Email exists' })
    res.status(500).json({ error: 'Failed to register' })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' })
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  const ok = bcrypt.compareSync(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
  const token = signToken({ id: user.id, email: user.email, name: user.name })
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
})

router.post('/demo', async (_req, res) => {
  let user = await prisma.user.findUnique({ where: { email: 'demo@greensteps.app' } })
  if (!user) {
    user = await prisma.user.create({ data: { email: 'demo@greensteps.app', name: 'Demo User', passwordHash: bcrypt.hashSync('demo1234',10) }})
  }
  const token = signToken({ id: user.id, email: user.email, name: user.name })
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
})

// Google ID token sign-in
router.post('/google', async (req, res) => {
  const { idToken } = req.body || {}
  if (!GOOGLE_CLIENT_ID || !googleClient) return res.status(400).json({ error: 'Google login not configured' })
  try {
    const ticket = await googleClient.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID })
    const payload = ticket.getPayload()
    if (!payload?.email || !payload.name) return res.status(400).json({ error: 'Invalid Google token' })
    let user = await prisma.user.findUnique({ where: { email: payload.email } })
    if (!user) {
      user = await prisma.user.create({ data: { email: payload.email, name: payload.name, passwordHash: bcrypt.hashSync(Math.random().toString(36), 10) } })
    }
    const token = signToken({ id: user.id, email: user.email, name: user.name })
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
  } catch (e) {
    res.status(400).json({ error: 'Google token verification failed' })
  }
})

// OTP start
router.post('/otp/start', async (req, res) => {
  const { email } = req.body || {}
  if (!email) return res.status(400).json({ error: 'Email required' })
  const code = (Math.floor(100000 + Math.random()*900000)).toString()
  const expiresAt = new Date(Date.now() + 10*60*1000)
  await prisma.otp.create({ data: { email, code, expiresAt } })

  if (SMTP.host && SMTP.user && SMTP.pass) {
    const transport = nodemailer.createTransport({ host: SMTP.host, port: SMTP.port, auth: { user: SMTP.user, pass: SMTP.pass } })
    await transport.sendMail({ from: SMTP.from, to: email, subject: 'Your GreenSteps OTP', text: `Your code is ${code} (valid 10 minutes)` })
    res.json({ sent: true })
  } else {
    console.log(`[OTP] ${email} -> ${code}`)
    res.json({ sent: false, note: 'SMTP not configured; code logged to server console for demo.' })
  }
})

// OTP verify
router.post('/otp/verify', async (req, res) => {
  const { email, code, name } = req.body || {}
  if (!email || !code) return res.status(400).json({ error: 'Email and code required' })
  const otp = await prisma.otp.findFirst({ where: { email, code, used: false }, orderBy: { id: 'desc' } })
  if (!otp || otp.expiresAt < new Date()) return res.status(400).json({ error: 'Invalid or expired code' })
  await prisma.otp.update({ where: { id: otp.id }, data: { used: true } })

  let user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    user = await prisma.user.create({ data: { email, name: name || email.split('@')[0], passwordHash: bcrypt.hashSync(Math.random().toString(36), 10) } })
  }
  const token = signToken({ id: user.id, email: user.email, name: user.name })
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
})

export default router
