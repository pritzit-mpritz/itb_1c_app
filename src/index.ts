import express from 'express';
import dotenv from 'dotenv';
import randomRouter from "./routes/randoms";
import actorRouter from "./routes/actor";
import filmRouter from "./routes/film";
import categoryRouter from "./routes/category";

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { db } from "./db";

// Initialize environment variables
dotenv.config();

// Swagger configuration mit sortierten Tags
const swaggerSpec = swaggerJsdoc({
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Sakila API',
            version: '1.0.0',
            description: `
            Node.JS | Express | Swagger/OpenAPI | Knex -- Projekt der Gruppe-1 🙏!\n
            Soweit wurde diese Swagger API und die Endpunkte von Imad und Mathias erstellt, bei Fehlern bitte beide Augen zudrücken!\n
            Ansonsten viel Vergnügen beim Benoten!
            `,
        },
        tags: [
            { name: 'Categories', description: '📚 Kategorien verwalten & mit Filmen verknüpfen' },
            { name: 'Actors', description: '🧑‍🎤 Schauspieler verwalten' },
            { name: 'Films', description: '🎬 Filme verwalten & mit Kategorien verknüpfen' },
            { name: 'Randoms', description: '♠️ Zufallswerte generieren' }
        ],
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./src/routes/**/*.ts'],
});

// Check database connection
const dbConnection = db();
dbConnection.raw("SELECT 1 FROM DUAL").then(() => {
    console.log("Database connection successful");
}).catch((err) => {
    console.error("Database connection failed", err);
});

const app = express();
app.use(express.json());

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: `
    .swagger-ui,
    .swagger-ui * {
      color: #e4e6ed !important;
    }

    body {
      background-color: #1e1e20 !important;
    }

    .swagger-ui {
      background-color: #1e1e20 !important;
    }

    .swagger-ui .topbar {
      background-color: #2a2a2e !important;
    }

    .swagger-ui .topbar-wrapper .link span {
      color: #85ea2d !important;
    }

    .swagger-ui .info,
    .swagger-ui .scheme-container,
    .swagger-ui .opblock-tag-section,
    .swagger-ui .responses-inner,
    .swagger-ui .parameters,
    .swagger-ui .responses-wrapper,
    .swagger-ui .opblock {
      background-color: #2a2a2e !important;
    }

    .swagger-ui .opblock-summary {
      background-color: #323237 !important;
    }

    .swagger-ui .opblock-summary-method {
      color: #ffffff !important;
    }

    .swagger-ui .parameter__name,
    .swagger-ui .parameter__type,
    .swagger-ui .parameter__in,
    .swagger-ui .opblock-description-wrapper,
    .swagger-ui .opblock-summary-description,
    .swagger-ui .response-col_description {
      color: #85ea2d !important;
    }

    .swagger-ui .btn,
    .swagger-ui .model-box-control,
    .swagger-ui .try-out {
      background-color: #3a3a40 !important;
      color: #e4e6ed !important;
    }

    .swagger-ui .btn:hover {
      background-color: #4a4a50 !important;
    }

    .swagger-ui .response-col_status {
      color: #85ea2d !important;
    }

    .swagger-ui pre,
    .swagger-ui code {
      background-color: #1a1a1c !important;
      color: #85ea2d !important;
    }

    .swagger-ui .parameters,
    .swagger-ui .responses-inner,
    .swagger-ui .response-col_description,
    .swagger-ui .response-col_status {
      background-color: #2a2a2e !important;
    }

    .swagger-ui table tbody tr td {
      background-color: #1e1e20 !important;
    }

    .swagger-ui textarea,
    .swagger-ui input,
    .swagger-ui select {
      background-color: #1e1e20 !important;
      color: #e4e6ed !important;
      border: 1px solid #444 !important;
    }

    .swagger-ui .execute-wrapper,
    .swagger-ui .btn-group,
    .swagger-ui .btn-group .btn {
      background-color: #2a2a2e !important;
      border: none !important;
      color: #e4e6ed !important;
    }

    .swagger-ui .btn-group .btn:hover {
      background-color: #3a3a40 !important;
    }

    .swagger-ui .btn.execute {
      background-color: #5c5d6c !important;
      color: #e4e6ed !important;
    }

    .swagger-ui .btn.execute:hover {
      background-color: #6c6d7c !important;
    }

    .swagger-ui .responses-inner .response,
    .swagger-ui .responses-inner .response-header {
      background-color: #2a2a2e !important;
      color: #e4e6ed !important;
    }

    .swagger-ui .responses-table .headers td,
    .swagger-ui .responses-table .headers th {
      background-color: #2a2a2e !important;
      color: #e4e6ed !important;
    }

    .swagger-ui .response .response-col_links {
      background-color: #1e1e20 !important;
    }

    .swagger-ui .opblock-section-header {
      background-color: #2a2a2e !important;
      color: #e4e6ed !important;
    }
    .swagger-ui .btn.try-out__btn {
      background-color: #515257 !important;
      color: #e4e6ed !important;
      border: 1px solid #444 !important;
    }

    .swagger-ui .btn.try-out__btn:hover {
      background-color: #3a3a40 !important;
      color: #85ea2d !important;
      border: 1px solid #85ea2d !important;
    }
  `
}));


const port = process.env.PORT || 3000;

// region Routes
app.use('/randoms', randomRouter);
app.use('/actor', actorRouter);
app.use('/category', categoryRouter);
app.use('/film', filmRouter);
// endregion

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});