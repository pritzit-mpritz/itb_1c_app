/**
 * @file film.ts
 * @description Enthält die REST API-Endpunkte zur Verwaltung von Filmen.
 * Die Endpunkte unterstützen grundlegende CRUD-Operationen und die Verwaltung
 * der n:n-Beziehung zwischen Film und Kategorie.
 *
 * Dieses Modul verwendet Express-Router, KnexJS für DB-Zugriffe und liefert
 * sowohl Swagger-Dokumentation als auch JSDoc für interne Zwecke.
 */

import {Request, Response, Router} from 'express';
import {
    getAllFilms,
    createFilm,
    getFilmById,
    deleteFilm,
    updateFilm,
    addFilmToCategory,
    deleteFilmCategory}
    from "../services/filmService";

const filmRouter: Router = Router();

/**
 * Holt eine Liste aller Filme, optional gefiltert nach dem Titel.
 */

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
 *         example: The Matrix
 *     responses:
 *       200:
 *         description: Liste der Filme erfolgreich abgerufen
 *       500:
 *         description: Fehler beim Abrufen der Filme.
 */

filmRouter.get('/', async (req: Request, res: Response) => {
    try {
        // Versuch, die Filme abzurufen
        const films = await getAllFilms(req.query.title as string);

        res.status(200).send({
            message: "Liste der Filme erfolgreich abgerufen.",
            data: films
        });
    } catch (error) {

        console.error(error);
        res.status(500).send({ error: "Fehler beim Abrufen der Filme." });
    }
});

/**
 * Holt einen bestimmten Film anhand der ID.
 *
 * @route GET /film/{id}
 * @param {Request} req - Die HTTP-Anfrage, welche die Film-ID als Pfadparameter enthält.
 * @param {Response} res - Die HTTP-Antwort, die den Film oder eine Fehlermeldung zurückgibt.
 * @returns {void}
 */

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
 *         description: Film erfolgreich abgerufen.
 *       404:
 *         description: Film nicht gefunden.
 *       500:
 *         description: Fehler beim Abrufen des Films.
 */

filmRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const film = await getFilmById(Number(req.params.id));

        if (!film) {
            res.status(404).send({error: "Film nicht gefunden"});
            return;
        }
        res.status(200).send({
            message: "Film erfolgreich abgerufen.",
            data: film
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Fehler beim Abrufen des Films." });
    }
});

/**
 * Erstellt einen neuen Film mit den bereitgestellten Daten.
 *
 * @route POST /film
 * @param {Request} req - Die HTTP-Anfrage, die im Body die Filmdaten als JSON enthält.
 * @param {Response} res - Die HTTP-Antwort, die die ID des neu erstellten Films oder eine Fehlermeldung zurückgibt.
 * @returns {void}
 */


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
 *               description:
 *                 type: string
 *                 example: A thrilling sci-fi movie.
 *               release_year:
 *                 type: number
 *                 example: 1999
 *               language_id:
 *                 type: integer
 *                 description: 1 = English, 2 = Italian, 3 = Japanese, 4 = Mandarin, 5 = French, 6 = German
 *                 example: 1
 *               original_language_id:
 *                 type: integer
 *                 nullable: true
 *                 example:
 *               rental_duration:
 *                 type: integer
 *                 example: 3
 *               rental_rate:
 *                 type: number
 *                 format: float
 *                 example: 4.99
 *               length:
 *                 type: integer
 *                 nullable: true
 *                 example: 120
 *               replacement_cost:
 *                 type: number
 *                 format: float
 *                 example: 19.99
 *               rating:
 *                 type: string
 *                 enum: [G, PG, PG-13, R, NC-17]
 *                 example: PG
 *               special_features:
 *                 description: "Wählen Sie einen der folgenden Werte: 'Trailers','Commentaries','Deleted Scenes','Behind the Scenes'. Bitte stellen Sie sicher, dass zwischen den Werten keine Leerzeichen nach den Kommas stehen."
 *                 nullable: true
 *                 example: "Commentaries,Deleted Scenes,Behind the Scenes"
 *     responses:
 *       201:
 *         description: Film erfolgreich erstellt.
 *       500:
 *         description: Fehler beim Erstellen des Films.
 */

filmRouter.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Erstelle Film: ", req.body);

        // Verwendet die Service-Funktion, um den Film zu erstellen
        const newFilmId = await createFilm(req.body);

        res.status(201).send({
            message: "Film erfolgreich erstellt.",
            id: newFilmId
        });
    } catch (error) {
        console.error("Fehler beim Erstellen des Films:", error);
        res.status(500).send({ error: "Fehler beim Erstellen des Films." });
    }
});

/**
 * Aktualisiert einen bestehenden Film anhand der Film-ID.
 *
 * @route PUT /film/{id}
 * @param {Request} req - Die HTTP-Anfrage mit dem Pfadparameter `id` und den neuen Daten im Body.
 * @param {Response} res - Die HTTP-Antwort, welche die Anzahl der aktualisierten Datensätze oder eine Fehlermeldung enthält.
 * @returns {void}
 */

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
 *               example: The Matrix
 *             description:
 *               type: string
 *               example: A thrilling sci-fi movie.
 *             release_year:
 *               type: number
 *               example: 1999
 *             language_id:
 *               type: integer
 *               description: 1 = English, 2 = Italian, 3 = Japanese, 4 = Mandarin, 5 = French, 6 = German
 *               example: 1
 *             original_language_id:
 *               type: integer
 *               nullable: true
 *               example:
 *             rental_duration:
 *               type: integer
 *               example: 3
 *             rental_rate:
 *               type: number
 *               format: float
 *               example: 4.99
 *             length:
 *               type: integer
 *               nullable: true
 *               example: 120
 *             replacement_cost:
 *               type: number
 *               format: float
 *               example: 19.99
 *             rating:
 *               type: string
 *               enum: [G, PG, PG-13, R, NC-17]
 *               example: PG
 *             special_features:
 *               type: string
 *               description: "Wählen Sie einen der folgenden Werte: 'Trailers','Commentaries','Deleted Scenes','Behind the Scenes'. Bitte stellen Sie sicher, dass zwischen den Werten keine Leerzeichen nach den Kommas stehen."
 *               nullable: true
 *               example: "Commentaries,Deleted Scenes,Behind the Scenes"
 *   responses:
 *     200:
 *       description: Film erfolgreich aktualisiert.
 *     404:
 *       description: Film nicht gefunden.
 *     500:
 *       description: Fehler beim Aktualisieren des Films.
 */


filmRouter.put('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedCount = await updateFilm(req.params.id, req.body);

        res.status(200).send({
            message: "Film erfolgreich aktualisiert.",
            updatedCount: updatedCount
        });

    } catch (error: any) {
        if (error.message === "Film nicht gefunden") {
            res.status(404).send({ error: error.message });
        } else {
            console.error("Fehler beim Aktualisieren des Films", error);
            res.status(500).send({ error: "Fehler beim Aktualisieren" });
        }
    }
});

/**
 * Löscht einen Film anhand der Film-ID.
 *
 * @route DELETE /film/{id}
 * @param {Request} req - Die HTTP-Anfrage, die den Pfadparameter `id` enthält.
 * @param {Response} res - Die HTTP-Antwort, welche eine Bestätigung oder eine Fehlermeldung zurückgibt.
 * @returns {void}
 */

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
 *       description: Film erfolgreich gelöscht.
 *     404:
 *       description: Film nicht gefunden.
 *     500:
 *       description: Fehler beim Löschen des Films.
 */



filmRouter.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const deleteOperation = await deleteFilm(Number(req.params.id));

        if (!deleteOperation) {
            res.status(404).send({ error: "Film nicht gefunden." });
            return;
        }

        res.status(200).send({
            message: "Film erfolgreich gelöscht.",
            deletedCount: deleteOperation
        });
    } catch (error) {
        console.error("Fehler beim Löschen des Films", error);
        res.status(500).send({ error: "Fehler beim Löschen des Films" });
    }
});



/**
 * Fügt einer Kategorie einen Film hinzu. (Erstellt eine Verknüpfung in der Tabelle film_category.)
 *
 * @route POST /film/{film_id}/category/{category_id}
 * @param {Request} req - Die HTTP-Anfrage mit den Pfadparametern `film_id` und `category_id`.
 * @param {Response} res - Die HTTP-Antwort, welche den Erfolg oder Fehler der Operation zurückgibt.
 * @returns {void}
 */

 /**
 * @swagger
 * /film/{film_id}/category/{category_id}:
 *   post:
 *     summary: Add a film to a category – the film should already exist
 *     tags: [Films]
 *     parameters:
 *       - in: path
 *         name: film_id
 *         required: true
 *         description: ID of the film
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: path
 *         name: category_id
 *         required: true
 *         description: ID of the category
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       201:
 *         description: Film erfolgreich zu Category hinzugefügt.
 *       400:
 *         description: Fehler den Film zu Category hinzuzufügen.
 */

filmRouter.post('/:film_id/category/:category_id', async (req: Request, res: Response) => {
    const filmId = req.params.film_id;
    const categoryId = req.params.category_id;

    try {
        await addFilmToCategory(Number(filmId), Number(categoryId));
        console.log(`Film ${filmId} added to category ${categoryId}`);

        res.status(201).send({
            message: "Film erfolgreich zu Category hinzugefügt.",
            filmId: filmId,
            categoryId: categoryId
        });

    } catch (error) {
        console.error("Fehler den Film zu Category hinzuzufügen: ", error);
        res.status(400).send({error: "Fehler den Film zu Category hinzuzufügen. " + error});
    }
})

/**
 * Entfernt die Verknüpfung zwischen einem Film und einer Kategorie.
 *
 * @route DELETE /film/{film_id}/category/{category_id}
 * @param {Request} req - Die HTTP-Anfrage, die die Pfadparameter `film_id` und `category_id` enthält.
 * @param {Response} res - Die HTTP-Antwort, welche eine Bestätigung oder eine Fehlermeldung zurückgibt.
 * @returns {void}
 */

 /**
 * @swagger
 * /film/{film_id}/category/{category_id}:
 *   delete:
 *     summary: Entfernt die Verknüpfung zwischen einem Film und einer Kategorie
 *     tags: [Films]
 *     parameters:
 *       - in: path
 *         name: film_id
 *         required: true
 *         description: ID des Films, bei dem die Kategorie entfernt werden soll
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: path
 *         name: category_id
 *         required: true
 *         description: ID der Kategorie, die entfernt werden soll
 *         schema:
 *           type: integer
 *         example: 2
 *     responses:
 *       200:
 *         description: Verknüpfung erfolgreich entfernt.
 *       404:
 *         description: Verknüpfung nicht gefunden.
 *       500:
 *         description: Fehler beim Entfernen der Verknüpfung.
 */

filmRouter.delete('/:film_id/category/:category_id', async (req: Request, res: Response): Promise<void> => {
    try {
        const { film_id, category_id } = req.params;

        // // Umwandlung der URL-Parameter 'film_id' und 'category_id' in Ganzzahlen (Integer), um sie in der Datenbank zu verwenden
        const filmId = parseInt(film_id, 10);
        const categoryId = parseInt(category_id, 10);

        //  // Überprüfe, ob die Umwandlung der Parameter in gültige Zahlen erfolgreich war
        if (isNaN(filmId) || isNaN(categoryId)) {
            // Gib eine Fehlermeldung zurück, wenn eine der IDs ungültig ist
            res.status(400).json({ message: 'Invalid film_id or category_id' });
            return;
        }

        // Rufe die Funktion auf, die die Verknüpfung zwischen Film und Kategorie entfernt
        const deletedCount = await deleteFilmCategory(filmId, categoryId);
        // Wenn keine Verknüpfung entfernt wurde, wir eine 404-Fehlermeldung zurück gegeben
        if (deletedCount === 0) {
            res.status(404).json({ message: 'Category not found for the given film' });
            return;
        }
        // Erfolgreiches Entfernen der Verknüpfung
        res.status(200).json({ message: 'Category removed successfully' });
    } catch (error: any) {
        //Fehler in der Verarbeitung
        res.status(500).json({ message: 'Error removing category', error: error.message });
    }
});




export default filmRouter;
