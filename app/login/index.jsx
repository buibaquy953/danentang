import { View, Text, Image, Dimensions, Pressable, StyleSheet } from 'react-native';
import React, { useCallback, useState, useEffect } from 'react';
import Colors from '../../constants/Colors';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../config/FirebaseConfig';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';
import useFirebaseUser from '../../hooks/useFirebaseUser';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { user, loading } = useFirebaseUser();
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID', // Thay bằng clientId của bạn
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      setIsLoading(true);
      signInWithCredential(auth, credential)
        .then(() => {
          setIsLoading(false);
          router.push('(tabs)/home');
        })
        .catch((err) => {
          setIsLoading(false);
          alert('Đăng nhập thất bại!');
        });
    }
  }, [response]);

  useEffect(() => {
    if (user) {
      router.push('(tabs)/home');
    }
  }, [user]);

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
          onPress={() => promptAsync()}
          style={styles.button}>
          <Text style={styles.buttonText}>Đăng nhập với Google</Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace('/register')}
          style={[styles.button, { backgroundColor: Colors.SECONDARY, marginTop: 20 }]}
        >
          <Text style={[styles.buttonText, { color: '#fff' }]}>Đăng nhập bằng Email</Text>
        </Pressable>

        {(isLoading || loading) && (
          <View style={styles.loadingOverlay}>
            <LottieView
              source={require('./../../assets/loading.json')} 
              autoPlay
              loop
              style={styles.loadingAnimation}
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1000,
  },
  loadingAnimation: {
    width: 100,
    height: 100,
  },
});
