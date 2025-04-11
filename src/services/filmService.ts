import {db} from "../db";
//
/**
 * Get all films from the database
 * @param titleFilter Optional filter for the title of the film
 */
export async function getAllFilms(titleFilter?: string) : Promise<any[]> {
    const connection = db();

    const films: any[] = await connection
        .select("*")
        .from("film")
        .whereLike("title", titleFilter ? `${titleFilter}%` : '%');



    console.log("Selected films: ", films.length);

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

    console.log("Selected film: ", film?.title || "Not found");

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

    const tableName = "film_category";

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