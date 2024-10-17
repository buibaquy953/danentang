import { View, Text, Image, TextInput, StyleSheet, ScrollView, TouchableOpacity, ToastAndroid, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import Colors from './../../constants/Colors';
import { db, storage } from './../../config/FirebaseConfig';
import { Picker } from '@react-native-picker/picker';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useUser } from '@clerk/clerk-expo';

export default function AddNewPet() {
    const navigation = useNavigation();
    const [formData, setFormData] = useState({ category: 'Dogs', sex: 'Male' });
    const [gender, setGender] = useState();
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState();
    const [image, setImage] = useState();
    const { user } = useUser();
    const [loader, setLoader] = useState(false);
    const router = useRouter();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Add New Pet',
            headerStyle: {
                backgroundColor: Colors.BACKGROUND, 
              },
        });
        GetCategories();
    }, []);

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

    const UploadImage = async () => {
        setLoader(true);
        const resp = await fetch(image);
        const blobImage = await resp.blob();
        const storageRef = ref(storage, '/' + Date.now() + '.jpg');

        uploadBytes(storageRef, blobImage).then(() => {
            console.log('File Uploaded');
            getDownloadURL(storageRef).then(async (downloadUrl) => {
                SaveFormData(downloadUrl);
            });
        });
    };

    const SaveFormData = async (imageUrl) => {
        const docId = Date.now().toString();
        await setDoc(doc(db, 'Pets', docId), {
            ...formData,
            imageUrl: imageUrl,
            userName: user?.fullName,
            email: user?.primaryEmailAddress?.emailAddress,
            userImage: user?.imageUrl,
            id: docId
        });
        setLoader(false);
        router.replace('/(tabs)/home');
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
                <Text style={{ fontFamily: 'outfit-medium', fontSize: 20, marginBottom: 20 }}>Add New Pet</Text>
                <TouchableOpacity onPress={imagePicker}>
                    {!image ? <Image source={require('./../../assets/images/AddPet.png')}
                        style={{ width: 100, height: 100 }} />
                        : <Image source={{ uri: image }}
                            style={{ width: 120, height: 120, borderRadius: 15 }} />}
                </TouchableOpacity>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Pet Name *</Text>
                    <TextInput style={styles.input}
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
                        onChangeText={(value) => handleInputChange('breed', value)} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Age *</Text>
                    <TextInput style={styles.input}
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
                        keyboardType='number-pad'
                        onChangeText={(value) => handleInputChange('weight', value)} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Address *</Text>
                    <TextInput style={styles.input}
                        onChangeText={(value) => handleInputChange('address', value)} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>About *</Text>
                    <TextInput style={styles.input}
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
