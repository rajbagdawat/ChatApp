import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useReducer } from 'react'
import ChatItem from './ChatItem'
import { useRoute } from '@react-navigation/native'

const ChatList = ({users,currentUser}) => {



    const router = useRoute();
    
  return (
    <View className="flex-1 mx-5">
     <FlatList
       data={users}
       contentContainerStyle={{flex: 1,paddingVertical:26}}
       keyExtractor={item=>Math.random()}
       showsVerticalScrollIndicator={false}
       renderItem={({item,index})=> 
       <ChatItem 
       noborder={index+1 == users.length}
       router = {router}
       currentUser={currentUser}
       item={item} 
       index={index} 
       />}
     />

    
    </View>
  )
}

export default ChatList

const styles = StyleSheet.create({})