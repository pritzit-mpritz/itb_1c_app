import {Request, Response, Router} from 'express';
import {db} from '../db';
import {addFilmToCategory} from "../services/filmService";



const categoryRouter: Router = Router();

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Gibt alle Filmkategorien zurück
 *     description: Ruft alle Einträge aus der Tabelle "film_category" ab und gibt sie als Liste zurück.
 *     tags:
 *       - Category
 *     responses:
 *       200:
 *         description: Erfolgreiche Antwort mit einer Liste aller Filmkategorien
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   film_id:
 *                     type: integer
 *                     description: ID des Films
 *                   category_id:
 *                     type: integer
 *                     description: ID der Kategorie
 *       500:
 *         description: Serverfehler beim Abrufen der Kategorien
 */
categoryRouter.get('/', async (req: Request, res: Response) => {
    const connection = db();
    try {
        const categorys = await connection.select("*").from("film_category");

        console.log("Selected category: ", categorys);

        res.send(categorys);
    }
    catch{}
});


    /**
     * @swagger
     * /category/{id}:
     *   get:
     *     summary: Gibt eine bestimmte Kategorie anhand der ID zurück
     *     description: Ruft eine einzelne Kategorie aus der Tabelle "category" basierend auf der übergebenen ID ab.
     *     tags:
     *       - Category
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Die ID der Kategorie, die abgerufen werden soll
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Erfolgreich – Kategorie gefunden
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 category_id:
     *                   type: integer
     *                   description: Die ID der Kategorie
     *                 name:
     *                   type: string
     *                   description: Der Name der Kategorie
     *       404:
     *         description: Kategorie mit der angegebenen ID wurde nicht gefunden
     *       500:
     *         description: Serverfehler beim Abrufen der Kategorie
     */
    categoryRouter.get('/:id', async (req: Request, res: Response) => {
        const connection = db();
        try {
            const category = await connection.select("*")
                .from("category")
                .where("category_id", req.params.id)
                .first();

            console.log("Selected category: ", category);
            res.send(category);
        } catch {
            res.status(404).send({error: "Category not found"});
            return;
        }


    });


/**
 * @swagger
 * /category:
 *   post:
 *     summary: Erstellt eine neue Film-Kategorie-Zuordnung
 *     description: Fügt einen neuen Eintrag in die Tabelle "film_category" ein, um einen Film mit einer Kategorie zu verknüpfen.
 *     tags:
 *       - Category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - film_id
 *               - category_id
 *             properties:
 *               film_id:
 *                 type: integer
 *                 description: Die ID des Films
 *               category_id:
 *                 type: integer
 *                 description: Die ID der Kategorie
 *     responses:
 *       201:
 *         description: Erfolgreich erstellt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Die ID des erstellten Eintrags
 *       400:
 *         description: Ungültige Anfrage
 *       404:
 *         description: Kategorie oder Film wurde nicht gefunden
 *       500:
 *         description: Serverfehler beim*
 *
 **/
    categoryRouter.post('/', async (req: Request, res: Response) => {
        console.log("Creating film_category: ", req.body);

        const connection = db();
        try {
            const insertOperation = await connection.insert(req.body).into("film_category");

            res.send({id: insertOperation[0]});
        } catch (error) {
            res.status(404).send({error: " Category not found"});
        }


    });
/**
 * @swagger
 * /category/{id}:
 *   put:
 *     summary: Aktualisiert eine bestehende Kategorie
 *     description: Aktualisiert den Namen einer Kategorie anhand der übergebenen ID.
 *     tags:
 *       - Category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Die ID der Kategorie, die aktualisiert werden soll
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Neuer Name der Kategorie
 *     responses:
 *       200:
 *         description: Kategorie erfolgreich aktualisiert
 *       404:
 *         description: Kategorie wurde nicht gefunden
 *       500:
 *         description: Serverfehler beim Aktualisieren der Kategorie
 */

    categoryRouter.put('/:id', async (req: Request, res: Response) => {
        const connection = db();
        try {
            const category = await connection.select("*")
                .from("category")
                .where("category_id", req.params.id).first();
            category.name = req.body.name;

            const updateOperation = await connection("category").update(category)
                .where("category_id", req.params.id);
            res.send(`Updated ${updateOperation} category`);

        } catch (error) {
            res.status(404).send({error: " category not found"});
        }


    });
    /**
     *
     * **/
    categoryRouter.delete('/:id', async (req: Request, res: Response) => {
        const connection = db();
        try {
            const deleteOperation = await connection("category")
                .where("category_id", req.params.id).delete();
            res.send(`Deleted ${deleteOperation} category`);
        } catch (error) {
            res.status(404).send({error: " not found"});
        }


    });
    /**
     *
     * **/
    categoryRouter.post('/:category_id/film/:film_id', async (req: Request, res: Response) => {
        const categoryId = req.params.category_id;
        const filmId = req.params.film_id;

        try {
            await addFilmToCategory(Number(categoryId), Number(filmId));
            console.log(`category ${categoryId} added to film ${filmId}`);

            res.status(201).send("category-Film created");
        } catch (error) {
            console.error("Error adding category to film: ", error);
            res.status(400).send({error: "Failed to add category to film. " + (error)});
        }
    })

    export default categoryRouter;



