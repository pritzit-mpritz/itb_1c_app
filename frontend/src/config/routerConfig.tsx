import {createBrowserRouter} from "react-router";
import App from "../App.tsx";
import FilmPage from "../pages/FilmPage.tsx";
import ActorPage from "../pages/ActorPage.tsx";
import NotFoundPage from "../pages/NotFoundPage.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                index: true,
                element: <h1>Index</h1>
            },
            {
                path: "film",
                element: <FilmPage />
            },
            {
                path: "actor",
                element: <ActorPage />
            },
            {
                path: "*",
                element: <NotFoundPage />
            }
        ]
    },
]);