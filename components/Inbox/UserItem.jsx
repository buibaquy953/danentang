import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import Colors from './../../constants/Colors';

export default function UserItem({ userInfo }) {
  return (
    <Link style={styles.link} href={`/chat?id=${userInfo.docId}`}>
      <View style={styles.userItemContainer}>
        <Image 
          source={{ uri: userInfo.imageUrl }} 
          style={styles.userImage} 
        />
        <Text style={styles.userName}>{userInfo?.name}</Text>
      </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  link: {
    marginVertical: 10,
    borderColor: Colors.BLACK,
    borderWidth: 1,
    alignContent: 'center',
    padding: 10,
    borderRadius: 15,
    backgroundColor: Colors.WHITE, // Set background color for better contrast
    shadowColor: Colors.BLACK, // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 4, 
    elevation: 2, 
  },
  userItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 99, 
  },
  userName: {
    fontFamily: 'outfit',
    fontSize: 20,
  },
});
