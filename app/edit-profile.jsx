import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import Colors from '../constants/Colors';
import { db, storage } from '../config/FirebaseConfig';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import useFirebaseUser from '../hooks/useFirebaseUser';

const DEFAULT_IMAGE = require('../assets/images/icon.png');
const DEFAULT_IMAGE_URL = "https://firebasestorage.googleapis.com/v0/b/adoptappreactnative.appspot.com/o/clown-fish.png?alt=media&token=387102cf-c2f9-4d04-ba7f-77a31e33f416";

export default function EditProfileScreen() {
  const { user } = useFirebaseUser();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      if (user?.uid) {
        try {
          const docRef = doc(db, 'Users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFullName(data.name || '');
            setEmail(data.email || '');
            setImage(data.imageUrl || DEFAULT_IMAGE_URL);
          }
        } catch (e) {
          setFullName('');
          setEmail('');
          setImage(DEFAULT_IMAGE_URL);
        }
      }
    };
    fetchUser();
  }, [user]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!fullName || !email) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    setLoading(true);
    try {
      let imageUrlToSave = image;
      // Nếu người dùng chọn ảnh mới (không phải mặc định và không phải link storage)
      if (image && !image.startsWith('http') && user?.uid) {
        const imageName = `avatar_${user.uid}_${Date.now()}.jpg`;
        const storageRef = ref(storage, imageName);
        const resp = await fetch(image);
        const blobImage = await resp.blob();
        await uploadBytes(storageRef, blobImage);
        imageUrlToSave = await getDownloadURL(storageRef);
      }
      await updateDoc(doc(db, 'Users', user.uid), {
        name: fullName,
        email: email,
        imageUrl: imageUrlToSave,
      });
      setLoading(false);
      router.back();
    } catch (err) {
      setError('Cập nhật thất bại: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chỉnh sửa thông tin cá nhân</Text>
      <TouchableOpacity onPress={pickImage}>
        <Image source={{ uri: image }} style={styles.avatar} />
        <Text style={{ color: Colors.PRIMARY, textAlign: 'center', marginBottom: 10 }}>Đổi ảnh đại diện</Text>
      </TouchableOpacity>
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
        editable={false}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Lưu</Text>}
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
    fontSize: 24,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 10,
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
