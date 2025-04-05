import {Request, Response, Router} from 'express';
import {db} from '../db';
import {getAllFilms, getFilmById, createFilm, updateFilm} from '../services/filmService'

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
 */
filmRouter.get('/:id', async (req: Request, res: Response) => {
    const film = await getFilmById(Number(req.params.id))

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
 */
filmRouter.post('/', async (req: Request, res: Response) => {
    /** If the function is successful, the following try and catch responds with the id of the created film.
     *  If an error occurs it responds with the error message. */
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
 */
filmRouter.put('/:id', async (req: Request, res: Response) => {
    const film = await getFilmById(Number(req.params.id))

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
 *
 */
filmRouter.delete('/:id', async (req: Request, res: Response) => {
    const connection = db();
    const deleteOperation = await connection("film")
        .where("film_id", req.params.id).delete();

    if (!deleteOperation) {
        res.status(404).send({error: "No film found"});
        return
    }

    res.send(`Deleted ${deleteOperation} film(s)`);
})

export default filmRouter;