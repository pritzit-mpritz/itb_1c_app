import { Request, Response, Router } from 'express';
import {
    getCatById,
    getAllCat,
    createCat,
    updateCat,
    deleteCat,
    linkFilmToCatSafe,
    unlinkFilmFromCat
} from '../services/categoryService';

const categoryRouter: Router = Router();

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Retrieve a list of categories
 *     tags: [Categories]
 *     parameters:
 *     - in: query
 *       name: name
 *       required: false
 *       description: Filter categories by name
 *       schema:
 *         type: string
 *         example: Comedy
 *     responses:
 *       200:
 *         description: Succeeded in accessing and retrieving categories
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
 *                   last_update:
 *                     type: string
 */
categoryRouter.get('/', async (req: Request, res: Response) => {
    const categories = await getAllCat(req.query.name as string);

    res.status(200).send({
        message: 'List of categories successfully retrieved',
        data: categories
    });
});

/**
 * @swagger
 * /category/{id}:
 *   get:
 *     summary: Get a single category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the category to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Succeeded in accessing and retrieving category by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category_id:
 *                   type: number
 *                   example: 5
 *                 name:
 *                   type: string
 *                   example: Horror
 *                 last_update:
 *                   type: string
 *                   example: 2025-01-01T12:33:15.000Z
 *       404:
 *         description: Category not found
 */
categoryRouter.get('/:id', async (req: Request, res: Response) => {
    const category = await getCatById(Number(req.params.id));

    if (!category) {
        res.status(404).send({ error: 'Category not found' });
        return;
    }

    res.status(200).send({
        message: 'Category successfully retrieved by ID',
        data: category
    });
});

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
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
 *                 description: The name of the category
 *                 example: Animation
 *     responses:
 *       200:
 *         description: Category created successfully 👍
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category_id:
 *                   type: integer
 *                   example: 7
 *                 name:
 *                   type: string
 *                   example: Animation
 *                 last_update:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-04-08T14:30:00Z
 *       400:
 *         description: Invalid request body or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing required field: name"
 *       404:
 *         description: Related resource not found (if applicable)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Parent category not found"
 *       500:
 *         description: Internal server error
 */
const handleCreateCat = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;

        if (!name || typeof name !== 'string' || !name.trim()) {
            res.status(400).send({ error: 'Missing or invalid field: name' });
            return;
        }

        const newCat = await createCat(name.trim());
        res.status(200).send(newCat);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
};

/**
 * @swagger
 * /category/{id}:
 *   put:
 *     summary: Update a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the category to update
 *         schema:
 *           type: integer
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
 *                 example: Adventure
 *     responses:
 *       200:
 *         description: Category updated successfully 👍
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category_id:
 *                   type: integer
 *                   example: 5
 *                 name:
 *                   type: string
 *                   example: Adventure
 *                 last_update:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
const handleUpdateCat = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;
        const id = Number(req.params.id);

        if (!name || typeof name !== 'string' || !name.trim()) {
            res.status(400).send({ error: 'Missing or invalid field: name' });
            return;
        }

        const updatedCat = await updateCat(id, name.trim());

        if (!updatedCat) {
            res.status(404).send({ error: 'Category not found' });
            return;
        }

        res.status(200).send(updatedCat);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
};

/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the category to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category deleted successfully 👍
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category deleted successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
const handleDeleteCat = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);
        const deleted = await deleteCat(id);

        if (!deleted) {
            res.status(404).send({ error: 'Category not found' });
            return;
        }

        res.status(200).send({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
};

/**
 * @swagger
 * /category/{categoryId}/film/{filmId}:
 *   post:
 *     summary: Link a film to a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the category
 *       - in: path
 *         name: filmId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the film
 *     responses:
 *       200:
 *         description: Film linked to category successfully
 *       500:
 *         description: Internal server error
 */
const handleLinkFilmToCat = async (req: Request, res: Response): Promise<void> => {
    try {
        const categoryId = Number(req.params.categoryId);
        const filmId = Number(req.params.filmId);

        const created = await linkFilmToCatSafe(filmId, categoryId);

        if (!created) {
            res.status(409).send({ message: 'Link already exists' });
            return;
        }

        res.status(200).send({ message: 'Film linked to category successfully' });
    } catch (error) {
        console.error('Error linking film to category:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
};

/**
 * @swagger
 * /category/{categoryId}/film/{filmId}:
 *   delete:
 *     summary: Unlink a film from a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the category
 *       - in: path
 *         name: filmId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the film
 *     responses:
 *       200:
 *         description: Film unlinked from category successfully
 *       500:
 *         description: Internal server error
 */
const handleUnlinkFilmToCat = async (req: Request, res: Response): Promise<void> => {
    try {
        const categoryId = Number(req.params.categoryId);
        const filmId = Number(req.params.filmId);

        await unlinkFilmFromCat(filmId, categoryId);
        res.status(200).send({ message: 'Film unlinked from category successfully' });
    } catch (error) {
        console.error('Error unlinking film from category:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
};

categoryRouter.post('/', handleCreateCat);
categoryRouter.put('/:id', handleUpdateCat);
categoryRouter.delete('/:id', handleDeleteCat);
categoryRouter.post('/:categoryId/film/:filmId', handleLinkFilmToCat);
categoryRouter.delete('/:categoryId/film/:filmId', handleUnlinkFilmToCat);

export default categoryRouter;
