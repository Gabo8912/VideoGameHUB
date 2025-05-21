import {Routes, Route} from 'react-router-dom';
import Home from "./pages/Home.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Profile from "./pages/Profile.tsx";
import Search from "./pages/Search.tsx";
import Navbar from "./components/NavBar.tsx";
import GameDetails from "./pages/VideoGameDetails.tsx";

import './App.css'

export default function App(){
    return(
        <div>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/search" element={<Search/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/videoGame/:id" element={<GameDetails />} />
            </Routes>
        </div>
    )
}