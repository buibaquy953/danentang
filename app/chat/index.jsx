import { View, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { db } from '../../config/FirebaseConfig';
import { addDoc, collection, doc, getDoc, onSnapshot, Timestamp, query, orderBy } from 'firebase/firestore';
import useFirebaseUser from '../../hooks/useFirebaseUser';
import { GiftedChat } from 'react-native-gifted-chat';
import Colors from './../../constants/Colors';

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const { user } = useFirebaseUser();
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    GetUserDetals();

    // Sắp xếp tin nhắn theo createdAt
    const q = query(collection(db, 'Chat', params?.id, 'Messages'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageData = snapshot.docs.map((doc) => {
        const data = doc.data();
        // Chuyển đổi Timestamp thành Date object, kiểm tra kỹ trước khi gọi toDate
        return {
          _id: doc.id,
          ...data,
          createdAt: data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : new Date(),
        };
      });
      setMessages(messageData);
    });

    return () => unsubscribe();
  }, []);

  const GetUserDetals = async () => {
    const docRef = doc(db, 'Chat', params?.id);
    const docSnap = await getDoc(docRef);

    const result = docSnap.data();
    const otherUser = result?.users.filter(item => item.email != user?.email);

    navigation.setOptions({
      headerTitle: otherUser[0]?.name,
      headerStyle: {
        backgroundColor: Colors.BACKGROUND, 
      },
      headerTintColor: Colors.BLACK, 
    headerTitleStyle: {
      color: Colors.TEXT_COLOR, 
      fontSize: 20, 
    },
    });
  };

  const onSend = async (newMessage) => {
    // Không cần setMessages ở đây, chỉ lưu lên Firestore
    newMessage[0].createdAt = Timestamp.now();
    await addDoc(collection(db, 'Chat', params.id, 'Messages'), newMessage[0]);
  };

  return (
    <View style={{ flex: 1,
      backgroundColor:Colors.BACKGROUND
     }}
    
    >
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        showUserAvatar={true}
        user={{
          _id: user?.email,
          name: user?.displayName,
          avatar: user?.photoURL,
        }}
        inverted={false}
      />
      {
        Platform.OS === 'ios' && <KeyboardAvoidingView behavior="padding" />
     }
     </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
