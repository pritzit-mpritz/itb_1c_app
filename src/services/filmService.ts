import {db} from "../db";
import {Request, Response} from "express";
import filmRouter from "../routes/film";

filmRouter.delete('/:id', async (req: Request, res: Response) => {
    const connection = db();
    const deleteOperation = await connection("film")
        .where("film_id", req.params.id).delete();

    if (!deleteOperation) {
        res.status(404).send({error: "No film found"});
        return
    }