import {useState} from "react";
import {Button, Text, View, TextInput} from "react-native";
import Dialog from "react-native-dialog";
import {styles} from "./constants";


export default function TitleScreen({navigation}) {

    const [codeModalVisible, setCodeModalVisible] = useState(false);
    const [name, setName] = useState("John Doe")
    const [code, setCode] = useState();
    return (
        <View
            style={styles.container}
        >
            <Text>Hide and Seek</Text>

            <TextInput
                style={styles.input}
                onChangeText={setName}
                value={name}
                placeholder="Enter Name"
                />
            <Button
                title="Create Lobby"
                onPress={() => navigation.navigate("Lobby", {username:name, code:"CDARUF"})}
            />
            <Button
                title="Join Lobby"
                onPress={()=> setCodeModalVisible(true)}
            />
            <Dialog.Container visible={codeModalVisible}>
                <Dialog.Title>Enter Code</Dialog.Title>
                <Dialog.Input onChangeText={setCode} value={code}/>
                <Dialog.Button label="Cancel" onPress={()=>setCodeModalVisible(false)}/>
                <Dialog.Button label="Join" onPress={()=>{
                    setCodeModalVisible(false);
                    navigation.navigate("Lobby", {username:name, code:code});
                }}/>
            </Dialog.Container>
        </View>
    );
}
