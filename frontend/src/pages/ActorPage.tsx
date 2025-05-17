// src/pages/ActorPage.tsx
import React, { useEffect } from 'react';
import { getAllActors } from "../services/ActorService";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from "@mui/material";
import { Actor } from "../types/types";
import { NavLink, useNavigate } from "react-router";

const ActorPage = () => {
    const [actors, setActors] = React.useState<Actor[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getActors();
    }, []);

    async function getActors() {
        const tempActors = await getAllActors();
        setActors(tempActors);
    }

    return (
        <div>
            <h2>Actor Page</h2>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/actor/new")}
                style={{ marginBottom: 16 }}
            >
                Neuen Schauspieler anlegen
            </Button>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Vorname</TableCell>
                            <TableCell>Nachname</TableCell>
                            <TableCell>Aktionen</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {actors.length > 0 ? (
                            actors.map((row) => (
                                <TableRow
                                    key={row.actor_id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>{row.actor_id}</TableCell>
                                    <TableCell>{row.first_name}</TableCell>
                                    <TableCell>{row.last_name}</TableCell>
                                    <TableCell align="right">
                                        <NavLink to={`/actor/${row.actor_id}`}>Details</NavLink>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4}>Keine Schauspieler vorhanden</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default ActorPage;
