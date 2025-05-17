
import { Outlet } from 'react-router';
import './App.css'
import ApplicationBar from "./components/layout/ApplicationBar.tsx";
import {useEffect} from "react";

function App() {
    useEffect(() => {
        console.log("App mounted")
    }, [])

    return (
    <>
        <ApplicationBar />
        <div style={{padding: "2em"}}>
        <Outlet />
        </div>
    </>
  )
}
import FilmPage from "./pages/FilmPage";

// Dann in den Routes:
<Route path="/film" element={<FilmPage />} />
export default App
