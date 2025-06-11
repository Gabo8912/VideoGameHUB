//Imports
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup,signInWithEmailAndPassword,createUserWithEmailAndPassword, signOut} from "firebase/auth";
import { getFirestore, getDoc, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBK795I0Ed3qn9rKZtAlvanAaDryD6bL5E",
    authDomain: "video-game-hub-f1a6a.firebaseapp.com",
    projectId: "video-game-hub-f1a6a",
    storageBucket: "video-game-hub-f1a6a.firebasestorage.app",
    messagingSenderId: "244712424163",
    appId: "1:244712424163:web:daf69ce05c774fee457bd6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
// Check if user exists in users collection
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
// Add new user with default role
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                role: "customer", // default role
                createdAt: new Date()
            });
        }
        return user;
    } catch (error) {
        console.error("Error signing in with Google:", error);
        throw error;
    }
};
//SignIn With Email
export const signInWithEmail = async (email: string, password: string) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email,
            password);
        return result.user;
    } catch (error) {
        console.error("Error signing in with email:", error);
        throw error;
    }
};

//rEGISTER WITH EMAIL AN PASSWORD
export const registerWithEmail = async (email: string, password:
string, displayName: string) => {
    try {
        const result = await createUserWithEmailAndPassword(auth,
            email, password);
        const user = result.user;
// Add new user with default role
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            role: "customer", // default role
            displayName: displayName,
            createdAt: new Date()
        });
        return user;
    } catch (error) {
        console.error("Error registering with email:", error);
        throw error;
    }
};

//logout function
export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out:", error);
        throw error;
    }
};

//User Role for display
export const getUserRole = async (userId: string): Promise<string> => {
    try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
            return userDoc.data().role || "customer";
        }
        return "customer"; // default role
    } catch (error) {
        console.error("Error getting user role:", error);
        return "customer";
    }
};

//Get User Name for display
export const getUserDisplayName = async (userId: string):
    Promise<string> => {
    try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
            return userDoc.data().displayName || "";
        }
        return ""; // default role
    } catch (error) {
        console.error("Error getting user displayName:", error);
        return "";
    }
};
