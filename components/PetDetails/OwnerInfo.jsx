import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import Colors from './../../constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function OwnerInfo({ pet }) {
    return (
        <View style={styles.container}>
            <View style={{
                display:'flex',
                flexDirection:'row',
                gap:20
            }}>
            <Image source={{ uri: pet?.userImage }}
                style={{
                    height: 50,
                    width: 50,
                    borderRadius:99
                }} />
                <View>
                    <Text style={{
                        fontFamily:'outfit-medium',
                        fontSize:17
                    }}>{pet?.userName}</Text>
                    <Text
                        style={{
                            fontFamily:'outfit-medium',
                            color:Colors.GRAY
                        }}
                    >Pet Owner</Text>
                </View>
            </View>
                <FontAwesome name="send-o" size={24} color={Colors.PRIMARY} />
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        marginHorizontal:20,
        paddingHorizontal:20,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        gap:20,
        borderWidth:1,
        borderRadius:15,
        padding:10,
        borderColor:Colors.PRIMARY,
        backgroundColor:Colors.WHITE,
        justifyContent:'space-between'
    }
})