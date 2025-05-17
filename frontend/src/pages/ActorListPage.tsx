// src/pages/ActorListPage.tsx
import React, { useEffect, useState } from "react";
import { getAllActors } from "../services/ActorService";
import { Actor } from "../types/types";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import { NavLink, useNavigate } from "react-router";

const ActorListPage = () => {
    const [actors, setActors] = useState<Actor[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getAllActors().then(setActors);
    }, []);

    return (
        <div>
            <h2>Schauspieler verwalten</h2>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/actor/new")}
                style={{ marginBottom: 16 }}
            >
                Neuen Schauspieler anlegen
            </Button>
            <TableContainer component={Paper}>
                <Table>
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
                            actors.map((actor) => (
                                <TableRow key={actor.actor_id}>
                                    <TableCell>{actor.actor_id}</TableCell>
                                    <TableCell>{actor.first_name}</TableCell>
                                    <TableCell>{actor.last_name}</TableCell>
                                    <TableCell>
                                        <NavLink to={`/actor/${actor.actor_id}`}>Details</NavLink> |{" "}
                                        <NavLink to={`/actor/${actor.actor_id}/edit`}>Bearbeiten</NavLink>
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

export default ActorListPage;
