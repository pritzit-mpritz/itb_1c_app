// src/api/FilmService.ts
import axios from "axios";
import { Film } from "../interfaces/film";

// Hole alle Filme
export async function getAllFilms(): Promise<Film[]> {
    const res = await axios.get("http://localhost:3000/film");
    return res.data;
}

// Hole einen Film per ID
export async function getFilmById(id: string): Promise<Film> {
    const res = await axios.get(`http://localhost:3000/film/${id}`);
    return res.data;
}

// Erstelle einen neuen Film
export async function createFilm(film: Film) {
    return axios.post("http://localhost:3000/film", film);
}

// Aktualisiere einen Film
export async function updateFilm(id: string, film: Film) {
    return axios.put(`http://localhost:3000/film/${id}`, film);
}

// Lösche einen Film
export async function deleteFilm(id: string) {
    return axios.delete(`http://localhost:3000/film/${id}`);
}

// ... (oben bleibt gleich)
/**
 * Liefert alle Filme als Array zurück.
 */
export async function getAllFilms(): Promise<Film[]> {
    const res = await axios.get("http://localhost:3000/film");
    return res.data;
