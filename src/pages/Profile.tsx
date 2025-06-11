// src/pages/Profile.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/api';

export default function Profile() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        bio: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data() as {
                    firstName?: string;
                    lastName?: string;
                    email?: string;
                    bio?: string;
                };
                setFormData({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    // si en Firestore no hay email explícito, usamos el de Firebase Auth
                    email: data.email || user.email || '',
                    bio: data.bio || '',
                });
            }
            setLoading(false);
        };
        fetchProfile();
    }, [user]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        try {
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, { ...formData, uid: user.uid }, { merge: true });
            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Failed to update profile:', err);
            alert('Error updating profile');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="text-gray-600">Loading profile…</span>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg border">
            <h1 className="text-2xl font-bold mb-5 text-gray-800">Your Profile</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* First Name */}
                <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">First Name</span>
                    <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        className="
              w-full
              border
              border-blue-500
              bg-blue-50
              text-blue-600
              placeholder-blue-300
              px-3 py-2
              rounded-md
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              transition
            "
                    />
                </label>

                {/* Last Name */}
                <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Last Name</span>
                    <input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        className="
              w-full
              border
              border-blue-500
              bg-blue-50
              text-blue-600
              placeholder-blue-300
              px-3 py-2
              rounded-md
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              transition
            "
                    />
                </label>

                {/* Email */}
                <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Email</span>
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="
              w-full
              border
              border-blue-500
              bg-blue-50
              text-blue-600
              placeholder-blue-300
              px-3 py-2
              rounded-md
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              transition
            "
                    />
                </label>

                {/* Bio */}
                <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Bio</span>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Bio"
                        rows={5}
                        className="
              w-full
              border
              border-blue-500
              bg-blue-50
              text-blue-600
              placeholder-blue-300
              px-3 py-2
              rounded-md
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              resize-none
              transition
            "
                    />
                </label>

                {/* Botón Guardar */}
                <button
                    type="submit"
                    className="
            w-full
            bg-blue-600
            text-white
            font-semibold
            px-4 py-2
            rounded-md
            hover:bg-blue-700
            transition
          "
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}
