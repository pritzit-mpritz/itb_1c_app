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
 * Delete a film from the database
 * @param id The ID of the film to delete
 * @returns The number of deleted rows
 */
export async function deleteFilm(id: number) {
    const connection = db();

    // First check if the film exists
    const film = await connection.select("*")
        .from("film")
        .where("film_id", id)
        .first();

    if (!film) {
        return 0;
    }

    // First delete any film_category entries
    await connection("film_category")
        .where("film_id", id)
        .delete();

    // Then delete the film
    const deleteOperation = await connection("film")
        .where("film_id", id)
        .delete();

    console.log(`Deleted film ${id}: ${deleteOperation} rows`);

    return deleteOperation;
}

/**
 * Get all films in a specific category
 * @param categoryId The ID of the category to get films for
 * @returns An array of films in the specified category
 */
export async function getFilmsByCategory(categoryId: number) {
    const connection = db();

    const films = await connection
        .select("f.*")
        .from("film as f")
        .join("film_category as fc", "f.film_id", "fc.film_id")
        .where("fc.category_id", categoryId);

    console.log(`Selected ${films.length} films for category ${categoryId}`);

    return films;
}