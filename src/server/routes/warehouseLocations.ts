import { Router } from 'express';
import { db } from '../../db/index.js';
import { warehouseLocations } from '../../db/schema.js';

const router = Router();

type WarehouseLocation = {
  id: number;
  name: string;
  zone: string;
  capacity: number;
};

type WarehouseLocationListResponse = {
  data: WarehouseLocation[];
};

/**
 * @openapi
 * /api/warehouse-locations:
 *   get:
 *     tags:
 *       - Warehouse Locations
 *     summary: List all warehouse locations
 *     description: >
 *       Returns all warehouse locations with their name, zone, and capacity.
 *     responses:
 *       200:
 *         description: List of warehouse locations
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
 *                       name:
 *                         type: string
 *                         example: Hyrule Main Storage
 *                       zone:
 *                         type: string
 *                         example: A
 *                       capacity:
 *                         type: integer
 *                         example: 100
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch warehouse locations
 */
router.get('/', async (_req, res) => {
  try {
    const rows = db
      .select({
        id: warehouseLocations.id,
        name: warehouseLocations.name,
        zone: warehouseLocations.zone,
        capacity: warehouseLocations.capacity,
      })
      .from(warehouseLocations)
      .all();

    const response: WarehouseLocationListResponse = { data: rows };
    res.json(response);
  } catch (err) {
    console.error('Failed to fetch warehouse locations:', err);
    res.status(500)
      .json({ error: 'Failed to fetch warehouse locations' });
  }
});

export { router as warehouseLocationRoutes };
