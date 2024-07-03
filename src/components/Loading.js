import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';

const Loading = () => {
  return (
    <View style={{height:250,width:'auto',aspectRatio:1,justifyContent:'center'}}>
      <LottieView style={{flex:1}} source={require('../assets/loading.json')} autoPlay loop /> 
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({})