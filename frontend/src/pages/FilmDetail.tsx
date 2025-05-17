// noinspection JSUnusedLocalSymbols

//import React from 'react';
import {useParams} from "react-router";
import JsonView from "@uiw/react-json-view";

const FilmDetailsPage = () => {

    const params = useParams();

    return (
        <div>
            Film Details
            <JsonView value={params} />
        </div>
    );
};

export default FilmDetailsPage;