import { View, Text, Alert, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router';
import { API_URI } from '../../constants/api';
import { useAuthStore } from '../../store/authStore';
import styles from '../../assets/styles/profile.styles';
import ProfileHeader from '../../components/ProfileHeader';
import Logout from '../../components/Logout';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { Image } from 'expo-image';
import { formatPublishedDate } from '../../lib/utils';

export default function Profile() {

  const {token} = useAuthStore();

  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();

  const fetchData = async () =>{
    try{
      setIsLoading(true);

      const response = await fetch(`${API_URI}books/user`,{
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      const data = await response.json();
      if(!response.ok) throw new Error(data.message || "Something went wrong");
      
      setBooks(data);
    }
    catch(error){
      console.error("Error fetching data", error);
      Alert.alert("Error", error.message);
    }
    finally{
      setIsLoading(false);
    }
  };

  useEffect(() =>{
    fetchData();
  }, []);

  const deleteBook = async (id) =>{
    try{
      const response = await fetch(`${API_URI}books/${id}`,{
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      const data = await response.json();
      if(!response.ok) throw new Error(data.message || "Something went wrong");
      
      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
      Alert.alert("Success", data.message);
    }
    catch(error){
      console.error("Error deleting book", error);
      console.log("Token used in DELETE:", token);
      Alert.alert("Error-", error.message);

    }
  }


  const confirmedDelete = (id) =>{
    Alert.alert("Delete Book", "Are you sure you want to delete this book?", [
      {text:"Cancel", style:'cancel'},
      {text:"Delete", style: 'destructive', onPress: () => deleteBook(id)}
    ])
  }

  const renderBookItem = ({item}) =>{
    return(
      <View style={styles.bookItem}>
        <Image source={{uri: item.image}} style={styles.bookImage} />
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <View style={styles.ratingContainer}>
            {renderStar(item.rating)}
          </View>
          <Text style={styles.bookCaption}>{item.caption}</Text>
          <Text style={styles.bookDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={() => confirmedDelete(item._id)}>
          <Ionicons name="trash-outline" size={20} color={COLORS.primary}/>
        </TouchableOpacity>
      </View>
    )
    
  }

  const renderStar =(rating) =>{
    const stars = [];

    for( let i=1; i<=5; i++){
      stars.push(
        <Ionicons 
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          style={{marginRight: 2}}
        />
      );
    }
    return stars;
  }

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <Logout />
      
      <View style={styles.booksHeader}>
        <Text style={styles.booksTitle}>Your Book Recommendation</Text>
        <Text style={styles.booksCount}>{books.length}</Text>
      </View>

      <FlatList 
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.booksList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name='book-outline' size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No books found</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => router.puch("/create")}>
              <Text style={styles.addButtonText}>Add Book</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>

    
  )
}