import {db} from "../db";

/**
 * Get all categories from the database
 * @param nameFilter Optional filter for the name of the category
 */

export async function getAllCategories(nameFilter?: string) : Promise<any[]> {
    const connection = db();
    // const actors = await connection.select("*").from("actor")
    //     .whereLike("first_name", `%${firstNameFilter}%`);

    const category:any[] = await connection
        .select("*")
        .from("category")
        .whereLike("name", `${nameFilter}%`)

    console.log("Selected categories: ", category);

    return category;
}