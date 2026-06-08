import { Router } from 'express';
import prisma from '../config/db.js';
import { adminMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// ─── Public ───────────────────────────────────────────────────────────────────
// GET /api/delivery-zones — list active zones for checkout
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

// ─── Admin ────────────────────────────────────────────────────────────────────
// GET /api/delivery-zones/admin — list ALL zones (including inactive)
router.get('/admin', adminMiddleware, async (_req, res) => {
  try {
    const zones = await prisma.deliveryZone.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
    res.json(
      zones.map((z) => ({
        id: z.id,
        code: z.code,
        name: z.name,
        fee: z.fee / 100,
        feeMinor: z.fee,
        isActive: z.isActive,
        createdAt: z.createdAt,
        updatedAt: z.updatedAt,
      }))
    );
  } catch {
    res.status(500).json({ message: 'Failed to fetch delivery zones.' });
  }
});

// POST /api/delivery-zones/admin — create a zone
router.post('/admin', adminMiddleware, async (req, res) => {
  const { name, code, fee } = req.body as { name: string; code: string; fee: number };

  if (!name?.trim() || !code?.trim() || fee === undefined || fee === null) {
    return res.status(400).json({ message: 'name, code, and fee are required.' });
  }
  if (isNaN(Number(fee)) || Number(fee) < 0) {
    return res.status(400).json({ message: 'fee must be a non-negative number.' });
  }

  try {
    const zone = await prisma.deliveryZone.create({
      data: {
        name: name.trim(),
        code: code.trim().toUpperCase().replace(/\s+/g, '_'),
        fee: Math.round(Number(fee) * 100), // store in minor units
        isActive: true,
      },
    });
    return res.status(201).json({
      id: zone.id,
      code: zone.code,
      name: zone.name,
      fee: zone.fee / 100,
      feeMinor: zone.fee,
      isActive: zone.isActive,
    });
  } catch (err: any) {
    if (err?.code === 'P2002') {
      return res.status(409).json({ message: `A delivery zone with code "${code}" already exists.` });
    }
    return res.status(500).json({ message: 'Failed to create delivery zone.' });
  }
});

// PUT /api/delivery-zones/admin/:id — update a zone
router.put('/admin/:id', adminMiddleware, async (req, res) => {
  const id = req.params.id as string;
  const { name, code, fee, isActive } = req.body as {
    name?: string;
    code?: string;
    fee?: number;
    isActive?: boolean;
  };

  try {
    const existing = await prisma.deliveryZone.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      return res.status(404).json({ message: 'Delivery zone not found.' });
    }

    const updated = await prisma.deliveryZone.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(code !== undefined && { code: code.trim().toUpperCase().replace(/\s+/g, '_') }),
        ...(fee !== undefined && { fee: Math.round(Number(fee) * 100) }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return res.json({
      id: updated.id,
      code: updated.code,
      name: updated.name,
      fee: updated.fee / 100,
      feeMinor: updated.fee,
      isActive: updated.isActive,
    });
  } catch (err: any) {
    if (err?.code === 'P2002') {
      return res.status(409).json({ message: `A delivery zone with that code already exists.` });
    }
    return res.status(500).json({ message: 'Failed to update delivery zone.' });
  }
});

// PATCH /api/delivery-zones/admin/:id/toggle — toggle isActive
router.patch('/admin/:id/toggle', adminMiddleware, async (req, res) => {
  const id = req.params.id as string;
  try {
    const existing = await prisma.deliveryZone.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      return res.status(404).json({ message: 'Delivery zone not found.' });
    }
    const updated = await prisma.deliveryZone.update({
      where: { id },
      data: { isActive: !existing.isActive },
    });
    return res.json({ id: updated.id, isActive: updated.isActive });
  } catch {
    return res.status(500).json({ message: 'Failed to toggle delivery zone.' });
  }
});

// DELETE /api/delivery-zones/admin/:id — soft-delete
router.delete('/admin/:id', adminMiddleware, async (req, res) => {
  const id = req.params.id as string;
  try {
    const existing = await prisma.deliveryZone.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      return res.status(404).json({ message: 'Delivery zone not found.' });
    }
    // Soft-delete: append timestamp to code to free the unique index
    await prisma.deliveryZone.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
        code: `${existing.code}-deleted-${Date.now()}`,
      },
    });
    return res.json({ message: 'Delivery zone deleted.' });
  } catch {
    return res.status(500).json({ message: 'Failed to delete delivery zone.' });
  }
});

export default router;
