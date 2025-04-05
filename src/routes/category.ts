import { Request, Response, Router } from 'express';
import {
    getAllCategory,
    getCategoryById,


} from "../services/categoryService";
import {db} from "../db";

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
    const categories = await getAllCategory(req.query.CategoryName as string);

    if (categories.length === 0) {
        res.status(404).send({ error: "Category not found" });
        return;
    }
    res.send(categories);  // Bu tek bir kategori değil, birden fazla kategori dönecek.
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




/**
 * @swagger
 * /category/{id}:
 *   put:
 *     summary: Update an existing category
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the category
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Action
 *     responses:
 *       200:
 *         description: Category updated successfully
 */


categoryRouter.post('/', async (req: Request, res: Response) => {
    console.log("Creating category: ", req.body);

    const connection = db();
    const insertOperation = await connection.insert(req.body).into("category");

    res.send({id: insertOperation[0]});
});










export default categoryRouter; // damit andere Dateien den Router benutzen können
