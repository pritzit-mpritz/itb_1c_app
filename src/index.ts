/**
 * @fileoverview Main entry point for the Express application.
 * @module src/index
 * @description Sets up the Express server, configures middleware (JSON parsing),
 * performs a database connection check, registers API routes, and starts the server.
 * Includes optional Swagger configuration for API documentation.
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import swaggerJsdoc from "swagger-jsdoc"; // Optional Swagger import
import swaggerUi from "swagger-ui-express"; // Optional Swagger UI import

// --- Database ---
import { db } from "./db"; // Import the database connection function

// --- Routers ---
// Import route handlers for various API endpoints
import randomRouter from "./routes/randoms";
import actorRouter from "./routes/actor";
import filmRouter from "./routes/film"; // Required per M295 specification
import categoryRouter from "./routes/category"; // Required per M295 specification

// Load environment variables from .env file
dotenv.config();

// --- Optional: Swagger Definition ---
/**
 * Configuration options for swagger-jsdoc.
 * Defines API metadata and specifies where to find route definitions with Swagger annotations.
 * @type {swaggerJsdoc.Options}
 * @see {@link https://github.com/Surnet/swagger-jsdoc}
 */
const swaggerOptions: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0', // Specify the OpenAPI version
        info: {
            title: 'M295 API - Film & Category', // API Title
            version: '1.0.0', // API Version
            description: 'API for the Sakila Film Database focusing on Film & Category Management (M295 Final Project)', // API Description
        },

    },
    // Path to the API specification files (route files with Swagger annotations)
    apis: ['./src/routes/*.ts'], // Path for Swagger annotations
};

// Generate the Swagger specification object (Optional)
let swaggerSpec;
try {
    swaggerSpec = swaggerJsdoc(swaggerOptions);
    console.log("Swagger specification generated successfully.");
} catch (e) {
    console.error("Error generating Swagger specification:", e);
    swaggerSpec = null; // Set to null on error
}
// --- End Optional: Swagger Definition ---


// --- Database Connection Check ---
/**
 * Checks the database connection by executing a simple 'SELECT 1' query.
 * Logs success or exits the process with an error message if the connection fails.
 */
(async () => {
    try {
        const dbConnection = db(); // Get the DB connection instance
        await dbConnection.raw("SELECT 1"); // Execute a simple raw query
        console.log("Database connection check successful.");
    } catch (error) {
        console.error("FATAL: Database connection check failed:", error);
        process.exit(1); // Exit the application if DB connection fails on startup
    }
})(); // Immediately Invoked Function Expression (IIFE) to allow async/await

// --- Express App Setup ---
const app: Express = express(); // Create an Express application instance
const port = process.env.PORT || 3000; // Use port from .env or default to 3000

// --- Middleware ---
/**
 * Middleware to parse incoming requests with JSON payloads.
 * Populates `req.body` with the parsed data.
 */
app.use(express.json());

// --- Optional: Swagger UI ---
/**
 * Sets up the Swagger UI endpoint if the specification was generated.
 * Provides interactive API documentation.
 */
if (swaggerSpec) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
// --- End Optional: Swagger UI ---

// --- API Routes ---
/**
 * Registers the imported route handlers under specific base paths.
 */
console.log('Registering API routes...');
app.use('/randoms', randomRouter);      // Mount routes for random number generator
app.use('/actor', actorRouter);        // Mount routes for actor management
app.use('/film', filmRouter);          // Mount routes for film management (M295 requirement)
app.use('/category', categoryRouter);    // Mount routes for category management (M295 requirement)
console.log('API routes registered.');

// --- Global Error Handler (Example - Optional) ---
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//     console.error("Unhandled Error:", err.stack);
//     res.status(500).send('Something broke!');
// });

// --- Server Start ---
/**
 * Starts the Express server, listening on the configured port.
 * Logs messages indicating the server is running.
 */
app.listen(port, () => {
    console.log(`-------------------------------------------`);
    console.log(` Server running at: http://localhost:${port}`);
    if (swaggerSpec) { // Show Swagger path only if set up
        console.log(` Swagger Docs available at: http://localhost:${port}/api-docs`);
    }
    console.log(`-------------------------------------------`);
});