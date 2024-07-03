import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, StatusBar, StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './src/screens/HomeScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import SignInScreen from './src/screens/SignInScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ChatRoom from './src/screens/ChatRoom';
import SplashScreen from './src/screens/SplashScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const [loggedIn, setLoggedIn] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigationRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const getDataOfLogin = async () => {
      const data = await AsyncStorage.getItem('isLoggedIn');
      setLoggedIn(data ? true : false);
      console.log('login status : ' + data);
    };

    getDataOfLogin();
  }, []);

  useEffect(() => {
    if (navigationRef.current) {
      if (loggedIn) {
        navigationRef.current.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
      } else {
        navigationRef.current.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
    }
  }, [loggedIn]);

  if (isLoading) {
    return <SplashScreen />;
  }

  const HomeScreenstack = () => {
    return <Stack.Screen name="Home" component={HomeScreen} />;
  };
  const SignInScreenstack = () => {
    return <Stack.Screen name="SignIn" component={SignInScreen} />;
  };

  const handleNavigation = screenName => {
    if (
      navigationRef.current &&
      navigationRef.current.getCurrentRoute().name !== screenName
    ) {
      navigationRef.current.navigate(screenName);
    }
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar backgroundColor="#6366F1" barStyle="light-content" />
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {loggedIn ? (
          <>{handleNavigation('Home')}</>
        ) : (
          <>{handleNavigation('SignIn')}</>
        )}
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Profile"
          options={{headerShown: true}}
          component={ProfileScreen}
        />
        <Stack.Screen name="ChatRoom" component={ChatRoom} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
