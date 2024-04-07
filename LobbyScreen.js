import {Button, Text, View} from "react-native";
import {styles} from "./constants";


export default function LobbyScreen({navigation}) {

    return (
        <View style={styles.container}>
            <Text>Lobby</Text>
            <Button title="Start Game" onPress={()=>navigation.navigate("Game")}/>
        </View>
    )
}