import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import Colors from './../../constants/Colors';
import PetInfo from '../../components/PetDetails/PetInfo';
import PetSubInfo from '../../components/PetDetails/PetSubInfo';
import AboutPet from '../../components/PetDetails/AboutPet';
import OwnerInfo from '../../components/PetDetails/OwnerInfo';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import useFirebaseUser from '../../hooks/useFirebaseUser';

export default function PetDetails() {
    const pet = useLocalSearchParams();
    const navigation =useNavigation();
    const {user} = useFirebaseUser();
    const router =useRouter();

    useEffect(()=>{
            navigation.setOptions({
                headerTransparent:true,
                headerTitle:'',
            })
    },[])


    const InitiateChat=async()=>{
        if (!user?.email || !pet?.email) {
            alert('Không thể liên hệ: thiếu thông tin người dùng hoặc thú cưng!');
            return;
        }
        // Nếu là thú cưng của mình thì không cho chuyển trang
        if (user.email === pet.email) {
            alert('Đây là thú cưng của bạn!');
            return;
        }
        const docId1 =user.email+'_'+pet.email;
        const docId2 =pet.email+'_'+user.email;

        const q=query(collection(db,'Chat'),where('id','in',[docId1,docId2]));

        const querySnapshot =await getDocs(q);
        querySnapshot.forEach((doc)=>{
            // console.log(doc.data());
            router.push({
                pathname:'/chat',
                params:{id:doc.id}
            })
        })

        if(querySnapshot.docs?.length==0)
        {
            await setDoc(doc(db,'Chat',docId1),{
                id:docId1,
                users:[
                    {
                        email:user.email,
                        imageUrl:user.photoURL,
                        name:user.displayName
                    },
                    {
                        email:pet.email,
                        imageUrl:pet.userImage,
                        name:pet.userName
                    }
                ],
                userIds:[user.email,pet.email]
            });
            router.push({
                pathname:'/chat',
                params:{id:docId1}
            })
        }
    }
  return (
    <View style={{backgroundColor:Colors.BACKGROUND}}>
    <ScrollView>
        {/* Pet Info */}
        <PetInfo pet={pet}/>

        {/* Pet Sub Info */}
        <PetSubInfo pet={pet}/>

        {/* About Pet */}
        <AboutPet pet ={pet} />

        {/* Owner info */}
        <OwnerInfo pet={pet} />

        <View style={{height:100}}></View>
       
     </ScrollView>
             {/* btn adopt */}
        <View style={styles.bottomContainer}>
            <TouchableOpacity 
            onPress={InitiateChat}
            style={styles.adoptBtn}>
                <Text style={{
                    fontFamily:'outfit-medium',
                    textAlign:'center',
                    fontSize:20
                }}>C O N T A C T</Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    adoptBtn:{
        padding:15,
        backgroundColor:Colors.PRIMARY
    },
    bottomContainer:{
           position:'absolute',
           width:'100%',
           bottom:0
    }
})