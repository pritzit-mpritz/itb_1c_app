import {db} from "../db";

/**
 * Get all categories from the database
 * @param nameFilter Optional filter for the name of the category
 */

export async function getAllCategories(nameFilter?: string) : Promise<any[]> {
    const connection = db();
    // const category = await connection.select("*").from("category")
    //     .whereLike("name", `%${nameFilter}%`);

    const category:any[] = await connection
        .select("*")
        .from("category")
        .whereLike("name", `${nameFilter}%`)

    console.log("Selected categories: ", category);

    return category;
}

export async function getCategoryById(id: number) {
    const connection = db();
    const category = await connection.select("*")
        .from("category")
        .where("category_id", id)
        .first();

    console.log("Selected category: ", category);

    return category;
}

/**
 * Adds a film-category relation
 * @param categoryId the category to add to a film
 * @param filmId the film the category is added to
 */
export async function addCategoryToFilm(categoryId: number, filmId: number) {
    const connection = db();

    // Check if category exists
    const category = await connection.select("*")
        .from("category")
        .where("category_id", categoryId)
        .first();

    if (!category) {
        throw new Error(`Category with ID ${categoryId} not found`);
    }

    // Check if film exists
    const film = await connection.select("*")
        .from("film")
        .where("film_id", filmId)
        .first();

    if (!film) {
        throw new Error(`Film with ID ${filmId} not found`);
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
        throw new Error(`Category ${categoryId} is already in film ${filmId}`);
    }

    // Add relationship
    const insertOperation = await connection(tableName)
        .insert({
            film_id: filmId,
            category_id: categoryId,
            last_update: new Date()
        });

    console.log("Inserted category to film: ", insertOperation);

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