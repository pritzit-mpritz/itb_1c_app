import React, { useEffect, useState } from "react";
import { getAllFilms } from "../../api/FilmService";
import { Film } from "../../interfaces/film";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";

const FilmList: React.FC = () => {
    const [films, setFilms] = useState<Film[]>([]);

    useEffect(() => {
        getAllFilms().then(setFilms);
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Titel</TableCell>
                        <TableCell>Jahr</TableCell>
                        <TableCell>Aktionen</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {films.map((film) => (
                        <TableRow key={film.film_id}>
                            <TableCell>{film.title}</TableCell>
                            <TableCell>{film.release_year}</TableCell>
                            <TableCell>
                                {/* Später: <Button onClick={...}>Bearbeiten</Button> */}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default FilmList;