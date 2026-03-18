import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { characters } from '../../db/schema.js';

const router = Router();

/**
 * @openapi
 * /api/characters/{name}:
 *   get:
 *     tags:
 *       - Characters
 *     summary: Look up a character by name
 *     description: >
 *       Returns a single character record by their unique name, including
 *       bio and first appearance year.
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The character's unique name (e.g. "Link")
 *         example: Link
 *     responses:
 *       200:
 *         description: Character found
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
 *                     name:
 *                       type: string
 *                       example: Link
 *                     title:
 *                       type: string
 *                       example: Hero of Hyrule
 *                     race:
 *                       type: string
 *                       example: Hylian
 *                     bio:
 *                       type: string
 *                       example: Veteran hero turned reliable receiver. Known for opening every chest in the stockroom.
 *                     firstAppearanceYear:
 *                       type: integer
 *                       example: 1986
 *                     createdAt:
 *                       type: string
 *                       example: "2025-01-15 12:00:00"
 *       404:
 *         description: Character not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Character not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch character
 */
router.get('/:name', async (req, res) => {
  try {
    const character = db
      .select()
      .from(characters)
      .where(eq(characters.name, req.params.name))
      .get();

    if (!character) {
      res.status(404)
        .json({ error: 'Character not found' });
      return;
    }

    res.json({ data: character });
  } catch (err) {
    console.error('Failed to fetch character:', err);
    res.status(500)
      .json({ error: 'Failed to fetch character' });
  }
});

export { router as characterRoutes };
