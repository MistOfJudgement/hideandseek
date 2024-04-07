import { StatusBar } from 'expo-status-bar';
import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import Model from "react-native-modal"
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";
import {useState} from "react";
import Dialog from "react-native-dialog"
function TitleScreen({navigation}) {

    const [codeModalVisible, setCodeModalVisible] = useState(false);
    return (
        <View
            style={styles.container}
        >
            <Text>TitleScreen</Text>

            <Button
                title="Create Lobby"
                onPress={() => navigation.navigate("Lobby")}
            />
            <Button
                title="Join Lobby"
                onPress={()=> setCodeModalVisible(true)}
            />
            <Dialog.Container visible={codeModalVisible}>
                <Dialog.Title>Enter Code</Dialog.Title>
                <Dialog.Input>adsf</Dialog.Input>
                <Dialog.Button>Cancel</Dialog.Button>
                <Dialog.Button>Enter</Dialog.Button>
            </Dialog.Container>
        </View>
    );
}

function LobbyScreen({navigation}) {

    return (
        <View>
            <Text>Lobby</Text>
        </View>
    )
}

export default function App() {
    const stack = createNativeStackNavigator();
  return (
      <NavigationContainer>
        <stack.Navigator>
            <stack.Screen name="Title" component={TitleScreen}/>
            <stack.Screen name="Lobby" component={LobbyScreen}

            />
        </stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
