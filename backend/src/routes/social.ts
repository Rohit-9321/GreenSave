// backend/src/routes/social.ts
import { Router, Response } from 'express';
import { prisma } from '../prisma.js';
import { auth, AuthRequest } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

// Create a group
router.post(
  '/groups',
  auth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const name = (req.body?.name ?? '').toString().trim();
    if (!name) return res.status(400).json({ error: 'Name required' });

    const g = await prisma.group.create({
      data: { name, ownerId: req.user!.id },
    });

    await prisma.groupMember.create({
      data: { groupId: g.id, userId: req.user!.id, role: 'owner' },
    });

    res.json({ id: g.id, name: g.name });
  })
);

// List groups (BigInt-safe via _count)
router.get(
  '/groups',
  auth,
  asyncHandler(async (_req: AuthRequest, res: Response) => {
    const rows = await prisma.group.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        _count: { select: { members: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const groups = rows.map((r) => ({
      id: r.id,
      name: r.name,
      createdAt: r.createdAt,
      members: Number(r._count.members),
    }));

    res.json(groups);
  })
);

// Join a group (with validation)
router.post(
  '/groups/:id/join',
  auth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const gid = Number(req.params.id);
    if (!Number.isInteger(gid) || gid <= 0) {
      return res.status(400).json({ error: 'Invalid group id' });
    }

    await prisma.groupMember.upsert({
      where: { groupId_userId: { groupId: gid, userId: req.user!.id } },
      update: {},
      create: { groupId: gid, userId: req.user!.id },
    });

    res.json({ ok: true });
  })
);

export default router;
