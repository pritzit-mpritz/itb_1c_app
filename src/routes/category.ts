import {Request, Response, Router} from 'express';
import {db} from '../db';
import {getAllCategories, getCategoryById, addCategoryToFilm} from "../services/categoryService";

const categoryRouter: Router = Router();

//Category CRUD-Funktionalität

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

/**
 * @swagger
 * /category/{id}:
 *   put:
 *     summary: Update a category
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
 *                 example: Comedy
 *     responses:
 *       200:
 *         description: Category updated successfully
 */
categoryRouter.put('/:id', async (req: Request, res: Response) => {
    const connection = db();

    const category = await connection.select("*")
        .from("category")
        .where("category_id", req.params.id).first();

    if (!category) {
        res.status(404).send({error: "Category not found"});
        return
    }

    category.name = req.body.name;

    const updateOperation = await connection("category").update(category)
        .where("category_id", req.params.id);
    res.send(`Updated ${updateOperation} categories`);
});

/**
 * @swagger
 * /category/{id}:
 *  delete:
 *   summary: Delete a category
 *   tags: [Category]
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: ID of the category
 *      schema:
 *      type: integer
 *   responses:
 *     200:
 *       description: category deleted successfully
 *
 */
categoryRouter.delete('/:id', async (req: Request, res: Response) => {
    const connection = db();
    const deleteOperation = await connection("category")
        .where("category_id", req.params.id).delete();

    if (!deleteOperation) {
        res.status(404).send({error: "category not found"});
        return
    }

    res.send(`Deleted ${deleteOperation} categories`);
});

//Category zu Film Tabellenverbindung

/**
 * @swagger
 * /category/{category_id}/film/{film_id}:
 *  post:
 *    summary: Add a category to a film - film should already exist
 *    tags: [Category]
 *    parameters:
 *    - in: path
 *      name: category_id
 *      required: true
 *      description: ID of the category
 *      schema:
 *        type: integer
 *        example: 1
 *    - in: path
 *      name: film_id
 *      required: true
 *      description: ID of the category
 *      schema:
 *        type: integer
 *        example: 1
 *  responses:
 *    201:
 *      description: Category was successfully added to Film
 *    400:
 *      description: Bad request - film or category does not exist
 */
categoryRouter.post('/:category_id/:film/:film_id/', async (req: Request, res: Response) => {
    const categoryId = req.params.category_id;
    const filmId = req.params.film_id;

    try {
        await addCategoryToFilm(Number(categoryId), Number(filmId));
        console.log(`Category ${categoryId} added to film ${filmId}`);

        res.status(201).json("Film-Category created");
    } catch (error) {
        console.error("Error adding category to film: ", error);
        res.status(400).json({error: "Failed to add category to film. " + (error)});
    }
});
export default categoryRouter;