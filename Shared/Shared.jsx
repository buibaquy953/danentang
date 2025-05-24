import { getDoc,doc, setDoc, updateDoc } from "firebase/firestore"
import { db } from './../config/FirebaseConfig';

export const GetFavList= async(user)=>{
    const docSnap = await getDoc(doc(db,'UserFavPet',user?.email));
    if(docSnap?.exists())
    {
        return docSnap.data();
    }
    else{
        await setDoc(doc(db,'UserFavPet',user?.email),{
            email:user?.email,
            favorites:[]
        });
        return { email: user?.email, favorites: [] };
    }
}

const UpdateFav=async(user, favorites)=>{
    const docRef=doc(db,'UserFavPet',user?.email);
    try{
        await updateDoc(docRef,{
            favorites:favorites
        })
    }
    catch(e)
    {

    }
}

export default{
    GetFavList,
    UpdateFav
}