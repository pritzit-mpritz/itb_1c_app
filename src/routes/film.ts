import {Request, Response, Router} from 'express';
import {db} from '../db';
import {addActorToFilm, getFilmById, getAllActors} from "../services/actorService";

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
 *         example: BERETS AGENT
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
 *                 description:
 *                   type: string
 *                 release_year:
 *                   type: string
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
 *                 example: Tom
 *               description:
 *                 type: string
 *                 example: Madagaskar
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
 *                 example: Madagaskar
 *               description:
 *                 type: string
 *                 example: Die Welt unter uns
 *     responses:
 *       200:
 *         description: Film updated successfully
 */
filmRouter.put('/:id', async (req: Request, res: Response) => {
    const connection = db();

    const film = await connection.select("*")
        .from("film")
        .where("film_id", req.params.id).first();

    if (!film) {
        res.status(404).send({error: "Film not found"});
        return
    }

    film.title = req.body.title;
    film.description = req.body.description;

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
        res.status(404).send({error: "Film not found"});
        return
    }

    res.send(`Deleted ${deleteOperation} films`);
});

/**
 * @swagger
 * /film/{film_id}/film/{film_id}:
 *  post:
 *    summary: Add a film to a film - the film should already exist
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
 *      name: film_id
 *      required: true
 *      description: ID of the film
 *      schema:
 *        type: integer
 *        example: 1
 */
filmRouter.post('/:film_id/film/:film_id', async (req: Request, res: Response) => {
    const actorId = req.params.film_id;
    const filmId = req.params.film_id;

    try {
        await addActorToFilm(Number(actorId), Number(filmId));
        console.log(`Film ${actorId} added to film ${filmId}`);

        res.status(201).send("Film-Film created");
    } catch (error) {
        console.error("Error adding film to film: ", error);
        res.status(400).send({error: "Failed to add film to film. " + (error)});
    }
})

export default filmRouter;