import { db } from "../db";

/**
 * Retrieve a list of all categories from database.
 */
export async function getAllCategory() {
    const connection = db();
    const categories = await connection.select("*").from("category");

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
 * @param body takes in new name to update.
 * @param id takes in ID to know which category needs to be updated.
 */
export async function updateCategory(body: any, id: number) {
    const connection = db();

    const updateOperation = await connection("category").update({
        name: body.name
    })
        .where("category_id", id)

    return updateOperation;
}

/**
 * Delete a category by ID.
 * @param id filter to find category by ID to delete.
 */
export async function deleteCategory(id: number) {
    const connection = db();
    const deleteOperation = await connection("category")
        .where("category_id", id).delete();

    return deleteOperation;
}


