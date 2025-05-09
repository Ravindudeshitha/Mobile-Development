import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import COLORS from '../../constants/colors'

export default function TabLayout() {
  return (
    <Tabs
        screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: COLORS.primary,
            headerTitleStyle:{
                color: COLORS.textPrimary,
                fontWeight: "600",
            },
            headerShadowVisible: false,
            
            
            
        }}
    >
      <Tabs.Screen name="index" 
        options={{
            title: "Home",
            tabBarIcon:({color, size}) =>(
                <Ionicons name='home-outline' color={color} size={size} />
            ),
        }}
      />
      <Tabs.Screen name="profile"
        options={{
            title: "Profile",
            tabBarIcon:({color, size}) =>(
                <Ionicons name='person-outline' color={color} size={size} />
            ),
        }}
      />
      <Tabs.Screen name="create" 
        options={{
            title: "Create",
            tabBarIcon:({color, size}) =>(
                <Ionicons name='add-circle-outline' color={color} size={size} />
            ),
        }}
      />
    </Tabs>
  )
}



