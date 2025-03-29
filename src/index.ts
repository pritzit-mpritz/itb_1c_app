import express from 'express';
import dotenv from 'dotenv';
import randomRouter from "./routes/randoms";
import actorRouter from "./routes/actor";

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import {db} from "./db";

// Initialize environment variables
dotenv.config();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Sakila API',
            version: '1.0.0',
            description: '',
        },
    },
    apis: ['./src/routes/**/*.ts'], // Path to the API docs
};

// Checking database connection
const dbConnection = db();
// Check if the database connection is successful
// noinspection SqlNoDataSourceInspection
dbConnection.raw("SELECT 1 FROM DUAL").then(() => {
    console.log("Database connection successful");
}).catch((err) => {
    console.error("Database connection failed", err);
});


const app = express();
app.use(express.json());

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const port = process.env.PORT || 3000;

// region Routes
app.use('/randoms', randomRouter);
app.use('/actor', actorRouter);
// endregion

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});