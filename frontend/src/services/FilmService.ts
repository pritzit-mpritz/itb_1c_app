// src/services/FilmService.ts
import { Film } from "../types/types";

const baseUrl = "http://localhost:3000/film";

export async function getAllFilms(): Promise<Film[]> {
    try {
        const response = await fetch(baseUrl);
        if (!response.ok) throw new Error("Fehler beim Laden der Filme");
        const data = await response.json();
        return data.data as Film[];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getFilmById(id: number): Promise<Film | null> {
    try {
        console.log("Fetching film with id", id);
        const response = await fetch(`${baseUrl}/${id}`);
        if (!response.ok) throw new Error("Film nicht gefunden");
        const data = await response.json();
        return data.data as Film;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function createFilm(film: Film): Promise<void> {
    await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(film),
    });
}

export async function updateFilm(id: number, film: Film): Promise<void> {
    await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(film),
    });
}

export async function deleteFilm(id: number): Promise<void> {
    await fetch(`${baseUrl}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });
}
