import { View, Text, Image, TextInput, StyleSheet, ScrollView, TouchableOpacity, ToastAndroid, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRouter, useLocalSearchParams } from 'expo-router';
import Colors from './../../constants/Colors';
import { db, storage } from './../../config/FirebaseConfig';
import { Picker } from '@react-native-picker/picker';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import useFirebaseUser from '../../hooks/useFirebaseUser';

export default function AddNewPet() {
    const navigation = useNavigation();
    const params = useLocalSearchParams();
    const [formData, setFormData] = useState({ category: 'Dogs', sex: 'Male' });
    const [gender, setGender] = useState('Male');
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Dogs');
    const [image, setImage] = useState();
    const { user } = useFirebaseUser();
    const [loader, setLoader] = useState(false);
    const router = useRouter();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: params?.pet ? 'Update Pet' : 'Add New Pet',
            headerStyle: {
                backgroundColor: Colors.BACKGROUND, 
              },
        });
        GetCategories();
    }, []);

    useEffect(() => {
        if (params?.pet) {
            let pet = params.pet;
            if (typeof pet === 'string') {
                try {
                    pet = JSON.parse(pet);
                } catch (e) {
                    pet = null;
                }
            }
            if (pet) {
                // CHUẨN HÓA imageUrl
                pet.imageUrl = pet.imageUrl || pet.iamgeUrl || '';
                setFormData({
                    name: pet.name || '',
                    category: pet.category || 'Dogs',
                    breed: pet.breed || '',
                    age: pet.age || '',
                    sex: pet.sex || 'Male',
                    weight: pet.weight || '',
                    address: pet.address || '',
                    about: pet.about || '',
                });
                setSelectedCategory(pet.category || 'Dogs');
                setGender(pet.sex || 'Male');
                setImage(pet.imageUrl);
            }
        } else {
            setFormData({ category: 'Dogs', sex: 'Male' });
            setSelectedCategory('Dogs');
            setGender('Male');
            setImage(undefined);
        }
    }, [params.pet]);

    const GetCategories = async () => {
        const snapshot = await getDocs(collection(db, 'Category'));
        const categories = snapshot.docs.map(doc => doc.data());
        setCategoryList(categories);
    };

    const imagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleInputChange = (fieldName, fieldValue) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: fieldValue
        }));
    };

    const onSubmit = () => {
        if (params?.pet) {
            // Nếu là update, gọi hàm update thay vì thêm mới
            return onUpdatePet();
        }
        if (Object.keys(formData).length !== 8) {
            if (Platform.OS === 'android') {
                ToastAndroid.show("Nhập đầy đủ thông tin", ToastAndroid.SHORT);
            } else {
                alert("Nhập đầy đủ thông tin");
            }
            return;
        }
        UploadImage();
    };

    // Helper to fetch user info from Firestore
    const fetchUserInfoFromFirestore = async (uid) => {
        if (!uid) return { name: '', email: '', imageUrl: '' };
        try {
            const docRef = doc(db, 'Users', uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                return {
                    name: data.name || '',
                    email: data.email || '',
                    imageUrl: data.imageUrl || '',
                };
            }
        } catch (e) {}
        return { name: '', email: '', imageUrl: '' };
    };

    const onUpdatePet = async () => {
        setLoader(true);
        try {
            let pet = params.pet;
            if (typeof pet === 'string') {
                try {
                    pet = JSON.parse(pet);
                } catch (e) {
                    pet = {};
                }
            }
            const oldImageUrl = pet.imageUrl || pet.iamgeUrl || '';
            let imageUrl = image;
            if (image && image !== oldImageUrl) {
                const imageName = Date.now() + '.jpg';
                const storageRef = ref(storage, '/' + imageName);
                const resp = await fetch(image);
                const blobImage = await resp.blob();
                await uploadBytes(storageRef, blobImage);
                imageUrl = await getDownloadURL(storageRef);
            }
            // Fetch user info from Firestore
            const userInfo = await fetchUserInfoFromFirestore(user?.uid);
            await setDoc(doc(db, 'Pets', pet.id), {
                ...formData,
                imageUrl: imageUrl,
                userName: userInfo.name,
                email: userInfo.email,
                userImage: userInfo.imageUrl,
                id: pet.id
            });
            setLoader(false);
            router.replace('/(tabs)/home');
        } catch (error) {
            console.error('Error updating pet data:', error);
            setLoader(false);
        }
    };

    const UploadImage = async () => {
    setLoader(true);
    try {
        const imageName = Date.now() + '.jpg';
        const storageRef = ref(storage, '/' + imageName);

        const resp = await fetch(image);
        const blobImage = await resp.blob();

        // Tải ảnh lên Firebase Storage
        await uploadBytes(storageRef, blobImage);

        // Lấy URL chính thức từ Firebase
        const downloadUrl = await getDownloadURL(storageRef);

        // Lưu dữ liệu vào Firestore với URL ảnh thực tế
        await SaveFormData(downloadUrl);
    } catch (error) {
        console.error("Error uploading image: ", error);
        setLoader(false);
    }
};

    

    const SaveFormData = async (imageUrl) => {
        const docId = Date.now().toString();
        try {
            // Fetch user info from Firestore
            const userInfo = await fetchUserInfoFromFirestore(user?.uid);
            await setDoc(doc(db, 'Pets', docId), {
                ...formData,
                imageUrl: imageUrl,
                userName: userInfo.name,
                email: userInfo.email,
                userImage: userInfo.imageUrl,
                id: docId
            });
            setLoader(false);
            router.replace('/(tabs)/home');
        } catch (error) {
            console.error('Error saving pet data:', error);
            setLoader(false);
        }
    };
    
    return (
        <KeyboardAvoidingView 
            style={{ flex: 1 }} 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={100} // Điều chỉnh giá trị này nếu cần
        >
            <ScrollView style={{
                padding: 20,
                backgroundColor: Colors.BACKGROUND,
            }}>
                <Text style={{ fontFamily: 'outfit-medium', fontSize: 20, marginBottom: 20 }}>{params?.pet ? 'Update Pet' : 'Add New Pet'}</Text>
                <TouchableOpacity onPress={imagePicker}>
                    {!image ? <Image source={require('./../../assets/images/AddPet.png')}
                        style={{ width: 100, height: 100 }} />
                        : <Image source={{ uri: image }}
                            style={{ width: 120, height: 120, borderRadius: 15 }} />}
                </TouchableOpacity>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Pet Name *</Text>
                    <TextInput style={styles.input}
                        value={formData.name}
                        onChangeText={(value) => handleInputChange('name', value)} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Category *</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedCategory}
                            onValueChange={(itemValue) => {
                                setSelectedCategory(itemValue);
                                handleInputChange('category', itemValue);
                            }}>
                            {categoryList.map((category, index) => (
                                <Picker.Item key={index} label={category.name} value={category.name} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Breed *</Text>
                    <TextInput style={styles.input}
                        value={formData.breed}
                        onChangeText={(value) => handleInputChange('breed', value)} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Age *</Text>
                    <TextInput style={styles.input}
                        value={formData.age}
                        keyboardType='number-pad'
                        onChangeText={(value) => handleInputChange('age', value)} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Gender *</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={gender}
                            onValueChange={(itemValue) => {
                                setGender(itemValue);
                                handleInputChange('sex', itemValue);
                            }}>
                            <Picker.Item label="Male" value="Male" />
                            <Picker.Item label="Female" value="Female" />
                        </Picker>
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Weight *</Text>
                    <TextInput style={styles.input}
                        value={formData.weight}
                        keyboardType='number-pad'
                        onChangeText={(value) => handleInputChange('weight', value)} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Address *</Text>
                    <TextInput style={styles.input}
                        value={formData.address}
                        onChangeText={(value) => handleInputChange('address', value)} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>About *</Text>
                    <TextInput style={styles.input}
                        value={formData.about}
                        numberOfLines={5}
                        multiline={true}
                        onChangeText={(value) => handleInputChange('about', value)} />
                </View>

                <TouchableOpacity
                    onPress={onSubmit}
                    disabled={loader}
                    style={styles.button}>
                    {loader ?
                        <ActivityIndicator size={"large"} />
                        :
                        <Text style={{ fontFamily: 'outfit-medium', textAlign: 'center' }}>Submit</Text>
                    }
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        marginVertical: 10,
        marginHorizontal: 5
    },
    input: {
        padding: 15,
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
        fontFamily: 'outfit'
    },
    label: {
        marginVertical: 5,
        fontFamily: 'outfit'
    },
    pickerContainer: {
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
        overflow: 'hidden',
    },
    button: {
        padding: 15,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 40,

    }
});
