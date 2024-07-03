import { ActivityIndicator, AppState, StatusBar, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ChatList from '../components/ChatList';
import Loading from '../components/Loading';
import { collection, getDocs, query, where } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../authentication/firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = () => {
  const [users,setUsers] = useState([]);
  const [userdata,setuserData] = useState([]);

  useFocusEffect( 
    useCallback(() => {
      const fetchData = async () => {
        await getUserId();
        const value = await AsyncStorage.getItem("loggedInUserData");
        if (value !== null) {
         const data = JSON.parse(value);
          setuserData(data);
       }    
     };
     fetchData();
    },[])
  )
  const getUserId = async ()=>{
    try {  
      const loggedInUserEmail = await AsyncStorage.getItem('loggedInUserEmail');
  
      if (!loggedInUserEmail) {
        Toast.show('No logged in user email found in AsyncStorage', Toast.SHORT);
      
        return;
      }
  
      const querySnapshot = await getDocs(collection(db, 'users'));
      let userIdFound = false;
  
      querySnapshot.forEach(doc => {
        const data = doc.data();
        const email = data.email;
  
        if (email === loggedInUserEmail) {
          AsyncStorage.setItem("loggedInUserID", data.userId);
          // console.log(JSON.stringify(data));
          userIdFound = true;
        }
      });
  
      if (!userIdFound) {
        console.error('No matching user ID found for email:', loggedInUserEmail);
      }else{
       await getUser();
      }
    } catch (e) {
      console.error('Error retrieving user ID:', e);
    }
  }


  const getUser = async () => {
    try {
      const loggedInUserID = await AsyncStorage.getItem('loggedInUserID');
      if (!loggedInUserID) {
        console.warn('Logged in user ID not found');
        return;
      }
      
      const usersCollectionRef = collection(db, 'users');
      const q = query(usersCollectionRef, where('userId', '!=', loggedInUserID));

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => doc.data());
      setUsers(data);
    } catch (error) {
      console.error('Error getting users: ', error);
    }
    
  };

  return (
    <View className="flex-1">
     <StatusBar styles="light"/>
     <HomeHeader/>
      {
        users.length>0? (
          <ChatList currentUser={userdata} users={users} />
        )
        : 
        <View className ="flex items-center" style={{top:hp(30)}}>
          <Loading/>
          </View>
      }
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})