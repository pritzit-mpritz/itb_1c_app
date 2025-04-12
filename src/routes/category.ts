import { Request, Response, Router } from 'express';
import {
    getAllCategory,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    addFilmToCategory,
    removeFilmFromCategory
} from '../services/categoryService';

import {getFilmById} from "../services/filmService";


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


//1.Block get all
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
 *        404:
 *         description: Category is not found.
 *
 */

//2.Block get by id
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
 *         description: Category created successfully.
 *       400:
 *         description: Failed to create category.
 */


//3.Block post, create
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
 *         description: Category updating is successfully.
 *       404:
 *         description: Category is not found.
 */

//4. Block update, put
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
 *       description: Category deleted successfully.
 *     404:
 *       description: Category is not found.
 */


//5. Block delete category by id
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
 *    summary: Add a film to category - both must exist
 *    tags: [Category]
 *    parameters:
 *    - in: path
 *      name: film_id
 *      required: true
 *      description: ID of the film
 *      schema:
 *        type: integer
 *        example: 1
 *    - in: path
 *      name: category_id
 *      required: true
 *      description: ID of the category
 *      schema:
 *        type: integer
 *        example: 1
 *    responses:
 *      201:
 *         description: Film added from category successfully.
 *      400:
 *         description: Failed to add film from category.
 *      404:
 *         description: Category or Film is not found.
 */

//6.Block add film to category
categoryRouter.post('/:category_id/film/:film_id', async (req: Request, res: Response) => {
    const filmId = Number(req.params.film_id);

    const categoryId = Number(req.params.category_id);

    // 1.check if film exists
    const film = await getFilmById(filmId);
    if (!film) {
        res.status(404).send({ error: "Film is not found" });
        return
    }

    // 2.check if category exists
    const category = await getCategoryById(categoryId);
    if (!category) {
        res.status(404).send({ error: 'Category is not found' });
        return;
    }

    try {
        await addFilmToCategory(Number(filmId), Number(categoryId));
        console.log(`Film ${filmId} added to category ${categoryId}`);

        res.status(201).send("Film added to category");
    } catch (error) {
        console.error("Error adding film to category: ", error);
        res.status(400).send({ error: "Failed to add film to category. " + error });
    }
})


/**
 * @swagger
 * /category/{category_id}/film/{film_id}:
 *   delete:
 *     summary: Remove a film from category - both must exist
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: film_id
 *         required: true
 *         description: ID of the film
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: path
 *         name: category_id
 *         required: true
 *         description: ID of the category
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Film removed from category successfully.
 *       400:
 *         description: Failed to remove film from category.
 *       404:
 *         description: Category or Film is not found.
 *
 */

// 7. Block remove film from category
categoryRouter.delete('/:category_id/film/:film_id', async (req: Request, res: Response) => {

    const filmId = Number(req.params.film_id);
    const categoryId = Number(req.params.category_id);


    // 1.check film
    const film = await getFilmById(filmId);
    if (!film) {
        res.status(404).send({ error: "Film not found" });
        return
    }
    // 2.check category
    const category = await getCategoryById(categoryId);
    if (!category) {
        res.status(404).send({ error: 'No category found' });
        return;
    }

    try {
        await removeFilmFromCategory(Number(filmId), Number(categoryId));
        console.log(`Film ${filmId} removed from category ${categoryId}`);

        res.status(200).send(`Removed film ${filmId} from category ${categoryId}`);
    } catch (error) {
        console.error("Error removing film from category: ", error);
        res.status(400).send({ error: "Failed to remove film from category. " + error });
    }
});


export default categoryRouter;