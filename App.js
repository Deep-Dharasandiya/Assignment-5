import React from 'react'
import { StyleSheet, Text, View, StatusBar } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

import UserList from './UserList';
import PostList from './PostList';
import PostCommet from './PostCommet';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="UserList" component={UserList}  />
          <Stack.Screen name="PostList" component={PostList} />
          <Stack.Screen name="PostCommet" component={PostCommet} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
    
  )
}

const styles = StyleSheet.create({})
