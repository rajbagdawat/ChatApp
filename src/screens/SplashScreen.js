import { Image, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'

const SplashScreen = () => {

    useEffect(() => {
        StatusBar.setBackgroundColor('#FFFFFF');
        StatusBar.setBarStyle('dark-content');
      }, []);

  return (
    <View className="flex-1" >
       <View className="flex-1 bg-white" >
          <View className=" flex-1 flex-col justify-center items-center">
                    <Image source={require('../assets/splashicon.png')} />
                    <Text className="text-indigo-500 font-bold text-xl mt-1" >Chat App</Text>
          </View>
       </View>
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({}) 