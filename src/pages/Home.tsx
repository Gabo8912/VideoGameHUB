import { useEffect, useState } from "react";
import axios from "axios";
import VideoGameCard from "../components/VideoGameCard.tsx";

const TMB_API_KEY = 'a38a6c826646475aa18423002833c719';
const TMB_API_URL = `https://api.rawg.io/api/games?key=${TMB_API_KEY}`;

interface Genre {
    id: number;
    name: string;
    slug: string;
}

export interface VideoGame {
    id: number;
    name: string;
    background_image: string;
    rating: number;
    released: string;
    genres: Genre[];
    description: string;

}

export default function Home() {
    const [videoGames, setVideoGames] = useState<VideoGame[]>([]);

    useEffect(() => {
        axios.get(TMB_API_URL).then(response => {
            setVideoGames(response.data.results);
        });
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videoGames.map(videoGame => (
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