// src/pages/FilmDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Film } from "../types/types";
import { getFilmById, deleteFilm } from "../services/FilmService";
import JsonView from "@uiw/react-json-view";
import { Button, Paper } from "@mui/material";

const FilmDetailPage = () => {
    const { film_id } = useParams<{ film_id: string }>();
    const [film, setFilm] = useState<Film | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (film_id) {
            getFilmById(Number(film_id)).then(setFilm);
        }
    }, [film_id]);

    const handleDelete = async () => {
        if (film_id) {
            await deleteFilm(Number(film_id));
            navigate("/film");
        }
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 800, margin: "0 auto" }}>
            <h2>Filmdetails</h2>
            {film ? (
                <>
                    <JsonView value={film} />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/film/${film_id}/edit`)}
                        sx={{ mt: 2, mr: 2 }}
                    >
                        Bearbeiten
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        sx={{ mt: 2 }}
                    >
                        Löschen
                    </Button>
                </>
            ) : (
                "Lade Daten..."
            )}
        </Paper>
    );
};

export default FilmDetailPage;
