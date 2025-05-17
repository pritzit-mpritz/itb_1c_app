import {createBrowserRouter} from "react-router";
import App from "../App.tsx";
import FilmPage from "../pages/view/FilmPage.tsx";
import ActorPage from "../pages/view/ActorPage.tsx";
import NotFoundPage from "../pages/view/NotFoundPage.tsx";

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