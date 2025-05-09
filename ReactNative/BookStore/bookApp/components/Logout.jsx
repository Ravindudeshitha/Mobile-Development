import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { useAuthStore } from '../store/authStore'
import styles from '../assets/styles/profile.styles';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

export default function Logout() {

    const {logout} = useAuthStore();

    const confirmedLogout = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            {text: "Cancel", style: "cancel", onPress: () => {}},
            {text: "Logout", style: "destructive", onPress: () => {logout()}}
        ])
    };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={confirmedLogout}>
        <Ionicons name='log-out-outline' size={24} color={COLORS.white}/>
        <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  )
}