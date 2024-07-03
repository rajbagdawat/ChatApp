import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import Loading from '../components/Loading';
import CustomKeyBoardView from '../components/CustomKeyBoardView';
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import authfirebase from '../authentication/firebaseConfig';
import Toast from 'react-native-simple-toast';
import { collection, addDoc, setDoc, doc } from "firebase/firestore"; 
import {db} from '../authentication/firebaseConfig'

const SignUpScreen = () => {
  const navigation = useNavigation();
 
   const auth = getAuth();
  const usernameRef = useRef('');
  const emailRef = useRef('');
  const passRef = useRef('');
  const confirmpassRef = useRef('');
  const [loading, setLoading] = useState(false);
  const [checktext, setchecktext] = useState(false);

  const [passMatched,setPassMatched] = useState(false);
 
  
  const handleRegister = async () => {

    if (!usernameRef.current || !emailRef.current || !passRef.current || !confirmpassRef.current) {
      Alert.alert('Sign Up', 'Please fill all the fields!');
      return;
    }

    setLoading(true);

    try {
      const response = await createUserWithEmailAndPassword(auth, emailRef.current, passRef.current);
     
      const userId =  response?.user?.uid;
      console.log("userId : ", userId);
  
      const docRef = await setDoc(doc(db, "users", userId), {
        username: usernameRef.current,
        userId: userId,
        email: emailRef.current,
      });

      // console.log("Document written with ID: ", docRef.id);
      navigation.navigate('SignIn');
      Toast.show("User Created successfully", Toast.SHORT);

    } catch (error) {
      try{
        const errorMessage = error.code.split('/')[1];
        Toast.show(errorMessage, Toast.SHORT);
      }catch(e){
        Toast.show("Please provide vaild details", Toast.SHORT);
      }

    } finally {
      setLoading(false);
    }

  };

  const handlePasswordChange = () => {

     if(passRef.current && confirmpassRef.current){
      setchecktext(true)
    }
     if (passRef.current === confirmpassRef.current) {
      setPassMatched(true); // Passwords match
    } else {
      setPassMatched(false); // Passwords do not match
    }
  };

  return (
    <CustomKeyBoardView>

    <View className="flex-1 bg-white">
      <View className="items-center pt-10">
        <Image
          source={require('../assets/signupimg.png')}
          style={{width: wp(65), height: hp(20)}}
        />
      </View>

      <View className="items-center">
        <Text className="text-black font-bold text-3xl mt-10">Sign Up</Text>
      </View>

      <View className="mx-5 mt-7">
        

        <View className="bg-blue-100 rounded-xl mt-5 flex-row ">
          <View className="my-5 mx-5">
            <Icon name="perm-identity" size={hp(2.5)} color="black" />
          </View>
          <TextInput
            onChangeText={value => (usernameRef.current = value)}
            style={{fontSize: hp(2)}}
            className="flex-1 font-semibold text-neutral-700"
            placeholder="User Name"
            placeholderTextColor={'gray'}></TextInput>
        </View>

        <View className="bg-blue-100 rounded-xl mt-5 flex-row ">
          <View className="my-5 mx-5">
            <Icon name="mail-outline" size={hp(2.5)} color="black" />
          </View>
          <TextInput
            onChangeText={value => (emailRef.current = value)}
            style={{fontSize: hp(2)}}
            className="flex-1 font-semibold text-neutral-700"
            placeholder="Email Address"
            placeholderTextColor={'gray'}></TextInput>
        </View>
        

        <View className="mt-5">
          <View className="bg-blue-100 rounded-xl flex-row ">
            <View className="my-5 mx-5">
              <Icon name="lock-open" size={hp(2.5)} color="black" />
            </View>
            <TextInput
              onChangeText={value => {passRef.current = value; handlePasswordChange()}}
              style={{fontSize: hp(2)}}
              className="flex-1 font-semibold text-neutral-700"
              placeholder="Password"
              secureTextEntry
              placeholderTextColor={'gray'}></TextInput>
          </View>

          <View className="bg-blue-100 rounded-xl  mt-5 flex-row ">
            <View className="my-5 mx-5">
              <Icon name="lock-outline" size={hp(2.5)} color="black" />
            </View>
            <TextInput
              onChangeText={value => {confirmpassRef.current = value;   handlePasswordChange()}}
              style={{fontSize: hp(2)}}
              className="flex-1 font-semibold text-neutral-700"
              placeholder="Confirm Password"
              secureTextEntry
              placeholderTextColor={'gray'}></TextInput>
          </View>
         
           {
            checktext?(
              passMatched ? (
                <Text className="text-green-500 mt-2 ml-3">Password Matched</Text>
              ) : (
                <Text className="text-red-400 mt-2 ml-3">Password Unmatched</Text>
              )
            ):(
              null
            )
           }
        </View>

       
      </View>
        
      <View >
      {loading ? (
        <View className="justify-center items-center -my-20">
            <Loading size={hp()} />
          </View>
        ) :  <TouchableOpacity
        onPress={handleRegister}
        className="bg-indigo-500 rounded-xl mx-5 mt-5 p-3 justify-center items-center">
        <Text
          style={{fontSize: hp(2.5)}}
          className="text-white font-bold tracking-wider">
          Sign Up
        </Text>
      </TouchableOpacity>}
    </View>

      <View className="flex-row justify-center mt-4">
        <Text
          style={{fontSize: hp(1.8)}}
          className="font-semibold text-neutral-500">
          Already have an account?{' '}
        </Text>
        <Text
          onPress={() => navigation.navigate('SignIn')}
          style={{fontSize: hp(1.8)}}
          className="font-semibold text-indigo-500">
          SignIn
        </Text>
      </View>
    </View>
    </CustomKeyBoardView>
  );
};

export default SignUpScreen;