// src/pages/FilmFormPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Film } from "../types/types";
import { getFilmById, createFilm, updateFilm } from "../services/FilmService";
import { TextField, Button, Paper, Box } from "@mui/material";

const defaultFilm: Film = {
    title: "",
    description: "",
    release_year: new Date().getFullYear(),
    rental_duration: 0,
    rental_rate: 0,
    length: 0,
    replacement_cost: 0,
    rating: "",
    special_features: ""
};

const FilmFormPage = () => {
    const { film_id } = useParams<{ film_id?: string }>();
    const navigate = useNavigate();
    const [film, setFilm] = useState<Film>(defaultFilm);

    useEffect(() => {
        if (film_id && film_id !== "new") {
            getFilmById(Number(film_id)).then((data) => {
                if (data) setFilm(data);
            });
        }
    }, [film_id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilm({ ...film, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (film_id && film_id !== "new") {
            await updateFilm(Number(film_id), film);
        } else {
            await createFilm(film);
        }
        navigate("/film");
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 500, margin: "0 auto" }}>
            <h2>{film_id === "new" ? "Neuen Film anlegen" : "Film bearbeiten"}</h2>
            <Box component="form" onSubmit={handleSubmit} autoComplete="off" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField label="Titel" name="title" value={film.title} onChange={handleChange} required />
                <TextField label="Beschreibung" name="description" value={film.description} onChange={handleChange} required />
                <TextField label="Erscheinungsjahr" name="release_year" type="number" value={film.release_year} onChange={handleChange} required />
                <TextField label="Ausleihdauer" name="rental_duration" type="number" value={film.rental_duration} onChange={handleChange} required />
                <TextField label="Ausleihpreis" name="rental_rate" type="number" value={film.rental_rate} onChange={handleChange} required />
                <TextField label="Länge" name="length" type="number" value={film.length} onChange={handleChange} required />
                <TextField label="Ersatzkosten" name="replacement_cost" type="number" value={film.replacement_cost} onChange={handleChange} required />
                <TextField label="Bewertung" name="rating" value={film.rating} onChange={handleChange} required />
                <TextField label="Extras" name="special_features" value={film.special_features} onChange={handleChange} required />
                <Button type="submit" variant="contained">{film_id === "new" ? "Anlegen" : "Speichern"}</Button>
            </Box>
        </Paper>
    );
};

export default FilmFormPage;
