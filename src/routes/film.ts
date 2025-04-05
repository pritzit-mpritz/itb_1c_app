import {Request, Response, Router} from 'express';
import {db} from '../db';
import {addFilmtoCategory} from "../services/filmService";

const filmRouter = Router();


/**
 * @swagger
 * /film:
 *   get:
 *     summary: Retrieve a list of all films
 *     tags: [film]
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
 *       404:
 *         description: Failed to load films
 */

// GetAll – Liste aller Filme abrufen
filmRouter.get('/', async (_req: Request, res: Response) => {
    const connection = db();
    try {
        const films = await connection.select("*").from("film");
        res.send(films);
    } catch (error) {
        console.error("Error retrieving films from film: ", error);
        res.status(404).send({ error: 'Failed to load films' });
    }
});



//GetByID einzelnes Element nach ID abrufen
filmRouter.get('/:id', async (req: Request, res: Response) => {
    const connection = db();
    const film = await connection.select("*")
        .from("film")
        .where("film_id", req.params.id)
        .first();

    console.log("Selected film: ", film);

    if (!film) {
        res.status(404).send({error: "Film not found"});
        return
    }

    res.send(film);
});


//Insert: Post neues Element erstellen
/**
 * @swagger
 * /film:
 *   post:
 *     summary: Neuen Film erstellen
 *     tags: [film]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - language_id
 *             properties:
 *               title:
 *                 type: string
 *                 example: The Matrix
 *               description:
 *                 type: string
 *                 example: A hacker discovers reality is a simulation.
 *               release_year:
 *                 type: string
 *                 example: 1999
 *               language_id:
 *                 type: integer
 *                 example: 1
 *               rental_duration:
 *                 type: integer
 *                 example: 5
 *               rental_rate:
 *                 type: number
 *                 format: float
 *                 example: 4.99
 *               length:
 *                 type: integer
 *                 example: 136
 *               replacement_cost:
 *                 type: number
 *                 format: float
 *                 example: 19.99
 *               rating:
 *                 type: string
 *                 example: PG-13
 *               special_features:
 *                 type: string
 *                 example: Deleted Scenes,Behind the Scenes
 *     responses:
 *       200:
 *         description: Film erfolgreich erstellt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID des neu erstellten Films
 *       400:
 *         description: Ungültige Eingabe
 */



filmRouter.post('/', async (req: Request, res: Response) => {
    console.log("Creating film: ", req.body);

    const connection = db();
    const insertOperation = await connection.insert(req.body).into("film");

    res.send({id: insertOperation[0]});
});

//Update vorhandenes Element aktualisieren
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

// delete film ID, Element löschen
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

filmRouter.post('/:film_id/category/:category_id', async (req: Request, res: Response) => {
    const categoryId = req.params.category_id;
    const filmId = req.params.film_id;


    try {
        await addFilmtoCategory(Number(filmId), Number(categoryId));
        console.log(`Film ${filmId} added to category ${categoryId}`);

        res.status(201).send(" Film- Category created");
    } catch (error) {
        console.error("Error adding actor to film: ", error);
        res.status(400).send({error: "Failed to add actor to film. " + (error)});
    }
})

export default filmRouter;