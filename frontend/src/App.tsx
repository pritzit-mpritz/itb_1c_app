import { Outlet } from 'react-router';
import './App.css'
import ApplicationBar from "./components/layout/ApplicationBar.tsx";

function App() {
  return (
    <>
        <ApplicationBar />
        <Outlet />
    </>
  )
}

export default App
