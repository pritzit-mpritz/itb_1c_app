// src/routes/category.ts
import { Router, Request, Response } from "express";
import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../services/categoryService";
import {
    addLink,
    removeLink,
    getFilmsForCategory
} from "../services/filmCategoryService";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Categories
 *     description: Category management and relationships
 *
 * # Keine Schema-Definitionen mehr hier
 *
 * /category:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of category objects
 *       500:
 *         description: Internal Server Error
 */
router.get("/", async (req: Request, res: Response) => {
    try {
        const categories = await getAllCategories();
        res.json(categories);
    } catch (error: any) {
        console.error("Error in GET /category:", error);
        res.status(500).json({ message: 'Internal Server Error', error: error?.message });
    }
});

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Create category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: { name: { type: string } }
 *             required: [name]
 *             example: { name: "New Category Name" }
 *     responses:
 *       201:
 *         description: Category created (returns created category object)
 *       400:
 *         description: Bad Request (e.g., duplicate name)
 *       500:
 *         description: Internal Server Error
 */
router.post("/", async (req: Request, res: Response) => {
    try {
        const categoryData = req.body;
        if (!categoryData?.name) {
            res.status(400).json({ message: "Missing required field: name" });
            return;
        }
        const newCategory = await createCategory(categoryData);
        if (!newCategory) {
            res.status(500).json({ message: "Failed to create category record." });
            return;
        }
        res.status(201).json(newCategory);
    } catch (error: any) {
        console.error("Error in POST /category:", error);
        if (error?.code === 'ER_DUP_ENTRY' || error?.message?.includes('Duplicate entry')) {
            res.status(400).json({ message: `Category name '${req.body.name}' already exists.` });
            return;
        }
        res.status(500).json({ message: 'Failed to create category', error: error?.message });
    }
});

/**
 * @swagger
 * /category/{categoryId}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - { name: categoryId, in: path, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Category details }
 *       400: { description: Invalid ID }
 *       404: { description: Not Found }
 *       500: { description: Internal Server Error }
 *   put:
 *     summary: Update category by ID
 *     tags: [Categories]
 *     parameters:
 *       - { name: categoryId, in: path, required: true, schema: { type: integer } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: { name: { type: string } }
 *             required: [name]
 *             example: { name: "Updated Name" }
 *     responses:
 *       200: { description: Category updated (returns updated category object) }
 *       400: { description: "Invalid ID / Duplicate Name" }
 *       404: { description: Not Found }
 *       500: { description: Internal Server Error }
 *   delete:
 *     summary: Delete category by ID
 *     tags: [Categories]
 *     parameters:
 *       - { name: categoryId, in: path, required: true, schema: { type: integer } }
 *     responses:
 *       204: { description: Category deleted (No Content) }
 *       400: { description: "Invalid ID / Cannot delete (FK constraint)" }
 *       404: { description: Not Found }
 *       500: { description: Internal Server Error }
 */
router.route("/:categoryId")
    .get(async (req: Request, res: Response) => {
        try {
            const categoryId = parseInt(req.params.categoryId, 10);
            if (isNaN(categoryId)) { res.status(400).json({ message: "Invalid Category ID" }); return; }
            const category = await getCategoryById(categoryId);
            if (!category) { res.status(404).json({ message: "Category not found" }); return; }
            res.json(category);
        } catch (error: any) {
            console.error(`Error in GET /category/${req.params.categoryId}:`, error);
            res.status(500).json({ message: 'Internal Server Error', error: error?.message });
        }
    })
    .put(async (req: Request, res: Response) => {
        try {
            const categoryId = parseInt(req.params.categoryId, 10);
            if (isNaN(categoryId)) { res.status(400).json({ message: "Invalid Category ID" }); return; }
            const categoryData = req.body;
            if (!categoryData?.name) { res.status(400).json({ message: "Missing required field: name" }); return; }
            const updatedCategory = await updateCategory(categoryId, categoryData);
            if (!updatedCategory) { res.status(404).json({ message: "Category not found" }); return; }
            res.json(updatedCategory);
        } catch (error: any) {
            console.error(`Error in PUT /category/${req.params.categoryId}:`, error);
            if (error?.code === 'ER_DUP_ENTRY' || error?.message?.includes('Duplicate entry')) {
                res.status(400).json({ message: `Category name '${req.body.name}' already exists.` });
                return;
            }
            res.status(500).json({ message: 'Failed to update category', error: error?.message });
        }
    })
    .delete(async (req: Request, res: Response) => {
        try {
            const categoryId = parseInt(req.params.categoryId, 10);
            if (isNaN(categoryId)) { res.status(400).json({ message: "Invalid Category ID" }); return; }
            const deleteCount = await deleteCategory(categoryId);
            if (deleteCount === 0) { res.status(404).json({ message: "Category not found" }); return; }
            res.status(204).send();
        } catch (error: any) {
            console.error(`Error in DELETE /category/${req.params.categoryId}:`, error);
            if (error?.errno === 1451 || error?.code?.includes('FOREIGN KEY')) {
                res.status(400).json({ message: "Cannot delete category, it is still linked to films." });
                return;
            }
            res.status(500).json({ message: 'Failed to delete category', error: error?.message });
        }
    });

/**
 * @swagger
 * /category/{categoryId}/films:
 *   get:
 *     summary: Get films for a category
 *     tags: [Categories]
 *     parameters:
 *       - { name: categoryId, in: path, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: List of film objects }
 *       400: { description: Invalid ID }
 *       404: { description: Category Not Found }
 *       500: { description: Internal Server Error }
 */
router.get("/:categoryId/films", async (req: Request, res: Response) => {
    try {
        const categoryId = parseInt(req.params.categoryId, 10);
        if (isNaN(categoryId)) { res.status(400).json({ message: "Invalid Category ID" }); return; }
        const categoryExists = await getCategoryById(categoryId);
        if (!categoryExists) { res.status(404).json({ message: "Category not found" }); return; }
        const films = await getFilmsForCategory(categoryId);
        res.json(films);
    } catch (error: any) {
        console.error(`Error in GET /category/${req.params.categoryId}/films:`, error);
        res.status(500).json({ message: 'Internal Server Error', error: error?.message });
    }
});

/**
 * @swagger
 * /category/{categoryId}/film/{filmId}:
 *   post:
 *     summary: Link film to category (symmetric)
 *     tags: [Categories]
 *     parameters:
 *       - { name: categoryId, in: path, required: true, schema: { type: integer } }
 *       - { name: filmId, in: path, required: true, schema: { type: integer } }
 *     responses:
 *       201: { description: Link created or existed }
 *       400: { description: Invalid IDs }
 *       404: { description: "Film or Category not found for linking" }
 *       500: { description: Internal Server Error }
 *   delete:
 *     summary: Unlink film from category (symmetric)
 *     tags: [Categories]
 *     parameters:
 *       - { name: categoryId, in: path, required: true, schema: { type: integer } }
 *       - { name: filmId, in: path, required: true, schema: { type: integer } }
 *     responses:
 *       204: { description: Link removed (No Content) }
 *       400: { description: Invalid IDs }
 *       404: { description: "Link not found" }
 *       500: { description: Internal Server Error }
 */
router.route("/:categoryId/film/:filmId")
    .post(async (req: Request, res: Response) => {
        try {
            const categoryId = parseInt(req.params.categoryId, 10);
            const filmId = parseInt(req.params.filmId, 10);
            if (isNaN(filmId) || isNaN(categoryId)) { res.status(400).json({ message: "Invalid Film or Category ID" }); return; }
            const success = await addLink(filmId, categoryId); // Service erwartet (filmId, categoryId)
            if (!success) { res.status(404).json({ message: "Film or Category not found for linking" }); return; }
            res.status(201).json({ message: "Film linked to category successfully." });
        } catch (error: any) {
            console.error(`Error in POST /category/.../film:`, error);
            res.status(500).json({ message: 'Failed to link film to category', error: error?.message });
        }
    })
    .delete(async (req: Request, res: Response) => {
        try {
            const categoryId = parseInt(req.params.categoryId, 10);
            const filmId = parseInt(req.params.filmId, 10);
            if (isNaN(filmId) || isNaN(categoryId)) { res.status(400).json({ message: "Invalid Film or Category ID" }); return; }
            const deleteCount = await removeLink(filmId, categoryId); // Service erwartet (filmId, categoryId)
            if (deleteCount === 0) { res.status(404).json({ message: "Category-Film link not found" }); return; }
            res.status(204).send();
        } catch (error: any) {
            console.error(`Error in DELETE /category/.../film:`, error);
            res.status(500).json({ message: 'Failed to unlink film from category', error: error?.message });
        }
    });

export default router;