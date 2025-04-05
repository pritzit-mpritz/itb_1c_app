// src/routes/film.ts
import { Router, Request, Response } from "express";
import {
    getAllFilms,
    getFilmById,
    createFilm,
    updateFilm,
    deleteFilm,
} from "../services/filmService";
import {
    addLink,
    removeLink,
    getCategoriesForFilm
} from "../services/filmCategoryService";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Films
 *     description: Film management and relationships
 *
 * /film:
 *   get:
 *     summary: Get all films
 *     tags: [Films]
 *     responses:
 *       200:
 *         description: List of film objects
 *       500:
 *         description: Internal Server Error
 */
router.get("/", async (req: Request, res: Response) => {
    try {
        const films = await getAllFilms();
        res.json(films);
    } catch (error: any) {
        console.error("Error in GET /film:", error);
        res.status(500).json({ message: 'Internal Server Error', error: error?.message });
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
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              example:
 *                 title: "New Movie Title"
 *                 description: "Optional description"
 *                 release_year: 2024
 *     responses:
 *       201:
 *         description: Film created (returns created film object)
 *       400:
 *         description: Bad Request (e.g., missing title)
 *       500:
 *         description: Internal Server Error
 */
router.post("/", async (req: Request, res: Response) => {
    try {
        const filmData = req.body;
        if (!filmData?.title) {
            res.status(400).json({ message: "Missing required field: title" });
            return;
        }
        const newFilm = await createFilm(filmData);
        if (!newFilm) {
            res.status(500).json({ message: "Failed to create film record." });
            return;
        }
        res.status(201).json(newFilm);
    } catch (error: any) {
        console.error("Error in POST /film:", error);
        res.status(500).json({ message: 'Failed to create film', error: error?.message });
    }
});

/**
 * @swagger
 * /film/{filmId}:
 *   get:
 *     summary: Get film by ID
 *     tags: [Films]
 *     parameters:
 *       - { name: filmId, in: path, required: true, schema: { type: integer }, description: ID of the film }
 *     responses:
 *       200: { description: Film details }
 *       400: { description: Invalid ID }
 *       404: { description: Not Found }
 *       500: { description: Internal Server Error }
 *   put:
 *     summary: Update film by ID
 *     tags: [Films]
 *     parameters:
 *       - { name: filmId, in: path, required: true, schema: { type: integer } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              example: { title: "Updated Title" }
 *     responses:
 *       200: { description: Film updated (returns updated film object) }
 *       400: { description: Invalid ID }
 *       404: { description: Not Found }
 *       500: { description: Internal Server Error }
 *   delete:
 *     summary: Delete film by ID
 *     tags: [Films]
 *     parameters:
 *       - { name: filmId, in: path, required: true, schema: { type: integer } }
 *     responses:
 *       204: { description: Film deleted (No Content) }
 *       400: { description: Invalid ID }
 *       404: { description: Not Found }
 *       500: { description: Internal Server Error }
 */
router.route("/:filmId")
    .get(async (req: Request, res: Response) => {
        try {
            const filmId = parseInt(req.params.filmId, 10);
            if (isNaN(filmId)) { res.status(400).json({ message: "Invalid Film ID" }); return; }
            const film = await getFilmById(filmId);
            if (!film) { res.status(404).json({ message: "Film not found" }); return; }
            res.json(film);
        } catch (error: any) {
            console.error(`Error in GET /film/${req.params.filmId}:`, error);
            res.status(500).json({ message: 'Internal Server Error', error: error?.message });
        }
    })
    .put(async (req: Request, res: Response) => {
        try {
            const filmId = parseInt(req.params.filmId, 10);
            if (isNaN(filmId)) { res.status(400).json({ message: "Invalid Film ID" }); return; }
            const filmData = req.body;
            const updatedFilm = await updateFilm(filmId, filmData);
            if (!updatedFilm) { res.status(404).json({ message: "Film not found" }); return; }
            res.json(updatedFilm);
        } catch (error: any) {
            console.error(`Error in PUT /film/${req.params.filmId}:`, error);
            res.status(500).json({ message: 'Failed to update film', error: error?.message });
        }
    })
    .delete(async (req: Request, res: Response) => {
        try {
            const filmId = parseInt(req.params.filmId, 10);
            if (isNaN(filmId)) { res.status(400).json({ message: "Invalid Film ID" }); return; }
            const deleteCount = await deleteFilm(filmId);
            if (deleteCount === 0) { res.status(404).json({ message: "Film not found" }); return; }
            res.status(204).send();
        } catch (error: any) {
            console.error(`Error in DELETE /film/${req.params.filmId}:`, error);
            res.status(500).json({ message: 'Failed to delete film', error: error?.message });
        }
    });

/**
 * @swagger
 * /film/{filmId}/categories:
 *   get:
 *     summary: Get categories for a film
 *     tags: [Films]
 *     parameters:
 *       - { name: filmId, in: path, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: List of category objects }
 *       400: { description: Invalid ID }
 *       404: { description: Film Not Found }
 *       500: { description: Internal Server Error }
 */
router.get("/:filmId/categories", async (req: Request, res: Response) => {
    try {
        const filmId = parseInt(req.params.filmId, 10);
        if (isNaN(filmId)) { res.status(400).json({ message: "Invalid Film ID" }); return; }
        const filmExists = await getFilmById(filmId);
        if (!filmExists) { res.status(404).json({ message: "Film not found" }); return; }
        const categories = await getCategoriesForFilm(filmId);
        res.json(categories);
    } catch (error: any) {
        console.error(`Error in GET /film/${req.params.filmId}/categories:`, error);
        res.status(500).json({ message: 'Internal Server Error', error: error?.message });
    }
});


/**
 * @swagger
 * /film/{filmId}/category/{categoryId}:
 *   post:
 *     summary: Link category to film
 *     tags: [Films]
 *     parameters:
 *       - { name: filmId, in: path, required: true, schema: { type: integer } }
 *       - { name: categoryId, in: path, required: true, schema: { type: integer } }
 *     responses:
 *       201: { description: Link created or existed }
 *       400: { description: Invalid IDs }
 *       404: { description: "Film or Category not found for linking" }
 *       500: { description: Internal Server Error }
 *   delete:
 *     summary: Unlink category from film
 *     tags: [Films]
 *     parameters:
 *       - { name: filmId, in: path, required: true, schema: { type: integer } }
 *       - { name: categoryId, in: path, required: true, schema: { type: integer } }
 *     responses:
 *       204: { description: Link removed (No Content) }
 *       400: { description: Invalid IDs }
 *       404: { description: "Link not found" }
 *       500: { description: Internal Server Error }
 */
router.route("/:filmId/category/:categoryId")
    .post(async (req: Request, res: Response) => {
        try {
            const filmId = parseInt(req.params.filmId, 10);
            const categoryId = parseInt(req.params.categoryId, 10);
            if (isNaN(filmId) || isNaN(categoryId)) { res.status(400).json({ message: "Invalid Film or Category ID" }); return; }
            const success = await addLink(filmId, categoryId);
            if (!success) { res.status(404).json({ message: "Film or Category not found for linking" }); return; }
            res.status(201).json({ message: "Category linked to film successfully." });
        } catch (error: any) {
            console.error(`Error in POST /film/.../category:`, error);
            res.status(500).json({ message: 'Failed to link category to film', error: error?.message });
        }
    })
    .delete(async (req: Request, res: Response) => {
        try {
            const filmId = parseInt(req.params.filmId, 10);
            const categoryId = parseInt(req.params.categoryId, 10);
            if (isNaN(filmId) || isNaN(categoryId)) { res.status(400).json({ message: "Invalid Film or Category ID" }); return; }
            const deleteCount = await removeLink(filmId, categoryId);
            if (deleteCount === 0) { res.status(404).json({ message: "Film-Category link not found" }); return; }
            res.status(204).send();
        } catch (error: any) {
            console.error(`Error in DELETE /film/.../category:`, error);
            res.status(500).json({ message: 'Failed to unlink category from film', error: error?.message });
        }
    });

export default router;