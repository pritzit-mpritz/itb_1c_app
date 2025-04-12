import {Request, Response, Router} from 'express';
import {addFilmtoCategory, getAllFilms, getFilmById, postNewFilm, updateFilm, deleteFilm, deleteFilmFromCategory  }
    from "../services/filmService";

const filmRouter:Router = Router();     //erzeugt einen neuen Router

/**
 * @swagger
 * /film:
 *   get:
 *     summary: Retrieve a list of all films (optionally filtered by title)
 *     tags: [film]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter films by title (optional)
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
 *       500:
 *         description: Failed to load films
 */

//GetAll: Liste aller Filme abrufen mit optionalem Titelfilter
filmRouter.get('/', async (req: Request, res: Response) => {
    try {
        const films = await getAllFilms(req.query.title as string);
        res.send(films);        // sendet die Filme zurück als JSON
    } catch (error) {
        console.error("Error retrieving films:", error);        //falls Datenbank nicht erreichbar
        res.status(500).send({ error: "Failed to load films" });
    }
});




/**
 * @swagger
 * /film/{id}:
 *   get:
 *     summary: Returns a film by its ID
 *     tags: [film]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the film to retrieve
 *     responses:
 *       200:
 *         description: Film successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 film_id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *       404:
 *         description: Film not found
 *       500:
 *         description: Internal server error
 */


// GetByID – einzelnes Element nach ID abrufen
filmRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const film = await getFilmById(Number(req.params.id));

        if (!film) {
            res.status(404).send({error: "Film not found"});        //wenn der Film nicht existiert
            return;
        }
        res.send(film);
    } catch (error) {
        console.error("Error retrieving film by ID: ", error);
        res.status(500).send({error: "Internal server error"});
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
 *             required:
 *               - title
 *               - language_id
 *             properties:
 *               title:
 *                 type: string
 *                 example: The Matrix
 *               description:
 *                 type: string
 *                 example: A hacker discovers reality is a simulation.
 *               release_year:
 *                 type: string
 *                 example: 1999
 *               language_id:
 *                 type: integer
 *                 example: 1
 *               rental_duration:
 *                 type: integer
 *                 example: 5
 *               rental_rate:
 *                 type: number
 *                 format: float
 *                 example: 4.99
 *               length:
 *                 type: integer
 *                 example: 136
 *               replacement_cost:
 *                 type: number
 *                 format: float
 *                 example: 19.99
 *               rating:
 *                 type: string
 *                 example: PG-13
 *               special_features:
 *                 type: string
 *                 example: Deleted Scenes,Behind the Scenes
 *     responses:
 *       200:
 *         description: Film successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the newly created film
 *       500:
 *         description: Internal server error while creating film
 */


//Insert: Post, neues Element erstellen
filmRouter.post('/', async (req: Request, res: Response) => {
    console.log("Creating film: ", req.body);

    try {
        const filmId = await postNewFilm(req.body);     //erstellt einen neuen Film aus dem Body
        res.send({ id: filmId });
    } catch (error) {
        console.error("Error inserting film into film: ", error);
        res.status(500).send({ error: 'Failed to create film' }); //Meldung 500 passender als 404 das um Serverfehler beim Ein
    }
});



/**
 * @swagger
 * /film/{id}:
 *   put:
 *     summary: Update a film by ID
 *     tags: [film]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the film to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: The Matrix Reloaded
 *               description:
 *                 type: string
 *                 example: Neo continues his fight against the machines.
 *               release_year:
 *                 type: string
 *                 example: 2003
 *               language_id:
 *                 type: integer
 *                 example: 1
 *               original_language_id:
 *                 type: integer
 *                 example: 2
 *               rental_duration:
 *                 type: integer
 *                 example: 7
 *               rental_rate:
 *                 type: number
 *                 format: float
 *                 example: 4.99
 *               length:
 *                 type: integer
 *                 example: 138
 *               replacement_cost:
 *                 type: number
 *                 format: float
 *                 example: 19.99
 *               rating:
 *                 type: string
 *                 example: PG-13
 *               special_features:
 *                 type: string
 *                 example: Deleted Scenes,Behind the Scenes
 *     responses:
 *       200:
 *         description: Film successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Updated 1 film(s)
 *       404:
 *         description: Film not found
 *       500:
 *         description: Internal server error
 */


//Update vorhandenes Element aktualisieren
filmRouter.put('/:id', async (req: Request, res: Response) => {
    try {
        const updateCount = await updateFilm(Number(req.params.id), req.body);

        if (!updateCount) {
            res.status(404).send({ error: "Film not found" });
            return;
        }

        res.send(`Updated ${updateCount} film(s)`);
    } catch (error) {
        console.error("Error updating film: ", error);
        res.status(500).send({ error: "Failed to update film" });
    }
});


/**
 * @swagger
 * /film/{id}:
 *   delete:
 *     summary: Delete a film by its ID
 *     tags: [film]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the film to delete
 *     responses:
 *       200:
 *         description: Film successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Deleted 1 film(s)
 *       404:
 *         description: Film not found
 *       500:
 *         description: Internal server error
 */

//delete: Element löschen
filmRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const deleteCount = await deleteFilm(Number(req.params.id));

        if (!deleteCount) {
            res.status(404).send({error: "Film not found"});
            return;
        }

        res.send(`Deleted ${deleteCount} films`);
    } catch (error) {
        console.error("Error deleting film: ", error);
        res.status(500).send({ error: "Failed to delete film" });
    }
});


/**
 * @swagger
 * /film/{film_id}/category/{category_id}:
 *   post:
 *     summary: Add a film to a category
 *     tags: [film]
 *     parameters:
 *       - in: path
 *         name: film_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the film to add to the category
 *       - in: path
 *         name: category_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the category to add the film to
 *     responses:
 *       201:
 *         description: Film successfully added to the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Film added to category"
 *                 filmId:
 *                   type: integer
 *                   example: 1
 *                 categoryId:
 *                   type: integer
 *                   example: 2
 *       400:
 *         description: Failed to add film to category
 *       404:
 *         description: Film or category not found
 *       500:
 *         description: Internal server error
 */

//post: Film einer Kategorie zuordnen
    filmRouter.post('/:film_id/category/:category_id', async (req: Request, res: Response) => {
    const categoryId = req.params.category_id;
    const filmId = req.params.film_id;


    try {
        await addFilmtoCategory(Number(filmId), Number(categoryId));
        console.log(`Film ${filmId} added to category ${categoryId}`);
        res.status(201).send({message: " Film added to category", filmId, categoryId});
    } catch (error) {
        console.error("Error adding film to category: ", error);
        res.status(400).send({error: "Failed to add film to category. " + error});
    }
});


/**
 * @swagger
 * /film/{film_id}/category/{category_id}:
 *   delete:
 *     summary: Remove a film from a category
 *     tags: [film]
 *     parameters:
 *       - in: path
 *         name: film_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the film to remove from the category
 *       - in: path
 *         name: category_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the category to remove the film from
 *     responses:
 *       200:
 *         description: Film successfully removed from the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Film removed from category"
 *                 filmId:
 *                   type: integer
 *                   example: 1
 *                 categoryId:
 *                   type: integer
 *                   example: 2
 *       400:
 *         description: Failed to remove film from category
 *       404:
 *         description: Film or category not found
 *       500:
 *         description: Internal server error
 */

//Delete: Verknüpfung Film- Category entfernen
filmRouter.delete('/:film_id/category/:category_id', async (req: Request, res: Response) => {
    const categoryId = req.params.category_id;
    const filmId = req.params.film_id;

    try {
        const deleteCount = await deleteFilmFromCategory(Number(filmId), Number(categoryId));

        if (!deleteCount) {
            res.status(404).send({ error: "Film or Category not found" });
            return;
        }

        res.send(`Removed ${deleteCount} film(s) from category`);
    } catch (error) {
        console.error("Error removing film from category: ", error);
        res.status(500).send({ error: "Failed to remove film from category" });
    }
});


export default filmRouter;