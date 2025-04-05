// src/services/FilmService.ts
import { db } from '../db';

/**
 * Get all movies from the db
 */
export const getAllMovies = async () => {
    return await db()('film');
};

/**
 * Get a single movie by ID
 */
export const getMovieById = async (id: string) => {
    return await db()('film').where({ film_id: id }).first();
};

/**
 * Create a new movie
 */
export const createMovie = async (data: {
    title: string;
    description?: string;
    release_year?: number;
    language_id: number;
}) => {
    const [id] = await db()('film').insert(data);
    return await getMovieById(id.toString());
};

/**
 * Update an existing movie
 */
export const updateMovie = async (
    id: string,
    data: { title?: string; description?: string; release_year?: number; language_id?: number }
) => {
    const updated = await db()('film').where({ film_id: id }).update(data);
    return updated ? await getMovieById(id) : null;
};

/**
 * Delete a movie
 */
export const deleteMovie = async (id: string) => {
    return await db()('film').where({ film_id: id }).delete();
};

/**
 * Add a category to a movie
 */
export const addCategoryToMovie = async (filmId: string, categoryId: string) => {
    return await db()('film_category').insert({ film_id: filmId, category_id: categoryId });
};

/**
 * Remove a category from a movie
 */
export const removeCategoryFromMovie = async (filmId: string, categoryId: string) => {
    return await db()('film_category')
        .where({ film_id: filmId, category_id: categoryId })
        .delete();
};
