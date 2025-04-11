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
 * Adds a category-film relation
 * @param categoryId the category to add to a film
 * @param filmId the film the category is added to
 */
export async function addCategoryToFilm(categoryId: number, filmId: number) {
    const connection = db();
    const insertOperation = await connection("film_category")
        .insert({
            category_id: categoryId,
            film_id: filmId
        });

    console.log("Inserted category to film: ", insertOperation);

    return insertOperation;
}