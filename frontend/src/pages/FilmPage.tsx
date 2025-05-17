import React, { useEffect } from 'react';
import { getAllFilms } from "../services/FilmService";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Film } from "../types/types";
import { NavLink } from "react-router";

const FilmPage = () => {
    const [films, setFilms] = React.useState<Film[]>([]);

    useEffect(() => {
        getFilms();
    }, []);

    async function getFilms() {
        const tempFilms = await getAllFilms();
        setFilms(tempFilms);
    }

    return (
        <div>
            <h2>Film Page</h2>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                        {films.length > 0 ? (
                            films.map((row) => (
                                <TableRow
                                    key={row.film_id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">{row.film_id}</TableCell>
                                    <TableCell>{row.title}</TableCell>
                                    <TableCell>{row.rental_rate}</TableCell>
                                    <TableCell>{row.rental_duration}</TableCell>
                                    <TableCell align="right">
                                        <NavLink to={`/film/${row.film_id}`}>Details</NavLink>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5}>Keine Filme vorhanden</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default FilmPage;
