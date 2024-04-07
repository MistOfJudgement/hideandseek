import {useState} from "react";
import {Button, Text, View} from "react-native";
import Dialog from "react-native-dialog";
import {styles} from "./constants";


export default function TitleScreen({navigation}) {

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
                <Dialog.Input></Dialog.Input>
                <Dialog.Button label="Cancel" onPress={()=>setCodeModalVisible(false)}/>
                <Dialog.Button label="Join" onPress={()=>setCodeModalVisible(false)}/>
            </Dialog.Container>
        </View>
    );
}
