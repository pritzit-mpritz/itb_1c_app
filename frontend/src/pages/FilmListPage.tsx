// src/pages/FilmListPage.tsx

import React, { useEffect, useState } from "react";
import { getAllFilms } from "../services/FilmService";
import { Film } from "../types/types";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Stack, Typography
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";

/**
 * FilmListPage – Zeigt eine übersichtliche Liste aller Filme mit Aktionen (Details, Bearbeiten).
 * REST-konform, mit Fehlerbehandlung, Navigationsbutton und sauberem Layout.
 */
const FilmListPage: React.FC = () => {
    const [films, setFilms] = useState<Film[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadFilms();
    }, []);

    /**
     * Holt alle Filme aus dem Backend.
     */
    async function loadFilms() {
        try {
            const data = await getAllFilms();
            setFilms(data);
            setError(null);
        } catch (err: any) {
            setError("Filme konnten nicht geladen werden.");
            setFilms([]);
        }
    }

    return (
        <div>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4">Filme verwalten</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/film/new")}
                >
                    Neuen Film anlegen
                </Button>
            </Stack>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Titel</TableCell>
                            <TableCell>Preis</TableCell>
                            <TableCell>Dauer</TableCell>
                            <TableCell>Aktionen</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {error ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" style={{ color: "red" }}>
                                    {error}
                                </TableCell>
                            </TableRow>
                        ) : films.length > 0 ? (
                            films.map((film) => (
                                <TableRow key={film.film_id}>
                                    <TableCell>{film.film_id}</TableCell>
                                    <TableCell>{film.title}</TableCell>
                                    <TableCell>{film.rental_rate}</TableCell>
                                    <TableCell>{film.rental_duration}</TableCell>
                                    <TableCell>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            component={NavLink}
                                            to={`/film/${film.film_id}`}
                                            style={{ marginRight: 8 }}
                                        >
                                            Details
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            component={NavLink}
                                            to={`/film/${film.film_id}/edit`}
                                        >
                                            Bearbeiten
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    Keine Filme vorhanden
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default FilmListPage;