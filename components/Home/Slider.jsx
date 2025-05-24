import { View, Image, FlatList, StyleSheet, Dimensions } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './../../config/FirebaseConfig';
import Colors from './../../constants/Colors';
import LottieView from 'lottie-react-native'; // Import Lottie

export default function Slider() {
    const [sliderList, setSliderList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0); // Để theo dõi ảnh hiện tại
    const flatListRef = useRef(null); // Tạo ref cho FlatList để scroll tự động

    useEffect(() => {
        const fetchData = async () => {
            const snapshot = await getDocs(collection(db, 'Slider'));
            const tempList = snapshot.docs.map(doc => doc.data());
            setSliderList(tempList);
            setLoading(false);
        };
        fetchData();
    }, []);

    // Tạo hiệu ứng tự động di chuyển ảnh
    useEffect(() => {
        if (sliderList.length > 0) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) =>
                    prevIndex === sliderList.length - 1 ? 0 : prevIndex + 1
                );
            }, 3000); 

            return () => clearInterval(interval); // Xóa interval khi component bị hủy
        }
    }, [sliderList]);

    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({
                index: currentIndex,
                animated: true,
            });
        }
    }, [currentIndex]);

    return (
        <View style={styles.sliderContainer}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <LottieView
                        source={require('./../../assets/loading.json')} // Đường dẫn tới file loading.json
                        autoPlay
                        loop
                        style={styles.loadingAnimation}
                    />
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={sliderList}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item?.imageUrl }} style={styles.sliderImage} />
                        </View>
                    )}
                    contentContainerStyle={styles.flatListContent}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    sliderContainer: {
        marginTop: 0,
        backgroundColor: Colors.WHITE,
        borderRadius: 18,
        padding: 8,
        shadowColor: Colors.PRIMARY,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get('screen').height * 0.2, // Chiều cao cho vùng loading
    },
    loadingAnimation: {
        width: 100,
        height: 100,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    sliderImage: {
        width: Dimensions.get('screen').width * 0.82,
        height: Dimensions.get('screen').height * 0.19,
        borderRadius: 15,
        marginRight: 10,
    },
    flatListContent: {
        alignItems: 'center',
    },
});
