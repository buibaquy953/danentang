import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { db } from '../../config/FirebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import FavPetCard from '../../components/Home/PetListItem';
import Colors from './../../constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import Feather from '@expo/vector-icons/Feather';
import LottieView from 'lottie-react-native';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allPets, setAllPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [similarImage, setSimilarImage] = useState([]);
  const [favPetList, setFavPetList] = useState([]);
  const [notFound, setNotFound] = useState(false);

  // Fetch toàn bộ thú cưng
  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      try {
        const petsSnapshot = await getDocs(collection(db, 'Pets'));
        const petsData = petsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllPets(petsData);
      } catch (error) {
        console.error('Error fetching pets: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = (queryText) => {
    setSearchQuery(queryText);
    setNotFound(false);

    if (queryText.trim() === '') {
      setFavPetList([]);
      return;
    }

    const filteredResults = allPets.filter((pet) =>
      pet.name.toLowerCase().includes(queryText.toLowerCase())
    );

    setFavPetList(filteredResults);
    setNotFound(filteredResults.length === 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for pets..."
          value={searchQuery}
          onChangeText={handleSearch}
        />

      </View>

      {loading ? (
        <LottieView source={require('./../../assets/loading.json')} autoPlay loop />
      ) : (
        <View>
          {notFound ? (
            <Text style={styles.notFoundText}>Không tìm thấy </Text>
          ) : (
            <FlatList
              data={favPetList}
              numColumns={2}
              renderItem={({ item }) => (
                <View>
                  <FavPetCard pet={item} />
                </View>
              )}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No results found</Text>
                </View>
              )}
            />
          )}
        </View>
      )}
    </View>
  );  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 25,
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
  notFoundText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
});

export default SearchScreen;
