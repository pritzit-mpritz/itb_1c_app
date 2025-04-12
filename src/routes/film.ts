import {Request, Response, Router} from 'express';
import {
    getAllFilms,
    getFilmById,
    createFilm,
    updateFilm,
    deleteFilm,
    addCategoryToFilm,
    removeCategoryFromFilm
} from '../services/filmService'
import {getCategoryById} from "../services/categoryService";

const filmRouter: Router = Router();

/**
 * @swagger
 * /film:
 *   get:
 *     summary: Retrieve a list of all films from database
 *     tags: [Films]
 *     responses:
 *       200:
 *         description: A list of films
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   film_id:
 *                     type: number
 *                   title:
 *                     type: string
 */
filmRouter.get('/', async (req: Request, res: Response) => {
    const films = await getAllFilms();
    res.send(films);
});

/**
 * @swagger
 * /film/{id}:
 *   get:
 *     summary: Retrieve a film by ID
 *     tags: [Films]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the film
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A film
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 film_id:
 *                   type: number
 *                 title:
 *                   type: string
 *       404:
 *         description: Film not found
 */
filmRouter.get('/:id', async (req: Request, res: Response) => {
    const film = await getFilmById(Number(req.params.id));

    if (!film) {
        res.status(404).send({error: "No film found"});
        return
    }

    res.send(film);
})

/**
 * @swagger
 * /film:
 *   post:
 *     summary: Create a new film.
 *     tags: [Films]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Cars
 *               description:
 *                 type: string
 *                 example: Lightning McQueen doing some crazy stuff.
 *               language_id:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Film created successfully
 *       400:
 *         description: Failed to create film
 */
filmRouter.post('/', async (req: Request, res: Response) => {
    try {
        const insertOperation = await createFilm(req.body);
        res.send({id: insertOperation[0]});
    } catch (error) {
        console.error("Error creating film: ", error);
        res.status(400).send({error: "Failed to create film. " + (error)});
    }
})

/**
 * @swagger
 * /film/{id}:
 *   put:
 *     summary: Update a film
 *     tags: [Films]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the film
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Cars
 *               description:
 *                 type: string
 *                 example: Lightning McQueen doing some crazy stuff.
 *     responses:
 *       200:
 *         description: Film updated successfully
 *       404:
 *         description: Film not found
 */
filmRouter.put('/:id', async (req: Request, res: Response) => {
    const film = await getFilmById(Number(req.params.id));

    if (!film) {
        res.status(404).send({error: "No film found"});
        return
    }

    const updateOperation = await updateFilm(req.body, Number(req.params.id))
    res.send(`Updated ${updateOperation} film(s)`);
})

/**
 * @swagger
 * /film/{id}:
 *  delete:
 *   summary: Delete a film
 *   tags: [Films]
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: ID of the film
 *      schema:
 *      type: integer
 *   responses:
 *     200:
 *       description: Film deleted successfully
 *     404:
 *       description: Film not found
 *
 */
filmRouter.delete('/:id', async (req: Request, res: Response) => {
    const deleteOperation = await deleteFilm(Number(req.params.id));

    if (!deleteOperation) {
        res.status(404).send({error: "No film found"});
        return
    }

    res.send(`Deleted ${deleteOperation} film(s)`);
})

/**
 * @swagger
 * /film/{film_id}/category/{category_id}:
 *  post:
 *    summary: Add a category to a film - the film should already exist
 *    tags: [Films]
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
 *        description: Category added to film
 *      400:
 *        description: Failed to add category to film
 *      404:
 *        description: Film or category not found
 */
filmRouter.post('/:film_id/category/:category_id/', async (req: Request, res: Response) => {
    const filmId = Number(req.params.film_id);
    const categoryId = Number(req.params.category_id);

    // check if film exists
    const film = await getFilmById(filmId);
    if (!film) {
        res.status(404).send({ error: "Film not found" });
        return
    }
    // check if category exists
    const category = await getCategoryById(categoryId);
    if (!category) {
        res.status(404).send({ error: 'No category found' });
        return;
    }

    try {
        await addCategoryToFilm(Number(filmId), Number(categoryId));
        console.log(`Category ${categoryId} added to film ${filmId}`);

        res.status(201).send("Category added to film.");
    } catch (error) {
        console.error("Error adding category to film: ", error);
        res.status(400).send({error: "Failed to add category to film. " + (error)});
    }
})

/**
 * @swagger
 * /film/{film_id}/category/{category_id}:
 *  delete:
 *    summary: Delete category from film
 *    tags: [Films]
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
 *        description: Category deleted from film
 *      400:
 *        description: Failed to category from film
 *      404:
 *        description: Film or category not found
 */
filmRouter.delete('/:film_id/category/:category_id/', async (req: Request, res: Response) => {
    const filmId = Number(req.params.film_id);
    const categoryId = Number(req.params.category_id);

    // check if film exists
    const film = await getFilmById(filmId);
    if (!film) {
        res.status(404).send({ error: "Film not found" });
        return
    }
    // check if category exists
    const category = await getCategoryById(categoryId);
    if (!category) {
        res.status(404).send({ error: 'No category found' });
        return;
    }

    try {
        await removeCategoryFromFilm(Number(filmId), Number(categoryId));
        console.log(`Category ${categoryId} deleted from film ${filmId}`);

        res.status(201).send("Category deleted from film.");
    } catch (error) {
        console.error("Error deleting category from film: ", error);
        res.status(400).send({error: "Failed to category from film. " + (error)});
    }
})

export default filmRouter;