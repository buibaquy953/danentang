import { View, FlatList, Animated, StyleSheet } from 'react-native'; 
import React, { useEffect, useState } from 'react';
import Category from './Category';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './../../config/FirebaseConfig';
import Colors from './../../constants/Colors';
import PetListItem from './PetListItem';
import LottieView from 'lottie-react-native'; // Import Lottie

export default function PetListByCategory({ scrollY, setShowButton, resetScrollPosition }) {
  const [petList, setPetList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Dogs');

  

  useEffect(() => {
    GetPetList(selectedCategory);
  }, [selectedCategory]);

  const GetPetList = async (category) => {
    setLoader(true);
    setShowButton(false); // Ẩn nút khi bắt đầu tải dữ liệu mới
    resetScrollPosition(); // Đặt lại vị trí cuộn khi tải lại dữ liệu

    const tempList = [];
    const q = query(collection(db, 'Pets'), where('category', '==', category));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(doc => {
      tempList.push(doc.data());
    });

    setPetList(tempList);
    setLoader(false);
  };

  const categoryTranslate = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, -120],
    extrapolate: 'clamp',
  });

  const flatListTranslate = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, -100],
    extrapolate: 'clamp',
  });

  const handleScroll = (event) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;

    // Hiển thị nút khi cuộn tới gần cuối
    if (contentOffsetY + layoutHeight >= contentHeight - 100) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Animated.View style={[styles.animatedCategory, { transform: [{ translateY: categoryTranslate }] }]}>
        <Category category={(value) => {
          setSelectedCategory(value);
          GetPetList(value);
        }} />
      </Animated.View>

      {loader ? (
        <View style={styles.loader}>
          <LottieView
            source={require('./../../assets/loading.json')}
            autoPlay
            loop
            style={styles.loadingAnimation}
          />
        </View>
      ) : (
        <Animated.View style={{ flex: 1, transform: [{ translateY: flatListTranslate }] }}>
          <FlatList
            data={petList}
            keyExtractor={(item, index) => index.toString()}
            refreshing={loader}
            numColumns={2}
            onRefresh={() => GetPetList(selectedCategory)}
            renderItem={({ item }) => <PetListItem pet={item} />}
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={false}
            style={styles.flatList}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            onScrollEndDrag={handleScroll} 
            onMomentumScrollEnd={handleScroll} 
            onEndReachedThreshold={0.5} 
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  animatedCategory: {
    zIndex: 1,
    marginBottom: 0,
  },
  flatListContent: {
    paddingBottom: 16, 
    paddingTop: 4,
  },
  flatList: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingAnimation: {
    width: 100,
    height: 100,
  },
});
