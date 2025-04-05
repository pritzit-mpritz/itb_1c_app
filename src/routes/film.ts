import {Request, Response, Router} from 'express';
import {db} from '../db';
import {getAllFilms, getFilmById} from '../services/filmService'

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
    console.log("Creating film: ", req.body);

    const connection = db();
    const insertOperation = await connection.insert(req.body).into("film");

    res.send({id: insertOperation[0]});
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
    const connection = db();
    const film = await connection.select("*")
        .from("film")
        .where("film_id", req.params.id)
        .first();

    if (!film) {
        res.status(404).send({error: "No film found"});
        return
    }

    film.title = req.body.title;
    film.description = req.body.description;

    const updateOperation = await connection("film").update(film)
        .where("film_id", req.params.id)
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