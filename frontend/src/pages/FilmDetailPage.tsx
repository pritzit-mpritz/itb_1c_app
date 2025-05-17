// noinspection JSUnusedLocalSymbols

import {useParams} from "react-router";
import JsonView from "@uiw/react-json-view";

const FilmDetailPage = () => {

    const params = useParams();

    return (
        <div>
            Film Details
            <JsonView value={params} />
        </div>
    );
};

export default FilmDetailPage;