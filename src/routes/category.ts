import {Request, Response, Router} from 'express';

import {addFilmToCategory} from "../services/filmService";
import {getAllCategories, getCategoryById, createFilmCategory, updateCategory, deleteCategory} from "../services/categoryService";



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

    try {
        res.send(await  getAllCategories(req.query.NameFilter as string));

    }catch{
        res.status(404).send({error: "Categories not found"});
    }
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

        try {
            const category = await getCategoryById(Number(req.params.id))
            res.send(category);
        } catch {
            res.status(404).send({error: "Category not found"});
            return
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
 *         description: Serverfehler beim
 *
 **/
categoryRouter.post('/', async (req: Request, res: Response) => {
    try {
        const id = await createFilmCategory(req.body);
        res.send({ id });
    } catch (error) {
        res.status(404).send({ error: 'Category not found' });
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
    try {
        const result = await updateCategory(req.params.id, req.body.name);
        res.send(`Updated ${result} category`);
    } catch (error) {
        res.status(404).send({ error: 'Category not found' });
    }
});
/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Löscht eine Kategorie
 *     description: Entfernt eine Kategorie anhand ihrer ID aus der Datenbank.
 *     tags:
 *       - Category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Die ID der Kategorie, die gelöscht werden soll
 *     responses:
 *       200:
 *         description: Kategorie erfolgreich gelöscht
 *       404:
 *         description: Kategorie wurde nicht gefunden
 *       500:
 *         description: Serverfehler beim Löschen der Kategorie
 */

categoryRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const result = await deleteCategory(req.params.id);
        res.send(`Deleted ${result} category`);
    } catch (error) {
        res.status(404).send({ error: 'Not found' });
    }
});
/**
 * @swagger
 * /category/{category_id}/film/{film_id}:
 *   post:
 *     summary: Ordnet einen Film einer Kategorie zu
 *     description: Fügt eine Zuordnung zwischen einem Film und einer Kategorie in der Tabelle "film_category" hinzu, basierend auf den übergebenen IDs.
 *     tags:
 *       - Category
 *     parameters:
 *       - in: path
 *         name: category_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Die ID der Kategorie, die dem Film zugeordnet werden soll
 *       - in: path
 *         name: film_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Die ID des Films, der der Kategorie zugeordnet werden soll
 *
 *     responses:
 *       201:
 *         description: Film erfolgreich der Kategorie zugeordnet
 *       400:
 *         description: Fehlerhafte Anfrage oder fehlerhafte Zuordnung
 *       404:
 *         description: Film oder Kategorie wurden nicht gefunden
 *       500:
 *         description: Serverfehler beim Erstellen der Zuordnung
 */

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
    });

    export default categoryRouter;



