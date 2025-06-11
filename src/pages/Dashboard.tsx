import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.tsx";
import { db } from "../services/api";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import VideoGameCard from "../components/VideoGameCard.tsx";

const TMB_API_KEY = 'a38a6c826646475aa18423002833c719';

interface UserGameRecord {
    id: string; // ID del documento en Firestore
    gameId: number; // ID del juego de RAWG
    status: "played" | "queued" | "wishlist";
}

interface VideoGame {
    id: number;
    name: string;
    background_image: string;
    rating: number;
    released: string;
    genres: { name: string }[];
}

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const [userGames, setUserGames] = useState<UserGameRecord[]>([]);
    const [gameDetails, setGameDetails] = useState<Record<number, VideoGame>>({});

    // Traer userGames del usuario desde Firestore
    useEffect(() => {
        if (!user) return;
        (async () => {
            const ref = collection(db, "userGames");
            const q = query(ref, where("userId", "==", user.uid));
            const snap = await getDocs(q);
            setUserGames(snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<UserGameRecord, 'id'>) })));
        })();
    }, [user]);

    // Traer detalles de cada juego desde RAWG
    useEffect(() => {
        const missing = userGames
            .map(r => r.gameId)
            .filter(id => !gameDetails[id]);
        if (!missing.length) return;
        (async () => {
            const calls = missing.map(id =>
                axios
                    .get<VideoGame>(`https://api.rawg.io/api/games/${id}?key=${TMB_API_KEY}`)
                    .then(r => ({ id, data: r.data }))
            );
            const results = await Promise.all(calls);
            setGameDetails(prev => {
                const nxt = { ...prev };
                results.forEach(({ id, data }) => (nxt[id] = data));
                return nxt;
            });
        })();
    }, [userGames, gameDetails]);

    // Eliminar un juego del dashboard (Firestore)
    const handleDelete = async (recordId: string) => {
        await deleteDoc(doc(db, "userGames", recordId));
        setUserGames(prev => prev.filter(r => r.id !== recordId));
    };

    // Agrupar juegos por status y emparejar con su registro de Firestore
    const groupedByStatus = (status: UserGameRecord["status"]) =>
        userGames
            .filter(r => r.status === status && gameDetails[r.gameId])
            .map(r => ({
                firestoreId: r.id, // Para eliminar
                game: gameDetails[r.gameId]
            }));

    const played = groupedByStatus("played");
    const queued = groupedByStatus("queued");
    const wishlist = groupedByStatus("wishlist");

    if (!user) return <p>Por favor inicia sesión.</p>;

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-2xl font-bold">Hola, {user.email}</h1>

            <Section title="Played Games" games={played} onDelete={handleDelete} />
            <Section title="Queued Games" games={queued} onDelete={handleDelete} />
            <Section title="Wishlist Games" games={wishlist} onDelete={handleDelete} />
        </div>
    );
}

// Componente reutilizable para cada sección
function Section({
                     title,
                     games,
                     onDelete
                 }: {
    title: string;
    games: { firestoreId: string; game: VideoGame }[];
    onDelete: (id: string) => void;
}) {
    if (games.length === 0) return null;

    return (
        <section>
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {games.map(({ firestoreId, game }) => (
                    <div key={firestoreId} className="relative">
                        <VideoGameCard
                            id={game.id}
                            title={game.name}
                            image={game.background_image}
                            rating={game.rating}
                            released={game.released}
                            genre={game.genres.map(g => g.name).join(", ")}
                        />
                        <button
                            onClick={() => onDelete(firestoreId)}
                            className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded shadow"
                        >
                            Eliminar
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}
