import {db} from "../db";

/**
 * Get all film from the database
 * @param titleFilter Optional filter for the title of the film
 */
export async function getAllFilm(titleFilter?: string) {
    const connection = db();

    const query = connection.select("*").from("film");

    if (titleFilter) {
        query.whereLike("title", `${titleFilter}%`);
    }

    const films = await query;
    console.log("Selected films: ", films);

    return films;
}

/**
 * Get a specific film from the database by ID
 * @param id The unique identifier of the film to retrieve
 * @returns The film object if found, otherwise undefined
 */
export async function getFilmById(id: number) {
    const connection = db();
    const film = await connection.select("*")
        .from("film")
        .where("film_id", id)
        .first();

    console.log("Selected film: ", film);

    return film;
}

/**
 * Adds a film-category relation
 * @param filmId the film to add to a category
 * @param categoryId the category the film is added to
 */
export async function addFilmToCategory(filmId: number, categoryId: number) {
    const connection = db();

    // Check if film exists
    const film = await connection.select("*")
        .from("film")
        .where("film_id", filmId)
        .first();

    if (!film) {
        throw new Error(`Film with ID ${filmId} not found`);
    }

    // Check if category exists
    const category = await connection.select("*")
        .from("category")
        .where("category_id", categoryId)
        .first();

    if (!category) {
        throw new Error(`Category with ID ${categoryId} not found`);
    }

    // Check the correct table name - might be film_category in Sakila
    const tableName = "film_category"; // Change this if your table is named differently

    // Check if relationship already exists
    const existing = await connection(tableName)
        .where({
            film_id: filmId,
            category_id: categoryId
        })
        .first();

    if (existing) {
        throw new Error(`Film ${filmId} is already in category ${categoryId}`);
    }

    // Add relationship
    const insertOperation = await connection(tableName)
        .insert({
            film_id: filmId,
            category_id: categoryId,
            last_update: new Date() // Sakila tables often have this field
        });

    console.log("Inserted film to category: ", insertOperation);

    return insertOperation;

}

/**
 * Removes a film-category relation
 * @param filmId the film to remove from a category
 * @param categoryId the category the film is removed from
 * @returns number of deleted records (0 if none found, 1 if successful)
 */
export async function removeFilmFromCategory(filmId: number, categoryId: number) {
    const connection = db();

    // The correct table name should be "film_category" in Sakila DB
    const tableName = "film_category";

    const deleteOperation = await connection(tableName)
        .where({
            film_id: filmId,
            category_id: categoryId
        })
        .delete();

    console.log(`Removed film ${filmId} from category ${categoryId}. Rows affected: ${deleteOperation}`);

    return deleteOperation;
}