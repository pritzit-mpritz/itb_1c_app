import express, { Request, Response, Router } from 'express';

const randomRouter: Router = Router();

randomRouter.get('/', (req: Request, res: Response) => {
    res.send(`Random number: ${Math.floor(Math.random() * 100)}`);
});

randomRouter.get('/:max', (req: Request, res: Response) => {
    const max = parseInt(req.params.max);
    if(isNaN(max)) {
        res.status(400).send('Invalid input');
        return;
    }
    // Achtung: sind keine Hochkomma ' sondern Backticks `
    res.send(`Random number: ${Math.floor(Math.random() * max)}`);
});

export default randomRouter;
