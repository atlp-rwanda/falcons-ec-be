/**
 * @openapi
 * /welcome:
 *   get:
 *     tags:
 *       - welcome message
 *     summary: welcome message
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The welcome message
 *                   default: Test controller ok
 *       404:
 *         description: Not Found
 */
