import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SecureStore from 'expo-secure-store';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { useEffect, useState } from "react";

const tokenCache = {
  async getToken(key) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log('No values stored under key: ' + key);
      }
      return item;
    } catch (error) {
      console.error('SecureStore get item error: ', error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      await SecureStore.setItemAsync(key, value);
      console.log(`Token saved under key: ${key}`);
    } catch (err) {
      console.error('Error saving token: ', err);
    }
  },
};

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        console.log('Found token, attempting to log in...');
        setIsLoggedIn(true);  // Cập nhật trạng thái đăng nhập
      } else {
        console.log('No token found, redirecting to login...');
        setIsLoggedIn(false); // Cập nhật trạng thái không đăng nhập
      }
    };
    checkLogin();
  }, []);

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  const [loaded] = useFonts({
    'outfit': require('./../assets/fonts/Outfit-Regular.ttf'),
    'outfit-medium': require('./../assets/fonts/Outfit-Medium.ttf'),
    'outfit-bold': require('./../assets/fonts/Outfit-Bold.ttf'),
  });

  if (!loaded) return null; // Chờ cho đến khi fonts được tải xong

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      {/* ClerkLoaded đảm bảo rằng dữ liệu đã được tải trước khi render các màn hình */}
      <ClerkLoaded>
        <Stack>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login/index" options={{ headerShown: false }} />
        </Stack>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
