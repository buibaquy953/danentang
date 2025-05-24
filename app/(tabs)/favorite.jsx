import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from './../../constants/Colors';
import Shared from '../../Shared/Shared';
import useFirebaseUser from '../../hooks/useFirebaseUser';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import FavPetCard from '../../components/FavPetCard';
import { useFocusEffect } from '@react-navigation/native';

export default function Favorite() {

  const { user } = useFirebaseUser();
  const [favIds, setFavIds] = useState([]);
  const [favPetList, setFavPetList] = useState([]);
  const [loader,setLoader] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      user && GetFavPetIds();
    }, [user])
  );

  const GetFavPetIds = async () => {
    setLoader(true)
    const result = await Shared.GetFavList(user);
    setFavIds(result?.favorites);
    setLoader(false)
    GetFavPetList(result?.favorites);
  }

  const GetFavPetList = async (favId_) => {
    setLoader(true)
    setFavPetList([])
    const q = query(collection(db, 'Pets'), where('id', 'in', favId_));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      // console.log(doc.data());
      setFavPetList(prev => [...prev, doc.data()])
    })
    setLoader(false);
  }

  return (
    <View style={{
      padding: 20,
      backgroundColor: Colors.BACKGROUND,
      height: '100%'
    }}>
      <Text style={{
        fontFamily: 'outfit-medium',
        fontSize: 30,
        paddingTop:20,
      }}>Favorites</Text>
      
      <FlatList
        data={favPetList}
        numColumns={2}
        onRefresh={GetFavPetIds}
        refreshing={loader}
        renderItem={({item,index})=>(
          <View>
            <FavPetCard pet={item} />
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={{textAlign:'center',marginTop:40,fontFamily:'outfit',fontSize:18,color:Colors.GRAY}}>
            Chưa có thú cưng yêu thích
          </Text>
        )}
      />

    </View>
  )
}