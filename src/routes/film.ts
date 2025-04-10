import { Request, Response, Router } from "express";
import { db } from "../db";
import { addFilmToCategory} from "../services/filmService";

const filmRouter: Router = Router();

/**
 * @swagger
 * /film:
 *   get:
 *     summary: Gibt alle Filme zurück
 *     description: Ruft alle Einträge aus der Tabelle "film" ab und gibt sie als Liste zurück.
 *     tags: [film]
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
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 */
filmRouter.get("/", async (req: Request, res: Response) => {
    const connection = db();
    try {
        const films = await connection.select("*").from("film");
        res.send(films);
    } catch (error) {
        console.error("Fehler beim Abrufen der Filme:", error);
        res.status(404).send({ error: "Filme konnten nicht geladen werden" });
    }
});

/**
 * @swagger
 * /film/{id}:
 *   get:
 *     summary: Gibt einen bestimmten Film anhand der ID zurück
 *     description: Ruft einen einzelnen Film aus der Tabelle "film" anhand der ID ab.
 *     tags: [film]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Die ID des Films
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
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *       404:
 *         description: Film nicht gefunden
 */
filmRouter.get("/:id", async (req: Request, res: Response) => {
    const connection = db();
    try {
        const film = await connection("film").where("film_id", req.params.id).first();

        if (!film) {
            res.status(404).send({ error: "Film nicht gefunden" });
            return;
        }

        res.send(film);
    } catch (error) {
        console.error("Fehler beim Abrufen des Films:", error);
        res.status(404).send({ error: "Film konnte nicht geladen werden" });
    }
});

/**
 * @swagger
 * /film:
 *   post:
 *     summary: Erstellt einen neuen Film
 *     description: Fügt einen neuen Eintrag in die Tabelle "film" ein.
 *     tags: [film]
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
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Erfolgreich erstellt
 *       400:
 *         description: Fehler bei der Erstellung
 */
filmRouter.post("/", async (req: Request, res: Response) => {
    const connection = db();
    try {
        const insertResult = await connection("film").insert(req.body);
        res.send({ success: true, id: insertResult[0] });
    } catch (error) {
        console.error("Fehler beim Erstellen des Films:", error);
        res.status(404).send({ error: "Film konnte nicht erstellt werden" });
    }
});

/**
 * @swagger
 * /film/{id}:
 *   put:
 *     summary: Aktualisiert einen bestehenden Film
 *     description: Ändert Titel und Beschreibung eines Films anhand der ID.
 *     tags: [film]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Die ID des Films, der aktualisiert werden soll
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
 *                 example: Inception
 *               description:
 *                 type: string
 *                 example: Ein Film über Träume und Realität
 *     responses:
 *       200:
 *         description: Film erfolgreich aktualisiert
 *       404:
 *         description: Film wurde nicht gefunden
 */
filmRouter.put("/:id", async (req: Request, res: Response) => {
    const connection = db();
    try {
        const film = await connection("film")
            .select("*")
            .where("film_id", req.params.id)
            .first();
        if (!film) {
            res.status(404).send({ error: "Film nicht gefunden" });
            return;
        }

        film.title = req.body.title;
        film.description = req.body.description;

        const updateOperation = await connection("film")
            .update(film)
            .where("film_id", req.params.id);

        res.send(`Film aktualisiert (${updateOperation} Eintrag)`);
    } catch (error) {
        console.error("Fehler beim Aktualisieren des Films:", error);
        res.status(404).send({ error: "Film konnte nicht aktualisiert werden" });
    }
});

/**
 * @swagger
 * /film/{id}:
 *   delete:
 *     summary: Löscht einen Film
 *     description: Entfernt einen Film aus der Datenbank anhand der ID.
 *     tags: [film]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Die ID des Films
 *     responses:
 *       200:
 *         description: Film erfolgreich gelöscht
 *       404:
 *         description: Film nicht gefunden
 */
filmRouter.delete("/:id", async (req: Request, res: Response) => {
    const connection = db();
    try {
        const deleteOperation = await connection("film")
            .where("film_id", req.params.id)
            .delete();

        res.send(`Film gelöscht (${deleteOperation} Eintrag)`);
    } catch (error) {
        res.status(404).send({ error: "Film konnte nicht gelöscht werden" });
    }
});

/**
 * @swagger
 * /film/{film_id}/category/{category_id}:
 *   post:
 *     summary: Verknüpft einen Film mit einer Kategorie
 *     description: Fügt eine Beziehung zwischen Film und Kategorie in der Tabelle "film_category" hinzu.
 *     tags: [film]
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
 *       201:
 *         description: Verknüpfung erfolgreich erstellt
 *       400:
 *         description: Fehler bei der Verknüpfung
 */
filmRouter.post("/:film_id/category/:category_id", async (req: Request, res: Response) => {
    const filmId = req.params.film_id;
    const categoryId = req.params.category_id;

    try {
        await addFilmToCategory(Number(categoryId), Number(filmId));
        console.log(`Film ${filmId} wurde Kategorie ${categoryId} zugeordnet`);
        res.status(201).send("Verknüpfung erstellt");
    } catch (error) {
        console.error("Fehler bei Verknüpfung: ", error);
        res.status(400).send({ error: "Film konnte nicht zugeordnet werden" });
    }
});

/**
 * @swagger
 * /film/{film_id}/category/{category_id}:
 *   delete:
 *     summary: Entfernt die Verknüpfung zwischen einem Film und einer Kategorie
 *     description: Löscht die Zuordnung aus der Tabelle "film_category".
 *     tags: [film]
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
 *         description: Verknüpfung erfolgreich gelöscht
 *       404:
 *         description: Verknüpfung nicht gefunden
 */
filmRouter.delete("/:film_id/category/:category_id", async (req: Request, res: Response) => {
    const categoryId = req.params.category_id;
    const filmId = req.params.film_id;

    try {
        await addFilmToCategory(Number(categoryId), Number(filmId));
        console.log(`Film ${filmId} added to Category ${categoryId} `);

        res.status(201).send("Film added to Category ${categoryId} ");
    } catch (error) {
        console.error("Error adding Film to Category: ", error);
        res.status(400).send({error: "Failed to add Film to Category. " + (error)});
    }
});

export default filmRouter;
