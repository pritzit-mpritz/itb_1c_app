import {db} from "../db";

/**
 * Retrieve a list of all films from database.
 */
export async function getAllFilms() {
    const connection = db();
    const films = await connection.select("*").from("film");

    console.log("Selected films: ", films);

    return films;
}

/**
 * Retrieve a film by ID.
 * @param id filter to find film by ID (via req.params.id).
 */
export async function getFilmById(id: number) {
    const connection = db();
    const film = await connection.select("*").from("film")
        .where("film_id", id)
        .first();

    console.log("Selected film: ", film);

    return film;
}

/**
 * summary: Create a new film. Required values are title, description and language_id.
 * @param body takes in title, description and language_id to create a new film (via req.body).
 */
export async function createFilm(body: string) {
    console.log("Creating film: ", body);

    const connection = db();
    const insertOperation = await connection.insert(body).into("film");

    return insertOperation;
}