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
import categoryRouter from "./routes/category"; // Importiere den neuen Category-Router


dotenv.config();

// --- Swagger Definition ---
const swaggerOptions: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Abschlussarbeit M295 - Film & Category Endpunkte',
            version: '1.0.0',
            description: 'API um Filme and kategorien zu managen.',
        },
    },
    apis: ['./src/routes/*.ts'], // Pfad zu den Routen
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// --- Database Connection Check ---
try {
    const dbConnection = db();
    dbConnection.raw("SELECT 1") // Universellerer Check
        .then(() => { console.log("Database connection successful."); })
        .catch((err) => {
            console.error("FATAL ERROR: Database connection failed:", err);
            process.exit(1); // Beenden bei DB-Fehler
        });
} catch (error) {
    console.error("FATAL ERROR: Failed to initialize database configuration:", error);
    process.exit(1);
}

// --- Express App Setup ---
const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // JSON Body Parser

// --- Swagger UI ---
// Direkt unter /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- API Routes ---
app.use('/randoms', randomRouter);
app.use('/actor', actorRouter);
app.use('/film', filmRouter);
app.use('/category', categoryRouter);


// --- Start Server ---
app.listen(port, () => {
    console.log(`-------------------------------------------------------`);
    console.log(` Server running at http://localhost:${port}`);
    console.log(` API available at http://localhost:${port}`);
    console.log(` Swagger Docs at http://localhost:${port}/api-docs`);
    console.log(`-------------------------------------------------------`);
});