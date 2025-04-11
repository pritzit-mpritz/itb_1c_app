import {Request, Response, Router} from 'express';
import {db} from '../db';
import {removeFilmFromCategory, addFilmToCategory, getFilmById, getAllFilms} from "../services/filmService";

const filmRouter: Router = Router();

// Film REST-conform operators

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
 *       description: Filter Films by title
 *       schema:
 *         type: string
 *         example: Academy Dinosaur
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
 *                   title:
 *                     type: string
 *                   last_update:
 *                     type: string
 */
filmRouter.get('/', async (req: Request, res: Response) => {
    res.send(await getAllFilms(req.query.title as string));
});


/**
 * @swagger
 * /Film/{id}:
 *   get:
 *     summary: Retrieve a film by ID
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
 *         description: A Film
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 film_id:
 *                   type: number
 *                 title:
 *                   type: string
 *                 last_update:
 *                   type: string
 */
filmRouter.get('/:id', async (req: Request, res: Response) => {
    const Film = await getFilmById(Number(req.params.id))

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
 *               title:
 *                 type: string
 *                 example: Academy Dinosaur
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
 * /Film/{id}:
 *   put:
 *     summary: Update a film
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
 *               title:
 *                 type: string
 *                 example: Academy Dinosaur
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
    film.title = req.body.title;

    const updateOperation = await connection("film").update(film)
        .where("film_id", req.params.id);
    res.send(`Updated ${updateOperation} film`);
});

/**
 * @swagger
 * /Film/{id}:
 *  delete:
 *   summary: Delete a film
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

//Film zu Category Tabellenverbindung

/**
 * @swagger
 * /film/{film_id}/category/{category_id}:
 *  post:
 *    summary: Add a film to a category - category should already exist
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
 *      name: category_id
 *      required: true
 *      description: ID of the category
 *      schema:
 *        type: integer
 *        example: 1
 *  responses:
 *    201:
 *      description: Film was successfully added to category
 *    400:
 *      description: Bad request - film or category does not exist
 */
filmRouter.post('/:film_id/category/:category_id', async (req: Request, res: Response) => {
    const filmId = req.params.film_id;
    const categoryId = req.params.category_id;

    try {
        await addFilmToCategory(Number(filmId), Number(categoryId));
        console.log(`Film ${filmId} added to category ${categoryId}`);

        res.status(201).json("Film-Category created");
    } catch (error) {
        console.error("Error adding film to category: ", error);
        res.status(400).json({error: "Failed to add film to category. " + (error)});
    }
});

/**
 * @swagger
 * /film/{film_id}/category/{category_id}:
 *  delete:
 *    summary: Remove a film from a category
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
 *      name: category_id
 *      required: true
 *      description: ID of the category
 *      schema:
 *        type: integer
 *        example: 1
 *    responses:
 *      200:
 *        description: Film was successfully removed from category
 *      404:
 *        description: Relationship between film and category not found
 */
filmRouter.delete('/:film_id/category/:category_id', async (req: Request, res: Response) => {
    const filmId = Number(req.params.film_id);
    const categoryId = Number(req.params.category_id);

    try {
        const result = await removeFilmFromCategory(filmId, categoryId);
        if (result === 0) {
            res.status(404).json({ error: "Film-category relationship not found" });
            return;
        }
        res.status(200).json({ message: `Film ${filmId} removed from category ${categoryId}` });
    } catch (error) {
        console.error("Error removing film from category: ", error);
        res.status(500).json({ error: "Failed to remove film from category. " + error });
    }
});

export default filmRouter;