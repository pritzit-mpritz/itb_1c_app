import { Request, Response, Router } from 'express';
import { db } from '../db';

const filmRouter: Router = Router();

/**
 * @swagger
 * /film:
 *   get:
 *     summary: Retrieve a list of film
 *     tags: [film]
 *     responses:
 *       200:
 *         description: A list of film
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
filmRouter.get('/', async (req: Request, res: Response) => {
    const connection = db();
    const films = await connection.select('*').from('film');
    res.send(films);
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
filmRouter.get('/:id', async (req: Request, res: Response) => {
    const connection = db();
    const film = await connection('film').where('film_id', req.params.id).first();

    if (!film) {
        res.status(404).send({ error: 'Film not found' });
        return;
    }

    res.send(film);
});

/**
 * @swagger
 * /film:
 *   post:
 *     summary: Create a new film *     tags: [Film]
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
filmRouter.post('/', async (req: Request, res: Response) => {
    const connection = db();
    const insertResult = await connection('film').insert(req.body);
    res.send({ success: true, id: insertResult[0] });
});

/**
 * @swagger
 * /film/{id}:
 *   put:
 *     summary: Update a film *     tags: [Film]
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
 *     responses:
 *       200:
 *         description: film updated
 */
filmRouter.put('/:id', async (req: Request, res: Response) => {
    const connection = db();
    const updateCount = await connection('film').where('film_id', req.params.id).update(req.body);

    if (updateCount === 0) {
        res.status(404).send({ error: 'Film not found' });
        return;
    }

    res.send({ success: true });
});

/**
 * @swagger
 * /film/{id}:
 *   delete:
 *     summary: Delete a film *     tags: [Film]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: film deleted
 */
filmRouter.delete('/:id', async (req: Request, res: Response) => {
    const connection = db();
    const deleted = await connection('film').where('film_id', req.params.id).delete();

    if (!deleted) {
        res.status(404).send({ error: 'Film not found' });
        return;
    }

    res.send({ success: true });
});


export default filmRouter;
