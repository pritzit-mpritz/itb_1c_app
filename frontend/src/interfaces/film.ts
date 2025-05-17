export interface Film {
    film_id: number;
    title: string;
    release_year?: number;
    // weitere Felder möglich

}
export interface Film {
    film_id?: number;      // Optional (wird bei neuen Filmen erst von der DB vergeben)
    title: string;
    description?: string;
    release_year?: string;
    rental_duration?: string;
    rental_rate?: string;
    length?: string;
    rating?: string;
    replacement_cost?: string;
    special_features?: string;
}