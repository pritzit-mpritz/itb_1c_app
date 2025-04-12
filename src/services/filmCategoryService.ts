/**
 * @fileoverview Service layer for managing the film-category relationship.
 * @module src/services/filmCategoryService
 */
import { db } from "../db";
import { Knex } from "knex";

// Assuming interfaces are defined elsewhere or defined here
interface Film { /* ... properties ... */ film_id: number; title: string; }
interface Category { /* ... properties ... */ category_id: number; name: string; }

const FC_TABLE = 'film_category';
const FILM_TABLE = 'film';
const CATEGORY_TABLE = 'category';

/**
 * Adds a link between a film and a category in the join table.
 * @async
 * @param {number} filmId - The ID of the film.
 * @param {number} categoryId - The ID of the category.
 * @returns {Promise<number[]>} A promise resolving to the result of the Knex insert operation (typically an array with the insert ID).
 * @throws {Error} Throws a database error (e.g., foreign key violation, duplicate entry).
 */
export async function addFilmCategoryLink(filmId: number, categoryId: number): Promise<number[]> {
    if (isNaN(filmId) || filmId <= 0 || isNaN(categoryId) || categoryId <= 0) {
        throw new Error(`Invalid filmId (${filmId}) or categoryId (${categoryId}) provided.`);
    }
    const connection: Knex = db();
    const insertData = {
        film_id: filmId,
        category_id: categoryId
        // last_update is handled by the database
    };
    const result = await connection(FC_TABLE).insert(insertData);
    console.log(`Linked film ID ${filmId} with category ID ${categoryId}. Result: ${JSON.stringify(result)}`);
    return result;
}

/**
 * Removes a link between a film and a category from the join table.
 * @async
 * @param {number} filmId - The ID of the film.
 * @param {number} categoryId - The ID of the category.
 * @returns {Promise<number>} A promise resolving to the number of deleted rows (0 or 1).
 * @throws {Error} Throws a database error if the delete operation fails.
 */
export async function removeFilmCategoryLink(filmId: number, categoryId: number): Promise<number> {
    if (isNaN(filmId) || filmId <= 0 || isNaN(categoryId) || categoryId <= 0) {
        // Or return 0 as no rows would be deleted with invalid IDs
        console.warn(`removeFilmCategoryLink called with invalid IDs: Film ${filmId}, Category ${categoryId}`);
        return 0;
    }
    const connection: Knex = db();
    const deletedCount: number = await connection(FC_TABLE)
        .where({ film_id: filmId, category_id: categoryId })
        .delete();
    console.log(`Attempted to unlink film ID ${filmId} and category ID ${categoryId}. Deleted ${deletedCount} rows.`);
    return deletedCount;
}

/**
 * Retrieves all categories associated with a specific film.
 * @async
 * @param {number} filmId - The ID of the film.
 * @returns {Promise<Category[]>} A promise resolving to an array of category objects linked to the film.
 * @throws {Error} Throws a database error if the query fails.
 */
export async function getCategoriesForFilm(filmId: number): Promise<Category[]> {
    if (isNaN(filmId) || filmId <= 0) {
        console.warn(`getCategoriesForFilm called with invalid film ID: ${filmId}`);
        return []; // Return empty array for invalid IDs
    }
    const connection: Knex = db();
    const categories: Category[] = await connection(CATEGORY_TABLE)
        .join(FC_TABLE, `${CATEGORY_TABLE}.category_id`, '=', `${FC_TABLE}.category_id`)
        .where(`${FC_TABLE}.film_id`, filmId)
        .select(`${CATEGORY_TABLE}.*`); // Select all columns from the category table

    console.log(`Retrieved ${categories.length} categories for film ID ${filmId}.`);
    return categories;
}

/**
 * Retrieves all films associated with a specific category.
 * @async
 * @param {number} categoryId - The ID of the category.
 * @returns {Promise<Film[]>} A promise resolving to an array of film objects linked to the category.
 * @throws {Error} Throws a database error if the query fails.
 */
export async function getFilmsForCategory(categoryId: number): Promise<Film[]> {
    if (isNaN(categoryId) || categoryId <= 0) {
        console.warn(`getFilmsForCategory called with invalid category ID: ${categoryId}`);
        return []; // Return empty array for invalid IDs
    }
    const connection: Knex = db();
    const films: Film[] = await connection(FILM_TABLE)
        .join(FC_TABLE, `${FILM_TABLE}.film_id`, '=', `${FC_TABLE}.film_id`)
        .where(`${FC_TABLE}.category_id`, categoryId)
        .select(`${FILM_TABLE}.*`); // Select all columns from the film table

    console.log(`Retrieved ${films.length} films for category ID ${categoryId}.`);
    return films;
}