// src/pages/FilmDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Film } from "../types/types";
import { getFilmById, deleteFilm } from "../services/FilmService";
import JsonView from "@uiw/react-json-view";
import { Button, Paper } from "@mui/material";

const FilmDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [film, setFilm] = useState<Film | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            getFilmById(Number(id)).then(setFilm);
        }
    }, [id]);

    const handleDelete = async () => {
        if (id) {
            await deleteFilm(Number(id));
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
                        onClick={() => navigate(`/film/${id}/edit`)}
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
