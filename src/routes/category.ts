import { Request, Response, Router } from 'express';
import {
    getAllCategory,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
} from '../services/categoryService';
import {addFilmToCategory} from "../services/filmService";

const categoryRouter: Router = Router();

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Retrieve a list of all categories from database
 *     tags: [Category]
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
 */


//1.get
categoryRouter.get('/', async (req: Request, res: Response) => {
    const categories = await getAllCategory();
    res.send(categories);
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
 */

//2.get
categoryRouter.get('/:id', async (req: Request, res: Response) => {
    const category = await getCategoryById(Number(req.params.id));

    if (!category) {
        res.status(404).send({ error: 'No category found' });
        return;
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
 *                 example: Action
 *     responses:
 *       200:
 *         description: Category created successfully
 */


//insert
categoryRouter.post('/', async (req: Request, res: Response) => {
    try {
        const insertOperation = await createCategory(req.body);
        res.send({ id: insertOperation[0] });
    } catch (error) {
        console.error('Error creating category: ', error);
        res.status(400).send({ error: 'Failed to create category. ' + error });
    }
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
 *                 example: Adventure
 *     responses:
 *       200:
 *         description: Category updated successfully
 */

//update
categoryRouter.put('/:id', async (req: Request, res: Response) => {
    const category = await getCategoryById(Number(req.params.id));

    if (!category) {
        res.status(404).send({ error: 'No category found' });
        return;
    }

    const updateOperation = await updateCategory(Number(req.params.id), req.body);
    res.send(`Updated ${updateOperation} category(s)`);
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
 *        type: integer
 *   responses:
 *     200:
 *       description: Category deleted successfully
 */


//delete
categoryRouter.delete('/:id', async (req: Request, res: Response) => {
    const deleteOperation = await deleteCategory(Number(req.params.id));

    if (!deleteOperation) {
        res.status(404).send({ error: 'No category found' });
        return;
    }

    res.send(`Deleted ${deleteOperation} category(s)`);
});



/**
 * @swagger
 * /category/{category_id}/film/{film_id}:
 *  post:
 *    summary: Add a category to a film - the category should already exist
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
 *      description: ID of the film
 *      schema:
 *        type: integer
 *        example: 1
 *    responses:
 *      200:
 *        description: Category added successfully
 */
categoryRouter.post('/:category_id/film/:film_id', async (req: Request, res: Response) => {

    const categoryId = req.params.category_id;
    const filmId = req.params.film_id;


    try {
        await addFilmToCategory(Number(categoryId), Number(filmId));
        console.log(`Film ${filmId} added to category ${categoryId}`);

        res.status(201).send("Film-Category created");
    } catch (error) {
        console.error("Error adding film to category: ", error);
        res.status(400).send({error: "Failed to add film to category. " + (error)});
    }
})

export default categoryRouter;

