import { View, Text, TouchableOpacity, Alert, StyleSheet, Image, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../constants/Colors';// Nhập useNavigation
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import useFirebaseUser from '../../hooks/useFirebaseUser';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import * as SecureStore from 'expo-secure-store';

export default function Profile() {
  const navigation = useNavigation(); // Khởi tạo navigation
  const { user } = useFirebaseUser();
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (user?.uid) {
        try {
          const docRef = doc(db, 'Users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        } catch (e) {
          setUserData(null);
        }
      }
    };
    fetchUser();
    // Listen for navigation focus to refresh user data
    const unsubscribe = navigation.addListener('focus', fetchUser);
    return unsubscribe;
  }, [user, navigation]);

  const Menu=[
    {
      id:1,
      name:'Add New Pet',
      icon: 'add-circle',
      path:'/AddNewPet'
    },
    {
      id:5,
      name:'My Post',
      icon: 'bookmark',
      path:'/user-post'
    },
    {
      id:2,
      name:'Favorites',
      icon: 'heart',
      path:'/(tabs)/favorite'
    },
    {
      id:3,
      name:'Inbox',
      icon: 'chatbubble',
      path:'/(tabs)/inbox'
    },
    {
      id:6,
      name:'Edit Profile',
      icon: 'person',
      path:'/edit-profile'
    },
     {
      id: 7,
      name: 'Change Password',
      icon: 'key',
      path: '/change-password'
    },
    {
      id:4,
      name:'Logout',
      icon: 'exit',
      path:'logout'
    },
   
  ]


  const handleLogout = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất không?",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "Đăng xuất",
          onPress: async () => {
            await signOut(getAuth());
            await SecureStore.deleteItemAsync('user_email');
            await SecureStore.deleteItemAsync('user_password');
            navigation.navigate('email-login');
          }
        }
      ]
    );
  };

  const onPressMenu=(menu)=>{
    if(menu.path=='logout')
    {
      handleLogout();
      return;
    }
    router.push(menu.path)
  }

  return (
    // <View style={styles.container}>
    //   <Text style={styles.title}>Trang cá nhân</Text>
    //   <TouchableOpacity onPress={handleLogout} style={styles.button}>
    //     <Text style={styles.buttonText}>Đăng xuất</Text>
    //   </TouchableOpacity>
    // </View>

    <View style={{
      padding: 20,
      marginTop: 20,
      backgroundColor:Colors.BACKGROUND,
      height:'100%'
    }}>
      {/* <Text style={{
        fontFamily: 'outfit-medium',
        fontSize: 30
      }}>Profile</Text> */}

      <View style={{
        display: 'flex',
        alignItems: 'center',
        marginVertical: 25
      }}>
        <Image source={{ uri: userData?.imageUrl }}
          style={{
            width: 60,
            height: 60,
            borderRadius: 99
          }} />
        <Text style={{
          fontFamily: 'outfit-medium',
          fontSize: 20,
          marginTop:6
        }}>{userData?.name}</Text>
        <Text style={{
          fontFamily: 'outfit',
          fontSize: 16,
          color: Colors.GRAY
        }}>{userData?.email}</Text>
      </View>
      <FlatList 
          data={Menu}
          renderItem={({item,index})=>(
            <TouchableOpacity 
            onPress={()=>onPressMenu(item)}
            key={item.id}
            style={{
              marginVertical:10,
              display:'flex',
              flexDirection:'row',
              alignItems:'center',
              gap:10,
              backgroundColor:Colors.WHITE,
              padding:10,
              borderRadius:10
            }}>

                <Ionicons name={item?.icon} size={24}
                color={Colors.PRIMARY}
                style={{
                  padding:10,
                  backgroundColor:Colors.LIGHT_PRIMARY,
                  borderRadius:8
                }}
                />
                <Text style={{
                  fontFamily:'outfit',
                  fontSize:20
                }}>{item?.name}</Text>
            </TouchableOpacity>
  )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    padding: 14,
    backgroundColor: '#FF5733', // Màu nền cho nút đăng xuất
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF', // Màu chữ trắng
    fontSize: 18,
    textAlign: 'center',
  },
});
