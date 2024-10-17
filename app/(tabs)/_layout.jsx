import { View, Text, SafeAreaView } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import Colors from './../../constants/Colors';

export default function TabLayOut() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.PRIMARY,
        }}
      >
        <Tabs.Screen
          name='home'
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={24} color={color} />,
          }}
        />
          <Tabs.Screen
          name='search'
          options={{
            title: 'search',
            headerShown: false,
            tabBarIcon: ({ color }) => <FontAwesome5 name="search" size={20} color={color} />,
          }}
        />
        <Tabs.Screen
          name='favorite'
          options={{
            title: 'Favorite',
            headerShown: false,
            tabBarIcon: ({ color }) => <MaterialIcons name="favorite" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name='inbox'
          options={{
            title: 'Inbox',
            headerShown: false,
            tabBarIcon: ({ color }) => <FontAwesome5 name="facebook-messenger" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name='profile'
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color }) => <Octicons name="people" size={24} color={color} />,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
