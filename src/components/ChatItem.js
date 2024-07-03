import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fromDate, getRoomId} from '../utils/Common';
import {collection, doc, onSnapshot, orderBy, query} from 'firebase/firestore';
import {db} from '../authentication/firebaseConfig';

const ChatItem = ({item, router, noborder, currentUser}) => {
  const [lastmessage, setlastmessage] = useState(undefined);

  useEffect(() => {
    let roomId = getRoomId(currentUser.userId, item.userId);
    const docRef = doc(db, 'rooms', roomId);
    const messageRef = collection(docRef, 'messages');
    const q = query(messageRef, orderBy('createdAt', 'desc'));

    let unsub = onSnapshot(q, snapshot => {
      let allMessages = snapshot.docs.map(doc => {
        return doc.data();
      });
      setlastmessage(allMessages[0] ? allMessages[0] : null);
    });

    // return unsub();
  }, []);

  const renderTime = () => {
    if(lastmessage){
       let date = lastmessage?.createdAt;
       return fromDate(new Date(date?.seconds * 1000))
    }
  
  };

 const renderLastMessage = () => {
  if (typeof lastmessage === 'undefined') {
    return 'Loading...';
  } 
   if (lastmessage) {
    if (currentUser.userId === lastmessage.userId) {
      return "You: " + lastmessage.text;
    }
    return lastmessage.text;
  } else {
    return 'Say hi 👋';
  }
};


  //  console.log('last message : ',lastmessage);
  const navigation = useNavigation();

  const OpenChat = () => {
    navigation.navigate('ChatRoom', {item});
  };

  const imageSource = item.imageUrl
    ? {uri: item.imageUrl}
    : require('../assets/placeholderimg.png');

  return (
    <View>
      <TouchableOpacity
        onPress={() => OpenChat()}
        className={`flex-row justify-between mx-4 items-center gap-3 mb-4 pb-2  ${
          noborder ? '' : 'border-b border-b-neutral-200'
        }`}>
        <Image
          source={imageSource}
          style={{height: hp(6), width: hp(6)}}
          className="rounded-full"
        />
        <View className="flex-1 gap-1">
          <View className="flex-row justify-between">
            <Text
              style={{fontSize: hp(1.9)}}
              className="font-semibold text-neutral-800">
              {item.username}
            </Text>
            <Text
              style={{fontSize: hp(1.6)}}
              className="font-medium text-neutral-500">
              {' '}
              {renderTime()}
            </Text>
          </View>
          <Text
            style={{fontSize: hp(1.5)}}
            className="font-medium text-neutral-500">
            {renderLastMessage()}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ChatItem;

const styles = StyleSheet.create({});
