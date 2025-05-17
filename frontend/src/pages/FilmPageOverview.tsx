// noinspection JSUnusedLocalSymbols

import React, {useEffect} from 'react';
import {getAllFilms} from "../service/FilmService.ts";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {Film} from "../types/types.ts";
import {NavLink} from "react-router";

const FilmPage = () => {
    const [films, setFilms] = React.useState<Film[] | undefined>();

    useEffect(() => {
        getFilms();
    }, [])

    async function getFilms() {
        const tempFilms = await getAllFilms();
        console.log("Got films from server: ", tempFilms);
        setFilms(tempFilms);
        console.log("Ending GetFilms")
    }


    return (
        <div>
            Film Page
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
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
                        {films ? (
                                films.map((row) => (
                                    <TableRow
                                        key={row.film_id}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        <TableCell component="th" scope="row">{row.film_id}</TableCell>
                                        <TableCell component="th" scope="row">{row.title}</TableCell>
                                        <TableCell>{row.rental_rate}</TableCell>
                                        <TableCell>{row.rental_duration}</TableCell>
                                        <TableCell align="right"><NavLink to={"/film/"+row.film_id}>Details</NavLink></TableCell>
                                    </TableRow>
                                ))
                            )
                            : <TableRow>
                                <TableCell>Keine Filme vorhanden</TableCell>
                            </TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default FilmPage;