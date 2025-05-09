import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import styles from '../../assets/styles/login.styles'
import { Image } from 'expo-image';
import {Ionicons, Ionucons} from "@expo/vector-icons";
import COLORS from '../../constants/colors';
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';

export default function Signup() {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const {user, register} = useAuthStore();
    const handleSugnup = async() => {
        const result = await register(username, email, password);
        console.log(result);
        if(!result.success) return alert(result.message);
    }
    

  return (
    <View style={styles.container}>

        <View style={styles.card}>

            <View style={styles.header}>
                <Text style={styles.title}>BookWorm</Text>
                <Text style={styles.subtitle}>Share your favorite reads</Text>
            </View>
            <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>User Name</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons 
                            name='person-outline' 
                            size={20} 
                            color={COLORS.primary} 
                            style={styles.inputIcon}
                        />
                        <TextInput 
                            style={styles.input}
                            placeholder='John Doe'
                            placeholderTextColor={COLORS.placeholderText}
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize='none'
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons 
                            name='mail-outline' 
                            size={20} 
                            color={COLORS.primary} 
                            style={styles.inputIcon}
                        />
                        <TextInput 
                            style={styles.input}
                            placeholder='Enter Email'
                            placeholderTextColor={COLORS.placeholderText}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType='email-address'
                            autoCapitalize='none'
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons 
                            name='lock-closed-outline' 
                            size={20} 
                            color={COLORS.primary} 
                            style={styles.inputIcon}
                        />
                        <TextInput 
                            style={styles.input}
                            placeholder='Enter Password'
                            placeholderTextColor={COLORS.placeholderText}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />

                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                            <Ionicons 
                                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                size={20}
                                color={COLORS.primary}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                
                <TouchableOpacity style={styles.button} onPress={handleSugnup} disabled={isLoading}>
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ):(
                        <Text style={styles.buttonText}>SignUp</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                
                    <TouchableOpacity onPress={()=> router.back()}>
                        <Text style={styles.link}> Login</Text>
                    </TouchableOpacity>
                        
                </View>
            </View>
        </View>
    </View>
  )
}