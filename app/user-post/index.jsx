import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from 'expo-router'
import Colors from './../../constants/Colors';
import { db } from './../../config/FirebaseConfig';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import useFirebaseUser from '../../hooks/useFirebaseUser';
import PetListItem from './../../components/Home/PetListItem'
import { StyleSheet } from 'react-native';


export default function UserPost() {
    const navigation = useNavigation();
    const { user } = useFirebaseUser();
    const [userPostList,setUserPostList] = useState([]);
    const [loader,setLoader] = useState(false);

    useEffect(()=>{
            navigation.setOptions({
                headerTitle:'User Post',
                headerStyle: {
                    backgroundColor: Colors.BACKGROUND, 
                  },
            })
            user&&GetUserPost();
    },[user]);

    const GetUserPost=async()=>{
        setLoader(true)
        setUserPostList([]);
        const q = query(collection(db,'Pets'),where('email','==',user?.email));
        const querySnapshot =await getDocs(q);

        querySnapshot.forEach((doc)=>{
            // console.log(doc.data());
            setUserPostList(prev=>[...prev,doc.data()])
        })
        setLoader(false);
    }

    const OnDeletePost =(docId)=>{
            Alert.alert('Ban co chac muon xoa?','',[
                {
                    text:'Cancel',
                    onPress:()=>console.log("Cancel Click"),
                    style:'cancel'
                },
                {
                    text:'Delete',
                    onPress:()=>deletePost(docId),
                    style:'default'

                }
            ])
    }
    const deletePost=async(docId)=>{
            await deleteDoc(doc(db,'Pets',docId));
            GetUserPost();
    }
  return (
    <View style={{
        paddingHorizontal:20,
        backgroundColor: Colors.BACKGROUND,
        height:'100%',
    }}>
      <Text style={{
        fontFamily:'outfit-medium',
        fontSize:30,
        marginVertical:10
      }}>My Post</Text>
    {userPostList?.length==0 && <Text>No Post Found</Text>}
      <FlatList 
      data={userPostList}
      numColumns={2}
      refreshing={loader}
      onRefresh={GetUserPost}
      showsVerticalScrollIndicator={false}
      renderItem={({item,index})=>(
        <View style={{
          margin: 8,
          backgroundColor: Colors.WHITE,
          borderRadius: 18,
          padding: 10,
          shadowColor: Colors.PRIMARY,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.12,
          shadowRadius: 10,
          elevation: 3,
          alignItems: 'center',
          minWidth: 160,
          maxWidth: 200,
          flex: 1,
        }}>
          <PetListItem pet={item} key={index}/>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginTop: 12,
            gap: 14
          }}>
            <TouchableOpacity
              onPress={()=>OnDeletePost(item?.id)}
              style={{
                backgroundColor: Colors.SECONDARY,
                paddingVertical: 5,
                paddingHorizontal: 5,
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center',
                shadowColor: Colors.SECONDARY,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text style={{
                fontFamily:'outfit-medium',
                textAlign:'center',
                color: '#1A150DFF',
                fontSize: 15,
                letterSpacing: 0.5
              }}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                const petData = { ...item, imageUrl: item.imageUrl || item.iamgeUrl };
                navigation.navigate('AddNewPet/index', { pet: JSON.stringify(petData) });
              }}
              style={{
                backgroundColor: '#FFA500',
                paddingVertical: 5,
                paddingHorizontal: 5,
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center',
                shadowColor: '#FFA500',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text style={{
                fontFamily:'outfit-medium',
                textAlign:'center',
                color: '#1A150DFF',
                fontSize: 14,
                letterSpacing: 0.5
              }}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    deleteButton:{
            backgroundColor:Colors.SECONDARY,
            padding:5,
            marginBottom:5,
            borderRadius:9,
            marginRight:10

    },
    updateButton: {
        width: '50%',
        backgroundColor: '#FFA500',
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 10,
    },
    button: {
        width: '50%',
        backgroundColor: Colors.PRIMARY,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 10,
    },
})