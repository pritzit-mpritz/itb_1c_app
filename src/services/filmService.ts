/**
 * @fileoverview Service layer for film-related database operations.
 * @module src/services/filmService
 */
import { db } from "../db";
import { Knex } from "knex";

const TABLE_NAME = 'film';

// Define an interface for the Film object (example)
interface Film {
    film_id: number;
    title: string;
    description?: string;
    release_year?: number;
    language_id: number;
    original_language_id?: number | null;
    rental_duration: number;
    rental_rate: number | string; // Knex might return Decimal as string
    length?: number;
    replacement_cost: number | string; // Knex might return Decimal as string
    rating?: string;
    special_features?: string;
    last_update: string; // Consider Date type
}


/**
 * Retrieves all films, optionally filtering by the beginning of the title.
 * @async
 * @param {string} [titleFilter] - Optional filter string. Matches films whose title starts with this string (case-insensitive).
 * @returns {Promise<Film[]>} A promise resolving to an array of matching film objects.
 * @throws {Error} Throws a database error if the query fails.
 */
export async function getAllFilms(titleFilter?: string): Promise<Film[]> {
    const connection: Knex = db();
    let query = connection.select("*").from(TABLE_NAME);

    if (titleFilter) {
        // Ensure case-insensitivity and use bindings
        query = query.where("title", "like", `${titleFilter}%`);
        // For true case-insensitivity if DB collation isn't CI:
        // query = query.whereRaw('LOWER(title) LIKE ?', [`${titleFilter.toLowerCase()}%`]);
    }

    const films: Film[] = await query;
    console.log(`Retrieved ${films.length} films ${titleFilter ? `starting with "${titleFilter}"` : ''}.`);
    return films;
}

/**
 * Retrieves a film by its unique ID.
 * @async
 * @param {number} filmId - The ID of the film to retrieve.
 * @returns {Promise<Film | undefined>} A promise resolving to the film object or undefined if not found.
 * @throws {Error} Throws a database error if the query fails.
 */
export async function getFilmById(filmId: number): Promise<Film | undefined> {
    if (isNaN(filmId) || filmId <= 0) {
        console.warn(`getFilmById called with invalid ID: ${filmId}`);
        return undefined;
    }
    const connection: Knex = db();
    const film: Film | undefined = await connection(TABLE_NAME)
        .where("film_id", filmId)
        .first();

    if (film) {
        console.log(`Retrieved film ID ${filmId}: ${film.title}`);
    } else {
        console.log(`Film with ID ${filmId} not found.`);
    }
    return film;
}