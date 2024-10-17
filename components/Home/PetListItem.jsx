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
    style={{
      padding: 10,
      marginTop: 15,
      marginHorizontal:5,
      backgroundColor: Colors.WHITE,
      borderRadius: 10,
      // flex: 1, // Thêm flex: 1 để mỗi mục có thể chiếm không gian hợp lý trong FlatList
    }}>
      <Image 
        source={{ uri: pet.imageUrl }}
        style={{
          width: 150, // Đảm bảo hình ảnh chiếm toàn bộ chiều rộng
          height: 100,
          objectFit:'cover',
          borderRadius: 10,
        }}
        resizeMode="cover" // Sử dụng resizeMode để đảm bảo hình ảnh không bị méo
      />
      <Text style={{
        fontFamily: 'outfit-medium',
        fontSize: 18,
        marginTop: 10, // Thêm khoảng cách giữa hình ảnh và tên thú cưng
      }}>{pet?.name}</Text>

      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // width: '100%', // Đảm bảo khung chứa thông tin chiếm toàn bộ chiều rộng
        marginTop: 5, // Thêm khoảng cách giữa tên và thông tin
      }}>
        <Text style={{
          fontFamily: 'outfit',
          color: Colors.GRAY
        }}>{pet?.breed}</Text>

        <Text style={{
          fontFamily: 'outfit',
          color: Colors.PRIMARY,
          paddingHorizontal: 7,
          borderRadius: 99,
          backgroundColor: Colors.LIGHT_PRIMARY,
        }}>{pet?.age} Years</Text>
      </View>
    </TouchableOpacity>
  );
}
