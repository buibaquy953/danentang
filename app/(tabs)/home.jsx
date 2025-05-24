import { View, Animated, SafeAreaView, StatusBar, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import Header from '../../components/Home/Header';
import Slider from '../../components/Home/Slider';
import PetListByCategory from '../../components/Home/PetListByCategory';
import Colors from './../../constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link } from 'expo-router';


export default function Home() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showButton, setShowButton] = useState(false);
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  // Hàm animation cho nút Add New Pet
  const animateButton = useCallback(() => {
    Animated.timing(buttonOpacity, {
      toValue: showButton ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showButton]);

  useEffect(() => {
    animateButton();
  }, [animateButton]);

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, -120],
    extrapolate: 'clamp',
  });

  const sliderTranslate = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, -120],
    extrapolate: 'clamp',
  });

  const resetScrollPosition = () => {
    scrollY.setValue(0);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.BACKGROUND }}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.BACKGROUND} />
      <View style={styles.container}>
        <Animated.View style={{ transform: [{ translateY: headerTranslate }] }}>
          <Header />
        </Animated.View>

        <Animated.View style={{ transform: [{ translateY: sliderTranslate }] }}>
          <Slider />
        </Animated.View>


        <PetListByCategory scrollY={scrollY} setShowButton={setShowButton} resetScrollPosition={resetScrollPosition} />

        <Animated.View style={[styles.addNewPetContainer, { opacity: buttonOpacity }]}>
          <Link href={'/AddNewPet'}>
            <Text style={styles.addNewPetText}>
              <MaterialIcons name="pets" size={24} color={Colors.PRIMARY} /> Add New Pet
            </Text>
          </Link>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.BACKGROUND,
  },
  addNewPetContainer: {
    position: 'absolute',
    bottom: 30,
    left: '45%',
    transform: [{ translateX: -50 }],
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 15,
    borderStyle: 'dashed',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    gap: 10,
  },
  addNewPetText: {
    fontSize: 20,
  },
});
