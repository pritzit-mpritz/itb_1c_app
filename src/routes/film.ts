import {Request, Response, Router} from 'express';
import {db} from '../db';
import {getAllFilms, getFilmById, addFilm, updateFilm, deleteFilm, getFilmsByCategory} from "../services/filmService";

const filmRouter: Router = Router();

//Film CRUD-Funktionalität

/**
 * @swagger
 * /film:
 *   get:
 *     summary: Retrieve a list of films
 *     tags: [Film]
 *     parameters:
 *     - in: query
 *       name: title
 *       required: false
 *       description: Filter films by title
 *       schema:
 *         type: string
 *         example: Avatar
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
 *                   description:
 *                     type: string
 *                   release_year:
 *                     type: number
 *                   language_id:
 *                     type: number
 *                   rental_duration:
 *                     type: number
 *                   rental_rate:
 *                     type: number
 *                   length:
 *                     type: number
 *                   replacement_cost:
 *                     type: number
 *                   rating:
 *                     type: string
 *                   last_update:
 *                     type: string
 *                   special_features:
 *                     type: array
 *                     items:
 *                       type: string
 */
filmRouter.get('/', async (req: Request, res: Response) => {
    res.send(await getAllFilms(req.query.title as string));
});

/**
 * @swagger
 * /film/{id}:
 *   get:
 *     summary: Retrieve a film
 *     tags: [Film]
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
 *                 description:
 *                   type: string
 *                 release_year:
 *                   type: number
 *                 language_id:
 *                   type: number
 *                 rental_duration:
 *                   type: number
 *                 rental_rate:
 *                   type: number
 *                 length:
 *                   type: number
 *                 replacement_cost:
 *                   type: number
 *                 rating:
 *                   type: string
 *                 last_update:
 *                   type: string
 *                 special_features:
 *                   type: array
 *                   items:
 *                     type: string
 */
filmRouter.get('/:id', async (req: Request, res: Response) => {
    const film = await getFilmById(Number(req.params.id))

    if (!film) {
        res.status(404).send({error: "Film not found"});
        return
    }

    res.send(film);
});

/**
 * @swagger
 * /film:
 *   post:
 *     summary: Create a new film
 *     tags: [Film]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: New Film
 *               description:
 *                 type: string
 *                 example: A description of the film
 *               release_year:
 *                 type: number
 *                 example: 2023
 *               language_id:
 *                 type: number
 *                 example: 1
 *               rental_duration:
 *                 type: number
 *                 example: 3
 *               rental_rate:
 *                 type: number
 *                 example: 4.99
 *               length:
 *                 type: number
 *                 example: 120
 *               replacement_cost:
 *                 type: number
 *                 example: 19.99
 *               rating:
 *                 type: string
 *                 example: PG-13
 *               special_features:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Trailers", "Commentaries"]
 *     responses:
 *       200:
 *         description: Film created successfully
 */
filmRouter.post('/', async (req: Request, res: Response) => {
    console.log("Creating film: ", req.body);

    try {
        const id = await addFilm(req.body);
        res.send({id: id});
    } catch (error) {
        console.error("Error creating film: ", error);
        res.status(400).send({error: "Failed to create film. " + (error)});
    }
});

/**
 * @swagger
 * /film/{id}:
 *   put:
 *     summary: Update a film
 *     tags: [Film]
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
 *                 example: Updated Film Title
 *               description:
 *                 type: string
 *                 example: Updated description
 *               release_year:
 *                 type: number
 *                 example: 2023
 *               language_id:
 *                 type: number
 *                 example: 1
 *               rental_duration:
 *                 type: number
 *                 example: 3
 *               rental_rate:
 *                 type: number
 *                 example: 4.99
 *               length:
 *                 type: number
 *                 example: 120
 *               replacement_cost:
 *                 type: number
 *                 example: 19.99
 *               rating:
 *                 type: string
 *                 example: PG-13
 *               special_features:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Trailers", "Commentaries"]
 *     responses:
 *       200:
 *         description: Film updated successfully
 */
filmRouter.put('/:id', async (req: Request, res: Response) => {
    try {
        const updateCount = await updateFilm(Number(req.params.id), req.body);

        if (updateCount === 0) {
            res.status(404).send({error: "Film not found"});
            return;
        }

        res.send(`Updated ${updateCount} films`);
    } catch (error) {
        console.error("Error updating film: ", error);
        res.status(400).send({error: "Failed to update film. " + (error)});
    }
});

/**
 * @swagger
 * /film/{id}:
 *  delete:
 *   summary: Delete a film
 *   tags: [Film]
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: ID of the film
 *      schema:
 *        type: integer
 *   responses:
 *     200:
 *       description: Film deleted successfully
 *     404:
 *       description: Film not found
 */
filmRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const deleteCount = await deleteFilm(Number(req.params.id));

        if (deleteCount === 0) {
            res.status(404).send({error: "Film not found"});
            return;
        }

        res.send(`Deleted ${deleteCount} films`);
    } catch (error) {
        console.error("Error deleting film: ", error);
        res.status(400).send({error: "Failed to delete film. " + (error)});
    }
});

/**
 * @swagger
 * /film/category/{category_id}:
 *   get:
 *     summary: Get all films by category
 *     tags: [Film]
 *     parameters:
 *       - in: path
 *         name: category_id
 *         required: true
 *         description: ID of the category
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of films in the specified category
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
 *                   description:
 *                     type: string
 *                   release_year:
 *                     type: number
 */
filmRouter.get('/category/:category_id', async (req: Request, res: Response) => {
    try {
        const films = await getFilmsByCategory(Number(req.params.category_id));
        res.send(films);
    } catch (error) {
        console.error("Error getting films by category: ", error);
        res.status(400).send({error: "Failed to get films by category. " + (error)});
    }
});

export default filmRouter;