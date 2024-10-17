import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from 'expo-router'
import Colors from './../../constants/Colors';
import { db } from './../../config/FirebaseConfig';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { useUser } from '@clerk/clerk-expo';
import PetListItem from './../../components/Home/PetListItem'
import { StyleSheet } from 'react-native';


export default function UserPost() {
    const navigation = useNavigation();
    const { user } = useUser();
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
        const q = query(collection(db,'Pets'),where('email','==',user?.primaryEmailAddress?.emailAddress));
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
        <View>
                <PetListItem pet={item} key={index}/>
                <TouchableOpacity
                onPress={()=>OnDeletePost(item?.id)}
                style={
                    styles.deleteButton
                }>
                    <Text style={{
                        fontFamily:'outfit',
                        textAlign:'center'
                    }}>Delete</Text>
                </TouchableOpacity>
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
            marginBottom:15,
            borderRadius:9,
            marginRight:10

    }
})