import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import { db } from '../../config/FirebaseConfig';  // Sử dụng db từ FirebaseConfig
import { collection, getDocs } from 'firebase/firestore'; // Import các phương thức Firestore
import { Ionicons } from '@expo/vector-icons';
import PetListItem from '../../components/Home/PetListItem';  // Import PetListItem
import Colors from './../../constants/Colors';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [allPets, setAllPets] = useState([]);  // Lưu toàn bộ thú cưng từ Firestore
  const [loading, setLoading] = useState(false);

  // Lấy toàn bộ danh sách thú cưng từ Firestore khi lần đầu tải trang
  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      try {
        const petsSnapshot = await getDocs(collection(db, 'Pets'));
        const petsData = petsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllPets(petsData);  // Lưu toàn bộ thú cưng vào state
      } catch (error) {
        console.error('Error fetching pets: ', error);
      }
      setLoading(false);
    };

    fetchPets();
  }, []);

  // Hàm lọc kết quả tìm kiếm cục bộ
  const handleSearch = (queryText) => {
    setSearchQuery(queryText);

    if (queryText.trim() === '') {
      setResults([]);  // Xóa kết quả nếu không nhập gì
      return;
    }

    const filteredResults = allPets.filter((pet) =>
      pet.name.toLowerCase().includes(queryText.toLowerCase()) // Lọc không phân biệt chữ hoa/thường
    );

    setResults(filteredResults);
  };

  // Hiển thị từng kết quả tìm kiếm
  const renderItem = ({ item }) => (
    <PetListItem pet={item} /> // Sử dụng PetListItem để hiển thị kết quả tìm kiếm
  );

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for pets..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Danh sách kết quả */}
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          numColumns={2}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No results found</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop:25,
    backgroundColor: Colors.BACKGROUND,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
  },
});

export default SearchScreen;
