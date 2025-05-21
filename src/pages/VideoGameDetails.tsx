import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { VideoGame } from "./Home";

const RAWG_API_KEY = `a38a6c826646475aa18423002833c719`;
const RAWG_API_URL = `https://api.rawg.io/api/games`;

export default function GameDetails() {
    const { id } = useParams<{ id: string }>();
    const [game, setGame] = useState<VideoGame>();

    useEffect(() => {
        if (!id) return;

        // Solicitud a la API usando el ID del videojuego
        axios
            .get<VideoGame>(`${RAWG_API_URL}/${id}?key=${RAWG_API_KEY}`)
            .then((res) => setGame(res.data))
            .catch(console.error);
    }, [id]);

    if (!game) {
        return <p>Cargando detalles del juego…</p>;
    }

    return (
        <div className="p-4 space-y-4">
            <img
                src={game.background_image}
                alt={game.name}
                className="w-full max-w-md mx-auto rounded-lg shadow"
            />
            <div className="bg-gray-600 text-white p-6 rounded-lg mt-4">
            <h1 className="text-3xl font-bold">{game.name}</h1>
            <p className="text-white">
                🎮 Géneros: {game.genres.map((g) => g.name).join(", ")}
            </p>
            <p>⭐ Rating: {game.rating} / 5</p>
            <p>📆 Lanzamiento: {game.released}</p>
            <div className="text-white">
                <h3 className="text-lg font-bold">🗒️ Descripción:</h3>
                <div className="text-left" dangerouslySetInnerHTML={{ __html: game.description }} />
            </div>
            </div>
        </div>
    );
}