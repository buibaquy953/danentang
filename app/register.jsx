import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import Colors from '../constants/Colors';
import { auth, db } from '../config/FirebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

const DEFAULT_IMAGE = require('../assets/images/icon.png'); // Đường dẫn ảnh mặc định
const DEFAULT_IMAGE_URL = "https://firebasestorage.googleapis.com/v0/b/adoptappreactnative.appspot.com/o/clown-fish.png?alt=media&token=387102cf-c2f9-4d04-ba7f-77a31e33f416";

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validate = () => {
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email không hợp lệ.');
      return false;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return false;
    }
    setError('');
    return true;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: fullName,
        photoURL: DEFAULT_IMAGE_URL,
      });
      await setDoc(doc(db, 'Users', userCredential.user.uid), {
        name: fullName,
        email: email,
        imageUrl: DEFAULT_IMAGE_URL,
      });
      setLoading(false);
      router.replace('/login');
    } catch (err) {
      setError('Đăng ký thất bại: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký tài khoản</Text>
      <TextInput
        style={styles.input}
        placeholder="Họ và tên"
        value={fullName}
        onChangeText={setFullName}
      />
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
      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Đăng ký</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace('/email-login')} style={{ marginTop: 20 }}>
        <Text style={{ color: Colors.PRIMARY }}>Đã có tài khoản? Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
