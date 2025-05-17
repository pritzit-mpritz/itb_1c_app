/**
 * @file actor.ts
 * @description Enthält die REST API-Endpunkte zur Verwaltung von Schauspielern.
 * Die Endpunkte unterstützen grundlegende CRUD-Operationen.
 */

import {Request, Response, Router} from 'express';
import {
    getAllActors,
    createActor,
    getActorById,
    deleteActor,
    updateActor
} from "../services/actorService";

const actorRouter: Router = Router();

// GET /actor - Alle Schauspieler abrufen
actorRouter.get('/', async (req: Request, res: Response) => {
    try {
        const actors = await getAllActors(req.query.name as string);

        res.status(200).send({
            message: "Liste der Schauspieler erfolgreich abgerufen.",
            data: actors
        });
    } catch (error) {
        console.error(error);
        console.log("Error: ", error);
        res.status(500).send({ error: "Fehler beim Abrufen der Schauspieler." });
    }
});

// GET /actor/:id - Einen spezifischen Schauspieler abrufen
actorRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const actor = await getActorById(Number(req.params.id));

        if (!actor) {
            res.status(404).send({error: "Schauspieler nicht gefunden"});
            return;
        }

        res.status(200).send({
            message: "Schauspieler erfolgreich abgerufen.",
            data: actor
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Fehler beim Abrufen des Schauspielers." });
    }
});

// POST /actor - Neuen Schauspieler erstellen
actorRouter.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Erstelle Schauspieler: ", req.body);

        const newActorId = await createActor(req.body);

        res.status(201).send({
            message: "Schauspieler erfolgreich erstellt.",
            id: newActorId
        });
    } catch (error) {
        console.error("Fehler beim Erstellen des Schauspielers:", error);
        res.status(500).send({ error: "Fehler beim Erstellen des Schauspielers." });
    }
});

// PUT /actor/:id - Schauspieler aktualisieren
actorRouter.put('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedCount = await updateActor(req.params.id, req.body);

        res.status(200).send({
            message: "Schauspieler erfolgreich aktualisiert.",
            updatedCount: updatedCount
        });
    } catch (error: any) {
        if (error.message === "Schauspieler nicht gefunden") {
            res.status(404).send({ error: error.message });
        } else {
            console.error("Fehler beim Aktualisieren des Schauspielers", error);
            res.status(500).send({ error: "Fehler beim Aktualisieren" });
        }
    }
});

// DELETE /actor/:id - Schauspieler löschen
actorRouter.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const deleteOperation = await deleteActor(Number(req.params.id));

        if (!deleteOperation) {
            res.status(404).send({ error: "Schauspieler nicht gefunden." });
            return;
        }

        res.status(200).send({
            message: "Schauspieler erfolgreich gelöscht.",
            deletedCount: deleteOperation
        });
    } catch (error) {
        console.error("Fehler beim Löschen des Schauspielers", error);
        res.status(500).send({ error: "Fehler beim Löschen des Schauspielers" });
    }
});

export default actorRouter;