import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { VideoGame } from "./Home";
import { AuthContext } from "../context/AuthContext.tsx";
import ReviewForm from "../components/ReviewForm.tsx";
import { db } from "../services/api";
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";

const RAWG_API_KEY = `a38a6c826646475aa18423002833c719`;
const RAWG_API_URL = `https://api.rawg.io/api/games`;

interface Review {
    review: string;
    userName: string;
}

type GameStatus = "played" | "queued" | "wishlist";

export default function GameDetails() {
    const { id } = useParams<{ id: string }>();
    const [game, setGame] = useState<VideoGame>();
    const [reviews, setReviews] = useState<Review[]>([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (!id) return;

        axios
            .get<VideoGame>(`${RAWG_API_URL}/${id}?key=${RAWG_API_KEY}`)
            .then((res) => setGame(res.data))
            .catch(console.error);
    }, [id]);

    useEffect(() => {
        if (!id) return;

        const fetchReviews = async () => {
            const reviewsRef = collection(db, "reviews");
            const q = query(reviewsRef, where("videoGameID", "==", Number(id)));
            const snapshot = await getDocs(q);
            setReviews(snapshot.docs.map((doc) => doc.data() as Review));
        };

        fetchReviews();
    }, [id]);

    // Función para guardar el status del juego
    const handleSaveStatus = async (status: GameStatus) => {
        if (!user || !game) return;

        try {
            await addDoc(collection(db, "userGames"), {
                userId: user.uid,
                gameId: game.id,
                status,
                gameName: game.name,
                backgroundImage: game.background_image,
                createdAt: serverTimestamp(),
            });
            alert(`Juego marcado como '${status}' exitosamente.`);
        } catch (err) {
            console.error("Error guardando el juego:", err);
            alert("Hubo un error al guardar el juego. Intenta de nuevo.");
        }
    };

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
                    <div
                        className="text-left"
                        dangerouslySetInnerHTML={{ __html: game.description }}
                    />
                </div>

                {/* Botones para guardar estados */}
                {user && (
                    <div className="flex space-x-2 mt-4">
                        <button
                            onClick={() => handleSaveStatus("played")}
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded"
                        >
                            Mark as Played
                        </button>
                        <button
                            onClick={() => handleSaveStatus("queued")}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded"
                        >
                            Add to Queue
                        </button>
                        <button
                            onClick={() => handleSaveStatus("wishlist")}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
                        >
                            Add to Wishlist
                        </button>
                    </div>
                )}

                {/* Formulario de review si está logueado */}
                {user && <ReviewForm videoGameID={game.id} />}

                {/* Muestra de reviews */}
                {reviews.length > 0 && (
                    <div className="p-4">
                        <h1>Reviews</h1>
                        {reviews.map((r, index) => (
                            <p style={{ textAlign: "right" }} key={index}>
                                <strong>{r.review}</strong>
                                <br />by: {r.userName}
                            </p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
