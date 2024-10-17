import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './../../config/FirebaseConfig';
import Colors from './../../constants/Colors';

export default function Category({ category }) {
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Dogs');

  useEffect(() => {
    GetCategories();
  }, []);

  const GetCategories = async () => {
    const snapshot = await getDocs(collection(db, 'Category'));
    const categories = snapshot.docs.map(doc => doc.data());
    setCategoryList(categories);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Category</Text>
      <FlatList
        data={categoryList}
        numColumns={4}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedCategory(item.name);
              category(item.name);
            }}
            style={{ flex: 1 }}
          >
            <View style={[styles.categoryItem, selectedCategory === item.name && styles.selectedCategoryContainer]}>
              {item?.imageUrl && (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.categoryImage}
                />
              )}
              <Text style={styles.categoryText}>{item.name || 'Unknown Category'}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.name} // Đảm bảo item.name là duy nhất
        contentContainerStyle={styles.flatListContent} // Thêm style cho FlatList
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop:10
  },
  title: {
    fontFamily: 'outfit-medium',
    fontSize: 20,
    marginBottom: 5, // Giảm khoảng cách giữa tiêu đề và danh sách
  },
  categoryItem: {
    backgroundColor: Colors.LIGHT_PRIMARY,
    paddingVertical: 5,
    paddingHorizontal: 10, // Giảm padding ngang
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 15,
    borderColor: Colors.PRIMARY,
    margin: 2, // Giảm margin
  },
  categoryImage: {
    width: 45,
    height: 40,
    marginBottom: 2, // Giảm khoảng cách dưới hình ảnh
  },
  categoryText: {
    textAlign: 'center',
    fontFamily: 'outfit',
  },
  selectedCategoryContainer: {
    backgroundColor: Colors.SECONDARY,
    borderColor: Colors.SECONDARY,
  },
  flatListContent: {
    paddingBottom: 0, // Đảm bảo không có khoảng trống dưới cùng
  },
});
