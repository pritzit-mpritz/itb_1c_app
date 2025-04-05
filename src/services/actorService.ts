import {db} from "../db";

/**
 * Get all actors from the database
 * @param firstNameFilter Optional filter for the first name of the actor
 */
export async function getAllActors(firstNameFilter?: string) {
    const connection = db();
    // const actors = await connection.select("*").from("actor")
    //     .whereLike("first_name", `%${firstNameFilter}%`);

    const actors = await connection
        .select("*")
        .from("actor")
        .whereLike("first_name", `${firstNameFilter}%`)

    console.log("Selected actors: ", actors);

    return actors;
}

export async function getActorById(id: number) {
    const connection = db();
    const actor = await connection.select("*")
        .from("actor")
        .where("actor_id", id)
        .first();

    console.log("Selected actor: ", actor);

    return actor;
}

/**
 * Adds an actor-film relation
 * @param actorId the actor to add to a film
 * @param filmId the film the actor is added to
 */
export async function addActorToFilm(actorId: number, filmId: number) {
    const connection = db();
    const insertOperation = await connection("film_actor")
        .insert({
            actor_id: actorId,
            film_id: filmId
        });

    console.log("Inserted actor to film: ", insertOperation);

    return insertOperation;
}