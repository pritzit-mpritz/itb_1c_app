import {Request, Response, Router} from 'express';
import {db} from '../db';
import {addActorToFilm, getFilmById, getAllFilms} from "../services/filmService";

const filmRouter: Router = Router();

/**
 * @swagger
 * /film:
 *   get:
 *     summary: Retrieve a list of films
 *     tags: [Films]
 *     parameters:
 *     - in: query
 *       name: title
 *       required: false
 *       description: Filter films by title
 *       schema:
 *         type: string
 *         example: The Shawshank Redemption
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
 *                   release_year:
 *                     type: number
 *                   last_update:
 *                     type: string
 */
filmRouter.get('/', async (req: Request, res: Response) => {
    res.send(await getAllFilms(req.query.title as string));
});

/**
 * @swagger
 * /film/{id}:
 *   get:
 *     summary: Retrieve a film
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
 *                 release_year:
 *                   type: number
 *                 last_update:
 *                   type: string
 */
filmRouter.get('/:id', async (req: Request, res: Response) => {
    const film = await getFilmById(Number(req.params.id));

    if (!film) {
        res.status(404).send({error: "Film not found"});
        return;
    }

    res.send(film);
});

/**
 * @swagger
 * /film:
 *   post:
 *     summary: Create a new film
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
 *                 example: The Matrix
 *               release_year:
 *                 type: number
 *                 example: 1999
 *     responses:
 *       200:
 *         description: Film created successfully
 */
filmRouter.post('/', async (req: Request, res: Response) => {
    console.log("Creating film: ", req.body);

    const connection = db();
    const insertOperation = await connection.insert(req.body).into("film");


    res.send({id: insertOperation[0]});
});

/**
 * @swagger
 * /film/{id}:
 *  put:
 *   summary: Update a film
 *   tags: [Films]
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: ID of the film
 *      schema:
 *        type: integer
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               example: The Matrix Reloaded
 *             release_year:
 *               type: number
 *               example: 2003
 *   responses:
 *     200:
 *       description: Film updated successfully
 */
filmRouter.put('/:id', async (req: Request, res: Response) => {
    const connection = db();

    const film = await connection.select("*")
        .from("film")
        .where("film_id", req.params.id).first();

    if (!film) {
        res.status(404).send({error: "Film not found"});
        return;
    }

    film.title = req.body.title;
    film.release_year = req.body.release_year;

    const updateOperation = await connection("film").update(film)
        .where("film_id", req.params.id);
    res.send(`Updated ${updateOperation} films`);
});

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
 *        type: integer
 *   responses:
 *     200:
 *       description: Film deleted successfully
 */
filmRouter.delete('/:id', async (req: Request, res: Response) => {
    const connection = db();
    const deleteOperation = await connection("film")
        .where("film_id", req.params.id).delete();

    if (!deleteOperation) {
        res.status(404).send({error: "Film not found"});
        return;
    }

    res.send(`Deleted ${deleteOperation} films`);
});

/**
 * @swagger
 * /film/{film_id}/actor/{actor_id}:
 *  post:
 *    summary: Add a film to an actor - the actor should already exist
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
 *      name: actor_id
 *      required: true
 *      description: ID of the actor
 *      schema:
 *        type: integer
 *        example: 1
 */
filmRouter.post('/:film_id/actor/:actor_id', async (req: Request, res: Response) => {
    const filmId = req.params.film_id;
    const actorId = req.params.actor_id;

    try {
        await addActorToFilm(Number(actorId), Number(filmId));
        console.log(`Actor ${actorId} added to film ${filmId}`);

        res.status(201).send("Actor-Film relation created");
    } catch (error) {
        console.error("Error adding actor to film: ", error);
        res.status(400).send({error: "Failed to add actor to film. " + error});
    }
})

export default filmRouter;
