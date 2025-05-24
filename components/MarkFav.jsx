import { View, Text, Pressable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Shared from './../Shared/Shared'
import useFirebaseUser from '../hooks/useFirebaseUser';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function MarkFav({ pet }) {
    const { user } = useFirebaseUser();
    const [favlist, setFavlist] = useState([]);

    useEffect(() => {
        user && GetFav();
    }, [user])

    const GetFav = async () => {
        const result = await Shared.GetFavList(user);
        setFavlist(result?.favorites ? result?.favorites : [])
    }

    const AddToFav = async () => {
        const favResult = favlist;
        favResult.push(pet.id)
        await Shared.UpdateFav(user, favResult);
        GetFav();
    }

    const removeFromFav=async()=>{
        const favResult = favlist.filter(item=>item!=pet.id);
        await Shared.UpdateFav(user, favResult);
        GetFav();
    }
    return (
        <View>
            {favlist.includes(pet?.id) ?
                <TouchableOpacity onPress={() => removeFromFav()}>
                    <AntDesign name="heart" size={30} color={"red"} />
                </TouchableOpacity> :
                <TouchableOpacity onPress={() => AddToFav()}>
                    <FontAwesome name="heart-o" size={30} color="black" />
                </TouchableOpacity>
            }
        </View>
    )
}