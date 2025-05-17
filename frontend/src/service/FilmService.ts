const baseUrl = "http://localhost:3000/film";

// Types (optional, falls du sie brauchst)
export type FilmRating = "G" | "PG" | "PG-13" | "R" | "NC-17";

export interface Film {
    id: string;
    title: string;
    description: string;
    release_year: string;
    rental_duration: string;
    rental_rate: string;
    length: string;
    replacement_cost: string;
    rating: FilmRating | "";
    special_features: string;
}

export async function getAllFilms(): Promise<Film[] | undefined> {
    console.log("Start getAllFilms");

    const response = await fetch(baseUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });

    if (!response.ok) {
        console.error("Error while fetching films:", response.status);
        return undefined;
    }

    const result = await response.json();
    return result;
}

export async function getFilmById(id: string): Promise<Film | undefined> {
    console.log(`Start getFilmById: ${id}`);

    const response = await fetch(`${baseUrl}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });

    if (!response.ok) {
        console.error(`Error while fetching film with id ${id}:`, response.status);
        return undefined;
    }

    const result = await response.json();
    console.log("Successfully getFilmById", result);

    return result;
}

export async function createFilm(film: Film): Promise<Film | undefined> {
    console.log("Start createFilm");

    const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(film),
    });

    if (!response.ok) {
        console.error("Error while creating film:", response.status);
        return undefined;
    }

    const result = await response.json();
    return result;
}

export async function updateFilm(id: string, film: Partial<Film>): Promise<Film | undefined> {
    console.log(`Start updateFilm: ${id}`);

    const response = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(film),
    });

    if (!response.ok) {
        console.error(`Error while updating film with id ${id}:`, response.status);
        return undefined;
    }

    const result = await response.json();
    console.log("Successfully updateFilm", result);
    return result;
}

export async function deleteFilm(id: string): Promise<boolean> {
    console.log(`Start deleteFilm: ${id}`);

    const response = await fetch(`${baseUrl}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    });

    if (!response.ok) {
        console.error(`Error while deleting film with id ${id}:`, response.status);
        return false;
    }

    return true;
}
