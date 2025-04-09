// src/routes/category.ts
import { Router, Request, Response } from "express";
import { db } from '../db'; // DB direkt nutzen
import { getAllCategories, getCategoryById } from "../services/categoryService";
import {
    addFilmCategoryLink,
    removeFilmCategoryLink,
    getFilmsForCategory
} from "../services/filmCategoryService";

const categoryRouter: Router = Router();

/**
 * @swagger
 * tags:
 *   - name: Categories
 *     description: Category management
 * /category:
 *   get:
 *     summary: Retrieve a list of categories
 *     tags: [Categories]
 *     responses:
 *       200: { description: A list of categories }
 *       500: { description: Server Error }
 */
categoryRouter.get('/', async (req: Request, res: Response) => {
    try {
        const categories = await getAllCategories();
        res.send(categories);
    } catch (error: any) {
        console.error("[GET /category] Error:", error);
        res.status(500).send({ error: "Failed to retrieve categories", details: error?.message });
    }
});

/**
 * @swagger
 * /category/{id}:
 *   get:
 *     summary: Retrieve a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - { name: id, in: path, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: A single category }
 *       400: { description: Invalid ID }
 *       404: { description: Category not found }
 *       500: { description: Server Error }
 */
categoryRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const categoryId = Number(req.params.id);
        if (isNaN(categoryId)) { res.status(400).send({ error: "Invalid category ID" }); return; }
        const category = await getCategoryById(categoryId);
        if (!category) { res.status(404).send({ error: "Category not found" }); return; }
        res.send(category);
    } catch (error: any) {
        console.error(`[GET /category/${req.params.id}] Error:`, error);
        res.status(500).send({ error: "Failed to retrieve category", details: error?.message });
    }
});

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { type: object, properties: { name: { type: string } }, required: [name], example: { name: "Animation" } } } }
 *     responses:
 *       201: { description: Category created successfully, content: { application/json: { schema: { properties: { id: { type: integer } } } } } }
 *       400: { description: Bad request (e.g. missing name, duplicate name) }
 */
categoryRouter.post('/', async (req: Request, res: Response) => {
    const name = req.body?.name?.trim();
    if (!name) { res.status(400).send({ error: "Missing or empty required field: name" }); return; }
    const connection = db();
    try {
        const insertOperation = await connection.insert({ name: name }).into("category");
        res.status(201).send({ id: insertOperation[0] });
    } catch (error: any) {
        console.error("[POST /category] DB Error:", error);
        if (error?.code === 'ER_DUP_ENTRY') {
            res.status(400).send({ error: `Category name '${name}' already exists.` }); return;
        }
        res.status(400).send({ error: "Failed to create category", details: error?.message });
    }
});

/**
 * @swagger
 * /category/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     parameters:
 *       - { name: id, in: path, required: true, schema: { type: integer } }
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { type: object, properties: { name: { type: string } }, required: [name], example: { name: "Sci-Fi" } } } }
 *     responses:
 *       200: { description: Category updated successfully (returns count), content: { text/plain: { schema: { type: string, example: "Updated 1 categories" } } } }
 *       400: { description: Invalid ID, Missing Name, or Duplicate Name }
 *       404: { description: Category not found }
 */
categoryRouter.put('/:id', async (req: Request, res: Response) => {
    const categoryId = Number(req.params.id);
    const name = req.body?.name?.trim();
    if (isNaN(categoryId)) { res.status(400).send({ error: "Invalid category ID" }); return; }
    if (!name) { res.status(400).send({ error: "Missing or empty required field: name" }); return; }
    const connection = db();
    try {
        const updateOperation = await connection("category")
            .update({ name: name })
            .where("category_id", categoryId);
        if (updateOperation === 0) {
            res.status(404).send({error: "Category not found or no changes applied"}); return;
        }
        res.send(`Updated ${updateOperation} categories`);
    } catch(error: any) {
        console.error(`[PUT /category/${categoryId}] DB Error:`, error);
        if (error?.code === 'ER_DUP_ENTRY') {
            res.status(400).send({ error: `Category name '${name}' already exists.` }); return;
        }
        res.status(400).send({ error: "Failed to update category", details: error?.message });
    }
});

/**
 * @swagger
 * /category/{id}:
 *  delete:
 *   summary: Delete a category
 *   tags: [Categories]
 *   parameters:
 *    - { name: id, in: path, required: true, schema: { type: integer } }
 *   responses:
 *     200: { description: Category deleted successfully (returns count), content: { text/plain: { schema: { type: string, example: "Deleted 1 categories" } } } }
 *     400: { description: "Cannot delete (FK constraint)" }
 *     404: { description: Category not found }
 *     500: { description: Server Error }
 */
categoryRouter.delete('/:id', async (req: Request, res: Response) => {
    const categoryId = Number(req.params.id);
    if (isNaN(categoryId)) { res.status(400).send({ error: "Invalid category ID" }); return; }
    const connection = db();
    try {
        const deleteOperation = await connection("category").where("category_id", categoryId).delete();
        if (deleteOperation === 0) {
            res.status(404).send({error: "Category not found"}); return;
        }
        res.send(`Deleted ${deleteOperation} categories`);
    } catch (error: any) {
        console.error(`[DELETE /category/${categoryId}] DB Error:`, error);
        if (error?.errno === 1451) {
            res.status(400).send({ error: "Cannot delete category, it is still linked to films." }); return;
        }
        res.status(500).send({ error: "Failed to delete category", details: error?.message });
    }
});

// --- Category-Film Linking ---

/**
 * @swagger
 * /category/{category_id}/film/{film_id}:
 *  post:
 *    summary: Link a film to a category (symmetric)
 *    tags: [Categories]
 *    parameters:
 *    - { name: category_id, in: path, required: true, schema: { type: integer } }
 *    - { name: film_id, in: path, required: true, schema: { type: integer } }
 *    responses:
 *      201: { description: Link processed }
 *      400: { description: "Invalid IDs or Failed to link (e.g., FK violation, duplicate)" }
 */
categoryRouter.post('/:category_id/film/:film_id', async (req: Request, res: Response) => {
    const categoryId = Number(req.params.category_id);
    const filmId = Number(req.params.film_id);
    if (isNaN(filmId) || isNaN(categoryId)) { res.status(400).send({ error: "Invalid Film or Category ID" }); return; }

    try {
        await addFilmCategoryLink(filmId, categoryId);
        res.status(201).send("Film-Category link processed.");
    } catch (error: any) {
        console.error(`[POST /category/.../film] Error linking:`, error);
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
 * /category/{category_id}/film/{film_id}:
 *  delete:
 *    summary: Unlink a film from a category (symmetric)
 *    tags: [Categories]
 *    parameters:
 *    - { name: category_id, in: path, required: true, schema: { type: integer } }
 *    - { name: film_id, in: path, required: true, schema: { type: integer } }
 *    responses:
 *      200: { description: Link removed successfully (returns count), content: { text/plain: { schema: { type: string, example: "Removed 1 links" } } } }
 *      400: { description: "Invalid IDs" }
 *      404: { description: "Link not found" }
 *      500: { description: "Server Error" }
 */
categoryRouter.delete('/:category_id/film/:film_id', async (req: Request, res: Response) => {
    const categoryId = Number(req.params.category_id);
    const filmId = Number(req.params.film_id);
    if (isNaN(filmId) || isNaN(categoryId)) { res.status(400).send({ error: "Invalid Film or Category ID" }); return; }

    try {
        const deleteCount = await removeFilmCategoryLink(filmId, categoryId);
        if (deleteCount === 0) {
            res.status(404).send({error: "Film-Category link not found"}); return;
        }
        res.send(`Removed ${deleteCount} links`);
    } catch (error: any) {
        console.error(`[DELETE /category/.../film] Error unlinking:`, error);
        res.status(500).send({error: "Failed to remove film-category link.", details: error?.message});
    }
});


/**
 * @swagger
 * /category/{category_id}/films:
 *   get:
 *     summary: Get all films for a specific category
 *     tags: [Categories]
 *     parameters:
 *     - { name: category_id, in: path, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: A list of films for the category }
 *       400: { description: Invalid Category ID }
 *       404: { description: Category not found }
 *       500: { description: Server error }
 */
categoryRouter.get('/:category_id/films', async (req: Request, res: Response) => {
    const categoryId = Number(req.params.category_id);
    if (isNaN(categoryId)) { res.status(400).send({ error: "Invalid Category ID" }); return; }
    try {
        const categoryExists = await getCategoryById(categoryId);
        if (!categoryExists) { res.status(404).send({error: "Category not found"}); return; }
        const films = await getFilmsForCategory(categoryId);
        res.send(films);
    } catch(error: any) {
        console.error(`[GET /category/.../films] Error:`, error);
        res.status(500).send({error: "Failed to get films for category.", details: error?.message});
    }
});

export default categoryRouter;