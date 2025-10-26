import { Router } from 'express'
import { prisma } from '../prisma.js'

const router = Router()

router.get('/summary', async (_req, res) => {
  const totalUsers = await prisma.user.count()
  const totalChallenges = await prisma.challenge.count()
  const totalActions = await prisma.action.count()
  const totalCO2Agg = await prisma.action.aggregate({ _sum: { co2Saved: true } })
  const totalCO2 = totalCO2Agg._sum.co2Saved || 0

  const byDay = await prisma.$queryRawUnsafe<any[]>(`
    SELECT to_char("createdAt", 'YYYY-MM-DD') as day, SUM("co2Saved") as co2
    FROM "Action"
    GROUP BY 1
    ORDER BY 1 ASC
  `)

  const topUsers = await prisma.$queryRawUnsafe<any[]>(`
    SELECT u.id, u.name, u.email, SUM(a."co2Saved") as co2
    FROM "User" u JOIN "Action" a ON a."userId" = u.id
    GROUP BY u.id
    ORDER BY co2 DESC
    LIMIT 10
  `)

  res.json({ totals: { totalUsers, totalChallenges, totalActions, totalCO2 }, timeseries: byDay, topUsers })
})

// New: group leaderboard
router.get('/group-leaderboard', async (_req, res) => {
  const rows = await prisma.$queryRawUnsafe<any[]>(`
    SELECT g.id, g.name, COALESCE(SUM(a."co2Saved"),0) as co2
    FROM "Group" g
    LEFT JOIN "GroupMember" gm ON gm."groupId" = g.id
    LEFT JOIN "Action" a ON a."userId" = gm."userId"
    GROUP BY g.id
    ORDER BY co2 DESC
    LIMIT 20
  `)
  res.json(rows)
})

export default router
