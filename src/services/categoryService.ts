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