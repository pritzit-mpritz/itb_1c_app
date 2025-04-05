import {Request, Response, Router} from 'express';
import {db} from '../db';


/** import {getCategoryById} from "../services/categoryService"; **/



const categoryRouter: Router = Router();

/**
 *
 * **/

categoryRouter.get('/', async (req: Request, res: Response) => {
    const connection = db();
    const categorys = await connection.select("*").from("film_category");

    console.log("Selected category: ",categorys );

    res.send(categorys);
});

/**
 *
 * **/
categoryRouter.get('/:id', async (req: Request, res: Response) => {
    const connection = db();
    const category = await connection.select("*")
        .from("category")
        .where("category_id", req.params.id)
        .first();

    console.log("Selected category: ", category);

    if (!category) {
        res.status(404).send({error: "Category not found"});
        return
    }

    res.send(category);
});

/**
 *
 * **/
categoryRouter.post('/', async (req: Request, res: Response) => {
    console.log("Creating film_category: ", req.body);

    const connection = db();
    const insertOperation = await connection.insert(req.body).into("film_category");

    res.send({id: insertOperation[0]});
});
/**
 *
 * **/
categoryRouter.put('/:id', async (req: Request, res: Response) => {
    const connection = db();

    const category = await connection.select("*")
        .from("category")
        .where("category_id", req.params.id).first();

    if (!category) {
        res.status(404).send({error: "Category not found"});
        return
    }

    category.name = req.body.name;


    const updateOperation = await connection("category").update(category)
        .where("category_id", req.params.id);
    res.send(`Updated ${updateOperation} category`);
});
/**
 *
 * **/
categoryRouter.delete('/:id', async (req: Request, res: Response) => {
    const connection = db();
    const deleteOperation = await connection("category")
        .where("category_id", req.params.id).delete();

    if (!deleteOperation) {
        res.status(404).send({error: " not found"});
        return
    }

    res.send(`Deleted ${deleteOperation} category`);
});
/**
 *
 * **/



