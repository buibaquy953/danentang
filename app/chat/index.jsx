import { View, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { db } from '../../config/FirebaseConfig';
import { addDoc, collection, doc, getDoc, onSnapshot, Timestamp, query, orderBy } from 'firebase/firestore';
import { useUser } from '@clerk/clerk-expo';
import { GiftedChat } from 'react-native-gifted-chat';
import Colors from './../../constants/Colors';

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const { user } = useUser();
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    GetUserDetals();

    // Sắp xếp tin nhắn theo createdAt
    const q = query(collection(db, 'Chat', params?.id, 'Messages'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageData = snapshot.docs.map((doc) => {
        const data = doc.data();
        // Chuyển đổi Timestamp thành Date object
        return {
          _id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(), // Chuyển đổi Timestamp thành Date
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
    const otherUser = result?.users.filter(item => item.email != user?.primaryEmailAddress?.emailAddress);

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
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessage));

    // Sử dụng Timestamp từ Firestore và chuyển đổi trước khi lưu
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
          _id: user?.primaryEmailAddress?.emailAddress,
          name: user?.fullName,
          avatar: user?.imageUrl,
        }}
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
