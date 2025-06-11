import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from "../context/AuthContext.tsx";
import { LoginButton } from "./LoginButton.tsx";
import { LogoutButton } from "./LogoutButton.tsx";

export default function NavBar() {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const { user, displayName } = useAuth();

    function handleSearch(event: React.FormEvent) {
        event.preventDefault();
        navigate('/search?query=' + query);
    }

    return (
        <nav className="flex flex-wrap gap-4 p-4 bg-[rgba(30,83,110,0.7)] text-white items-center justify-between mb-4 border">
            {/* Left: Logo & Navigation */}
            <div className="flex gap-4 items-center">
                <Link to="/" className="font-bold text-lg">Video Game HUB 🎮</Link>
                <Link to="/search">Search</Link>
                {user && <Link to="/profile">Profile</Link>}
                {user && <Link to="/dashboard">Dashboard</Link>}
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search VideoGame..."
                        className="bg-gray-500 px-2 py-1 rounded"
                    />
                    <button type="submit" className="bg-blue-50 text-black px-2 py-1 rounded">
                        🔍
                    </button>
                </form>
            </div>

            {/* Right: Navbar actions */}
            <div className="flex gap-4 items-center">
                {/* Welcome user */}
                {user && (
                    <div className="text-sm">
                        Welcome, <Link to="/profile" className="font-semibold underline hover:text-blue-200">{displayName}</Link>
                    </div>
                )}

                {/* Auth buttons */}
                {user ? (
                    <LogoutButton />
                ) : (
                    <LoginButton />
                )}
            </div>
        </nav>
    );
}
