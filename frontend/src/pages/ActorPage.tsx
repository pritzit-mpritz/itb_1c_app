// noinspection JSUnusedLocalSymbols

import React, {useEffect} from 'react';
import {getAllActors} from "../service/ActorService.ts";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {Actor} from "../types/types.ts";
import {NavLink} from "react-router";

const ActorPage = () => {
    const [actors, setActors] = React.useState<Actor[] | undefined>();

    useEffect(() => {
        getActors();
    }, [])

    async function getActors() {
        const tempActors = await getAllActors();
        console.log("Got actors from server: ", tempActors);
        setActors(tempActors);
        console.log("Ending GetActors")
    }


    return (
        <div>
            Actor Page
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Vorname</TableCell>
                            <TableCell>Nachname</TableCell>
                            <TableCell>Aktionen</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {actors ? (
                                actors.map((row) => (
                                    <TableRow
                                        key={row.actor_id}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        <TableCell component="th" scope="row">{row.actor_id}</TableCell>
                                        <TableCell component="th" scope="row">{row.first_name}</TableCell>
                                        <TableCell>{row.last_name}</TableCell>
                                        <TableCell><NavLink to={"/actor/"+row.actor_id}>Details</NavLink></TableCell>
                                    </TableRow>
                                ))
                            )
                            : <TableRow>
                                <TableCell>Keine Schauspieler vorhanden</TableCell>
                            </TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default ActorPage;