import {useState,useContext} from "react";
import { db } from '../services/api';
import {addDoc, collection} from "firebase/firestore";
import {AuthContext} from "../context/AuthContext.tsx";

export default function ReviewFrom({videoGameID}: {videoGameID: number}){
    const {user} = useContext(AuthContext);
    const [review,setReview]=useState("");

    async function handleSubmit(e: React.FormEvent){
        e.preventDefault();
        if(user){
            await addDoc(collection(db,"reviews"),{videoGameID,review,
                userName: user.email,userId:user.uid});
            setReview("");
        }
    }

    return(
        <form onSubmit={handleSubmit} className="p-4">
            <textarea value={review}  onChange={(e)=>setReview(e.target.value)}
                      placeholder="Write a review..." className="p-2 border"/> <br/><br/>
            <button type={"submit"} className="bg-green-500 text-white p-2"> Submit</button>
        </form>
    );
}