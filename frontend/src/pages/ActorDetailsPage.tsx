// noinspection JSUnusedLocalSymbols

// @ts-ignore
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getActorById } from '../service/ActorService';
import { Actor } from '../types/types';
import {
    Typography,
    TableContainer,
    Paper,
    Table,
    TableBody,
    TableRow,
    TableCell
} from '@mui/material';

const ActorDetailsPage = () => {
    const { id } = useParams();
    const [actor, setActor] = useState<Actor | null>(null);
    console.log("Param actorId:", id);

    useEffect(() => {
        if (id) {
            getActorById(id).then((data) => {
                if (data) {
                    setActor(data);
                }
            });
        }
    }, [id]);

    if (!actor) {
        return <div>Schauspieler wird geladen...</div>;
    }

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                Details zu Schauspieler #{actor.actor_id}
            </Typography>

            <TableContainer component={Paper} sx={{ maxWidth: 500 }}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell>{actor.actor_id}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><strong>Vorname</strong></TableCell>
                            <TableCell>{actor.first_name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><strong>Nachname</strong></TableCell>
                            <TableCell>{actor.last_name}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default ActorDetailsPage;