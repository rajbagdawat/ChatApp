import {
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from 'react-native';
  import React, {useEffect, useState} from 'react';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import {useNavigation} from '@react-navigation/native';
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
  import {useSafeAreaInsets} from 'react-native-safe-area-context';
  import {Firestore} from 'firebase/firestore';
  import {db} from '../authentication/firebaseConfig';
  import {collection, getDocs} from 'firebase/firestore';
  
  const ios = Platform.OS === 'ios';
 
const HomeHeader = () => {

    const navigation = useNavigation();
    const [imageUrl ,setimageUrl] = useState(null);
    useEffect(() => {
      ReadData();
    });
  
   
  
    const ReadData = async () => {
      try {
        const loggedInUseremail = await AsyncStorage.getItem('loggedInUserEmail');
  
        const querySnapshot = await getDocs(collection(db, 'users'));
        querySnapshot.forEach(doc => {
          const data = doc.data();      
          const email = data.email;
  
          if (email === loggedInUseremail) {
             setimageUrl(data.imageUrl);
             AsyncStorage.setItem("loggedInUserID", data.userId);
             AsyncStorage.setItem("loggedInUserData", JSON.stringify(data));
        //   console.log(data.userId);
          }
          // console.log(`${doc.id} => ${doc.data()}`);
          // console.log(`${doc.id} => ${username}`);
          // console.log(`${doc.id} => ${JSON.stringify(doc.data(), null, 2)}`);
        });
      } catch (e) {}
    };
  
    const {top} = useSafeAreaInsets();
  

    return (
        <View>
          <View
            style={{paddingTop: ios ? top : top + 10}}
            className="flex-row justify-between bg-indigo-500 rounded-b-3xl ">
            <View className="ml-5 ">
              <Text style={{fontSize: hp(3)}} className="font-medium text-white">
                Chats
              </Text>
            </View>
            
              <TouchableOpacity onPress={()=>navigation.navigate('Profile',{imageUrl})}>
              <Image 
                source={
                  imageUrl
                  ?{uri: imageUrl}
                  : require('../assets/placeholderimg.png')
                }
                style={{height: hp(5),width:wp(10)}}
                className="m-5 rounded-full -mt-1"            
                />
                </TouchableOpacity>
            
          </View>
        </View>
      );
    };
    
    export default HomeHeader;
    
    const styles = StyleSheet.create({});
    