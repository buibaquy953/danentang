import React, { useState, useEffect } from 'react';
import { View, Text,Image,Dimensions, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Colors from '../constants/Colors';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/FirebaseConfig';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function EmailLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Tự động đăng nhập lại nếu có email/password trong SecureStore
    const tryAutoLogin = async () => {
      const savedEmail = await SecureStore.getItemAsync('user_email');
      const savedPassword = await SecureStore.getItemAsync('user_password');
      if (savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
        setLoading(true);
        try {
          await signInWithEmailAndPassword(auth, savedEmail, savedPassword);
          setLoading(false);
          router.replace('/(tabs)/home');
        } catch (err) {
          setLoading(false);
        }
      }
    };
    tryAutoLogin();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Lưu email và password vào SecureStore để tự động đăng nhập lại
      await SecureStore.setItemAsync('user_email', email);
      await SecureStore.setItemAsync('user_password', password);
      setLoading(false);
      router.replace('/(tabs)/home');
    } catch (err) {
      setError('Đăng nhập thất bại: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
         <Image 
              source={require('../assets/images/Picture_Start.png')}
              style={styles.image}
            />
            <View style={{ padding: 20, width: '100%', height: '50%', justifyContent: 'center', alignItems: 'center' }}>
             
      <Text style={styles.title}>Đăng nhập</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Đăng nhập</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace('/register')} style={{ marginTop: 20 }}>
        <Text style={{ color: Colors.PRIMARY }}>Chưa có tài khoản? Đăng ký</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    height: Dimensions.get('window').height,
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 28,
    marginBottom: 30,
  },
  input: {
    width: '100%',
    padding: 14,
    backgroundColor: Colors.BACKGROUND,
    borderRadius: 10,
    marginBottom: 15,
    fontFamily: 'outfit',
  },
  button: {
    width: '100%',
    padding: 14,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 15,
    alignItems: 'center',
  },
   image: {
    width: '100%',
    height: '40%',
  },
  buttonText: {
    fontFamily: 'outfit-medium',
    fontSize: 20,
    color: '#fff',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    fontFamily: 'outfit',
  },
});
