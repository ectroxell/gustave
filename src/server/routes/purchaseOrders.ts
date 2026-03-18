import { Router } from 'express';
import { count, eq, sum } from 'drizzle-orm';
import { db } from '../../db/index.js';
import {
  purchaseOrders,
  purchaseOrderItems,
  characters,
  items,
  receipts,
  receiptLines,
} from '../../db/schema.js';

const router = Router();

type PurchaseOrderSummary = {
  id: number;
  poNumber: string;
  status: string;
  characterName: string;
  totalItems: number;
  totalOrdered: number;
  totalReceived: number;
};

type PurchaseOrderListResponse = {
  data: PurchaseOrderSummary[];
};

type PurchaseOrderResponse = {
  data: {
    id: number;
    poNumber: string;
    status: string;
    notes: string | null;
    createdAt: string;
    character: {
      id: number;
      name: string;
      title: string;
      race: string;
    };
    items: Array<{
      id: number;
      quantityOrdered: number;
      quantityReceived: number;
      warehouseLocationId: number | null;
      item: {
        id: number;
        name: string;
        description: string;
        category: string;
        rupeePrice: number;
        isUnique: boolean;
      };
    }>;
  };
};

/**
 * @openapi
 * /api/purchase-orders:
 *   get:
 *     tags:
 *       - Purchase Orders
 *     summary: List all purchase orders
 *     description: >
 *       Returns a summary list of all purchase orders, including the ordering
 *       character's name and aggregated item totals (count of line items,
 *       total quantity ordered, and total quantity received).
 *     responses:
 *       200:
 *         description: List of purchase order summaries
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
 *                       poNumber:
 *                         type: string
 *                         example: PO-001
 *                       status:
 *                         type: string
 *                         example: pending
 *                       characterName:
 *                         type: string
 *                         example: Link
 *                       totalItems:
 *                         type: integer
 *                         example: 3
 *                       totalOrdered:
 *                         type: integer
 *                         example: 15
 *                       totalReceived:
 *                         type: integer
 *                         example: 5
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch purchase orders
 */
router.get('/', async (_req, res) => {
  try {
    const rows = db
      .select({
        id: purchaseOrders.id,
        poNumber: purchaseOrders.poNumber,
        status: purchaseOrders.status,
        characterName: characters.name,
        totalItems: count(purchaseOrderItems.id),
        totalOrdered: sum(purchaseOrderItems.quantityOrdered),
        totalReceived: sum(purchaseOrderItems.quantityReceived),
      })
      .from(purchaseOrders)
      .innerJoin(characters, eq(purchaseOrders.characterId, characters.id))
      .leftJoin(purchaseOrderItems, eq(purchaseOrderItems.purchaseOrderId, purchaseOrders.id))
      .groupBy(purchaseOrders.id)
      .all();

    const data: PurchaseOrderSummary[] = rows.map((row) => ({
      id: row.id,
      poNumber: row.poNumber,
      status: row.status,
      characterName: row.characterName,
      totalItems: row.totalItems,
      totalOrdered: Number(row.totalOrdered ?? 0),
      totalReceived: Number(row.totalReceived ?? 0),
    }));

    const response: PurchaseOrderListResponse = { data };
    res.json(response);
  } catch (err) {
    console.error('Failed to fetch purchase orders:', err);
    res.status(500)
      .json({ error: 'Failed to fetch purchase orders' });
  }
});

/**
 * @openapi
 * /api/purchase-orders/{poNumber}:
 *   get:
 *     tags:
 *       - Purchase Orders
 *     summary: Look up a purchase order by PO number
 *     description: >
 *       Returns a purchase order with its associated character and line items
 *       (including full item details). The PO number is a unique string
 *       identifier like "PO-001".
 *     parameters:
 *       - in: path
 *         name: poNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique purchase order number (e.g. "PO-001")
 *         example: PO-001
 *     responses:
 *       200:
 *         description: Purchase order found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     poNumber:
 *                       type: string
 *                       example: PO-001
 *                     status:
 *                       type: string
 *                       example: pending
 *                     notes:
 *                       type: string
 *                       nullable: true
 *                       example: Urgent delivery for Hyrule Castle
 *                     createdAt:
 *                       type: string
 *                       example: "2025-01-15 12:00:00"
 *                     character:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: Link
 *                         title:
 *                           type: string
 *                           example: Hero of Time
 *                         race:
 *                           type: string
 *                           example: Hylian
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           quantityOrdered:
 *                             type: integer
 *                             example: 5
 *                           quantityReceived:
 *                             type: integer
 *                             example: 0
 *                           warehouseLocationId:
 *                             type: integer
 *                             nullable: true
 *                             example: null
 *                           item:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 1
 *                               name:
 *                                 type: string
 *                                 example: Master Sword
 *                               description:
 *                                 type: string
 *                                 example: The blade of evil's bane
 *                               category:
 *                                 type: string
 *                                 example: weapon
 *                               rupeePrice:
 *                                 type: integer
 *                                 example: 500
 *                               isUnique:
 *                                 type: boolean
 *                                 example: true
 *       404:
 *         description: Purchase order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Purchase order "PO-999" not found'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch purchase order
 */
router.get('/:poNumber', async (req, res) => {
  const { poNumber } = req.params;

  try {
    const po = await db
      .select()
      .from(purchaseOrders)
      .where(eq(purchaseOrders.poNumber, poNumber))
      .get();

    if (!po) {
      res.status(404)
        .json({ error: `Purchase order "${poNumber}" not found` });
      return;
    }

    const character = await db
      .select()
      .from(characters)
      .where(eq(characters.id, po.characterId))
      .get();

    const lineItems = await db
      .select({
        id: purchaseOrderItems.id,
        quantityOrdered: purchaseOrderItems.quantityOrdered,
        quantityReceived: purchaseOrderItems.quantityReceived,
        warehouseLocationId: purchaseOrderItems.warehouseLocationId,
        item: {
          id: items.id,
          name: items.name,
          description: items.description,
          category: items.category,
          rupeePrice: items.rupeePrice,
          isUnique: items.isUnique,
        },
      })
      .from(purchaseOrderItems)
      .innerJoin(items, eq(purchaseOrderItems.itemId, items.id))
      .where(eq(purchaseOrderItems.purchaseOrderId, po.id))
      .all();

    const response: PurchaseOrderResponse = {
      data: {
        id: po.id,
        poNumber: po.poNumber,
        status: po.status,
        notes: po.notes,
        createdAt: po.createdAt,
        character: {
          id: character!.id,
          name: character!.name,
          title: character!.title,
          race: character!.race,
        },
        items: lineItems,
      },
    };

    res.json(response);
  } catch (err) {
    console.error('Failed to fetch purchase order:', err);
    res.status(500)
      .json({ error: 'Failed to fetch purchase order' });
  }
});

type ReceiveLineInput = {
  purchaseOrderItemId: number;
  quantity: number;
};

type ReceiveRequestBody = {
  lines: ReceiveLineInput[];
  notes?: string | null;
};

/**
 * @openapi
 * /api/purchase-orders/{poNumber}/receive:
 *   post:
 *     tags:
 *       - Receiving
 *     summary: Receive items against a purchase order
 *     description: >
 *       Records a receipt against a purchase order. Creates receipt and receipt
 *       line records, updates item quantities, and transitions the PO status
 *       to "partial" or "received" as appropriate.
 *     parameters:
 *       - in: path
 *         name: poNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique purchase order number (e.g. "PO-HYR-004")
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lines
 *             properties:
 *               lines:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - purchaseOrderItemId
 *                     - quantity
 *                   properties:
 *                     purchaseOrderItemId:
 *                       type: integer
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       example: 5
 *               notes:
 *                 type: string
 *                 nullable: true
 *                 example: "Partial delivery from Beedle"
 *     responses:
 *       201:
 *         description: Receipt created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     receiptNumber:
 *                       type: string
 *                     purchaseOrderId:
 *                       type: integer
 *                     notes:
 *                       type: string
 *                       nullable: true
 *                     createdAt:
 *                       type: string
 *                     lines:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           purchaseOrderItemId:
 *                             type: integer
 *                           quantityReceived:
 *                             type: integer
 *                           isReceived:
 *                             type: boolean
 *       400:
 *         description: Validation error
 *       404:
 *         description: Purchase order not found
 *       500:
 *         description: Internal server error
 */
router.post('/:poNumber/receive', async (req, res) => {
  const { poNumber } = req.params;
  const body = req.body as ReceiveRequestBody;

  // Validate request body
  if (!body.lines || !Array.isArray(body.lines) || body.lines.length === 0) {
    res.status(400)
      .json({ error: 'lines must be a non-empty array' });
    return;
  }

  for (const line of body.lines) {
    if (!line.purchaseOrderItemId || typeof line.purchaseOrderItemId !== 'number') {
      res.status(400)
        .json({ error: 'Each line must have a valid purchaseOrderItemId' });
      return;
    }
    if (!line.quantity || typeof line.quantity !== 'number' || line.quantity <= 0) {
      res.status(400)
        .json({ error: 'Each line must have a quantity greater than 0' });
      return;
    }
  }

  try {
    // Look up the PO
    const po = db
      .select()
      .from(purchaseOrders)
      .where(eq(purchaseOrders.poNumber, poNumber))
      .get();

    if (!po) {
      res.status(404)
        .json({ error: `Purchase order "${poNumber}" not found` });
      return;
    }

    if (po.status === 'received') {
      res.status(400)
        .json({ error: 'Purchase order is already fully received' });
      return;
    }

    // Fetch all line items for this PO
    const poItems = db
      .select()
      .from(purchaseOrderItems)
      .where(eq(purchaseOrderItems.purchaseOrderId, po.id))
      .all();

    const poItemMap = new Map(poItems.map((item) => [item.id, item]));

    // Validate each receive line
    for (const line of body.lines) {
      const poItem = poItemMap.get(line.purchaseOrderItemId);
      if (!poItem) {
        res.status(400)
          .json({
            error: `Item ID ${line.purchaseOrderItemId} does not belong to this purchase order`,
          });
        return;
      }
      const remaining = poItem.quantityOrdered - poItem.quantityReceived;
      if (line.quantity > remaining) {
        res.status(400)
          .json({
            error: `Cannot receive ${line.quantity} of item ID ${line.purchaseOrderItemId}: only ${remaining} remaining`,
          });
        return;
      }
    }

    // Execute the receive in a transaction
    const result = db.transaction((tx) => {
      // Generate receipt number
      const receiptCount = tx
        .select({ value: count() })
        .from(receipts)
        .get()!.value;
      const receiptNumber = `REC-HYR-${String(receiptCount + 1)
        .padStart(3, '0')}`;

      // Create receipt
      const [newReceipt] = tx
        .insert(receipts)
        .values({
          receiptNumber,
          purchaseOrderId: po.id,
          notes: body.notes ?? null,
        })
        .returning()
        .all();

      // Process each line
      const createdLines = [];
      for (const line of body.lines) {
        const poItem = poItemMap.get(line.purchaseOrderItemId)!;
        const newReceived = poItem.quantityReceived + line.quantity;
        const isReceived = newReceived >= poItem.quantityOrdered;

        // Create receipt line
        const [receiptLine] = tx
          .insert(receiptLines)
          .values({
            receiptId: newReceipt.id,
            purchaseOrderItemId: line.purchaseOrderItemId,
            quantityReceived: line.quantity,
            isReceived,
          })
          .returning()
          .all();

        // Update PO item quantity received
        tx.update(purchaseOrderItems)
          .set({ quantityReceived: newReceived })
          .where(eq(purchaseOrderItems.id, line.purchaseOrderItemId))
          .run();

        // Update our local map for status check
        poItem.quantityReceived = newReceived;

        createdLines.push({
          id: receiptLine.id,
          purchaseOrderItemId: receiptLine.purchaseOrderItemId,
          quantityReceived: receiptLine.quantityReceived,
          isReceived: receiptLine.isReceived,
        });
      }

      // Check if all PO items are fully received
      const allReceived = poItems.every(
        (item) => item.quantityReceived >= item.quantityOrdered,
      );
      const newStatus = allReceived ? 'received' : 'partial';

      tx.update(purchaseOrders)
        .set({ status: newStatus })
        .where(eq(purchaseOrders.id, po.id))
        .run();

      return {
        id: newReceipt.id,
        receiptNumber: newReceipt.receiptNumber,
        purchaseOrderId: newReceipt.purchaseOrderId,
        notes: newReceipt.notes,
        createdAt: newReceipt.createdAt,
        lines: createdLines,
      };
    });

    res.status(201)
      .json({ data: result });
  } catch (err) {
    console.error('Failed to receive items:', err);
    res.status(500)
      .json({ error: 'Failed to receive items' });
  }
});

export { router as purchaseOrderRoutes };
