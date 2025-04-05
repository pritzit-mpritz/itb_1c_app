import {Request, Response, Router} from 'express';
import {db} from '../db';
import {getAllCategories, getCategoryById} from "../services/categoryService";

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
 *       description: Filter catgories by name
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
    res.send(await getAllCategories(req.query.first_name as string));
});

/**
 * @swagger
 * /category/{id}:
 *   get:
 *     summary: Retrieve a category
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
    const category = await getCategoryById(Number(req.params.id))

    if (!category) {
        res.status(404).send({error: "Category not found"});
        return
    }

    res.send(category);
});

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Comedy
 *     responses:
 *       200:
 *         description: Category created successfully
 */
categoryRouter.post('/', async (req: Request, res: Response) => {
    console.log("Creating category: ", req.body);

    const connection = db();
    const insertOperation = await connection.insert(req.body).into("category");

    res.send({id: insertOperation[0]});
});

export default categoryRouter;