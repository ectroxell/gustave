import { Router } from 'express';
import { desc, eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import {
  purchaseOrders,
  receipts,
  receiptLines,
  purchaseOrderItems,
  items,
  warehouseLocations,
} from '../../db/schema.js';

const router = Router();

type ReceiptLineResponse = {
  id: number;
  quantityReceived: number;
  item: {
    id: number;
    name: string;
    category: string;
  };
  warehouseLocation: string | null;
};

type ReceiptResponse = {
  id: number;
  receiptNumber: string;
  notes: string | null;
  createdAt: string;
  lines: ReceiptLineResponse[];
};

type ReceiptsListResponse = {
  data: ReceiptResponse[];
};

/**
 * @openapi
 * /api/purchase-orders/{poNumber}/receipts:
 *   get:
 *     tags:
 *       - Receiving
 *     summary: List all receipts for a purchase order
 *     description: >
 *       Returns all receipts recorded against a purchase order, ordered by most
 *       recent first. Each receipt includes its line items with item names,
 *       categories, quantities received, and warehouse location names.
 *     parameters:
 *       - in: path
 *         name: poNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique purchase order number (e.g. "PO-HYR-001")
 *         example: PO-HYR-001
 *     responses:
 *       200:
 *         description: List of receipts for the purchase order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       receiptNumber:
 *                         type: string
 *                         example: REC-HYR-001
 *                       notes:
 *                         type: string
 *                         nullable: true
 *                         example: "First delivery batch"
 *                       createdAt:
 *                         type: string
 *                         example: "2025-01-15 12:00:00"
 *                       lines:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             quantityReceived:
 *                               type: integer
 *                               example: 5
 *                             item:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                   example: 2
 *                                 name:
 *                                   type: string
 *                                   example: Deku Shield
 *                                 category:
 *                                   type: string
 *                                   example: shield
 *                             warehouseLocation:
 *                               type: string
 *                               nullable: true
 *                               example: "Zone A - Shelf 1"
 *       404:
 *         description: Purchase order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Purchase order not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch receipts
 */
router.get('/:poNumber/receipts', async (req, res) => {
  const { poNumber } = req.params;

  try {
    const po = db
      .select()
      .from(purchaseOrders)
      .where(eq(purchaseOrders.poNumber, poNumber))
      .get();

    if (!po) {
      res.status(404)
        .json({ error: 'Purchase order not found' });
      return;
    }

    const poReceipts = db
      .select()
      .from(receipts)
      .where(eq(receipts.purchaseOrderId, po.id))
      .orderBy(desc(receipts.createdAt))
      .all();

    const receiptData: ReceiptResponse[] = [];

    for (const receipt of poReceipts) {
      const lines = db
        .select({
          id: receiptLines.id,
          quantityReceived: receiptLines.quantityReceived,
          item: {
            id: items.id,
            name: items.name,
            category: items.category,
          },
          warehouseLocationName: warehouseLocations.name,
        })
        .from(receiptLines)
        .innerJoin(purchaseOrderItems, eq(receiptLines.purchaseOrderItemId, purchaseOrderItems.id))
        .innerJoin(items, eq(purchaseOrderItems.itemId, items.id))
        .leftJoin(warehouseLocations, eq(purchaseOrderItems.warehouseLocationId, warehouseLocations.id))
        .where(eq(receiptLines.receiptId, receipt.id))
        .all();

      receiptData.push({
        id: receipt.id,
        receiptNumber: receipt.receiptNumber,
        notes: receipt.notes,
        createdAt: receipt.createdAt,
        lines: lines.map((line) => ({
          id: line.id,
          quantityReceived: line.quantityReceived,
          item: {
            id: line.item.id,
            name: line.item.name,
            category: line.item.category,
          },
          warehouseLocation: line.warehouseLocationName ?? null,
        })),
      });
    }

    const response: ReceiptsListResponse = { data: receiptData };
    res.json(response);
  } catch (err) {
    console.error('Failed to fetch receipts:', err);
    res.status(500)
      .json({ error: 'Failed to fetch receipts' });
  }
});

export { router as receiptRoutes };
