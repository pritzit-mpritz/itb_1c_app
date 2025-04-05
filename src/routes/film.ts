import { Request, Response, Router } from 'express';
import { db } from '../db';

const filmRouter: Router = Router();

/**
 * @swagger
 * /film:
 *   get:
 *     summary: Retrieve a list of all films
 *     tags: [film]
 *     responses:
 *       200:
 *         description: A list of films
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   film_id:
 *                     type: number
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 */

/**
 * Retrieves all films from the database.
 */
filmRouter.get('/', async (req: Request, res: Response) => {
    const connection = db();
    try {
        const films = await connection.select('*').from('film');
        res.send(films);
    } catch (error) {
        console.error('Error retrieving films:', error);
        res.status(404).send({ error: 'Failed to load films' });
    }
});

/**
 * @swagger
 * /film/{id}:
 *   get:
 *     summary: Retrieve a single film by ID
 *     tags: [film]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A film object
 */

/**
 * Retrieves a film by its ID.
 */
filmRouter.get('/:id', async (req: Request, res: Response) => {
    const connection = db();
    try {
        const film = await connection('film').where('film_id', req.params.id).first();

        if (!film) {
            res.status(404).send({ error: 'Film not found' });
            return;
        }

        res.send(film);
    } catch (error) {
        console.error('Error retrieving film by ID:', error);
        res.status(404).send({ error: 'Failed to load film' });
    }
});

/**
 * @swagger
 * /film:
 *   post:
 *     summary: Create a new film
 *     tags: [film]
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
 *     responses:
 *       200:
 *         description: Film created
 */

/**
 * Creates a new film with title and description.
 */
filmRouter.post('/', async (req: Request, res: Response) => {
    const connection = db();
    try {
        const insertResult = await connection('film').insert(req.body);
        res.send({ success: true, id: insertResult[0] });
    } catch (error) {
        console.error('Error creating film:', error);
        res.status(404).send({ error: 'Failed to create film' });
    }
});

/**
 * @swagger
 * /film/{id}:
 *   put:
 *     summary: Update an existing film
 *     tags: [film]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the film
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
 *                 example: Inception
 *               description:
 *                 type: string
 *                 example: A mind-bending thriller by Christoph Nolan
 *     responses:
 *       200:
 *         description: Film updated
 */

/**
 * Updates an existing film with new data.
 */
filmRouter.put('/:id', async (req: Request, res: Response) => {
    const connection = db();
    try {
        //get existing film
        const film= await connection('film')
            .select('*')
            .where('film_id', req.params.id)
            .first();
        if (!film) {
            res.status(404).send({ error: 'Film not found' });
            return;
        }

        //Update values from request body
        film.title = req.body.title;
        film.description = req.body.description;

        const updateResult = await connection('film')
            .update(film)
            .where('film_id', req.params.id);

        res.send({ message: `Updated ${updateResult} film(s)` });
    } catch (error) {
        console.error('Error updating film:', error);
        res.status(404).send({ error: 'Failed to update film' });
    }
});
