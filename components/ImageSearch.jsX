// components/ImageSearch.js
import React, { useState, useEffect } from 'react';
import { Button, Image, View, ActivityIndicator, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as tf from '@tensorflow/tfjs';
import { fetch as fetchPolyfill } from 'whatwg-fetch';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

// Tải danh sách lớp từ file JSON
const IMAGENET_CLASSES = require('./imagenet_classes.json');

export default function ImageSearch() {
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [model, setModel] = useState(null);

  // Khởi tạo TensorFlow.js
  useEffect(() => {
    const loadModel = async () => {
      await tf.ready(); // Đảm bảo TensorFlow đã sẵn sàng
      const mobilenet = await tf.loadLayersModel('https://tfhub.dev/google/imagenet/mobilenet_v2_100_224/classification/4'); // Link tới mô hình MobileNet
      setModel(mobilenet);
    };
    loadModel();
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      classifyImage(result.assets[0].uri);
    }
  };

  const classifyImage = async (uri) => {
    setLoading(true);
    const img = new Image();
    img.src = uri;
    img.onload = async () => {
      // Chuyển đổi hình ảnh sang tensor
      const tensor = tf.browser.fromPixels(img)
        .resizeBilinear([224, 224]) // Kích thước đầu vào cho MobileNet
        .expandDims()
        .toFloat()
        .div(tf.scalar(255)); // Chuẩn hóa giá trị pixel

      const predictions = await model.predict(tensor).data();
      const topPrediction = Array.from(predictions).map((p, i) => {
        return { className: IMAGENET_CLASSES[i], probability: p }; // Lấy tên lớp và xác suất
      }).sort((a, b) => b.probability - a.probability)[0]; // Sắp xếp theo xác suất

      setResult(topPrediction);
      setLoading(false);
    };
  };

  if (!model) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Chọn ảnh từ thư viện" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}
      {loading && <ActivityIndicator size="large" />}
      {result && (
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Kết quả:</Text>
          <Text>{result.className} - {Math.round(result.probability * 100)}%</Text>
        </View>
      )}
    </View>
  );
}
