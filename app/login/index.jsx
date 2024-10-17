import { View, Text, Image, Dimensions, Pressable, StyleSheet } from 'react-native';
import React, { useCallback, useState } from 'react';
import Colors from './../../constants/Colors';
import * as WebBrowser from 'expo-web-browser';
import { useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import LottieView from 'lottie-react-native'; // Import Lottie
import { useUser } from '@clerk/clerk-expo';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();



export default function LoginScreen() {
  const router = useRouter();
  const { isLoaded, user } = useUser(); // Sử dụng useUser để kiểm tra người dùng
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const [loading, setLoading] = useState(false); // State to manage loading

  const onPress = useCallback(async () => {
    setLoading(true); // Start loading
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/', { scheme: 'myapp' }),
      });

      setLoading(false); // Stop loading

      if (createdSessionId) {
        // Đảm bảo sessionId tồn tại và hợp lệ
        await setActive({ session: createdSessionId });
        
        // Khi đã gọi setActive, điều hướng có thể cần đợi isLoaded để hoàn tất
        console.log("Đăng nhập thành công, đang đợi tải thông tin người dùng...");
      } else if (signIn || signUp) {
        console.log("Yêu cầu thêm bước đăng nhập hoặc đăng ký.");
      } else {
        console.log("Không có phiên được tạo hoặc signIn/signUp không được thực hiện.");
      }
    } catch (err) {
      setLoading(false); // Stop loading on error
      console.error('OAuth error', err);
    }
  }, []);

  // useEffect để kiểm tra khi thông tin người dùng được tải xong
  useEffect(() => {
    if (isLoaded && user) {
      // Điều hướng đến home khi user có thông tin
      console.log("Thông tin người dùng đã được tải, điều hướng đến trang chủ.");
      router.push('(tabs)/home');
    } else if (isLoaded && !user) {
      console.log("Thông tin người dùng chưa có.");
    }
  }, [isLoaded, user]);

  var w = Dimensions.get('window').width;
  var h = Dimensions.get('window').height;

  return (
    <View style={styles.container}>
      <Image 
        source={require('./../../assets/images/Picture_Start.png')}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title}>
          Chào mừng bạn tới với ứng dụng
        </Text>
        <Text style={styles.subtitle}>
          Hãy cùng chia sẻ, yêu thương và chăm sóc nhưng vật nuôi đáng yêu
        </Text>

        <Pressable
          onPress={onPress}
          style={styles.button}>
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>

        {loading && (
          <View style={styles.loadingOverlay}>
            <LottieView
              source={require('./../../assets/loading.json')} 
              autoPlay
              loop
              style={styles.loadingAnimation} // Kích thước của animation
            />
          </View>
        )}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    height: Dimensions.get('window').height,
  },
  image: {
    width: '100%',
    height: '60%',
  },
  content: {
    padding: 20,
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 30,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'outfit',
    fontSize: 18,
    textAlign: 'center',
    color: Colors.GRAY,
  },
  button: {
    padding: 14,
    marginTop: 100,
    backgroundColor: Colors.PRIMARY,
    width: '100%',
    borderRadius: 15,
  },
  buttonText: {
    fontFamily: 'outfit-medium',
    fontSize: 20,
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Nền trắng nhẹ
    zIndex: 1000, // Đảm bảo overlay nằm trên các thành phần khác
  },
  loadingAnimation: {
    width: 100,
    height: 100,
  },
});
