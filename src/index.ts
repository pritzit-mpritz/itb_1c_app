// src/index.ts
import express, { Express } from 'express';
import dotenv from 'dotenv';
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// --- Database ---
import { db } from "./db";

// --- Routers ---
import randomRouter from "./routes/randoms";
import actorRouter from "./routes/actor";
import filmRouter from "./routes/film";
import categoryRouter from "./routes/category";


dotenv.config();

// --- Swagger Definition ---
const swaggerOptions: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'M295 API -  Film & Category',
            version: '1.0.0',
            description: 'API für Film & Category Aufgabe',
        },
    },
    apis: ['./src/routes/*.ts'], // Scannt Routen
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// --- Database Connection Check ---
try {
    const dbConnection = db();
    dbConnection.raw("SELECT 1")
        .then(() => { console.log("Database connection successful."); })
        .catch((err) => { console.error("FATAL: DB Connection Check Failed:", err); process.exit(1); });
} catch (error) {
    console.error("FATAL: DB Configuration Failed:", error); process.exit(1);
}

// --- Express App Setup ---
const app: Express = express();
const port = process.env.PORT || 3000;
app.use(express.json()); // JSON Body Parser

// --- Swagger UI ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- API Routes ---
console.log('Registering API routes at root path...');
app.use('/randoms', randomRouter);
app.use('/actor', actorRouter);
app.use('/film', filmRouter);
app.use('/category', categoryRouter);

// --- Start Server ---
app.listen(port, () => {
    console.log(`-------------------------------------------`);
    console.log(` Server running: http://localhost:${port}`);
    console.log(` Swagger Docs:   http://localhost:${port}/api-docs`);
    console.log(`-------------------------------------------`);
});