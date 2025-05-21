import { Link } from "react-router-dom";

interface VideoGameProps{
    id:number;
    title:string;
    image:string;
    rating:number;
    released: string;
    genre: string;
}

export default function VideoGameCard({id,title,image,rating,released,genre}:VideoGameProps){
    return(
        <div className="p-4 bg-cyan-700 text-white rounded-lg border">
            <Link to={`/videoGame/${id}`}>
            <img src={image} alt={title} className="w-full rounded"/>
            <h3 className="text-xl font-bold">🎮{title}</h3>
            <p>⭐ {rating}</p>
            <p>📆 {released}</p>
            <p>🕹️ {genre}</p>
            </Link>
        </div>
    )

}