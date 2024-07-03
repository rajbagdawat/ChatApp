import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Call from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useRoute} from '@react-navigation/native';

const ChatRoomHeader = () => {
  const route = useRoute();
  const {item} = route.params;
  const navigation = useNavigation();

  const imageSource = item.imageUrl
  ? { uri: item.imageUrl }
  : require('../assets/placeholderimg.png');



  return (
    <View className="bg-white ">
      <View className="flex-row items-center p-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={hp(4.5)} color='gray' className="bg-neutral-700" />
        </TouchableOpacity>

        <Image
          source={imageSource}
          style={{width: wp(10), height: hp(5), borderRadius: 25}}
          className="justify-between ml-2"
        />
        <View className="ml-4">
          <Text className="font-semibold text-black">{item.username}</Text>
          <Text className="text-gray-500 text-xs -ml-1">
            {' '}
            Last seen 1 hour ago
          </Text>
        </View>

        <View className="flex-1 flex-row justify-end items-end">
          
          <View className="flex-3 flex-row justify-center items-center gap-5">
            <TouchableOpacity >
            <Call
              name="call"
              size={hp(3)}
              className="bg-neutral-800"
              color='gray' 
              />
          </TouchableOpacity>

          <TouchableOpacity >
            <Call
              name="videocam"
              size={hp(4)}
              className="bg-neutral-800"
              color='gray' 
              />
          </TouchableOpacity>
              </View>
        </View>
        
      </View>
    </View>
  );
};

export default ChatRoomHeader;

const styles = StyleSheet.create({});
