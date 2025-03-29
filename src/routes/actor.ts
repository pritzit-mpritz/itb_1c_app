import {Request, Response, Router} from 'express';
import {db} from '../db';

const actorRouter: Router = Router();

/**
 * @swagger
 * /actor:
 *   get:
 *     summary: Retrieve a list of actors
 *     tags: [Actors]
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
actorRouter.get('/', async (req: Request, res: Response) => {
    const connection = db();
    const actors = await connection.select("*").from("actor");

    console.log("Selected actors: ", actors);

    res.send(actors);
});


/**
 * @swagger
 * /actor/{id}:
 *   get:
 *     summary: Retrieve an actor
 *     tags: [Actors]
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
actorRouter.get('/:id', async (req: Request, res: Response) => {
    const connection = db();
    const actor = await connection.select("*")
        .from("actor")
        .where("actor_id", req.params.id)
        .first();

    console.log("Selected actor: ", actor);

    if (!actor) {
        res.status(404).send({error: "Actor not found"});
        return
    }

    res.send(actor);
});

/**
 * @swagger
 * /actor:
 *   post:
 *     summary: Create a new actor
 *     tags: [Actors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: Tom
 *               last_name:
 *                 type: string
 *                 example: Hanks
 *     responses:
 *       200:
 *         description: Actor created successfully
 */
actorRouter.post('/', async (req: Request, res: Response) => {
    console.log("Creating actor: ", req.body);

    const connection = db();
    const insertOperation = await connection.insert(req.body).into("actor");

    res.send({id: insertOperation[0]});
});

/**
 * @swagger
 * /actor/{id}:
 *   put:
 *     summary: Update an actor
 *     tags: [Actors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the actor
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: Tom
 *               last_name:
 *                 type: string
 *                 example: Hanks
 *     responses:
 *       200:
 *         description: Actor updated successfully
 */
actorRouter.put('/:id', async (req: Request, res: Response) => {
    const connection = db();

    const actor = await connection.select("*")
        .from("actor")
        .where("actor_id", req.params.id).first();

    if (!actor) {
        res.status(404).send({error: "Actor not found"});
        return
    }

    actor.first_name = req.body.first_name;
    actor.last_name = req.body.last_name;

    const updateOperation = await connection("actor").update(actor)
        .where("actor_id", req.params.id);
    res.send(`Updated ${updateOperation} actors`);
});

/**
 * @swagger
 * /actor/{id}:
 *  delete:
 *   summary: Delete an actor
 *   tags: [Actors]
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: ID of the actor
 *      schema:
 *      type: integer
 *   responses:
 *     200:
 *       description: Actor deleted successfully
 *
 */
actorRouter.delete('/:id', async (req: Request, res: Response) => {
    const connection = db();
    const deleteOperation = await connection("actor")
        .where("actor_id", req.params.id).delete();

    if (!deleteOperation) {
        res.status(404).send({error: "Actor not found"});
        return
    }

    res.send(`Deleted ${deleteOperation} actors`);
});

export default actorRouter;