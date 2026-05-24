import { Router } from 'express';
import prisma from '../config/db.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const zones = await prisma.deliveryZone.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { name: 'asc' },
      select: { id: true, code: true, name: true, fee: true },
    });
    res.json(
      zones.map((z) => ({
        ...z,
        fee: z.fee / 100,
        feeMinor: z.fee,
      }))
    );
  } catch {
    res.status(500).json({ message: 'Failed to fetch delivery zones.' });
  }
});

export default router;
