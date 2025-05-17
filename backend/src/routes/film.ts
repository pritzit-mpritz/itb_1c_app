import {Request, Response, Router} from 'express';
import {
    getAllFilms,
    createFilm,
    getFilmById,
    deleteFilm,
    updateFilm,
    addActorToFilm,
    deleteFilmActor}
    from "../services/filmService";

const filmRouter: Router = Router();

filmRouter.get('/', async (req: Request, res: Response) => {
    try {
        // Versuch, die Filme abzurufen
        const films = await getAllFilms(req.query.title as string);

        res.status(200).send({
            message: "Liste der Filme erfolgreich abgerufen.",
            data: films
        });
    } catch (error) {

        console.error(error);
        res.status(500).send({ error: "Fehler beim Abrufen der Filme." });
    }
});

filmRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const film = await getFilmById(Number(req.params.id));

        if (!film) {
            res.status(404).send({error: "Film nicht gefunden"});
            return;
        }
        res.status(200).send({
            message: "Film erfolgreich abgerufen.",
            data: film
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Fehler beim Abrufen des Films." });
    }
});

filmRouter.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Erstelle Film: ", req.body);

        // Verwendet die Service-Funktion, um den Film zu erstellen
        const newFilmId = await createFilm(req.body);

        res.status(201).send({
            message: "Film erfolgreich erstellt.",
            id: newFilmId
        });
    } catch (error) {
        console.error("Fehler beim Erstellen des Films:", error);
        res.status(500).send({ error: "Fehler beim Erstellen des Films." });
    }
});


filmRouter.put('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedCount = await updateFilm(req.params.id, req.body);

        res.status(200).send({
            message: "Film erfolgreich aktualisiert.",
            updatedCount: updatedCount
        });

    } catch (error: any) {
        if (error.message === "Film nicht gefunden") {
            res.status(404).send({ error: error.message });
        } else {
            console.error("Fehler beim Aktualisieren des Films", error);
            res.status(500).send({ error: "Fehler beim Aktualisieren" });
        }
    }
});

filmRouter.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const deleteOperation = await deleteFilm(Number(req.params.id));

        if (!deleteOperation) {
            res.status(404).send({ error: "Film nicht gefunden." });
            return;
        }

        res.status(200).send({
            message: "Film erfolgreich gelöscht.",
            deletedCount: deleteOperation
        });
    } catch (error) {
        console.error("Fehler beim Löschen des Films", error);
        res.status(500).send({ error: "Fehler beim Löschen des Films" });
    }
});

filmRouter.post('/:film_id/actor/:actor_id', async (req: Request, res: Response) => {
    const filmId = req.params.film_id;
    const actorId = req.params.actor_id;

    try {
        await addActorToFilm(Number(filmId), Number(actorId));
        console.log(`Film ${filmId} added to actor ${actorId}`);

        res.status(201).send({
            message: "Actor erfolgreich zu Film hinzugefügt.",
            filmId: filmId,
            actorId: actorId
        });

    } catch (error) {
        console.error("Fehler den Actor zum Film hinzuzufügen: ", error);
        res.status(400).send({error: "Fehler den Actor zum Film hinzuzufügen. " + error});
    }
})

filmRouter.delete('/:film_id/actor/:actor_id', async (req: Request, res: Response): Promise<void> => {
    try {
        const { film_id, actor_id } = req.params;
        const filmId = parseInt(film_id, 10);
        const actorId = parseInt(actor_id, 10);

        //  // Überprüfe, ob die Umwandlung der Parameter in gültige Zahlen erfolgreich war
        if (isNaN(filmId) || isNaN(actorId)) {
            res.status(400).json({ message: 'Invalid film_id or actor_id' });
            return;
        }

        const deletedCount = await deleteFilmActor(filmId, actorId);
        if (deletedCount === 0) {
            res.status(404).json({ message: 'Actor not found for the given film' });
            return;
        }
        // Erfolgreiches Entfernen der Verknüpfung
        res.status(200).json({ message: 'Actor removed successfully' });
    } catch (error: any) {
        //Fehler in der Verarbeitung
        res.status(500).json({ message: 'Error removing actor', error: error.message });
    }
});




export default filmRouter;
