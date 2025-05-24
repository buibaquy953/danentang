import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import useFirebaseUser from '../../hooks/useFirebaseUser';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function Header() {
  const { user } = useFirebaseUser();
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();

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

  return (
    <View style={styles.headerContainer}>
      <View>
        <Text style={styles.welcomeText}>Welcome,</Text>
        <Text style={styles.userName}>{userData?.name || userData?.email || ''}</Text>
      </View>
      {userData?.imageUrl && (
        <Image source={{ uri: userData.imageUrl }}
          style={styles.avatar}
        />
      )}
    </View>
  );
}

const styles = {
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 10,
    paddingHorizontal: 0,
    backgroundColor: '#fff0',
  },
  welcomeText: {
    fontFamily: 'outfit',
    fontSize: 16,
    color: '#7EC4CF',
    marginBottom: 2,
  },
  userName: {
    fontFamily: 'outfit-medium',
    fontSize: 24,
    color: '#2D2D2D',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 99,
    borderWidth: 2,
    borderColor: '#FFD6EC',
    backgroundColor: '#fff',
  },
};