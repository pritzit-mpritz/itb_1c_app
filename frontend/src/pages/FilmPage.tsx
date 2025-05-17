import React from "react";
import {getAllFilms} from "../service/FilmService.ts";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

const FilmPage = () => {
    const [films, setFilms] = React.useState<any[]>([]); // Liste von Filme, am Anfang leer
    React.useEffect(() => {
        console.log("Film Page geladen"); // wenn Seite lädt
        getAllFilms().then((data) => {
            console.log("Filme vom Server:", data); // kontrol
            setFilms(data); // speichert Filme in State
        });

    }, []);


    return (
        // Tabelle mit Film-Daten Kopfzeile
        <div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Titel</TableCell>
                            <TableCell>Beschreibung</TableCell>
                            <TableCell>Actors</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {films.map((film) => (
                            <TableRow key={film.film_id}>
                                <TableCell>{film.film_id}</TableCell>
                                <TableCell>{film.title}</TableCell>
                                <TableCell>{film.description}</TableCell>
                                <TableCell>
                                    {film.actors?.map((a: any) => a.first_name + " " + a.last_name).join(", ")}
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>// Tabelle fertig
    );
};

export default FilmPage;
