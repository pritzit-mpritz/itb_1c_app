import { db } from "../db";

/**
 * Retrieve a list of all categories from database.
 */
export async function getAllCategory() {
    const connection = db();
    const categories = await connection
        .select("*")
        .from("category");

    console.log("Selected categories: ", categories);

    return categories;
}

/**
 * Retrieve a category by ID.
 * @param id filter to find category by ID.
 */
export async function getCategoryById(id: number) {
    const connection = db();
    const category = await connection
        .select("*")
        .from("category")
        .where("category_id", id)
        .first();

    console.log("Selected category: ", category);

    return category;
}

/**
 * Create a new category. Required value is name.
 * @param body takes in name to create a new category.
 */
export async function createCategory(body: string) {
    console.log("Creating category: ", body);

    const connection = db();
    const insertOperation = await connection.insert(body).into("category");

    return insertOperation;
}

/**
 * Update the name of a category.
 * @param id ID of the category to update.
 * @param body New data for the category.
 */
export async function updateCategory(id: number, body: { name: string }) {
    const connection = db();

    const updateOperation = await connection("category")
        .update({ name: body.name })
        .where("category_id", id);

    return updateOperation;
}

/**
 * Delete a category by ID.
 * @param id filter to find category by ID to delete.
 */
export async function deleteCategory(id: number) {
    const connection = db();
    const deleteOperation = await connection("category")
        .where("category_id", id)
        .delete();

    return deleteOperation;
}


/**
 * Adds a film to a category (film_category relation)
 * @param filmId ID of the film
 * @param categoryId ID of the category
 */
export async function addFilmToCategory(filmId: number, categoryId: number) {
    const connection = db();

    const insertOperation = await connection("film_category").insert({
        film_id: filmId,
        category_id: categoryId
    });

    console.log(`Film ${filmId} added to category ${categoryId}`);


    return insertOperation;
}


/**
 * Removes a film from a category (film_category relation)
 * @param filmId ID of the film
 * @param categoryId ID of the category
 */
export async function removeFilmFromCategory(categoryId: number, filmId: number) {
    const connection = db();
    const deleteOperation = await connection("film_category")
        .where({
            film_id: filmId,
            category_id: categoryId
        })
        .delete();

    console.log(`Film ${filmId} removed from category ${categoryId}`);


    return deleteOperation;
}



