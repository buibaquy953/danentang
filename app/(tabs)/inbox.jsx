import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { query, collection, getDocs, where } from 'firebase/firestore';
import useFirebaseUser from '../../hooks/useFirebaseUser';
import { useFocusEffect } from '@react-navigation/native';
import Colors from './../../constants/Colors';
import UserItem from '../../components/Inbox/UserItem';
import { db } from './../../config/FirebaseConfig';

export default function Inbox() {
  const { user } = useFirebaseUser();
  const [loader, setLoader] = useState(false);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    if (user) {
      GetUserList();
    }
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        GetUserList();
      }
    }, [user])
  );

  // Get user list
  const GetUserList = async () => {
    setLoader(true);
    setUserList([]);

    try {
      const q = query(collection(db, 'Chat'), where('userIds', 'array-contains', user?.email));
      const querySnapshot = await getDocs(q);
      const userData = [];

      querySnapshot.forEach(doc => {
        userData.push(doc.data());
      });

      setUserList(userData);
    } catch (error) {
      console.error("Error fetching user list: ", error);
    } finally {
      setLoader(false);
    }
  };

  const GetOtherUserList = () => {
    const list = [];

    userList.forEach((record) => {
      if (Array.isArray(record.users)) {
        const otherUser = record.users.filter(u => u?.email !== user?.email);
        if (otherUser?.length) {
          const result = {
            docId: record.id,
            ...otherUser[0],
          };
          list.push(result);
        }
      }
    });

    return list;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>I N B O X</Text>

      <FlatList 
        data={GetOtherUserList()}
        refreshing={loader}
        onRefresh={GetUserList}
        style={styles.list}
        keyExtractor={(item) => item.docId} // Use a unique key
        renderItem={({ item }) => <UserItem userInfo={item} />}
        ListEmptyComponent={() => (
          <Text style={{textAlign:'center',marginTop:40,fontFamily:'outfit',fontSize:18,color:Colors.GRAY}}>
            Chưa có tin nhắn
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.BACKGROUND,
    height: '100%',
  },
  title: {
    fontFamily: 'outfit-medium',
    fontSize: 30,
    paddingTop:20,
  },
  list: {
    marginTop: 20,
  },
});
