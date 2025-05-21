import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from "axios";
import VideoGameCard from "../components/VideoGameCard.tsx";
import type { VideoGame } from "./Home";

const TMB_API_KEY = 'a38a6c826646475aa18423002833c719';
const TMB_API_URL = 'https://api.rawg.io/api/games';

export default function Search() {
    const location = useLocation();
    const [videoGames, setVideoGames] = useState<VideoGame[]>([]);

    const query = new URLSearchParams(location.search).get('query');

    useEffect(() => {
        if (query) {
            axios.get(`${TMB_API_URL}?key=${TMB_API_KEY}&search=${query}`)
                .then((res) => setVideoGames(res.data.results));
        }
    }, [query]);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
            {videoGames.map((videoGame) => (
                <VideoGameCard
                    key={videoGame.id}
                    id={videoGame.id}
                    title={videoGame.name}
                    image={videoGame.background_image}
                    rating={videoGame.rating}
                    released={videoGame.released}
                    genre={videoGame.genres.map(g => g.name).join(', ')}
                />
            ))}
        </div>
    );
}