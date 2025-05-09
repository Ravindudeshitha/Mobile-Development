import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import styles from '../../assets/styles/create.styles'
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import {useAuthStore} from '../../store/authStore'
import { API_URI } from '../../constants/api';

export default function Create() {

  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [rating, setRating] = useState(3);
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const {token} = useAuthStore();

  const pickImage = async() =>{
    
    try{
      if(Platform.OS !== "web"){
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if(status !== "granted") {
          Alert.alert("Permission Denied");
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true
      });

      if(!result.canceled){
        // console.log("result is here: ", result);
        setImage(result.assets[0].uri);

        if(result.assets[0].base64){
          setImageBase64(result.assets[0].base64);
        }else{
          const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {encoding: FileSystem.EncodingType.Base64});
          setImageBase64(base64);
        }
      }
    } 
    catch(error){
      console.log("Error",error);
    }
  }

  const handleSubmit = async() =>{
    if (!title || !caption || !image || !rating) {
      Alert.alert("All fields are required");
      return;
    }


    try{
      setIsLoading(true);

      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length - 1];
      const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg";

      const imageDataUrl = `data:${imageType};base64,${imageBase64}`;

      const response = await fetch(`${API_URI}books`, {
        method: "POST",
        headers:{
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          caption,
          rating: rating.toString(),
          image: imageDataUrl
        }),
      });

      const data = await response.json();
      if(!response.ok) throw new Error(data.message || "Something went wrong");

      Alert.alert("success", "Your book recommendation has been posted");
      setTitle('');
      setCaption('');
      setRating(3);
      setImage(null);
      setImageBase64(null);
      router.push("/");
    }
    catch(error){
      console.log(error);
      Alert.alert("Error", error.message);
    }finally{
      setIsLoading(false);
    }
  }

  const renderRatingPicker = () =>{
    const stars = [];
    for (let i = 1; i <= 5; i++){
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)} style={styles.starButton}>
          <Ionicons 
            name ={i <= rating ? "star" : "star-outline"}
            size={32}
            color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          />
        </TouchableOpacity>
      );
    }

    return <View style={styles.ratingContainer}>{stars}</View>
  }

  return (
    
    <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Book Recommendation</Text>
          <Text style={styles.subtitle}>Share your favorite reads with others</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Book Title</Text>
            <View style={styles.inputContainer}>
              <Ionicons 
                name='book-outline' 
                size={24} 
                color={COLORS.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput 
                style={styles.input}
                placeholder = "Enter Book Title"
                placeholderTextColor={COLORS.placeholderText}
                value={title}
                onChangeText={setTitle}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Your Rating</Text>
            {renderRatingPicker()}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Book Image</Text>
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              {image ? (
                <Image source={{uri: image}} style={styles.previewImage} />
              ):(
                <View style={styles.placeholderContainer}>
                  <Ionicons name="image-outline" size={40} color={COLORS.textSecondary} />
                  <Text style={styles.placeholderText}>Tap to select image</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Caption</Text>
            <TextInput 
              style = {styles.textArea}
              placeholder='Write your review or thoughts about this book ..'
              placeholderTextColor={COLORS.placeholderText}
              multiline
              value={caption}
              onChangeText={setCaption}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ):(
              <>
                <Ionicons 
                  name='cloud-upload-outline'
                  size={24}
                  color={COLORS.white}
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Submit</Text>
              </>
            )}
          </TouchableOpacity>

        </View>
      </View>
    </ScrollView>
    
  )
}