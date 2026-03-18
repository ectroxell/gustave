import request from 'supertest';
import { db } from '../../db/index.js';
import {
  purchaseOrders,
  purchaseOrderItems,
  receipts,
  receiptLines,
} from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { app } from '../app.js';

/**
 * Helper: reset the receiving-related state for a specific PO
 * back to its seed values, so each test starts from a known state.
 */
function resetPO(poNumber: string, seedStatus: string, itemSeeds: { id: number; qtyReceived: number }[]) {
  // Delete any receipts (and their lines) added by tests
  const po = db.select()
    .from(purchaseOrders)
    .where(eq(purchaseOrders.poNumber, poNumber))
    .get()!;
  const testReceipts = db.select()
    .from(receipts)
    .where(eq(receipts.purchaseOrderId, po.id))
    .all();
  // Find receipts that were NOT in the seed data (seed receipts have receiptNumber <= REC-HYR-005)
  for (const rec of testReceipts) {
    const num = parseInt(rec.receiptNumber.replace('REC-HYR-', ''), 10);
    if (num > 5) {
      db.delete(receiptLines)
        .where(eq(receiptLines.receiptId, rec.id))
        .run();
      db.delete(receipts)
        .where(eq(receipts.id, rec.id))
        .run();
    }
  }
  // Reset PO status
  db.update(purchaseOrders)
    .set({ status: seedStatus })
    .where(eq(purchaseOrders.id, po.id))
    .run();
  // Reset item quantities
  for (const seed of itemSeeds) {
    db.update(purchaseOrderItems)
      .set({ quantityReceived: seed.qtyReceived })
      .where(eq(purchaseOrderItems.id, seed.id))
      .run();
  }
}

// Seed state for POs used in tests
const PO_HYR_004_SEEDS = {
  status: 'pending',
  items: [
    { id: 14, qtyReceived: 0 }, // Fierce Deity Mask, 1 ordered
    { id: 15, qtyReceived: 0 }, // Shock Arrow, 20 ordered
    { id: 16, qtyReceived: 0 }, // Ancient Screw, 15 ordered
    { id: 17, qtyReceived: 0 }, // Fairy in a Bottle, 3 ordered
  ],
};

const PO_HYR_005_SEEDS = {
  status: 'pending',
  items: [
    { id: 18, qtyReceived: 0 }, // Biggoron Sword, 1 ordered
    { id: 19, qtyReceived: 0 }, // Mirror Shield, 1 ordered
    { id: 20, qtyReceived: 0 }, // Bombchu, 10 ordered
    { id: 21, qtyReceived: 0 }, // Mighty Bananas, 5 ordered
  ],
};

const PO_HYR_002_SEEDS = {
  status: 'partial',
  items: [
    { id: 5, qtyReceived: 1 }, // Master Sword
    { id: 6, qtyReceived: 1 }, // Hylian Shield
    { id: 7, qtyReceived: 20 }, // Arrow, 30 ordered
    { id: 8, qtyReceived: 0 }, // Fire Arrow, 10 ordered
    { id: 9, qtyReceived: 0 }, // Bomb, 5 ordered
  ],
};

describe('POST /api/purchase-orders/:poNumber/receive', () => {
  beforeEach(() => {
    resetPO('PO-HYR-004', PO_HYR_004_SEEDS.status, PO_HYR_004_SEEDS.items);
    resetPO('PO-HYR-005', PO_HYR_005_SEEDS.status, PO_HYR_005_SEEDS.items);
    resetPO('PO-HYR-002', PO_HYR_002_SEEDS.status, PO_HYR_002_SEEDS.items);
  });

  afterEach(() => {
    resetPO('PO-HYR-004', PO_HYR_004_SEEDS.status, PO_HYR_004_SEEDS.items);
    resetPO('PO-HYR-005', PO_HYR_005_SEEDS.status, PO_HYR_005_SEEDS.items);
    resetPO('PO-HYR-002', PO_HYR_002_SEEDS.status, PO_HYR_002_SEEDS.items);
  });

  it('returns 201 with correct receipt shape on successful receive', async () => {
    const res = await request(app)
      .post('/api/purchase-orders/PO-HYR-004/receive')
      .send({
        lines: [
          { purchaseOrderItemId: 14, quantity: 1 },
        ],
        notes: 'First partial delivery',
      });

    expect(res.status)
      .toBe(201);
    expect(res.body.data)
      .toMatchObject({
        receiptNumber: expect.stringMatching(/^REC-HYR-\d{3}$/),
        notes: 'First partial delivery',
        lines: [
          expect.objectContaining({
            purchaseOrderItemId: 14,
            quantityReceived: 1,
            isReceived: true,
          }),
        ],
      });
    expect(res.body.data.id)
      .toBeTypeOf('number');
    expect(res.body.data.createdAt)
      .toBeTypeOf('string');
  });

  it('defaults notes to null when omitted', async () => {
    const res = await request(app)
      .post('/api/purchase-orders/PO-HYR-004/receive')
      .send({
        lines: [{ purchaseOrderItemId: 15, quantity: 1 }],
      });

    expect(res.status)
      .toBe(201);
    expect(res.body.data.notes)
      .toBeNull();
  });

  it('sets isReceived to false when item is not fully received', async () => {
    const res = await request(app)
      .post('/api/purchase-orders/PO-HYR-004/receive')
      .send({
        lines: [{ purchaseOrderItemId: 15, quantity: 5 }], // 5 of 20
      });

    expect(res.status)
      .toBe(201);
    expect(res.body.data.lines[0].isReceived)
      .toBe(false);
  });

  it('updates PO status to "partial" when not all items are fully received', async () => {
    const res = await request(app)
      .post('/api/purchase-orders/PO-HYR-005/receive')
      .send({
        lines: [{ purchaseOrderItemId: 18, quantity: 1 }], // Biggoron Sword fully received, but 3 other items remain
      });

    expect(res.status)
      .toBe(201);

    const poRes = await request(app)
      .get('/api/purchase-orders/PO-HYR-005');
    expect(poRes.body.data.status)
      .toBe('partial');
  });

  it('updates PO status to "received" when all items are fully received', async () => {
    const res = await request(app)
      .post('/api/purchase-orders/PO-HYR-005/receive')
      .send({
        lines: [
          { purchaseOrderItemId: 18, quantity: 1 }, // Biggoron Sword: 1/1
          { purchaseOrderItemId: 19, quantity: 1 }, // Mirror Shield: 1/1
          { purchaseOrderItemId: 20, quantity: 10 }, // Bombchu: 10/10
          { purchaseOrderItemId: 21, quantity: 5 }, // Mighty Bananas: 5/5
        ],
      });

    expect(res.status)
      .toBe(201);

    const poRes = await request(app)
      .get('/api/purchase-orders/PO-HYR-005');
    expect(poRes.body.data.status)
      .toBe('received');
  });

  it('updates quantityReceived on the PO item after receiving', async () => {
    await request(app)
      .post('/api/purchase-orders/PO-HYR-002/receive')
      .send({
        lines: [{ purchaseOrderItemId: 8, quantity: 3 }], // Fire Arrow: 0 + 3 = 3
      });

    const poRes = await request(app)
      .get('/api/purchase-orders/PO-HYR-002');
    const fireArrow = poRes.body.data.items.find(
      (item: { id: number }) => item.id === 8,
    );
    expect(fireArrow.quantityReceived)
      .toBe(3);
  });

  it('returns 404 for non-existent PO', async () => {
    const res = await request(app)
      .post('/api/purchase-orders/PO-FAKE-999/receive')
      .send({
        lines: [{ purchaseOrderItemId: 1, quantity: 1 }],
      });

    expect(res.status)
      .toBe(404);
    expect(res.body.error)
      .toContain('PO-FAKE-999');
  });

  it('returns 400 for already-received PO', async () => {
    const res = await request(app)
      .post('/api/purchase-orders/PO-HYR-001/receive')
      .send({
        lines: [{ purchaseOrderItemId: 1, quantity: 1 }],
      });

    expect(res.status)
      .toBe(400);
    expect(res.body.error)
      .toBe('Purchase order is already fully received');
  });

  it('returns 400 for item not belonging to the PO', async () => {
    const res = await request(app)
      .post('/api/purchase-orders/PO-HYR-004/receive')
      .send({
        lines: [{ purchaseOrderItemId: 1, quantity: 1 }], // Item 1 belongs to PO-HYR-001
      });

    expect(res.status)
      .toBe(400);
    expect(res.body.error)
      .toContain('does not belong to this purchase order');
  });

  it('returns 400 when quantity exceeds remaining', async () => {
    const res = await request(app)
      .post('/api/purchase-orders/PO-HYR-004/receive')
      .send({
        lines: [{ purchaseOrderItemId: 16, quantity: 999 }], // Ancient Screw: 15 ordered
      });

    expect(res.status)
      .toBe(400);
    expect(res.body.error)
      .toMatch(/only \d+ remaining/);
  });

  it('returns 400 for empty lines array', async () => {
    const res = await request(app)
      .post('/api/purchase-orders/PO-HYR-004/receive')
      .send({ lines: [] });

    expect(res.status)
      .toBe(400);
    expect(res.body.error)
      .toContain('non-empty');
  });

  it('returns 400 for missing lines', async () => {
    const res = await request(app)
      .post('/api/purchase-orders/PO-HYR-004/receive')
      .send({ notes: 'no lines' });

    expect(res.status)
      .toBe(400);
    expect(res.body.error)
      .toContain('non-empty');
  });

  it('returns 400 for quantity of zero', async () => {
    const res = await request(app)
      .post('/api/purchase-orders/PO-HYR-004/receive')
      .send({
        lines: [{ purchaseOrderItemId: 14, quantity: 0 }],
      });

    expect(res.status)
      .toBe(400);
    expect(res.body.error)
      .toContain('greater than 0');
  });

  it('returns 400 for negative quantity', async () => {
    const res = await request(app)
      .post('/api/purchase-orders/PO-HYR-004/receive')
      .send({
        lines: [{ purchaseOrderItemId: 14, quantity: -5 }],
      });

    expect(res.status)
      .toBe(400);
    expect(res.body.error)
      .toContain('greater than 0');
  });
});
