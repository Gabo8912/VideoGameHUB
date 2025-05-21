import {Link, useNavigate} from 'react-router-dom';
import {useState} from 'react';

export default function NavBar() {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    function handleSearch(event: React.FormEvent){
        event.preventDefault();
        navigate('/search?query=' + query);
    }


    return (
        <nav className="flex gap-4 p-4 bg-[rgba(30,83,110,0.7)] text-white items-end mb-4 border">
            <Link to="/">Video Game HUB 🎮</Link>
            <Link to="/search">Search</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/dashboard">Dashboard</Link>
            <form onSubmit={handleSearch} className="flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search VideoGame..."
                    className="bg-gray-500 px-2 py-1 rounded"
                />
                <button type="submit"
                        className="bg-blue-50 px-2 py-1 rounded">
                    🔍
                </button>
            </form>
        </nav>
    )
}