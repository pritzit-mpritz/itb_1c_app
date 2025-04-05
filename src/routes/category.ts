import {Request, Response, Router} from 'express';
import {db} from '../db';
import {getAllCategories} from "../services/categoryService";

const categoryRouter: Router = Router();

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Retrieve a list of categories
 *     tags: [Category]
 *     parameters:
 *     - in: query
 *       name: name
 *       required: false
 *       description: Filter categories by name
 *       schema:
 *         type: string
 *         example: Comedy
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   category_id:
 *                     type: number
 *                   name:
 *                     type: string
 *                   last_update:
 *                     type: string
 */

categoryRouter.get('/', async (req: Request, res: Response) => {
    res.send(await getAllCategories(req.query.name as string));
});

export default categoryRouter;