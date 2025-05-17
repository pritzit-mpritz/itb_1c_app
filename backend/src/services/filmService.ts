import {db} from "../db";
import {Actor} from "./actorService";

export interface Film {
    film_id?: number,
    title: string,
    description: string,
    release_year: number,
    rental_duration: number,
    rental_rate: number,
    length: number,
    replacement_cost: number,
    rating: string,
    special_features: string,
    actors?: Actor[]
}

export async function getAllFilms(titleFilter?: string) {
    const connection = db();

    const query = connection
        .select([
            'film.*',
            'actor.*',
        ])
        .from('film')
        .leftJoin('film_actor', 'film.film_id', 'film_actor.film_id')
        .leftJoin('actor', 'film_actor.actor_id', 'actor.actor_id')
        .orderBy("film.film_id")

    if (titleFilter) {
        query.whereLike("film.title", `${titleFilter}%`);
    }

    let films = await query;
    films = getFilmObjects(films);


    console.log("Selected films: ", films);
    return films;
}


function getFilmObjects(films: any[]): Film[] {
    const filmMap: Map<number, Film> = new Map();
    films.forEach(film => {
        let parsedFilm: Film;
        if (filmMap.has(film.film_id)) {
            parsedFilm = filmMap.get(film.film_id) as Film;
        } else {
            parsedFilm = {
                film_id: film.film_id,
                description: film.description,
                length: film.length,
                rating: film.rating,
                release_year: film.release_year,
                rental_duration: film.rental_duration,
                rental_rate: film.rental_rate,
                replacement_cost: film.replacement_cost,
                special_features: film.special_features,
                title: film.title,
                actors: []
            };
            filmMap.set(film.film_id, parsedFilm);
        }

        if (film.film_id) {
            const actor: Actor = {
                actor_id: film.actor_id,
                first_name: film.first_name,
                last_name: film.last_name
            }
            parsedFilm.actors?.push(actor)
        }
    });

    return Array.from(filmMap.values());
}

export async function getFilmById(id: number) {
    const connection = db();

    const film = await connection
        .select("film.*")
        .from("film")
        .where("film.film_id", id)
        .leftJoin('film_actor', 'film.film_id', 'film_actor.film_id')
        .leftJoin('actor', 'film_actor.actor_id', 'actor.actor_id')
        .first();

    if (film) {
        // Zugehörige Schauspieler laden
        film.actors = await connection
            .select("actor.*")
            .from("actor")
            .join("film_actor", "actor.actor_id", "film_actor.actor_id")
            .where("film_actor.film_id", id);
    }

    console.log("Selected film with actors: ", film);
    return film;
}


export async function createFilm(filmData: any): Promise<number> {
    const connection = db();
    const result = await connection("film")
        .insert(filmData);
    console.log("Created film with result:", result);
    return result[0];
}

export async function deleteFilm(id: number): Promise<number> {
    const connection = db();
    return connection("film")
        .where("film_id", id)
        .delete();
}

export async function updateFilm(id: string, data: any): Promise<number> {
    const connection = db();

    // Prüfen, ob der Film existiert
    const film = await connection("film")
        .select("*")
        .where("film_id", id)
        .first();

    if (!film) {
        throw new Error("Film nicht gefunden");
    }

    // Film aktualisieren
    return connection("film")
        .update({
            title: data.title,
            description: data.description,
            release_year: data.release_year,
            language_id: data.language_id,
            original_language_id: data.original_language_id,
            rental_duration: data.rental_duration,
            rental_rate: data.rental_rate,
            length: data.length,
            replacement_cost: data.replacement_cost,
            rating: data.rating,
            special_features: data.special_features
        })
        .where("film_id", id);
}

export async function addActorToFilm(filmId: number, actorId: number) {
    const connection = db();
    const insertOperation = await connection("film_actor")
        .insert({
            film_id: filmId,
            actor_id: actorId
        });

    console.log("Linked actor and film: ", insertOperation);

    return insertOperation;
}

export async function deleteFilmActor(filmId: number, actorId: number): Promise<number> {
    const connection = db();

    return connection("film_actor")
        .where({film_id: filmId, actor_id: actorId})
        .delete();
}