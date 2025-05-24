import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import Colors from './../../constants/Colors';
import { useRouter } from 'expo-router';

export default function PetListItem({ pet }) {
  const router =useRouter();
  return (
    <TouchableOpacity 
      onPress={()=>router.push(
        {
          pathname:'/pet-details',
          params:pet
        }
      )}
      style={styles.card}
    >
      <Image 
        source={{ uri: pet.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.name}>{pet?.name}</Text>
      <View style={styles.infoRow}>
        <Text style={styles.breed}>{pet?.breed}</Text>
        <Text style={styles.age}>{pet?.age} Years</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = {
  card: {
    padding: 12,
    marginTop: 15,
    marginHorizontal: 7,
    backgroundColor: Colors.WHITE,
    borderRadius: 18,
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
    minWidth: 150,
    maxWidth: 180,
    flex: 1,
  },
  image: {
    width: 120,
    height: 90,
    borderRadius: 14,
    marginBottom: 8,
    backgroundColor: Colors.LIGHT_PRIMARY,
  },
  name: {
    fontFamily: 'outfit-medium',
    fontSize: 17,
    marginTop: 2,
    color: Colors.PRIMARY,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 6,
  },
  breed: {
    fontFamily: 'outfit',
    color: Colors.GRAY,
    fontSize: 13,
  },
  age: {
    fontFamily: 'outfit',
    color: Colors.BLACK,
    paddingHorizontal: 8,
    borderRadius: 99,
    backgroundColor: Colors.LIGHT_PRIMARY,
    fontSize: 13,
  },
};
