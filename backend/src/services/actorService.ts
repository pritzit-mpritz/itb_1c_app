import {db} from "../db";
import {Film} from "./filmService";

export interface Actor {
    actor_id: number,
    first_name: string,
    last_name: string,
    films?: Film[]
}

export async function getAllActors(nameFilter?: string) {
    const connection = db();

    const query = connection
        .select([
            'actor.*',
            'film.*'
        ])
        .from('actor')
        .leftJoin('film_actor', 'actor.actor_id', 'film_actor.actor_id')
        .leftJoin('film', 'film_actor.film_id', 'film.film_id');

    if (nameFilter) {
        query.whereLike("actor.first_name", `${nameFilter}%`)
            .orWhereLike("actor.last_name", `${nameFilter}%`);
    }

    let actors = await query;
    actors = getActorObjects(actors);

    console.log("Selected actors: ", actors);
    return actors;
}

function getActorObjects (actors: any[]): Actor[] {
    const actorMap: Map<number, Actor> = new Map();
    actors.forEach(actor => {
        let parsedActor: Actor;
        if (actorMap.has(actor.actor_id)) {
            parsedActor = actorMap.get(actor.actor_id) as Actor;
        } else {
            parsedActor = {
                actor_id: actor.actor_id,
                first_name: actor.first_name,
                last_name: actor.last_name,
                films: []
            };
            actorMap.set(actor.actor_id, parsedActor);
        }

        if (actor.film_id) {
            const film: Film = {
                title: actor.title,
                description: actor.description,
                release_year: actor.release_year,
                rental_duration: actor.rental_duration,
                rental_rate: actor.rental_rate,
                length: actor.length,
                replacement_cost: actor.replacement_cost,
                rating: actor.rating,
                special_features: actor.special_features,
            }
            parsedActor.films?.push(film)
        }
    });

    return Array.from(actorMap.values());
}


export async function getActorById(id: number): Promise<Actor> {
    const connection = db();

    // Schauspieler laden
    const actor = await connection
        .select("actor.*")
        .from("actor")
        .where("actor.actor_id", id)
        .first();

    if (actor) {
        // Zugehörige Filme laden
        actor.films = await connection
            .select("film.*")
            .from("film")
            .join("film_actor", "film.film_id", "film_actor.film_id")
            .where("film_actor.actor_id", id);
    }

    console.log("Selected actor with films: ", actor);
    return actor;
}


export async function createActor(actorData: any): Promise<number> {
    const connection = db();
    const result = await connection("actor")
        .insert({
            first_name: actorData.first_name,
            last_name: actorData.last_name
        });
    console.log("Created actor with result:", result);
    return result[0];
}

export async function deleteActor(id: number): Promise<number> {
    const connection = db();
    return connection("actor")
        .where("actor_id", id)
        .delete();
}

export async function updateActor(id: string, data: any): Promise<number> {
    const connection = db();

    // Prüfen, ob der Schauspieler existiert
    const actor = await connection("actor")
        .select("*")
        .where("actor_id", id)
        .first();

    if (!actor) {
        throw new Error("Schauspieler nicht gefunden");
    }

    // Schauspieler aktualisieren
    return connection("actor")
        .update({
            first_name: data.first_name,
            last_name: data.last_name
        })
        .where("actor_id", id);
}