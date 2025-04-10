import {db} from "../db";

/**
 * Get all films from the database
 * @param titleFilter Optional filter for the title of the film
 */
export async function getAllFilms(titleFilter?: string) : Promise<any[]> {
    const connection = db();

    const films: any[] = await connection
        .select("*")
        .from("film")
        .whereLike("title", `${titleFilter || ''}%`);

    console.log("Selected films: ", films.length);

    return films;
}

/**
 * Get a film by its ID
 * @param id The ID of the film to retrieve
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
 * Add a new film to the database
 * @param filmData The film data to insert
 * @returns The ID of the newly created film
 */
export async function addFilm(filmData: any) {
    const connection = db();
    const insertOperation = await connection.insert(filmData).into("film");

    console.log("Inserted film: ", insertOperation[0]);

    return insertOperation[0];
}

/**
 * Update an existing film
 * @param id The ID of the film to update
 * @param filmData The updated film data
 * @returns The number of updated rows
 */
export async function updateFilm(id: number, filmData: any) {
    const connection = db();

    // Make sure the film exists
    const film = await connection.select("*")
        .from("film")
        .where("film_id", id)
        .first();

    if (!film) {
        return 0;
    }

    // Update the film
    const updateOperation = await connection("film")
        .update(filmData)
        .where("film_id", id);

    console.log(`Updated film ${id}: ${updateOperation} rows`);

    return updateOperation;
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