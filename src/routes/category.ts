import {Request, Response, Router} from 'express';

import {addFilmToCategory, removeFilmFromCategory} from "../services/filmService";
import {getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory} from "../services/categoryService";




const categoryRouter: Router = Router();

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Gibt alle Kategorien zurück
 *     description: Gibt alle Kategorien zurück, optional gefiltert nach Namen.
 *     tags: [Category]
 *     parameters:
 *       - in: query
 *         name: NameFilter
 *         schema:
 *           type: string
 *         required: false
 *         description: Optionaler Namensfilter für die Kategorien
 *     responses:
 *       200:
 *         description: Liste aller gefundenen Kategorien
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   category_id:
 *                     type: number
 *                   name:
 *                     type: string
 *       404:
 *         description: Kategorien nicht gefunden!
 */

categoryRouter.get('/', async (req: Request, res: Response) => {

    try {
        res.send(await  getAllCategories(req.query.NameFilter as string));              //Rüft die Funktion auf die eine Liste aller Funktionen ausgibt

    }catch{
        res.status(404).send({error: "Kategorien nicht gefunden!"});
    }
});


/**
 * @swagger
 * /category/{id}:
 *   get:
 *     summary: Gibt eine bestimmte Kategorie anhand der ID zurück
 *     description: Ruft eine einzelne Kategorie aus der Datenbank anhand der ID ab.
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Die ID der Kategorie
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kategorie erfolgreich gefunden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category_id:
 *                   type: number
 *                 name:
 *                   type: string
 *       404:
 *         description: Kategorie nicht gefunden
 */

categoryRouter.get('/:id', async (req: Request, res: Response) => {

        try {
            const category = await getCategoryById(Number(req.params.id))               //Rüft Funktion auf, die eine Kategorie anzeigt, anhand der ausgewählten ID
            res.send(category);
        } catch {
            res.status(404).send({error: "Kategorie nicht gefunden!"});
            return
        }


    });

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Erstellt eine neue Kategorie
 *     description: Fügt eine neue Kategorie in die Datenbank ein.
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Action
 *     responses:
 *       200:
 *         description: Kategorie erfolgreich erstellt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *       404:
 *         description: Kategorie konnte nicht erstellt werden
 */


categoryRouter.post('/', async (req: Request, res: Response) => {
    try {
        const id = await createCategory(req.body);                                  //Aufruf der Funktion zum Erstellen einer Kategorie
        res.send({ id });
    } catch (error) {
        res.status(404).send({ error: 'Kategorie konnte nicht erstellt werden' });
    }
});
/**
 * @swagger
 * /category/{id}:
 *   put:
 *     summary: Aktualisiert eine bestehende Kategorie
 *     description: Ändert den Namen einer Kategorie anhand der übergebenen ID.
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Die ID der Kategorie, die aktualisiert werden soll
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Drama
 *     responses:
 *       200:
 *         description: Kategorie erfolgreich aktualisiert
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Updated 1 category
 *       404:
 *         description: Kategorie nicht aktualisiert werden
 */


categoryRouter.put('/:id', async (req: Request, res: Response) => {
    try {
        const result = await updateCategory(req.params.id, req.body.name);          //Rüft die Aktualisierung- Funktion auf
        res.send(`Updated ${result} category`);                                             //Zeig die aktualisierten Daten an.
    } catch (error) {
        res.status(404).send({ error: 'Kategorie nicht aktualisiert werden' });
    }
});
/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Löscht eine Kategorie
 *     description: Entfernt eine Kategorie aus der Datenbank anhand der übergebenen ID.
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Die ID der zu löschenden Kategorie
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kategorie erfolgreich gelöscht
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Deleted 1 category
 *       404:
 *         description: Category konnte nicht gelöscht werden
 */


categoryRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const result = await deleteCategory(req.params.id);                     //Rüft Delete-Funktion auf mit der ID im Parameter
        res.send(`Deleted ${result} category`);
    } catch (error) {
        res.status(404).send({ error: 'Category konnte nicht gelöscht werden' });
    }
});
/**
 * @swagger
 * /category/{category_id}/film/{film_id}:
 *   post:
 *     summary: Verknüpft eine Kategorie mit einem Film
 *     description: Erstellt eine Beziehung zwischen einer Kategorie und einem Film, indem ein Eintrag in der Tabelle "film_category" erzeugt wird.
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: category_id
 *         required: true
 *         description: Die ID der Kategorie
 *         schema:
 *           type: integer
 *       - in: path
 *         name: film_id
 *         required: true
 *         description: Die ID des Films
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Kategorie erfolgreich mit dem Film verknüpft
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: category-Film created
 *       400:
 *         description: Fehler beim Verknüpfen von Kategorie und Film
 */


categoryRouter.post('/:category_id/film/:film_id',
    async (req: Request, res: Response) => {
        const categoryId = req.params.category_id;                                //Konstanten-Variablen werden initialisiert für die ID's die übergeben werden.
        const filmId = req.params.film_id;

        try {
            await addFilmToCategory(Number(categoryId), Number(filmId));                //Funktion um Verknüpfung mit einem Film aufzubauen wir aufgerufen
            console.log(`category ${categoryId} added to film ${filmId}`);              // Ausgabe der erstellten Verknüpfung in der Console

            res.status(201).send("Kategorie erfolgreich mit dem Film verknüpft");
        } catch (error) {
            console.error("Error adding Category to Film: ", error);                    //Fehlermeldung
            res.status(400).send({error: `Fehler beim Verknüpfen von Kategorie und Film. ${error}`});
        }
    });

/**
 * @swagger
 * /category/{category_id}/film/{film_id}:
 *   delete:
 *     summary: Entfernt die Verknüpfung zwischen einem Film und einer Kategorie
 *     description: Löscht die Zuordnung aus der Tabelle "film_category", wodurch die Verknüpfung zwischen dem Film und der Kategorie entfernt wird.
 *     tags: [Category]
 *     parameters:
 *       - name: category_id
 *         in: path
 *         required: true
 *         description: Die ID der Kategorie, die mit dem Film verknüpft ist
 *         schema:
 *           type: integer
 *       - name: film_id
 *         in: path
 *         required: true
 *         description: Die ID des Films, der aus der Kategorie entfernt werden soll
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Verknüpfung zwischen Film und Kategorie erfolgreich entfernt
 *       400:
 *         description: Fehler beim Entfernen der Verknüpfung
 *       404:
 *         description: Film oder Kategorie nicht gefunden
 */



categoryRouter.delete('/:category_id/film/:film_id', async (req: Request, res: Response) => {
    const filmId = Number(req.params.film_id);
    const categoryId = Number(req.params.category_id);

    try {
        await removeFilmFromCategory(categoryId, filmId);                                               //Rüft die Delete Funktion auf um die eine Verknüpfung mit Film zu entfernen
        console.log(`Verknüpfung zwischen Film ${filmId} und Kategorie ${categoryId} wurde entfernt`);  //Aufgelöste Verknüpfung wird in der Console ausgegeben

        res.status(200).send("Verknüpfung erfolgreich entfernt");
    } catch (error) {                                                                                   //Fehlermeldung
        console.error("Fehler beim Entfernen der Verknüpfung:", error);
        res.status(400).send({ error: `Verknüpfung konnte nicht entfernt werden: ${error}` });
    }
});


    export default categoryRouter;



