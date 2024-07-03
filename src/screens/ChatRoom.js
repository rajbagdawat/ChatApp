import {
  Alert,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableOpacityBase,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import ChatRoomHeader from '../components/ChatRoomHeader';
import MessageList from '../components/MessageList';
import Icon from 'react-native-vector-icons/Feather';
import {getRoomId} from '../utils/Common';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomKeyBoardView from '../components/CustomKeyBoardView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import {db} from '../authentication/firebaseConfig';
import Loading from '../components/Loading';

const ChatRoom = () => {
  const route = useRoute();
  const {item} = route.params;
  const [messages, setMessages] = useState([]);
  const [userid, setuserid] = useState(null);
  const [userData, setuserData] = useState(null);
  const textRef = useRef('');
  const inputRef = useRef(null);
  const scroolViewRef = useRef(null);

  useEffect(() => {
    
    const fetchData = async () => {
     await createRoomIfNotExists();
     const value = await AsyncStorage.getItem("loggedInUserData");
     if (value !== null) {
      const data = JSON.parse(value);
      //  console.log("value : ", value.userId);
       setuserData(data);
    }    
  };
  
  fetchData();
  
  let unsub;
  const getAllMessgae = async ()=>{
    const loggedInUserID = await AsyncStorage.getItem('loggedInUserID');
    console.log('loggedInUserID : ', loggedInUserID);
    if (loggedInUserID) {
      let roomId = getRoomId(loggedInUserID, item.userId);
      const docRef = doc(db, 'rooms', roomId);
      const messageRef = collection(docRef, 'messages');
      const q = query(messageRef, orderBy('createdAt', 'asc'));

     unsub = onSnapshot(q, snapshot => {
        let allMessages = snapshot.docs.map(doc => {
          return doc.data();
        });
        setMessages([...allMessages]);
      });
      console.log('userid : ', loggedInUserID);
      // console.log('get all messages : ', messages);
    } else {
      console.log('no user id found');
    }  
  }
  getAllMessgae();
  
  const KeyboardDidShowListener = Keyboard.addListener(
    'keyboardDidShow',updateScrollview
  )

  return()=>{
    unsub(),
    KeyboardDidShowListener.remove()
  } 
  }, []);

  const createRoomIfNotExists = async () => {
    const loggedInUserID = await AsyncStorage.getItem('loggedInUserID');
    let roomId = getRoomId(loggedInUserID, item.userId);
    // console.log('roomId : ', roomId);

    if (loggedInUserID && roomId) {
       setuserid(loggedInUserID);
      await setDoc(doc(db, 'rooms', roomId), {
        roomId,
        createdAt: Timestamp.fromDate(new Date()),
      });
    }
  };

  const handleSendMessage = async () => {
    const loggedInUserID = await AsyncStorage.getItem('loggedInUserID');

    let message = textRef.current.trim();
    if (!message) return;
    try {
      let roomId = getRoomId(loggedInUserID, item.userId);
      const docRef = doc(db, 'rooms', roomId);
      const messageRef = collection(docRef, 'messages');

      textRef.current = "";
      if (inputRef) inputRef?.current?.clear();

      const newDoc = await addDoc(messageRef, {
        userId: loggedInUserID,
        text: message,
        imageUrl: item.imageUrl,
        senderName: item.username,
        createdAt: Timestamp.fromDate(new Date()),
      });

      console.log('new message id : ', newDoc.id);
    } catch (e) {
      Alert.alert('Message', e.message);
    }
  };

  useEffect(() => {
    updateScrollview();
  }, [messages]);

  const updateScrollview= ()=>{
      setTimeout(()=>{
        scroolViewRef?.current?.scrollToEnd({animated:true})
      },100)
  }

  return (
    // <CustomKeyBoardView inChat={true}>
    <View className="flex-1 ">
      <StatusBar style="dark" />
      <ChatRoomHeader user={item} route={route} />
      <View className="h-1 -mt-1 border-b border-neutral-300" />

      <View className="flex-1 justify-between bg-neutral-100 overflow-visible">
        <View className="flex-1">
        
          <MessageList scroolViewRef={scroolViewRef} messages={messages} currentUser={userData} />
        </View>

        <View style={{marginBottom: hp(2.9)}}>
          <View className="flex-row justify-between items-center mx-3">
            <View className="flex-row justify-between bg-white border p-2 border-neutral-200 rounded-full pl-5">
              <TextInput
              ref={inputRef}
                onChangeText={value => (textRef.current = value)}
                placeholder="Type Message..."
                style={{fontSize: hp(2)}}
                className="flex-1 mr-2 text-neutral-900"
                placeholderTextColor="gray"
              />

              <TouchableOpacity
                onPress={handleSendMessage}
                className="bg-neutral-200 p-4 rounded-full">
                <Icon name="send" size={hp(2.4)} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
    // </CustomKeyBoardView>
  );
};

export default ChatRoom;
