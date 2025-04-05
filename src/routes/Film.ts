import { Router, Request, Response } from 'express';
import * as MovieService from '../services/FilmService';

const filmRouter: Router = Router();

/**
 * @swagger
 * /film:
 *   get:
 *     summary: Retrieve a list of all films
 *     tags: [Film]
 *     responses:
 *       200:
 *         description: A list of films
 */
filmRouter.get('/', async (req: Request, res: Response) => {
    const films = await MovieService.getAllMovies();
    res.send(films);
});

// @ts-ignore
// @ts-ignore
/**
 * @swagger
 * /film/{id}:
 *   get:
 *     summary: Retrieve a film by ID
 *     tags: [Film]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single film
 */
filmRouter.get('/:id', async (req: Request, res: Response) => {
        const film = await MovieService.getMovieById(req.params.id);
        if (!film) {
            res.status(404).json({ error: 'Film not found' });
            return
        }
        res.send(film);
});

/**
 * @swagger
 * /film:
 *   post:
 *     summary: Create a new film
 *     tags: [Film]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Inception
 *               description:
 *                 type: string
 *               release_year:
 *               language_id:
 *                 type: integer
 *                 example: 1
 *                 type: integer
 *     responses:
 *       201:
 *         description: Film created successfully
 */
filmRouter.post('/', async (req: Request, res: Response) => {
    if (!req.body.title) {
        res.status(400).json({ error: 'Title is required' });
        return;
    }
    const newFilm = await MovieService.createMovie(req.body);
    res.status(201).json(newFilm);
});

/**
 * @swagger
 * /film/{id}:
 *   put:
 *     summary: Update a film
 *     tags: [Film]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
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
 *               description:
 *                 type: string
 *               release_year:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Film updated
 */
filmRouter.put('/:id', async (req: Request, res: Response) => {
    const film = await MovieService.updateMovie(req.params.id, req.body);
    if (!film) {
        res.status(404).json({ error: 'Film not found' });
        return
    }
    res.json(film);
});

/**
 * @swagger
 * /film/{id}:
 *   delete:
 *     summary: Delete a film
 *     tags: [Film]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Film deleted
 */
filmRouter.delete('/:id', async (req: Request, res: Response) => {
    const deleted = await MovieService.deleteMovie(req.params.id);
    if (!deleted){
        res.status(404).json({ error: 'Film not found' });
        return

    }
    res.json({ message: 'Film deleted' });
});

/**
 * @swagger
 * /film/{filmId}/category/{categoryId}:
 *   post:
 *     summary: Add category to film
 *     tags: [Film]
 *     parameters:
 *       - in: path
 *         name: filmId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category added to film
 */
filmRouter.post('/:filmId/category/:categoryId', async (req: Request, res: Response) => {
    await MovieService.addCategoryToMovie(req.params.filmId, req.params.categoryId);
    res.json({ message: 'Category added to film' });
});

/**
 * @swagger
 * /film/{filmId}/category/{categoryId}:
 *   delete:
 *     summary: Remove category from film
 *     tags: [Film]
 *     parameters:
 *       - in: path
 *         name: filmId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category removed from film
 */
filmRouter.delete('/:filmId/category/:categoryId', async (req: Request, res: Response) => {
    await MovieService.removeCategoryFromMovie(req.params.filmId, req.params.categoryId);
    res.json({ message: 'Category removed from film' });
});

export default filmRouter;