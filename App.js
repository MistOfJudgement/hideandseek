import { StatusBar } from 'expo-status-bar';
import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import Model from "react-native-modal"
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";
import {useState} from "react";
import Dialog from "react-native-dialog"
import TitleScreen from "./TitleScreen";
import LobbyScreen from "./LobbyScreen";
import GameScreen from "./GameScreen";

export default function App() {
    const stack = createNativeStackNavigator();
  return (
      <NavigationContainer>
        <stack.Navigator>
            <stack.Screen name="Title" component={TitleScreen}/>
            <stack.Screen name="Lobby" component={LobbyScreen} />
            <stack.Screen name="Game" component={GameScreen} />
        </stack.Navigator>
      </NavigationContainer>
  );
}

