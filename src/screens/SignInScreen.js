import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Toast from 'react-native-simple-toast';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Loading from '../components/Loading';
import CustomKeyBoardView from '../components/CustomKeyBoardView';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const SignInScreen = () => {
   const navigation = useNavigation();


  const emailRef = useRef('');
  const passRef = useRef('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!emailRef.current || !passRef.current) {
      Alert.alert('Sign In', 'Please fill all the fields!');
      return;
    }
    setLoading(true);
  
    try {
      const auth = getAuth();
      const response = await signInWithEmailAndPassword(auth, emailRef.current, passRef.current);
      
      // Successfully signed in
      await AsyncStorage.setItem("isLoggedIn", JSON.stringify(true));
      await AsyncStorage.setItem("loggedInUserEmail", emailRef.current.toLocaleLowerCase());
      console.log(emailRef.current.toLocaleLowerCase());
      navigation.navigate('Home');
      Toast.show("Sign in successfully", Toast.SHORT);
  
    } catch (error) {
    
      const errorMessage = error.code.split('/')[1];
      console.log(errorMessage);
      Toast.show(errorMessage, Toast.SHORT);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <CustomKeyBoardView>
      <View className="flex-1 bg-white">
        <View className="items-center pt-10">
          <Image
            source={require('../assets/signin.png')}
            style={{width: wp(75), height: hp(25)}}
          />
        </View>

        <View className="items-center">
          <Text className="text-black font-bold text-3xl mt-10">Sign In</Text>
        </View>

        <View className="mx-5 mt-7">
          <View className="bg-blue-100 rounded-xl flex-row ">
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
                <Icon name="lock-outline" size={hp(2.5)} color="black" />
              </View>
              <TextInput
                onChangeText={value => (passRef.current = value)}
                style={{fontSize: hp(2)}}
                className="flex-1 font-semibold text-neutral-700"
                placeholder="Password"
                secureTextEntry
                placeholderTextColor={'gray'}></TextInput>
            </View>
          </View>

          <Text
            style={{fontSize: hp(1.8)}}
            className="font-semibold text-right mt-2 text-neutral-500">
            Forgot Password?
          </Text>
        </View>

        <View>
          {loading ? (
            <View className="justify-center items-center -my-20">
              <Loading size={hp()} />
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleLogin }
              className="bg-indigo-500 rounded-xl mx-5 mt-5 p-3 justify-center items-center">
              <Text
                style={{fontSize: hp(2.5)}}
                className="text-white font-bold tracking-wider">
                Sign In
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-row justify-center mt-4">
          <Text
            style={{fontSize: hp(1.8)}}
            className="font-semibold text-neutral-500">
            Don't have an account?{' '}
          </Text>
          <Text
            onPress={() => navigation.navigate('SignUp')}
            style={{fontSize: hp(1.8)}}
            className="font-semibold text-indigo-500">
            SignUp
          </Text>
        </View>
      </View>
    </CustomKeyBoardView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({});
