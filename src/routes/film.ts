// src/routes/film.ts
import { Router, Request, Response } from "express";
import { db } from '../db'; // DB-Verbindung direkt nutzen
import { getAllFilms, getFilmById } from "../services/filmService"; // Nur GETs importieren
import {
    addFilmCategoryLink,
    removeFilmCategoryLink,
    getCategoriesForFilm
} from "../services/filmCategoryService";

const filmRouter: Router = Router();

/**
 * @swagger
 * tags:
 *   - name: Films
 *     description: Film management
 * /film:
 *   get:
 *     summary: Retrieve a list of films
 *     tags: [Films]
 *     parameters:
 *     - name: title
 *       in: query
 *       required: false
 *       description: Filter films by title (starts with)
 *       schema: { type: string, example: "ACADEMY" }
 *     responses:
 *       200: { description: A list of films }
 *       500: { description: Server Error }
 */
filmRouter.get('/', async (req: Request, res: Response) => {
    try {
        const films = await getAllFilms(req.query.title as string);
        res.send(films);
    } catch (error: any) {
        console.error("[GET /film] Error:", error);
        res.status(500).send({ error: "Failed to retrieve films", details: error?.message });
    }
});

/**
 * @swagger
 * /film/{id}:
 *   get:
 *     summary: Retrieve a film by ID
 *     tags: [Films]
 *     parameters:
 *       - { name: id, in: path, required: true, description: ID of the film, schema: { type: integer } }
 *     responses:
 *       200: { description: A single film }
 *       400: { description: Invalid ID }
 *       404: { description: Film not found }
 *       500: { description: Server Error }
 */
filmRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const filmId = Number(req.params.id);
        if (isNaN(filmId)) {
            res.status(400).send({ error: "Invalid film ID" }); return;
        }
        const film = await getFilmById(filmId);
        if (!film) {
            res.status(404).send({ error: "Film not found" }); return;
        }
        res.send(film);
    } catch (error: any) {
        console.error(`[GET /film/${req.params.id}] Error:`, error);
        res.status(500).send({ error: "Failed to retrieve film", details: error?.message });
    }
});

/**
 * @swagger
 * /film:
 *   post:
 *     summary: Create a new film
 *     tags: [Films]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { type: object, example: { title: "Code Wars", language_id: 1, rental_duration: 3, rental_rate: 2.99, replacement_cost: 15.99 } } } }
 *     responses:
 *       201: { description: Film created successfully, content: { application/json: { schema: { properties: { id: { type: integer } } } } } }
 *       400: { description: Bad request (e.g. missing data, invalid FK) }
 */
filmRouter.post('/', async (req: Request, res: Response) => {
    // Weniger strikte Validierung, DB fängt Fehler ab
    if (!req.body?.title || !req.body?.language_id) {
        res.status(400).send({ error: "Missing required fields (at least title and language_id)" }); return;
    }
    const connection = db();
    try {
        // Default Werte für Sakila, falls nicht übergeben
        const filmData = {
            rental_duration: 3, // Default
            rental_rate: 4.99, // Default
            replacement_cost: 19.99, // Default
            ...req.body // Überschreibt Defaults mit Body-Daten
        };
        console.log("Creating film with data: ", filmData);
        const insertOperation = await connection.insert(filmData).into("film");
        res.status(201).send({ id: insertOperation[0] }); // Gibt nur ID zurück
    } catch (error: any) {
        console.error("[POST /film] DB Error:", error);
        res.status(400).send({ error: "Failed to create film", details: error?.message });
    }
});

/**
 * @swagger
 * /film/{id}:
 *   put:
 *     summary: Update a film
 *     tags: [Films]
 *     parameters:
 *       - { name: id, in: path, required: true, schema: { type: integer } }
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { type: object, example: { title: "Code Wars Reloaded" } } } }
 *     responses:
 *       200: { description: Film updated successfully (returns count), content: { text/plain: { schema: { type: string, example: "Updated 1 films" } } } }
 *       400: { description: Invalid ID or Body }
 *       404: { description: Film not found }
 */
filmRouter.put('/:id', async (req: Request, res: Response) => {
    const filmId = Number(req.params.id);
    if (isNaN(filmId)) { res.status(400).send({ error: "Invalid film ID" }); return; }
    if (!req.body || Object.keys(req.body).length === 0) {
        res.status(400).send({ error: "Request body cannot be empty" }); return;
    }
    const connection = db();
    try {
        // Direktes Update
        const updateOperation = await connection("film")
            .update(req.body)
            .where("film_id", filmId);
        if (updateOperation === 0) {
            res.status(404).send({error: "Film not found or no changes applied"}); return;
        }
        res.send(`Updated ${updateOperation} films`); // Einfache Antwort
    } catch(error: any) {
        console.error(`[PUT /film/${filmId}] DB Error:`, error);
        res.status(400).send({ error: "Failed to update film", details: error?.message });
    }
});

/**
 * @swagger
 * /film/{id}:
 *  delete:
 *   summary: Delete a film
 *   tags: [Films]
 *   parameters:
 *    - { name: id, in: path, required: true, schema: { type: integer } }
 *   responses:
 *     200: { description: Film deleted successfully (returns count), content: { text/plain: { schema: { type: string, example: "Deleted 1 films" } } } }
 *     400: { description: "Cannot delete (FK constraint)" }
 *     404: { description: Film not found }
 *     500: { description: Server Error }
 */
filmRouter.delete('/:id', async (req: Request, res: Response) => {
    const filmId = Number(req.params.id);
    if (isNaN(filmId)) { res.status(400).send({ error: "Invalid film ID" }); return; }
    const connection = db();
    try {
        const deleteOperation = await connection("film").where("film_id", filmId).delete();
        if (deleteOperation === 0) {
            res.status(404).send({error: "Film not found"}); return;
        }
        res.send(`Deleted ${deleteOperation} films`); // Einfache Antwort
    } catch (error: any) {
        console.error(`[DELETE /film/${filmId}] DB Error:`, error);
        if (error?.errno === 1451) {
            res.status(400).send({ error: "Cannot delete film, it is referenced elsewhere." }); return;
        }
        res.status(500).send({ error: "Failed to delete film", details: error?.message });
    }
});

// --- Film-Category Linking ---

/**
 * @swagger
 * /film/{film_id}/category/{category_id}:
 *  post:
 *    summary: Link a category to a film
 *    tags: [Films]
 *    parameters:
 *    - { name: film_id, in: path, required: true, schema: { type: integer } }
 *    - { name: category_id, in: path, required: true, schema: { type: integer } }
 *    responses:
 *      201: { description: Link processed (created or existed) }
 *      400: { description: "Invalid IDs or Failed to link (e.g., FK violation, duplicate)" }
 */
filmRouter.post('/:film_id/category/:category_id', async (req: Request, res: Response) => {
    const filmId = Number(req.params.film_id);
    const categoryId = Number(req.params.category_id);
    if (isNaN(filmId) || isNaN(categoryId)) { res.status(400).send({ error: "Invalid Film or Category ID" }); return; }

    try {
        await addFilmCategoryLink(filmId, categoryId);
        res.status(201).send("Film-Category link processed."); // Einfache Antwort
    } catch (error: any) {
        console.error(`[POST /film/.../category] Error linking:`, error);
        if (error?.code === 'ER_DUP_ENTRY') {
            res.status(400).send({error: "This film-category link already exists."}); return;
        }
        if (error?.errno === 1452) {
            res.status(400).send({error: "Failed to link: Film or Category ID not found."}); return;
        }
        res.status(400).send({error: "Failed to add film-category link.", details: error?.message});
    }
});

/**
 * @swagger
 * /film/{film_id}/category/{category_id}:
 *  delete:
 *    summary: Unlink a category from a film
 *    tags: [Films]
 *    parameters:
 *    - { name: film_id, in: path, required: true, schema: { type: integer } }
 *    - { name: category_id, in: path, required: true, schema: { type: integer } }
 *    responses:
 *      200: { description: Link removed successfully (returns count), content: { text/plain: { schema: { type: string, example: "Removed 1 links" } } } }
 *      400: { description: "Invalid IDs" }
 *      404: { description: "Link not found" }
 *      500: { description: "Server Error" }
 */
filmRouter.delete('/:film_id/category/:category_id', async (req: Request, res: Response) => {
    const filmId = Number(req.params.film_id);
    const categoryId = Number(req.params.category_id);
    if (isNaN(filmId) || isNaN(categoryId)) { res.status(400).send({ error: "Invalid Film or Category ID" }); return; }

    try {
        const deleteCount = await removeFilmCategoryLink(filmId, categoryId);
        if (deleteCount === 0) {
            res.status(404).send({error: "Film-Category link not found"}); return;
        }
        res.send(`Removed ${deleteCount} links`); // Einfache Antwort
    } catch (error: any) {
        console.error(`[DELETE /film/.../category] Error unlinking:`, error);
        res.status(500).send({error: "Failed to remove film-category link.", details: error?.message});
    }
});

/**
 * @swagger
 * /film/{film_id}/categories:
 *   get:
 *     summary: Get all categories for a specific film
 *     tags: [Films]
 *     parameters:
 *     - { name: film_id, in: path, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: A list of categories for the film }
 *       400: { description: Invalid Film ID }
 *       404: { description: Film not found }
 *       500: { description: Server error }
 */
filmRouter.get('/:film_id/categories', async (req: Request, res: Response) => {
    const filmId = Number(req.params.film_id);
    if (isNaN(filmId)) { res.status(400).send({ error: "Invalid Film ID" }); return; }
    try {
        const filmExists = await getFilmById(filmId); // Prüfung bleibt sinnvoll
        if (!filmExists) { res.status(404).send({error: "Film not found"}); return; }
        const categories = await getCategoriesForFilm(filmId);
        res.send(categories);
    } catch(error: any) {
        console.error(`[GET /film/.../categories] Error:`, error);
        res.status(500).send({error: "Failed to get categories for film.", details: error?.message});
    }
});

export default filmRouter;