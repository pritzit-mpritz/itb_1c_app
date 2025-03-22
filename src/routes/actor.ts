import {Request, Response, Router} from 'express';

const actorRouter: Router = Router();

/**
 * @swagger
 * /actor:
 *   get:
 *     summary: Retrieve a list of actors
 *     responses:
 *       200:
 *         description: A list of actors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   actor_id:
 *                     type: number
 *                   first_name:
 *                     type: string
 *                   last_name:
 *                     type: string
 *                   last_update:
 *                     type: string
 */
actorRouter.get('/', (req: Request, res: Response) => {
    res.send('List of actors');
});


/**
 * @swagger
 * /actor/{id}:
 *   get:
 *     summary: Retrieve an actor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the actor
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: An actor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 actor_id:
 *                   type: number
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *                 last_update:
 *                   type: string
 */
actorRouter.get('/:id', (req: Request, res: Response) => {
    res.send(`Actor with id ${req.params.id}`);
});

actorRouter.post('/', (req: Request, res: Response) => {
    res.send('Create actor');
});

actorRouter.put('/:id', (req: Request, res: Response) => {
    res.send(`Update actor with id ${req.params.id}`);
});

actorRouter.delete('/:id', (req: Request, res: Response) => {
    res.send(`Delete actor with id ${req.params.id}`);
});

export default actorRouter;