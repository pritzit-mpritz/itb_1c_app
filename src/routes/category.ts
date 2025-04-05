import { Request, Response, Router } from 'express';
import {
    getAllCategory,
    getCategoryById,

} from "../services/categoryService";

const categoryRouter: Router = Router();

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Retrieve a list of categories
 *     tags: [Category]
 *     parameters:
 *     - in: query
 *       name: CategoryName
 *       required: false
 *       description: Filter categories by name
 *       schema:
 *         type: string
 *         example: Action
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
    res.send(await getAllCategory(req.query.CategoryName as string));

    if (!CategoryName) {
        res.status(404).send({ error: "Category not found" });
        return;




});




/**
 * @swagger
 * /category/{id}:
 *   get:
 *     summary: Retrieve a category by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the category
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category_id:
 *                   type: number
 *                 name:
 *                   type: string
 *                 last_update:
 *                   type: string
 */
categoryRouter.get('/:id', async (req: Request, res: Response) => {
    const category = await getCategoryById(Number(req.params.id));

    if (!category) {
        res.status(404).send({ error: "Category not found" });
        return;
    }

    res.send(category);
});













export default categoryRouter; // damit andere Dateien den Router benutzen können
