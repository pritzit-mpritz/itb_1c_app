import {db} from "../db";

/**
 * Get all categories from the database
 * @param nameFilter Optional filter for the name of the category
 */

export async function getAllCategories(nameFilter?: string): Promise<any[]> {
    const connection = db();

    let query = connection.select("*").from("category");

    if (nameFilter) {
        query = query.whereLike("name", `${nameFilter}%`);
    }

    const categories: any[] = await query;

    console.log("Selected categories: ", categories);
    return categories;
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
 * Removes a category-film relation
 * @param categoryId the category to remove from a film
 * @param filmId the film the category is removed from
 * @returns number of deleted records (0 if none found, 1 if successful)
 */
export async function removeCategoryFromFilm(categoryId: number, filmId: number) {
    const connection = db();

    const deleteOperation = await connection("film_category")
        .where({
            category_id: categoryId,
            film_id: filmId
        })
        .delete();

    console.log(`Removed category ${categoryId} from film ${filmId}. Rows affected: ${deleteOperation}`);

    return deleteOperation;
}