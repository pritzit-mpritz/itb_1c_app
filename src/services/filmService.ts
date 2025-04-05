import {db} from "../db";

/**
 * Get all films from the database
 * @param titleFilter Optional filter for the film title
 */
export async function getAllFilms(titleFilter?: string) {
    const connection = db();

    const films = await connection
        .select("*")
        .from("film")
        .whereLike("title", `${titleFilter}%`);

    console.log("Selected films: ", films);

    return films;
}

export async function getFilmById(id: number) {
    const connection = db();
    const film = await connection.select("*")
        .from("film")
        .where("film_id", id)
        .first();

    console.log("Selected film: ", film);

    return film;
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
