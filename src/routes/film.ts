import {Request, Response, Router} from 'express';
import {db} from '../db';
import {addCategoryToFilm, getFilmById, getAllFilm} from "../services/filmService";
//
const filmRouter: Router = Router();

/**
 * @swagger
 * /Film:
 *   get:
 *     summary: Retrieve a list of film
 *     tags: [Film]
 *     parameters:
 *     - in: query
 *       name: title
 *       required: false
 *       description: Filter Films by first name
 *       schema:
 *         type: string
 *         example: Tom
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
 *                   Film_id:
 *                     type: number
 *                   first_name:
 *                     type: string
 *                   last_name:
 *                     type: string
 *                   last_update:
 *                     type: string
 */
filmRouter.get('/', async (req: Request, res: Response) => {
    res.send(await getAllFilm(req.query.first_name as string));
});


/**
 * @swagger
 * /Film/{id}:
 *   get:
 *     summary: Retrieve an film
 *     tags: [Film]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Film
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: An Film
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 film_id:
 *                   type: number
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *                 last_update:
 *                   type: string
 */
filmRouter.get('/:id', async (req: Request, res: Response) => {
    const Film = await getAllFilm(Number(req.params.id))

    if (!Film) {
        res.status(404).send({error: "film not found"});
        return
    }

    res.send(Film);
});

/**
 * @swagger
 * /Film:
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
 *               first_name:
 *                 type: string
 *                 example: Tom
 *               last_name:
 *                 type: string
 *                 example: Hanks
 *     responses:
 *       200:
 *         description: Film created successfully
 */
filmRouter.post('/', async (req: Request, res: Response) => {
    console.log("Creating Film: ", req.body);

    const connection = db();
    const insertOperation = await connection.insert(req.body).into("Film");

    res.send({id: insertOperation[0]});
});

/**
 * @swagger
 * /film/{id}:
 *   put:
 *     summary: Update an film
 *     tags: [Film]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Film
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: Tom
 *               last_name:
 *                 type: string
 *                 example: Hanks
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

    film.first_name = req.body.first_name;
    film.last_name = req.body.last_name;

    const updateOperation = await connection("film").update(film)
        .where("film_id", req.params.id);
    res.send(`Updated ${updateOperation} film`);
});

/**
 * @swagger
 * /film/{id}:
 *  delete:
 *   summary: Delete an film
 *   tags: [Film]
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
    const deleteOperation = await connection("Film")
        .where("Film_id", req.params.id).delete();

    if (!deleteOperation) {
        res.status(404).send({error: "Film not found"});
        return
    }

    res.send(`Deleted ${deleteOperation} film`);
});

/**
 * @swagger
 * /film/{film_id}/film/{film_id}:
 *  post:
 *    summary: Add an film to a film - the film should already exist
 *    tags: [Film]
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
    const filmId = req.params.film_id;
    const filmId = req.params.film_id;

    try {
        await addCategoryToFilm(Number(filmId), Number(filmId));
        console.log(`Film ${filmId} added to film ${filmId}`);

        res.status(201).send("film-Film created");
    } catch (error) {
        console.error("Error adding film to film: ", error);
        res.status(400).send({error: "Failed to add film to film. " + (error)});
    }
})

export default filmRouter;