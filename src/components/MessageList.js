import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import MessageItem from './MessageItem'

const MessageList = ({messages,currentUser,scroolViewRef}) => {
  return (
    <ScrollView
    ref={scroolViewRef}
      showsVerticalScrollIndicator={false}
       contentContainerStyle={{paddingTop:10}}
      >
        {
          messages.map((messages,index) =>{
                  return (
                  <MessageItem  messages={messages} key={index} currentUser={currentUser}/>)
          })
        }
    </ScrollView>
  )
}

export default MessageList