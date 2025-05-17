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

export interface Actor {
    actor_id: number,
    first_name: string,
    last_name: string,
    films?: Film[]
}