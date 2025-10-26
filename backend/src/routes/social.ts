import { Router } from 'express'
import { prisma } from '../prisma.js'
import { auth, AuthRequest } from '../middleware/auth.js'

const router = Router()

router.post('/groups', auth, async (req: AuthRequest, res) => {
  const { name } = req.body || {}
  if (!name) return res.status(400).json({ error: 'Name required' })
  const g = await prisma.group.create({ data: { name, ownerId: req.user!.id }})
  await prisma.groupMember.create({ data: { groupId: g.id, userId: req.user!.id, role: 'owner' } })
  res.json({ id: g.id, name: g.name })
})

router.get('/groups', auth, async (_req: AuthRequest, res) => {
  const groups = await prisma.$queryRawUnsafe<any[]>(`
    SELECT g.*, (SELECT COUNT(*) FROM "GroupMember" gm WHERE gm."groupId" = g.id) as members
    FROM "Group" g ORDER BY g.id DESC
  `)
  res.json(groups)
})

router.post('/groups/:id/join', auth, async (req: AuthRequest, res) => {
  const gid = Number(req.params.id)
  await prisma.groupMember.upsert({
    where: { groupId_userId: { groupId: gid, userId: req.user!.id } },
    update: {},
    create: { groupId: gid, userId: req.user!.id }
  })
  res.json({ ok: true })
})

export default router
