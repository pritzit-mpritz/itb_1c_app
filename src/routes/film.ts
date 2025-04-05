import {Request, Response, Router} from 'express';
import {db} from '../db';
import {getAllFilms} from '../services/filmService';
import {addFilmtoCategory} from "../services/filmService";

const filmRouter = Router();


filmRouter.get('/', async (req: Request, res: Response) => {
    res.send(await getAllFilms(req.query.title as string));
});
/**
 * @swagger
 * /film:
 *   get:
 *     summary: Gibt eine Liste aller Filme zurück
 *     tags: [Film]
 *     responses:
 *       200:
 *         description: Eine Liste von Filmen aus der Datenbank
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   film_id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   release_year:
 *                     type: string
 *                   language_id:
 *                     type: integer
 *                   rental_duration:
 *                     type: integer
 *                   rental_rate:
 *                     type: number
 *                     format: float
 *                   length:
 *                     type: integer
 *                   replacement_cost:
 *                     type: number
 *                     format: float
 *                   rating:
 *                     type: string
 *                   last_update:
 *                     type: string
 *                     format: date-time
 *                   special_features:
 *                     type: string
 *                   fulltext:
 *                     type: string
 *       500:
 *         description: Fehler beim Abrufen der Filme
 */


//GetAll Liste aller Filme abrufen
filmRouter.get('/', async (_req: Request, res: Response) => {
    const connection = db();
    const films = await connection.select("*").from("film");

    console.log("Selected films:...", films);

    res.send(films);
})

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