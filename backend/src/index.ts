import express from 'express';
import dotenv from 'dotenv';
import actorRouter from "./routes/actor";

import filmRouter from "./routes/film";
import cors from 'cors';

// Initialize environment variables
dotenv.config();

console.log("!!! EXPOSING Environment variables !!!");
console.log("Create new database connection");
console.log("DB_HOST: ", process.env.DB_HOST);
console.log("DB_PORT: ", process.env.DB_PORT);
console.log("DB_USER: ", process.env.DB_USER);
console.log("DB_PASSWORD: ", process.env.DB_PASSWORD);
console.log("DB_NAME: ", process.env.DB_NAME);

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// region Routes
app.use('/film', filmRouter);
app.use('/actor', actorRouter);
// endregion

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});