import {db} from "../db";





/**
 * Adds an film-category relation
 * @param categoryId the category to add to a film
 * @param filmId the film is added to the actor
 */
export async function addFilmToCategory(categoryId: number, filmId: number) {
    const connection = db();
    const insertOperation = await connection("film_category")
        .insert({
            actor_id: categoryId,
            film_id: filmId
        });

    console.log("Inserted film to category: ", insertOperation);

    return insertOperation;
}