import {
  Image,
  PermissionsAndroid,
  StyleSheet,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  View,
} from 'react-native';

import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {db} from '../authentication/firebaseConfig';
import {useNavigation} from '@react-navigation/native';
import ImageCropPicker from 'react-native-image-crop-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import Toast from 'react-native-simple-toast';
import RNFetchBlob from 'rn-fetch-blob'; // Ensure you have rn-fetch-blob installed


const ProfileScreen = ({route}) => {
  const navigation = useNavigation();
  const {imageUrl} = route.params;
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [image, setimage] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const [profileimg, setprofileimg] = useState(null);

  useEffect(() => {
    GetUserDetails();
  },[]);

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        Toast.show('User cancelled image picker', Toast.SHORT);
      } else if (response.error) {
        Toast.show('Image picker error: ', response.error, Toast.SHORT);
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        console.log('Image picker base 64: ', imageUri);
         AddImage(imageUri)
        
      }
    });
  };

  const convertToBase64 = (uri) => {
    return new Promise((resolve, reject) => {
      RNFetchBlob.fs.readFile(uri, 'base64')
        .then(data => {
          resolve('data:image/jpeg;base64,' + data);
        })
        .catch(error => {
          reject(error);
        });
    });
  };


  const GetUserDetails = async () => {


    const value = await AsyncStorage.getItem("loggedInUserData");
    if (value !== null) {
      // Parse the JSON string into an object
      const data = JSON.parse(value);

      setName(data.username);
      setDocumentId(data.userId);
      setimage(data.imageUrl)
      setEmail(data.email);
    }
  };


  const AddImage = async (imageUri) => {
    if (imageUri) {
      try {
        const base64Data = await convertToBase64(imageUri);
        await updateDoc(doc(db,'users',documentId), { imageUrl: base64Data });
        // console.log('Image uploaded to Firebase Storage: ', base64Data);

        Toast.show('Profile picture added successfully', Toast.SHORT);
      } catch (error) {
        console.error('Error uploading image: ', error);
        Toast.show('Error uploading image: ', error, Toast.SHORT);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.setItem('isLoggedIn', '');
      await AsyncStorage.setItem('loggedInUserEmail', '');
      await AsyncStorage.setItem('loggedInUserID', '');
      await AsyncStorage.setItem('loggedInUserData', '');
      navigation.navigate('SignIn');
      console.log('logout');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  return (
    <View className="flex-1 bg-white">
      <View className="justify-center items-center m-10 flex-row flex-2">
        <View className="rounded-full border-2 border-blue-400">
          <Image
            source={
              image
                ? {uri: image}
                : require('../assets/placeholderimg.png')
            }
            style={{height: hp(15), width: wp(30)}}
            className="m-0.5 rounded-full "
          />
        </View>
        <View className="mt-20 -ml-8 bg-blue-500 rounded-full p-2">
          <TouchableOpacity onPress={() => openImagePicker()}>
            <Icon name="camera-outline" size={hp(2.3)} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <View className="flex-2 bg-blue-50 rounded-xl mt-5 flex-row mx-5">
          <View className="my-5 mx-5">
            <Icon name="account-outline" size={hp(2.7)} color="black" />
          </View>

          <View className="flex-col">
            <Text
              style={{fontSize: hp(1.6)}}
              className="flex-1  text-neutral-500 mt-1">
              Name
            </Text>

            <Text
              style={{fontSize: hp(2)}}
              className="flex-1 -mt-5 font-semibold text-neutral-800">
              {name}
            </Text>
          </View>
        </View>
      </View>

      <View>
        <View className="flex-2 bg-blue-50 rounded-xl mt-5 flex-row mx-5">
          <View className="my-5 mx-5">
            <Icon name="email-outline" size={hp(2.7)} color="black" />
          </View>

          <View className="flex-col">
            <Text
              style={{fontSize: hp(1.6)}}
              className="flex-1  text-neutral-500 mt-1">
              Email
            </Text>

            <Text
              style={{fontSize: hp(2)}}
              className="flex-1 -mt-5 font-semibold text-neutral-800">
              {email}
            </Text>
          </View>
        </View>

        <View className="flex-3">
          <TouchableOpacity onPress={() => handleLogout()}>
            <Text className="bg-red-500 p-4 rounded-xl mx-5 my-5  text-white font-bold  text-center text-2l mr-5">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
