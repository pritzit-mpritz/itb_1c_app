// Express: Router, Request und Response importieren
import { Request, Response, Router } from "express";
// Die Service-Funktionen importieren, die mit der Datenbank arbeiten
import {addFilmToCategory, createFilm, deleteFilm, getAllFilms, getFilmById, updateFilm, removeFilmFromCategory} from "../services/filmService";
// Express-Router für /film-Endpunkte anlegen
const filmRouter: Router = Router();

/**
 * @swagger
 * /film:
 *   get:
 *     summary: Gibt alle Filme zurück
 *     description: Ruft alle Einträge aus der Tabelle "film" ab und gibt sie als Liste zurück.
 *     tags:
 *       - Film
 *     responses:
 *       200:
 *         description: Erfolgreiche Antwort mit einer Liste aller Filme
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
 *                     example: 1
 *                   title:
 *                     type: string
 *                     description: Titel des Films
 *                     example: Inception
 *                   description:
 *                     type: string
 *                     description: Beschreibung des Films
 *                     example: Ein spannender Film über Traumwelten
 *       404:
 *         description: Filme konnten nicht geladen werden
 */
filmRouter.get("/", async (req: Request, res: Response) => {
    // Rufe alle Filme aus der Datenbank ab, optional gefiltert über ?titleFilter=
    try {
        res.send(await getAllFilms(req.query.titleFilter as string));
    } catch {
        // Fehlerbehandlung: Wenn etwas schiefläuft, sende Status 404
        res.status(404).send({ error: "Filme konnten nicht geladen werden" });
    }
});

/**
 * @swagger
 * /film/{id}:
 *   get:
 *     summary: Gibt einen bestimmten Film anhand der ID zurück
 *     description: Ruft einen einzelnen Film aus der Tabelle "film" anhand der ID ab.
 *     tags:
 *       - Film
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Die ID des Films
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Erfolgreich – Film gefunden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 film_id:
 *                   type: integer
 *                   example: 2
 *                 title:
 *                   type: string
 *                   example: Interstellar
 *                 description:
 *                   type: string
 *                   example: Eine Reise durch Raum und Zeit
 *       404:
 *         description: Film konnte nicht geladen werden
 */
filmRouter.get("/:id", async (req: Request, res: Response) => {
    // Holt den Film mit passender ID aus der Datenbank
    try {
        const film= await getFilmById(Number(req.params.id))
        res.send(film); // Film erfolgreich zurückgeben
    } catch {
        res.status(404).send({ error: "Film konnte nicht geladen werden" });
    }
});

/**
 * @swagger
 * /film:
 *   post:
 *     summary: Erstellt einen neuen Film
 *     description: Fügt einen neuen Eintrag in die Tabelle "film" ein.
 *     tags:
 *       - Film
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: Matrix
 *               description:
 *                 type: string
 *                 example: Ein Hacker entdeckt eine künstliche Realität
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
 *                   description: Die ID des erstellten Films
 *                   example: 10
 *       404:
 *         description: Film konnte nicht erstellt werden
 */
filmRouter.post("/", async (req: Request, res: Response) => {
    try {
        // Erstellt einen neuen Film mit den Daten aus dem Request-Body
        const id = await createFilm(req.body);
        res.send({ id }); // Rückgabe der neuen Film-ID
    } catch (error) {
        res.status(404).send({ error: "Film konnte nicht erstellt werden" });
    }
});

/**
 * @swagger
 * /film/{id}:
 *   put:
 *     summary: Aktualisiert einen bestehenden Film
 *     tags:
 *       - Film
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Die ID des Films
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
 *                 example: "Inception"
 *               description:
 *                 type: string
 *                 example: "Ein Sci-Fi Thriller über Traumebenen"
 *               release_year:
 *                 type: string
 *                 example: "2010"
 *               language_id:
 *                 type: integer
 *                 example: 1
 *               original_language_id:
 *                 type: integer
 *                 example: 2
 *               rental_duration:
 *                 type: integer
 *                 example: 5
 *               rental_rate:
 *                 type: number
 *                 format: float
 *                 example: 2.99
 *               length:
 *                 type: integer
 *                 example: 148
 *               replacement_cost:
 *                 type: number
 *                 format: float
 *                 example: 19.99
 *               rating:
 *                 type: string
 *                 example: "PG-13"
 *               special_features:
 *                 type: string
 *                 example: "Deleted Scenes,Behind the Scenes"
 *     responses:
 *       200:
 *         description: Erfolgreich aktualisiert
 *       404:
 *         description: Film nicht gefunden
 */


filmRouter.put("/:id", async (req: Request, res: Response) => {
    try {
        // Übergibt die Film-ID und die neuen Felder an die update-Funktion
        const result= await updateFilm (Number(req.params.id), req.body);
        res.send (`Updated ${result} film`); // Bestätigung senden
    } catch (error){
        res.status(404).send({ error: "Film konnte nicht aktualisiert werden" });
    }
});

/**
 * @swagger
 * /film/{id}:
 *   delete:
 *     summary: Löscht einen Film
 *     description: Entfernt einen Film anhand der ID aus der Datenbank.
 *     tags:
 *       - Film
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Die ID des Films
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Film erfolgreich gelöscht
 *       404:
 *         description: Film konnte nicht gelöscht werden
 */
filmRouter.delete("/:id", async (req: Request, res: Response) => {
    try {
        // Löscht einen Film anhand seiner ID
        const result = await deleteFilm (req.params.id);
        res.send(`Deleted ${result} film`); // Rückmeldung über gelöschten Film
    } catch {
        res.status(404).send({ error: "Film konnte nicht gelöscht werden" });
    }
});

/**
 * @swagger
 * /film/{film_id}/category/{category_id}:
 *   post:
 *     summary: Verknüpft einen Film mit einer Kategorie
 *     description: Fügt eine Beziehung zwischen einem Film und einer Kategorie in der Tabelle "film_category" hinzu.
 *     tags:
 *       - Film
 *     parameters:
 *       - in: path
 *         name: film_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Einen Film einer Category hinzufügen.
 *       - in: path
 *         name: category_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Die ID der Kategorie
 *     responses:
 *       201:
 *         description: Verknüpfung erfolgreich erstellt
 *       400:
 *         description: Fehlerhafte Anfrage oder Verknüpfung fehlgeschlagen
 */
filmRouter.post('/:film_id/category/:category_id', async (req: Request, res: Response) => {
    const filmId = req.params.film_id;
    const categoryId = req.params.category_id;
    try {
        // Führt die Verknüpfung Film ↔ Kategorie aus (in film_category-Tabelle)
        await addFilmToCategory(Number(categoryId), Number(filmId));
        console.log(`Film ${filmId} wurde mit Kategorie ${categoryId} verknüpft`);

        res.status(201).send("Film wurde der Kategorie hinzugefügt");
    } catch (error) {
        console.error("Fehler beim Verknüpfen von Film und Kategorie:", error);
        res.status(400).send({ error: `Verknüpfung fehlgeschlagen: ${error}` });
    }
});

/**
 * @swagger
 * /film/{film_id}/category/{category_id}:
 *   delete:
 *     summary: Entfernt die Verknüpfung zwischen einem Film und einer Kategorie
 *     description: Löscht die Zuordnung eines Films zu einer Kategorie aus der "film_category"-Tabelle.
 *     tags:
 *       - Film
 *     parameters:
 *       - in: path
 *         name: film_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Die ID des Films
 *       - in: path
 *         name: category_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Die ID der Kategorie
 *     responses:
 *       200:
 *         description: Verknüpfung erfolgreich entfernt
 *       400:
 *         description: Fehler beim Entfernen der Verknüpfung
 */
filmRouter.delete('/:film_id/category/:category_id', async (req: Request, res: Response) => {
    const filmId = Number(req.params.film_id);
    const categoryId = Number(req.params.category_id);
    try {
        // Entfernt die Zuordnung zwischen einem Film und einer Kategorie
        await removeFilmFromCategory(categoryId, filmId);
        console.log(`Verknüpfung zwischen Film ${filmId} und Kategorie ${categoryId} wurde entfernt`);

        res.status(200).send("Verknüpfung erfolgreich entfernt");
    } catch (error) {
        console.error("Fehler beim Entfernen der Verknüpfung:", error);
        res.status(400).send({ error: `Verknüpfung konnte nicht entfernt werden: ${error}` });
    }
});

export default filmRouter;
// Macht den Router nutzbar in der Haupt-App
