import {Request, Response, Router} from 'express';
import {db} from '../db';
import {addActorToFilm, getActorById, getAllActors} from "../services/actorService";

const actorRouter: Router = Router();

/**
 * @swagger
 * /actor:
 *   get:
 *     summary: Retrieve a list of actors
 *     tags: [Actors]
 *     parameters:
 *     - in: query
 *       name: first_name
 *       required: false
 *       description: Filter actors by first name
 *       schema:
 *         type: string
 *         example: Tom
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
    res.send(await getAllActors(req.query.first_name as string));
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
    const actor = await getActorById(Number(req.params.id))

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

/**
 * @swagger
 * /actor/{actor_id}/film/{film_id}:
 *  post:
 *    summary: Add an actor to a film - the film should already exist
 *    tags: [Actors]
 *    parameters:
 *    - in: path
 *      name: actor_id
 *      required: true
 *      description: ID of the actor
 *      schema:
 *        type: integer
 *        example: 1
 *    - in: path
 *      name: film_id
 *      required: true
 *      description: ID of the film
 *      schema:
 *        type: integer
 *        example: 1
 */actorRouter.post('/:actor_id/film/:film_id', async (req: Request, res: Response) => {
    const actorId = req.params.actor_id;
    const filmId = req.params.film_id;

    try {
        await addActorToFilm(Number(actorId), Number(filmId));
        console.log(`Actor ${actorId} added to film ${filmId}`);

        res.status(201).send("Actor-Film created");
    } catch (error) {
        console.error("Error adding actor to film: ", error);
        res.status(400).send({error: "Failed to add actor to film. " + (error)});
    }
})

export default actorRouter;
